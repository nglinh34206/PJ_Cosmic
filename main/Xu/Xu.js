/** Định dạng số xu: 1250 -> "1.250" */
window.formatCoin = function(value) {
    const n = Math.max(0, Math.round(Number(value) || 0));
    return n.toLocaleString("vi-VN");
};

/** Hiệu ứng cộng/trừ xu nổi giữa màn hình */
window.showCoinEffect = function(amount) {
    const effect = document.createElement("div");
    effect.className = "coin-effect";
    const sign = amount > 0 ? "+" : "";
    effect.innerHTML = `
        <span style="font-size:50px;">🪙</span>
        <span>${sign}${amount}</span>
    `;
    document.body.appendChild(effect);
    requestAnimationFrame(() => { effect.classList.add("show"); });
    setTimeout(() => { effect.classList.remove("show"); }, 1200);
    setTimeout(() => { effect.remove(); }, 1600);
};

/**
 * Cộng xu cho user hiện tại dựa trên actionCode.
 * Ghi trực tiếp vào Firestore dùng increment.
 * Kiểm tra "once" dựa vào field `coins.claimedOnce` trong user doc.
 */
window.rewardCoins = async function(actionCode) {
    if (!auth.currentUser) return { success: false, reason: "NOT_AUTHED" };
    const policy = window.COIN_POLICY[actionCode];
    if (!policy || policy.amount <= 0) return { success: false, reason: "INVALID_POLICY" };

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { success: false, reason: "USER_NOT_FOUND" };

    const data = userSnap.data();
    const coins = data.coins || { received: 0, used: 0 };
    const claimedOnce = data.claimedOnce || [];

    // Kiểm tra "once"
    if (policy.once && claimedOnce.includes(actionCode)) {
        return { success: false, reason: "ALREADY_CLAIMED" };
    }

    const amount = Math.abs(policy.amount);
    const updateData = {
        'coins.received': increment(amount)
    };

    // Nếu là once, thêm vào danh sách claimed
    if (policy.once) {
        updateData.claimedOnce = claimedOnce.concat([actionCode]);
    }

    await updateDoc(userRef, updateData);

    // Hiệu ứng
    window.showCoinEffect(amount);
    window.logActivity('coin_receive', policy.label, { amount });
    console.log(`🪙 +${amount} xu (${policy.label})`);

    return { success: true, amount };
};

/**
 * Trừ xu cho user hiện tại dựa trên actionCode.
 * Kiểm tra số dư và oncePerTarget.
 */
window.spendCoins = async function(actionCode, targetId) {
    if (!auth.currentUser) return { success: false, reason: "NOT_AUTHED" };
    const policy = window.COIN_POLICY[actionCode];
    if (!policy || policy.amount >= 0) return { success: false, reason: "INVALID_POLICY" };

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { success: false, reason: "USER_NOT_FOUND" };

    const data = userSnap.data();
    const coins = data.coins || { received: 0, used: 0 };
    const balance = (coins.received || 0) - (coins.used || 0);
    const unlockedTargets = data.unlockedTargets || [];

    const amount = Math.abs(policy.amount);
    const targetKey = targetId ? `${actionCode}:${targetId}` : null;

    // Kiểm tra oncePerTarget
    if (policy.oncePerTarget) {
        if (!targetId) return { success: false, reason: "MISSING_TARGET_ID" };
        if (unlockedTargets.includes(targetKey)) {
            return { success: true, amount: 0, alreadyUnlocked: true };
        }
    }

    // Kiểm tra số dư
    if (balance < amount) {
        return { success: false, reason: "INSUFFICIENT_BALANCE" };
    }

    const updateData = {
        'coins.used': increment(amount)
    };

    if (policy.oncePerTarget) {
        updateData.unlockedTargets = unlockedTargets.concat([targetKey]);
    }

    await updateDoc(userRef, updateData);

    // Hiệu ứng
    window.showCoinEffect(-amount);
    window.logActivity('coin_spend', policy.label, { amount });
    console.log(`🪙 -${amount} xu (${policy.label})`);

    return { success: true, amount };
};
