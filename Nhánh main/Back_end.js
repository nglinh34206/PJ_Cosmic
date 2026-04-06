
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
        // Import Firebase SDKs
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
     //   import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
        import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, doc, setDoc, getDoc, updateDoc, deleteDoc, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Thêm dòng này vào cụm import: import { logEvent, setUserProperties } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
        // Firebase Configuration (From User)
        const firebaseConfig = {
            apiKey: "AIzaSyC4LY3lNNIMhsmC5fuJAG3ejABe3cWj41M",
            authDomain: "resource-9a362.firebaseapp.com",
            projectId: "resource-9a362",
            storageBucket: "resource-9a362.firebasestorage.app",
            messagingSenderId: "64359181492",
            appId: "1:64359181492:web:10d0622bd941451b5a7be1",
            measurementId: "G-TQ84LTSXD6"
        };

        // Initialize Firebase with try-catch
        let app, analytics, db, auth;
        try {
            app = initializeApp(firebaseConfig);
            analytics = null; // getAnalytics(app);
            db = getFirestore(app);
            auth = getAuth(app);
            console.log("Firebase & Auth Initialized!");
        } catch (e) {
            console.error("Firebase Init Error:", e);
            alert("Lỗi kết nối hệ thống! Vui lòng kiểm tra lại cấu hình.");
        }


// --- SUPABASE CONFIG ---
const supabaseUrl = 'https://xvwxryquxiphepyqatbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2d3hyeXF1eGlwaGVweXFhdGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MDcwMDEsImV4cCI6MjA4MjI4MzAwMX0.H5i14vJWotgWcTos6znXFHnUQXulKjpvR4gU4979VFA';
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase Initialized!");  // Để test console
// --- CẤU TRÚC RANK DATA ---
// --- CẤU TRÚC RANK DATA (FINAL NAMES) ---
const RANK_SYSTEM = {
    // 8 Mốc điểm tương ứng từ Lv1 -> Lv8
    thresholds: [0, 200, 1000, 2000, 4000, 6000, 8000, 10000],
    
    // Bảng tên danh hiệu theo 4 trụ cột (User thường)
    titles: {
        // Cột 1: NAVIGATOR (Diligence - Focus)
        navigator: ["Probe", "Rover", "Lander", "Orbiter", "Ranger", "Pioneer", "Voyager", "Horizon"],
        
        // Cột 2: GUARDIAN (Contribution - Upload)
        guardian:  ["Dust", "Meteor", "Asteroid", "Moon", "Planet", "Star", "Nebula", "Galaxy"],
        
        // Cột 3: DIPLOMAT (Social - Chat)
        diplomat:  ["Ping", "Echo", "Wave", "Pulse", "Beam", "Signal", "Resonance", "Spectrum"],
        
        // Cột 4: VOYAGER (Enthusiastic - Online)
        voyager:   ["Second", "Minute", "Hour", "Day", "Year", "Century", "Millennium", "Eternity"]
    },

    // Danh hiệu Genesis (CHỈ DÀNH CHO STAFF)
    genesis: {
        op: "Sanctuary",     // Operation
        tester: "Symphony",  // Tester
        mkt: "Origin"        // Marketing
    }
};
// --- DANH SÁCH MÔN HỌC (DATA TỪ ẢNH) ---
const SUBJECT_LIST = [
    "MGT01A - Quản trị học",
    "MKT21A - Marketing",
    "MGT12A - Hành vi tổ chức",
    "FIN02A - Tài chính doanh nghiệp",
    "FIN17A - Ngân hàng thương mại",
    "MIS08A - Phân tích thiết kế hệ thống",
    "IS60A - Quản lý dự án công nghệ thông tin",
    "IS54A - Trí tuệ nhân tạo",
    "GRA50A - Thực tập chuyên ngành",
    "IS51A - Lập trình Web với Php và MySQL",
    "IS49A - Phân tích nghiệp vụ (BA)",
    "IS24A - Kho dữ liệu và kinh doanh thông minh",
    "IS34A - Hệ thống hoạch định tài nguyên doanh nghiệp",
    "IS55A - Công nghệ dịch vụ tài chính",
    "MIS06A - Các hệ thống thông tin trong ngân hàng",
    "IS56A - Công nghệ ngân hàng số",
    "GRA90A - Tốt nghiệp (8 tín chỉ)",
    "Đồ án tốt nghiệp",
    "SPT03A - Giáo dục thể chất II (Bóng rổ)",
    "SPT04A - Giáo dục thể chất III (Bóng chuyền)",
    "SPT05A - Giáo dục thể chất IV (Cầu lông)",
    "SPT06A - Giáo dục thể chất V (Khiêu vũ)",
    "ENG04A - Tiếng Anh IV",
    "IS20A - Nhập môn hệ thống thông tin",
    "IS22A - Cơ sở lập trình",
    "IS21A - Cơ sở dữ liệu",
    "ACT01A - Nguyên lý kế toán",
    "ECO09A - Kinh tế học",
    "IS07A - Cấu trúc dữ liệu và giải thuật",
    "IS53A - Thiết kế cơ sở dữ liệu",
    "MAT05A - Toán rời rạc",
    "MIS07A - Hệ quản trị cơ sở dữ liệu",
    "IS35A - Thương mại điện tử",
    "IS19A - Thiết kế Web",
    "MIS02A - Hệ thống thông tin quản lý",
    "IS06A - Mạng và truyền thông",
    "IS25A - Lập trình .NET",
    "IS23A - Khai phá và phân tích dữ liệu",
    "PLT07A - Triết học Mác - Lênin",
    "PLT08A - Kinh tế chính trị Mác - Lênin",
    "PLT09A - Chủ nghĩa xã hội khoa học",
    "PLT10A - Lịch sử Đảng Cộng sản Việt Nam",
    "PLT06A - Tư tưởng Hồ Chí Minh",
    "ENG01A - Tiếng Anh I",
    "ENG02A - Tiếng Anh II",
    "ENG03A - Tiếng Anh III",
    "IS52A - Năng lực số ứng dụng",
    "LAW01A - Pháp luật đại cương",
    "MAT15A - Toán dành cho kinh tế",
    "MAT14A - Xác suất và thống kê",
    "BUS20A - Giao tiếp trong kinh doanh",
    "MGT36A - Đổi mới sáng tạo và khởi nghiệp",
    "SPT07A - Giáo dục quốc phòng và An ninh",
    "SPT02A - Giáo dục thể chất I (Đại cương)"
];

// Hàm xử lý khi nhập liệu (Filter & Show Suggestion)
window.handleCategoryInput = function(input) {
    const val = input.value.toLowerCase();
    const box = document.getElementById('suggestion-box');
    
    // Nếu trống thì hiển thị 5 môn đầu tiên (hoặc list trống tùy bạn)
    // Ở đây mình để hiển thị toàn bộ list lọc được
    const filtered = SUBJECT_LIST.filter(sub => sub.toLowerCase().includes(val));

    if (filtered.length === 0) {
        box.style.display = 'none';
        return;
    }

    // Tạo HTML cho list
    let html = '';
    filtered.forEach(sub => {
        // Highlight từ khóa tìm kiếm
        const regex = new RegExp(`(${val})`, 'gi');
        const highlighted = sub.replace(regex, '<strong>$1</strong>');
        html += `<div class="suggestion-item" onclick="selectCategory('${sub}')">${highlighted}</div>`;
    });

    box.innerHTML = html;
    box.style.display = 'block';
};

// Hàm chọn môn học từ list
window.selectCategory = function(value) {
    document.getElementById('up-category').value = value;
    document.getElementById('suggestion-box').style.display = 'none';
};

// Ẩn box khi click ra ngoài
document.addEventListener('click', function(e) {
    const wrapper = document.querySelector('.autocomplete-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('suggestion-box').style.display = 'none';
    }
});   
     // GLOBAL VARS attached to window for HTML access
        window.currentUserRank = "UNKNOWN";
        window.currentUserName = "Unknown Pilot";
        window.currentUserRoles = []; // Stores roles: ['admin', 'tester', 'op', 'mkt']
        window.currentMsv = "";
        window.voidIdentity = "";
        window.isSOSActive = false;
        window.isRegisterMode = false; // Toggle login/register
        window.targetEditUid = null; // For admin role editing
        window.currentDocId = null; // ID of doc being viewed
// --- MODULE TELEMETRY (TRACKING SYSTEM) ---
window.docStartTime = 0; // Biến đếm giờ đọc

// Hàm bắn event chung
window.trackTelemetry = function(eventName, params = {}) {
    if (!analytics) return; // Chưa init xong thì bỏ qua

    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Tự động lấy giờ & thứ để vẽ Heatmap
    const timeContext = {
        hour_of_day: now.getHours(),      // 0-23
        day_of_week: days[now.getDay()],  // Thứ
        timestamp_iso: now.toISOString()
    };

    // Gộp data và bắn lên Google
    const finalParams = { ...timeContext, ...params };
    
    try {
        logEvent(analytics, eventName, finalParams);
        // Bật dòng dưới nếu muốn soi log để test, chạy thật thì tắt đi cho đỡ rối
        // console.log(`📡 SENT [${eventName}]`, finalParams); 
    } catch (e) {
        console.warn("Telemetry Error:", e);
    }
};

        // --- AUTH & PROFILE LOGIC ---

        //Hàm Ẩn/hiện mật khẩu
        window.togglePasswordCheck = function(checkbox) {
            const passInput = document.getElementById('auth-pass');
            // Nếu checkbox được tích (checked === true) thì hiện text, ngược lại hiện password
            if (checkbox.checked) {
                passInput.type = 'text';
            } else {
                passInput.type = 'password';
            }
        };

        // XỬ LÝ VẤN ĐỀ ĐĂNG NHẬP / ĐĂNG KÝ
        window.isLoginMode = true;
        // 1. Tự động kiểm tra trạng thái khi vừa vào web
        if (auth) {
                onAuthStateChanged(auth, async (user) => { // Thêm async ở đây
                    const loginScreen = document.getElementById('login-screen');
                    const appContainer = document.getElementById('app-container');

                    if (user) {
                        console.log("Đã xác thực Auth:", user.email);
                        
                        // 1. Chạy hàm đảm bảo Profile & Phân quyền (Admin/User)
                        await window.ensureUserProfile(user); 

                        // 2. Giao diện
                        loginScreen.style.display = 'none'; 
                        appContainer.style.display = 'flex'; 
                        appContainer.style.opacity = '1';
                        appContainer.style.visibility = 'visible';

                        // 3. Gọi các hàm load dữ liệu khác
                        if (typeof window.renderResources === 'function') window.renderResources();
                        if (typeof window.loadEnergyStatus === 'function') window.loadEnergyStatus();
                    } else {
                        loginScreen.style.display = 'flex';
                        appContainer.style.display = 'none';
                    }
                });
            }

        // 2. Chuyển đổi giao diện Đăng nhập / Đăng ký
        window.toggleAuthMode = function() {
            isLoginMode = !isLoginMode;
            const title = document.querySelector('.login-title');
            const subtitle = document.getElementById('login-subtitle');
            const btnAction = document.getElementById('btn-auth-action');
            const switchText = document.querySelector('.auth-switch');
            const regFields = document.getElementById('register-fields');

            // Reset thông báo lỗi
            const errorMsg = document.getElementById('login-error');
            errorMsg.style.display = 'none';

            if (isLoginMode) {
                title.innerText = 'THE AIRLOCK';
                subtitle.innerText = 'Nhập thông tin truy cập Cosmic Base.';
                btnAction.innerText = 'LOGIN';
                switchText.innerHTML = 'Chưa có tài khoản? <b>Đăng ký ngay</b>';
                regFields.style.display = 'none';
            } else {
                title.innerText = 'REGISTRATION';
                subtitle.innerText = 'Điền thông tin để tạo tài khoản mới.';
                btnAction.innerText = 'CREATE ACCOUNT';
                switchText.innerHTML = 'Đã có tài khoản? <b>Đăng nhập</b>';
                if (regFields) regFields.style.display = 'block';
            }
        }

        // 3. Xử lý nút bấm chính (Login hoặc Register)
        window.handleAuth = async function() {
            const email = document.getElementById('auth-email').value.trim();
            const pass = document.getElementById('auth-pass').value.trim();
            const name = document.getElementById('auth-name').value.trim();
            const age = document.getElementById('auth-age').value;
            const gender = document.getElementById('auth-gender').value;
            const errorMsg = document.getElementById('login-error');

            // Kiểm tra dữ liệu chung
            if (!email || !pass) {
                showError("Vui lòng nhập Email và Mật khẩu.");
                return;
            }

            try {
                if (window.isLoginMode) {
                    // Logic ĐĂNG NHẬP
                    await signInWithEmailAndPassword(auth, email, pass);
                } else {
                    // Logic ĐĂNG KÝ
                    if (!name) { showError("Vui lòng nhập họ và tên đầy đủ"); return; }
                    
                    // Bước 1: Tạo tài khoản trên Firebase Auth
                    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                    const user = userCredential.user;
                    
                    // Bước 2: Lưu thông tin bổ sung vào Database (Firestore)
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        fullName: name,
                        age: age || "N/A",
                        gender: gender || "N/A",
                        email: email,
                        createdAt: serverTimestamp()
                    });

                    alert("Đăng ký thành công! Đang chuyển về trang đăng nhập.");
                    window.toggleAuthMode(); // Quay về login theo yêu cầu của bạn
                }
            } catch (error) {
                console.error("Auth Error:", error);
                let msg = "Lỗi xác thực. Vui lòng thử lại.";

                // Các trường hợp lỗi cụ thể
                if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                    msg = "Email hoặc mật khẩu không chính xác.";
                } else if (error.code === 'auth/wrong-password') {
                    msg = "Mật khẩu không đúng. Vui lòng thử lại.";
                } else if (error.code === 'auth/email-already-in-use') {
                    msg = "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.";
                } else if (error.code === 'auth/invalid-email') {
                    msg = "Định dạng email không hợp lệ.";
                }
                showError(msg);
            }
        }
        //Hàm hiển thị lỗi
        function showError(msg) {
            const errorMsg = document.getElementById('login-error');
            errorMsg.innerText = msg;
            errorMsg.style.display = 'block';
            document.querySelector('.login-box').style.animation = 'shake 0.3s';
            setTimeout(() => { document.querySelector('.login-box').style.animation = 'none'; }, 300);
        }

    // 4. Xử lý ĐĂNG XUẤT
        window.handleLogout = async function() {
            try {
                await signOut(auth);
                location.reload(); 
            } catch (error) { console.error("Logout error", error); }
        };
    
    // Hàm định danh User (Gọi khi Login xong)
        window.identifyUserForTracking = function(profile) {
            // Kiểm tra an toàn để không crash app
            if (typeof analytics === 'undefined' || !analytics || !profile) return;
            
            try {
                setUserProperties(analytics, {
                    user_name: profile.displayName || profile.fullName || "Unknown Pilot",
                    user_rank: profile.rank || "Stardust",
                    user_role: (profile.roles || ['user']).join(','),
                    last_login_timestamp: new Date().toISOString()
                });
                
                if (window.trackTelemetry) {
                    window.trackTelemetry('login', { method: 'msv_auth', rank: profile.rank });
                }
            } catch (e) {
                console.warn("Telemetry Error:", e);
            }
        };

    // 5. Hàm đảm bảo Profile người dùng tồn tại & Phân quyền
        window.ensureUserProfile = async function(user) {
    const userRef = doc(db, "users", user.uid);
    let userSnap;
    
    try { 
        userSnap = await getDoc(userRef); 
    } catch (e) { 
        console.error("Lỗi đọc profile:", e); 
        return; 
    }
    
    // Xác định định danh Admin
    const userEmail = user.email.toLowerCase();
    const msv = userEmail.split('@')[0];
    const isAdminAccount = (userEmail === 'vuconghoan461@gmail.com');

    if (userSnap.exists()) {
        // --- TRƯỜNG HỢP 1: PROFILE ĐÃ CÓ TRÊN DATABASE ---
        let data = userSnap.data();

        // Kiểm tra nếu là email của bạn nhưng chưa có quyền Admin trong DB thì ép cập nhật
        if (isAdminAccount) {
            const currentRoles = data.roles || [];
            if (!currentRoles.includes('admin') || data.rank !== 'SUPERNOVA') {
                console.log("Commander detected. Updating system privileges...");
                
                const adminUpdates = {
                    rank: "SUPERNOVA",
                    energy: 99999,
                    displayName: "Commander Hoàn", 
                    roles: ['admin', 'tester', 'op', 'mkt'] 
                };

                try {
                    await updateDoc(userRef, adminUpdates);
                    // Gộp dữ liệu mới vào để UI cập nhật ngay lập tức
                    data = { ...data, ...adminUpdates };
                    alert("📡 HỆ THỐNG: Đã xác nhận Commander Hoàn. Toàn quyền truy cập được kích hoạt!");
                } catch(err) {
                    console.error("Lỗi cập nhật quyền Admin:", err);
                }
            }
        }
        window.loadUserProfile(data);
    } else {
        // --- TRƯỜNG HỢP 2: PROFILE MỚI TOANH (CHƯA TỪNG ĐĂNG NHẬP) ---
        let initialRank = "Space Debris";
        let initialEnergy = 0;
        let initialName = "Cadet " + msv;
        let initialRoles = ['user'];
        
        // Đặc cách Admin cho tài khoản của bạn ngay từ lần đầu
        if (isAdminAccount) {
            initialRank = "SUPERNOVA";
            initialEnergy = 99999;
            initialName = "Commander Hoàn"; 
            initialRoles = ['admin', 'tester', 'op', 'mkt'];
        }

        const defaultProfile = {
            msv: msv,
            displayName: initialName,
            email: userEmail,
            rank: initialRank,
            energy: initialEnergy,
            roles: initialRoles,
            stats: { focus: 0, upload: 0, interact: 0, online: 1 },
            joinedAt: serverTimestamp()
        };

        await setDoc(userRef, defaultProfile);
        window.loadUserProfile(defaultProfile);
    }
};
// --- HÀM HIGH COMMAND - ĐÃ FIX SYNTAX HOÀN TOÀN ---
        window.setupHighCommand = function() {
            const inbox = document.getElementById('admin-inbox');
            if (!inbox) {
                console.error("Không tìm thấy #admin-inbox");
                return;
            }
            inbox.innerHTML = '<div style="color:#00FFC2; text-align:center; padding:20px;">Đang tải inbox...</div>';
            console.log("High Command: Bắt đầu load...");
            
            // Proposals
            const proposalsQ = query(collection(db, "proposals"), where("status", "==", "unread"), orderBy("createdAt", "desc"));
            onSnapshot(proposalsQ, (snap) => {
                console.log("Proposals: ", snap.size, "docs");
                let html = '<h4 style="color:#00FFC2;">Đề xuất Tester</h4>';
                if (snap.empty) {
                    html += '<div style="color:#888;">Không có đề xuất mới.</div>';
                } else {
                    snap.forEach(d => {
                        const data = d.data();
                        html += `<div style="padding:10px; border-left:4px solid #00FFC2; margin-bottom:10px;">
                            ${data.content}<br><small>${data.sender}</small>
                            <button onclick="markAsRead('${d.id}', 'proposals')" style="background:#333; color:white; border:1px solid #555; padding:2px 5px; font-size:10px; cursor:pointer; margin-top:5px;">Mark Read</button>
                        </div>`;
                    });
                }
                updateInbox(html + '<hr style="border-color:#444;">');
            });
    
    // Broadcasts
    const broadcastsQ = query(collection(db, "broadcasts"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
    onSnapshot(broadcastsQ, (snap) => {
        console.log("Broadcasts: ", snap.size, "docs");
        let html = '<h4 style="color:#FF00FF;">Yêu cầu Broadcast</h4>';
        if (snap.empty) {
            html += '<div style="color:#888;">Không có yêu cầu mới.</div>';
        } else {
            snap.forEach(d => {
                const data = d.data();
                html += `<div style="padding:10px; border-left:4px solid #FF00FF; margin-bottom:10px;">
                    ${data.message}<br><small>${data.sender}</small>
                    <div style="margin-top:5px;">
                        <button onclick="approveBroadcast('${d.id}', '${data.message.replace(/'/g, "\\'")}')" style="background:var(--neon-teal); color:black; border:none; padding:2px 5px; font-size:10px; cursor:pointer;">Approve</button>
                        <button onclick="rejectBroadcast('${d.id}')" style="background:#FF4500; color:white; border:none; padding:2px 5px; font-size:10px; cursor:pointer; margin-left:5px;">Reject</button>
                    </div>
                </div>`;
            });
        }
        updateInbox(html);
    });
    
    function updateInbox(newHtml) {
        // Để tránh flicker, append mới hoặc replace nếu cần
        const current = inbox.innerHTML;
        if (current.includes('Đang tải')) {
            inbox.innerHTML = '';
        }
        inbox.innerHTML += newHtml; // Hoặc logic merge tốt hơn nếu cần
    }
};
      window.loadUserProfile = function(data) {
    if (!data) data = {};
    const displayName = data.displayName || data.fullName || "Unknown Pilot";
    const rank = data.rank || "Space Debris";
    const energy = typeof data.energy === 'number' ? data.energy : 0;
    const roles = data.roles || ['user'];

    // 1. Cập nhật biến toàn cục & UI cơ bản
    window.currentUserName = displayName;
    window.currentUserRank = rank.toUpperCase();
    window.currentUserRoles = roles;
    window.currentMsv = data.msv;

    document.getElementById('user-display-name').innerText = displayName;
    document.getElementById('welcome-name').innerText = displayName;

    // --- 2. LOGIC TÍNH TOÁN RANK & TIER (MỚI) ---
    const rankTitle = document.getElementById('user-rank-title');
    const tierTag = document.getElementById('user-tier-tag');
    const avatarFrame = document.getElementById('user-avatar-frame');
    const quoteBox = document.getElementById('quote-box');
    const energyBar = document.getElementById('energy-bar');

    let displayRank = "Probe"; // Mặc định
    let tierClass = "rank-standard";
    let tagClass = "tag-standard";
    let frameClass = "basic";
    let tierName = "Tier 1"; 
    let quoteHtml = "";

    // A. ADMIN -> TIER 5: ULTIMATE (SUPERNOVA)
    if (roles.includes('admin')) {
        displayRank = "SUPERNOVA";   
        tierName = "ULTIMATE"; 
        tierClass = "rank-ultimate"; 
        tagClass = "tag-ultimate";
        frameClass = "supernova";    
        quoteHtml = `<h4 style="color: #FF4500;">🔥 THE COMMANDER</h4><p>Quyền lực tối thượng.</p>`;
    }
    // B. STAFF -> SPECIAL: GENESIS (SANCTUARY/SYMPHONY/ORIGIN)
    else if (roles.some(r => ['op', 'tester', 'mkt'].includes(r))) {
        tierClass = "rank-genesis"; 
        tagClass = "tag-genesis";
        frameClass = "supernova";   
        tierName = "GENESIS"; 

        if (roles.includes('op')) {
            displayRank = "SANCTUARY"; 
            quoteHtml = `<h4 style="color: #DC143C;">🛡️ SANCTUARY</h4><p>Thánh địa vận hành.</p>`;
        } else if (roles.includes('tester')) {
            displayRank = "SYMPHONY"; 
            quoteHtml = `<h4 style="color: #DC143C;">🎹 SYMPHONY</h4><p>Sự phối hợp hoàn hảo.</p>`;
        } else if (roles.includes('mkt')) {
            displayRank = "ORIGIN"; 
            quoteHtml = `<h4 style="color: #DC143C;">📢 ORIGIN</h4><p>Khởi nguồn lan tỏa.</p>`;
        } else {
            displayRank = "GENESIS"; 
            quoteHtml = `<h4 style="color: #DC143C;">🩸 GENESIS STAFF</h4><p>Thành viên sáng thế.</p>`;
        }
    } 
    // C. USER -> TIER 1 - 4 (Theo 4 hệ: Navigator, Guardian, Diplomat, Voyager)
    else {
        // C.1: Tính Level hiện tại (0 -> 7 tương ứng Lv 1 -> 8)
        let levelIndex = 0;
        for (let i = 0; i < RANK_SYSTEM.thresholds.length; i++) {
            if (energy >= RANK_SYSTEM.thresholds[i]) levelIndex = i;
        }
        const currentLevel = levelIndex + 1;

        // C.2: Xác định Hệ (Archetype) dựa trên chỉ số cao nhất
        const s = data.stats || { focus: 0, upload: 0, interact: 0, online: 0 };
        let maxStat = 'focus';
        let maxVal = s.focus || 0;
        let archetypeName = "NAVIGATOR"; // Mặc định

        // So sánh tìm chỉ số max
        if ((s.upload || 0) > maxVal) { maxStat = 'upload'; maxVal = s.upload; archetypeName = "GUARDIAN"; }
        if ((s.interact || 0) > maxVal) { maxStat = 'interact'; maxVal = s.interact; archetypeName = "DIPLOMAT"; }
        // Online là chỉ số phụ, nếu các cái kia = 0 hoặc online cực cao thì mới tính
        if (maxVal === 0 && (s.online || 0) > 0) { maxStat = 'online'; archetypeName = "VOYAGER"; }

        // Lấy tên Rank từ bảng RANK_SYSTEM
        if (maxStat === 'upload') displayRank = RANK_SYSTEM.titles.guardian[levelIndex];
        else if (maxStat === 'interact') displayRank = RANK_SYSTEM.titles.diplomat[levelIndex];
        else if (maxStat === 'online') displayRank = RANK_SYSTEM.titles.voyager[levelIndex];
        else displayRank = RANK_SYSTEM.titles.navigator[levelIndex]; 

        displayRank = displayRank.toUpperCase();

        // C.3: Xác định Visual Tier (Hiệu ứng)
        if (currentLevel <= 5) {
            // Lv 1-5: Standard
            tierClass = "rank-standard";
            tagClass = "tag-standard";
            frameClass = "basic";
            tierName = `Tier 1 • Lv.${currentLevel}`;
        } else if (currentLevel === 6) {
            // Lv 6: Neon Pulse
            tierClass = "rank-neon";
            tagClass = "tag-neon";
            frameClass = "basic"; 
            tierName = "NEON PULSE (Tier 2)";
        } else if (currentLevel === 7) {
            // Lv 7: Nebula Flow
            tierClass = "rank-nebula";
            tagClass = "tag-nebula";
            frameClass = "supernova"; // Bắt đầu dùng khung đẹp
            tierName = "NEBULA FLOW (Tier 3)";
        } else { 
            // Lv 8 (Max): Horizon
            tierClass = "rank-horizon";
            tagClass = "tag-horizon";
            frameClass = "supernova";
            tierName = "HORIZON (Tier 4)";
        }

        // Thông tin XP cho level tiếp theo
        const nextXp = RANK_SYSTEM.thresholds[levelIndex + 1];
        const xpText = nextXp ? `Next: ${nextXp} XP` : 'MAX LEVEL';
        
        quoteHtml = `<h4 style="color: #aaa;">${displayRank}</h4><p style="font-size:12px; color:#666;">${archetypeName} Class • ${xpText}</p>`;
    }

    // --- 3. RENDER UI ---
    rankTitle.className = "rank-title " + tierClass;
    rankTitle.innerText = displayRank; 
    
    tierTag.className = "tier-tag " + tagClass;
    tierTag.innerText = tierName;

    avatarFrame.className = "avatar-container avatar-frame " + frameClass;
    quoteBox.innerHTML = quoteHtml;
    
    document.getElementById('energy-text').innerText = energy;
    
    // --- 4. THANH NĂNG LƯỢNG (ENERGY BAR) ---
    if (roles.includes('admin') || tierClass === "rank-genesis" || energy >= 10000) {
        // Admin, Staff hoặc Max Level -> Full cây
        energyBar.style.width = "100%";
    } else {
        // User đang cày -> Tính % trong cấp hiện tại
        let currentBase = 0;
        let nextTarget = 200;
        
        // Tìm mốc hiện tại
        for (let i = 0; i < RANK_SYSTEM.thresholds.length; i++) {
            if (energy >= RANK_SYSTEM.thresholds[i]) {
                currentBase = RANK_SYSTEM.thresholds[i];
                nextTarget = RANK_SYSTEM.thresholds[i+1] || 10000;
            }
        }
        
        // Tính toán
        let range = nextTarget - currentBase;
        let gained = energy - currentBase;
        let pct = (range > 0) ? (gained / range) * 100 : 100;
        energyBar.style.width = Math.max(5, pct) + "%"; // Tối thiểu 5% để nhìn thấy vạch
    }

    // --- 5. KHỞI TẠO CÁC MODULE KHÁC ---
    
    // Admin Panel
    if (roles.includes('admin')) {
        document.getElementById('admin-panel').style.display = 'block';
        window.loadCrewList();
    }

    // Ops Center (Cho Admin & Op)
    if (roles.includes('admin') || roles.includes('op')) {
        const panelOp = document.getElementById('panel-op');
        if(panelOp) panelOp.style.display = 'block'; 
        window.setupOpsCenter(); 
    }

    // Chat & Resource Hub
    window.initVoidChat();
    window.initResourceHub();
    window.setupHighCommand();
window.identifyUserForTracking(data);
};

        window.enterApp = function() {
            document.getElementById('login-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('app-container').style.display = 'flex';
            }, 500);
        };
window.showNotificationBanner = function(msg) {
    const banner = document.getElementById('notification-banner');
    const content = document.getElementById('banner-content');
    if (banner && content) {
        content.innerHTML = msg;
        banner.style.display = 'block';
        // Auto hide after 10s
        setTimeout(() => { banner.style.display = 'none'; }, 10000);
    }
};
  window.approveBroadcast = async function(id, msg) {
    if (!confirm("Approve và broadcast thông báo này?")) return;
    try {
        await updateDoc(doc(db, "broadcasts", id), { status: 'approved' });
        const broadcastMsg = `THÔNG BÁO TỪ HIGH COMMAND: ${msg}`;
        await addDoc(collection(db, "void_messages"), {
            identity: "📢 COSMIC SIGNAL",
            text: broadcastMsg,
            createdAt: serverTimestamp()
        });
        // Show in banner immediately
        window.showNotificationBanner(broadcastMsg);
        alert("✅ Approved và broadcasted!");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};

// Cập nhật appendVoidMessage để check broadcast
window.appendVoidMessage = function(identity, text, isMe) {
    const chatBox = document.getElementById('void-messages');
    const row = document.createElement('div');
    row.className = `void-msg-row ${isMe ? 'me' : ''}`;
    const idDiv = document.createElement('div'); idDiv.className = 'void-identity'; idDiv.innerText = identity;
    const contentDiv = document.createElement('div'); contentDiv.className = 'void-content'; contentDiv.innerText = text;
    row.appendChild(idDiv); row.appendChild(contentDiv);
    chatBox.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // If broadcast, show in banner
    if (identity === "📢 COSMIC SIGNAL") {
        window.showNotificationBanner(text);
    }
};

window.rejectBroadcast = async function(id) {
    if (!confirm("Reject yêu cầu này?")) return;
    try {
        await updateDoc(doc(db, "broadcasts", id), { status: 'rejected' });
        alert("❌ Rejected!");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};// Hàm mark proposal as read
window.markAsRead = async function(id, collectionName) {
    try {
        await updateDoc(doc(db, collectionName, id), { status: 'read' });
        alert("✅ Marked as read!");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};
        window.switchTab = function(tabId, element) {
            // CHECK ACCESS FOR BRIDGE
            if (tabId === 'bridge') {
                const hasAccess = window.currentUserRoles.some(r => ['admin','tester','op','mkt'].includes(r));
                document.getElementById('bridge-locked').style.display = hasAccess ? 'none' : 'block';
                document.getElementById('bridge-content').style.display = hasAccess ? 'block' : 'none';
                
                if (hasAccess) {
                    // Show panels based on role
                    document.getElementById('panel-admin').style.display = window.currentUserRoles.includes('admin') ? 'block' : 'none';
                    document.getElementById('panel-tester').style.display = window.currentUserRoles.includes('tester') ? 'block' : 'none';
                    document.getElementById('panel-op').style.display = window.currentUserRoles.includes('op') ? 'block' : 'none';
                    document.getElementById('panel-mkt').style.display = window.currentUserRoles.includes('mkt') ? 'block' : 'none';
                }
            }

            document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            element.classList.add('active');
        };

        // --- ADMIN: CREW MANAGEMENT LOGIC ---
        window.loadCrewList = function() {
            // CHANGED: Increased limit to 100 and ordered by MSV
            const q = query(collection(db, "users"), orderBy("msv", "asc"), limit(100)); 
            onSnapshot(q, (snapshot) => {
                const table = document.getElementById('crew-list');
                let html = `<tr><th>MSV</th><th>Tên</th><th>Vai trò</th><th>Action</th></tr>`;
                
                // Add counter
                const total = snapshot.size;
                document.querySelector('#admin-panel h3').innerHTML = `🛡️ COMMAND CENTER (ADMIN) - <span style="font-size:12px; color:#888;">Total: ${total} members</span>`;

                snapshot.forEach(doc => {
                    const d = doc.data();
                    const roles = d.roles || ['user'];
                    let roleBadges = '';
                    if(roles.includes('admin')) roleBadges += `<span class="role-badge role-admin">ADMIN</span>`;
                    if(roles.includes('tester')) roleBadges += `<span class="role-badge role-tester">TESTER</span>`;
                    if(roles.includes('op')) roleBadges += `<span class="role-badge role-op">OP</span>`;
                    if(roles.includes('mkt')) roleBadges += `<span class="role-badge role-mkt">MKT</span>`;
                    
                    // Highlight Admin Row
                    const rowStyle = d.msv === '4043292' ? 'background:rgba(255,215,0,0.1);' : '';

                    html += `
                        <tr style="${rowStyle}">
                            <td>${d.msv}</td>
                            <td>${d.displayName}</td>
                            <td>${roleBadges}</td>
                            <td><button onclick="openRoleModal('${doc.id}', '${d.displayName}', '${roles.join(',')}')" 
                            style="background:#333; color:white; border:1px solid #555; cursor:pointer;">Edit</button></td>
                        </tr>
                    `;
                });
                table.innerHTML = html;
            });
        };

        window.openRoleModal = function(uid, name, rolesStr) {
            window.targetEditUid = uid;
            document.getElementById('role-target-name').innerText = "Target: " + name;
            
            const roles = rolesStr.split(',');
            document.getElementById('role-admin').checked = roles.includes('admin');
            document.getElementById('role-tester').checked = roles.includes('tester');
            document.getElementById('role-op').checked = roles.includes('op');
            document.getElementById('role-mkt').checked = roles.includes('mkt');
            
            document.getElementById('role-modal').style.display = 'flex';
        };

        window.submitRoleChange = async function() {
            if (!window.targetEditUid) return;
            
            const newRoles = ['user']; // Always base user
            if(document.getElementById('role-admin').checked) newRoles.push('admin');
            if(document.getElementById('role-tester').checked) newRoles.push('tester');
            if(document.getElementById('role-op').checked) newRoles.push('op');
            if(document.getElementById('role-mkt').checked) newRoles.push('mkt');

            try {
                await updateDoc(doc(db, "users", window.targetEditUid), {
                    roles: newRoles
                });
                document.getElementById('role-modal').style.display = 'none';
                alert("Đã cập nhật quyền thành công!");
            } catch(e) {
                console.error(e);
                alert("Lỗi khi cập nhật quyền: " + e.message);
            }
        };

        // --- ROLE ACTIONS (Mockup Logic for Demo) ---
      window.sendProposal = async function() {
    const txt = document.getElementById('proposal-text').value.trim();
    if (!txt) return alert("Vui lòng nhập nội dung đề xuất!");
    
    try {
        await addDoc(collection(db, "proposals"), {
            content: txt,
            sender: window.currentUserName,
            senderUid: auth.currentUser.uid,
            status: 'unread',
            createdAt: serverTimestamp()
        });
        document.getElementById('proposal-text').value = '';
        alert("🛠️ Đề xuất đã được gửi tới High Command!");
    } catch (e) {
        console.error("Lỗi gửi proposal:", e);
        alert("Lỗi kết nối: " + e.message);
    }
};

      window.requestBroadcast = async function() {
    const txt = document.getElementById('broadcast-msg').value.trim();
    if (!txt) return alert("Vui lòng nhập nội dung thông báo!");
    
    try {
        await addDoc(collection(db, "broadcasts"), {
            message: txt,
            sender: window.currentUserName,
            senderUid: auth.currentUser.uid,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        document.getElementById('broadcast-msg').value = '';
        alert("📢 Yêu cầu phát sóng đã được gửi duyệt!");
    } catch (e) {
        console.error("Lỗi gửi broadcast:", e);
        alert("Lỗi kết nối: " + e.message);
    }
};

        // ... [Giữ nguyên các hàm openSplitView, closeSplitView, initVoidChat, etc.] ...
        window.openSplitView = function(docName, fileUrl, docId, uploaderName) {
// Thêm vào đầu hàm:
window.docStartTime = Date.now(); // Bắt đầu bấm giờ
window.trackTelemetry('view_document', { 
    doc_title: docName, 
    doc_id: docId
});
            document.getElementById('resource-hub-main').style.display = 'none';
            document.getElementById('split-view-container').style.display = 'flex';
            document.getElementById('doc-title').innerText = docName;
            window.currentDocId = docId;
            
             // --- DELETE BUTTON LOGIC ---
            const btnDelete = document.getElementById('btn-delete-current-doc');
            // Show if Admin OR if current user is the uploader
            btnDelete.style.display = 'none';
            // Admin luôn được xóa
            if (window.currentUserRoles.includes('admin')) {
                btnDelete.style.display = 'block';
            } else if (auth.currentUser) {
                // Check uploader bằng UID
                getDoc(doc(db, "resources", docId)).then(snap => {
                    if (!snap.exists()) return;
                    const data = snap.data();
                    if (data.uploadedByUid === auth.currentUser.uid) {
                        btnDelete.style.display = 'block';
                    }
                });
            }

           const iframe = document.getElementById('doc-iframe');
    const placeholderMsg = document.getElementById('doc-placeholder-msg');
    const msgText = document.getElementById('doc-msg-text');
    const extLinkBtn = document.getElementById('external-link-btn');
    
    if (fileUrl && (fileUrl.includes('supabase.co') || fileUrl.toLowerCase().endsWith('.pdf'))) {
        // Supabase or PDF: Use Google Viewer for reliable preview
        iframe.style.display = 'block';
        placeholderMsg.style.display = 'none';
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
        iframe.src = googleViewerUrl;
    } else if (fileUrl && fileUrl.startsWith('http')) {
        // External link (e.g., Google Drive)
        iframe.style.display = 'none';
        placeholderMsg.style.display = 'block';
        msgText.innerText = "Tài liệu này là liên kết ngoài (Google Drive/Web).";
        extLinkBtn.href = fileUrl;
        extLinkBtn.innerText = "Mở tài liệu tại tab mới ↗";
        extLinkBtn.style.display = 'inline-block';
    } else {
        // No valid URL or deprecated blob
        iframe.style.display = 'none';
        placeholderMsg.style.display = 'block';
        msgText.innerText = "Không tìm thấy tài liệu hoặc preview không hỗ trợ.";
        extLinkBtn.style.display = 'none';
    }
};

        window.closeSplitView = function() {
// Thêm vào đầu hàm:
if (window.docStartTime > 0) {
    const duration = (Date.now() - window.docStartTime) / 1000;
    if (duration > 5) { // Đọc trên 5s mới tính
        window.trackTelemetry('read_completed', { 
            duration_seconds: Math.round(duration) 
        });
    }
    window.docStartTime = 0;
}
            document.getElementById('split-view-container').style.display = 'none';
            document.getElementById('resource-hub-main').style.display = 'block';
            document.getElementById('doc-iframe').src = "";
            window.currentDocId = null;
        };
        
        window.deleteCurrentDocument = async function() {
            if(!window.currentDocId) return;
            if(!confirm("Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.")) return;
            
            try {
                await deleteDoc(doc(db, "resources", window.currentDocId));
                alert("Đã xóa tài liệu.");
                window.closeSplitView();
            } catch(e) {
                console.error(e);
                alert("Lỗi khi xóa: " + e.message);
            }
        };

        // 1. VOID CHAT LOGIC
        window.initVoidChat = function() {
            // 1. Tạo ID tạm thời nếu chưa có
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const userRank = window.currentUserRank || "Cadet";
            window.voidIdentity = `${userRank}#${randomNum}`;
            
            const identityDisplay = document.getElementById('void-user-identity');
            if (identityDisplay) identityDisplay.innerText = "ID: " + window.voidIdentity;

            // 2. Truy vấn dữ liệu (Sắp xếp theo thời gian tạo)
            const q = query(collection(db, "void_messages"), orderBy("createdAt", "asc"), limit(50));
            
            onSnapshot(q, (snapshot) => {
                const chatBox = document.getElementById('void-messages');
                chatBox.innerHTML = '<div style="text-align: center; color: #444; margin-bottom: 15px; font-style: italic; font-size: 0.8rem;">-- Kênh đã được mã hóa --</div>';
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // So sánh ID để biết tin nhắn nào là của mình
                    const isMe = data.identity === window.voidIdentity;
                    window.appendVoidMessage(data.identity, data.text, isMe);
                });
            });
        };

        window.appendVoidMessage = function(identity, text, isMe) {
            const chatBox = document.getElementById('void-messages');
            const row = document.createElement('div');
            row.className = `void-msg-row ${isMe ? 'me' : ''}`;
            const idDiv = document.createElement('div'); idDiv.className = 'void-identity'; idDiv.innerText = identity;
            const contentDiv = document.createElement('div'); contentDiv.className = 'void-content'; contentDiv.innerText = text;
            row.appendChild(idDiv); row.appendChild(contentDiv);
            chatBox.appendChild(row);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        //2. HÀM NHẬP TIN NHẮN -> ENTER ĐỂ ĐẨY TIN NHẮN LÊN
        window.sendVoidMessage = async function() {
            const input = document.getElementById('void-input-field');
            const text = input.value.trim();
            
            if (!text) return; // Không gửi tin nhắn rỗng

            try {
                await addDoc(collection(db, "void_messages"), {
                    identity: window.voidIdentity || "Unknown Pilot",
                    text: text,
                    createdAt: serverTimestamp(), // Dùng cái này để sắp xếp tin nhắn chính xác
                    timestamp: serverTimestamp() // Dùng cho hiển thị thời gian
                });
                
                input.value = ''; // Gửi xong thì xóa chữ trong ô nhập
            } catch (e) {
                console.error("Lỗi truyền tín hiệu:", e);
            }
        };

        // Lắng nghe phím Enter để gửi tin cho nhanh
        document.getElementById('void-input-field').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.sendVoidMessage();
            }
        });
                window.openUploadModal = function() {
                    document.getElementById('upload-modal').style.display = 'flex';
                };

        window.closeUploadModal = function() {

            document.getElementById('upload-modal').style.display = 'none';

            document.getElementById('up-title').value = '';

            document.getElementById('up-category').value = '';

            document.getElementById('up-file').value = '';

            document.getElementById('up-url').value = '';

            document.getElementById('file-name-display').innerText = '';

            document.querySelector('.progress-container').style.display = 'none';

            document.getElementById('progress-text').style.display = 'none';

            document.getElementById('up-progress').style.width = '0%';

        };

        window.handleFileSelect = function(input) {
            if(input.files && input.files[0]) {
                document.getElementById('file-name-display').innerText = "Selected: " + input.files[0].name;
            }
        };

window.submitUpload = async function() {
    const title = document.getElementById('up-title').value.trim();
    const category = document.getElementById('up-category').value.trim();
    const fileInput = document.getElementById('up-file');
    const urlInput = document.getElementById('up-url').value.trim();

    if (!title || !category || (!fileInput.files.length && !urlInput)) {
        alert("Vui lòng điền đầy đủ thông tin và chọn File hoặc nhập Link!");
        return;
    }

    const progressContainer = document.querySelector('.progress-container');
    const progressFill = document.getElementById('up-progress');
    const progressText = document.getElementById('progress-text');
    progressContainer.style.display = 'block';
    progressText.style.display = 'block';
    progressText.innerText = "Preparing...";

    try {
        let fileUrl = "";
        let fileName = "";

        if (urlInput) {
            // Use external URL directly (no upload)
            fileUrl = urlInput;
            fileName = "External Link";
            progressFill.style.width = '100%';
            progressText.innerText = "Processing external link... 100%";
        } else if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (file.size > 50 * 1024 * 1024) {  // Limit 50MB
                throw new Error("File quá lớn (>50MB). Vui lòng dùng Link Drive.");
            }

            // Clean filename
            const cleanName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.-]/g, '_');
            const path = `${Date.now()}_${cleanName}`;  // Unique path

            progressText.innerText = "Uploading to Supabase...";
            progressFill.style.width = '20%';  // Simulate start

            // Upload to Supabase
            const { data, error } = await supabase.storage.from('COSMIC file').upload(path, file);
            if (error) throw error;

            // Get public URL
            const { data: publicData } = supabase.storage.from('COSMIC file').getPublicUrl(path);
            fileUrl = publicData.publicUrl;
            fileName = file.name;

            progressFill.style.width = '100%';
            progressText.innerText = "Upload complete! 100%";
        }

        // Save to Firestore
        await addDoc(collection(db, "resources"), {
            title,
            category,
            fileName,
            fileUrl,
            uploader: window.currentUserName,
            uploaderUid: auth.currentUser.uid,
            status: 'pending', 
            createdAt: serverTimestamp()
        });

        // --- [NEW] TRACKING & XP SECTION (Nằm trong TRY) ---
        
        // 1. Bắn Tracking (Guardian Activity)
        window.trackTelemetry('upload_document', { 
            doc_title: title, 
            doc_category: category,
            status: 'pending' 
        });

        // 2. Cộng điểm GUARDIAN (+10 Energy)
        window.addEnergy(10, 'guardian');

        // 3. Thông báo & Đóng Modal
        alert("Upload thành công! Tài liệu đang chờ duyệt.");
        window.closeUploadModal();

    } catch (e) {
        console.error("Upload error:", e);
        alert("Lỗi: " + e.message);
        progressContainer.style.display = 'none';
        progressText.style.display = 'none';
    }
};
    // --- BƯỚC 1: SỬA LOGIC HIỂN THỊ TẠI RESOURCE HUB ---
window.initResourceHub = function() {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"), limit(50));
    
    onSnapshot(q, (snapshot) => {
        const listContainer = document.getElementById('resource-list-container');

        if (snapshot.empty) { 
            listContainer.innerHTML = `
                <div style="text-align:center; padding:20px; color:#666;">
                    Chưa có tài liệu nào.
                </div>`; 
            return; 
        }

        let dynamicItemsHTML = "";

        const currentUid = auth.currentUser ? auth.currentUser.uid : "";
        const userRoles = window.currentUserRoles || [];
        const isStaff = userRoles.includes('admin') || userRoles.includes('op');

        snapshot.forEach((doc) => {
            const data = doc.data();
            const status = data.status || 'pending';

            let isVisible = false;
            let statusBadge = "";

            if (status === 'approved') {
                isVisible = true;
            } 
            else if (status === 'pending') {
                if (isStaff || data.uploaderUid === currentUid) {
                    isVisible = true;
                    statusBadge = `
                        <span class="res-tag" style="background:#FF8C00; color:#000;">
                            ⏳ PENDING
                        </span>`;
                }
            }

            if (!isVisible) return;

            const safeTitle = data.title.replace(/'/g, "\\'");
            const safeUrl = (data.fileUrl || "").replace(/'/g, "\\'");
            const uploader = data.uploader || "Unknown";

            // 🔒 CHỈ ADMIN / OP MỚI THẤY NGƯỜI UPLOAD
            let uploaderHTML = "";
            if (isStaff) {
                uploaderHTML = ` • Upload bởi: <b>${uploader}</b>`;
            }

            dynamicItemsHTML += `
                <div class="resource-item"
                     onclick="openSplitView('${safeTitle}', '${safeUrl}', '${doc.id}', '${uploader}')">
                    
                    <div style="display:flex; align-items:center;">
                        <div class="res-icon">📄</div>
                        <div class="res-info">
                            <h3>${data.title} ${statusBadge}</h3>
                            <p>${data.category}${uploaderHTML}</p>
                        </div>
                    </div>

                    <div style="font-size:12px; color:#888;">
                        Click to view
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = dynamicItemsHTML || `
            <div style="text-align:center; padding:20px; color:#666;">
                Không có tài liệu khả dụng cho bạn.
            </div>`;
    });
};

        window.triggerSOS = async function() {
            const radar = document.getElementById('radar-screen');
            const sosCount = document.getElementById('sos-count');
            const radarStatus = document.getElementById('radar-status');
            const btn = document.querySelector('.btn-sos-trigger');
            const chatBox = document.getElementById('chat-box');
            
            if (!window.isSOSActive) {
                window.isSOSActive = true;
                if(btn) { btn.innerHTML = "🚫 CANCEL SOS"; btn.classList.add('active'); }
                if(chatBox) { chatBox.innerHTML += `<div class="chat-msg msg-system" style="border-color: #FF4500; color:#FF4500;">🚨 BROADCASTING SOS SIGNAL...</div>`; }
                if(radar) {
                    const top = Math.floor(Math.random() * 60) + 20 + '%'; const left = Math.floor(Math.random() * 60) + 20 + '%';
                    radar.innerHTML += `<div class="radar-dot-new" id="active-sos-dot" style="top:${top}; left:${left};"></div>`;
                    radarStatus.innerText = "WARNING: DISTRESS SIGNAL ACTIVE!"; radarStatus.style.color = "#FF4500";
                    // let currentCases = parseInt(sosCount.innerText); sosCount.innerText = (currentCases + 1) + " Cases";
                }
                try { await addDoc(collection(db, "sos_signals"), { user: window.voidIdentity, status: "ACTIVE", timestamp: serverTimestamp() }); } catch(e) {}
            } else {
                window.isSOSActive = false;
                if(btn) { btn.innerHTML = "🚨 SIGNAL SOS"; btn.classList.remove('active'); }
                if(chatBox) { chatBox.innerHTML += `<div class="chat-msg msg-system" style="border-color: #00FFC2; color:#00FFC2;">✅ SOS SIGNAL CANCELLED.</div>`; }
                if(radar) {
                    const dot = document.getElementById('active-sos-dot'); if(dot) dot.remove();
                    radarStatus.innerText = "Scanning Sector 7..."; radarStatus.style.color = "#888";
                    // let currentCases = parseInt(sosCount.innerText); sosCount.innerText = Math.max(0, currentCases - 1) + " Cases";
                }
            }
        };

   window.sendMessage = function() {
    const input = document.getElementById('chat-input-field');
    const chatBox = document.getElementById('chat-box');
    const text = input.value.trim();

    // Chỉ chạy khi có nội dung tin nhắn thực sự
    if(text) {
        // 1. Xử lý UI
        chatBox.innerHTML += `<div class="chat-msg msg-me">${text}</div>`;
        input.value = ''; 
        chatBox.scrollTop = chatBox.scrollHeight;

        // 2. Xử lý logic SOS
        if(text.toLowerCase().includes('sos')) { 
            setTimeout(() => { 
                if (!window.isSOSActive) { 
                    window.triggerSOS(); 
                } else { 
                    chatBox.innerHTML += `<div class="chat-msg msg-system">SOS signal is already active! Rescue team alerted.</div>`; 
                } 
            }, 500); 
        }

        // --- [NEW] TRACKING & XP SECTION (Đặt trong IF mới đúng) ---
        
        // 3. Bắn Tracking
        window.trackTelemetry('send_message', { channel: 'sos_chat' });

        // 4. Cộng điểm DIPLOMAT
        // Chat kênh SOS được
}
};
// --- BƯỚC 2: LOGIC OPS CENTER (DUYỆT BÀI & THÔNG BÁO) ---

// Hàm khởi chạy Ops Center (Chỉ gọi khi user là Admin/Op)
window.setupOpsCenter = function() {
    const opsPanel = document.getElementById('panel-op');
    if (!opsPanel) return;

    // 1. Vẽ lại giao diện Ops Panel để chứa danh sách chờ
    opsPanel.innerHTML = `
        <h3 style="color:var(--neon-blue);">📋 OPS CENTER</h3>
        <p style="font-size:12px; color:#aaa; margin-bottom:10px;">Trung tâm kiểm soát tài liệu.</p>
        
        <div style="border-top: 1px solid #333; padding-top:10px;">
            <h4 style="color:#FF8C00; font-size:12px; margin-bottom:10px;">HÀNG CHỜ DUYỆT (PENDING QUEUE)</h4>
            <div id="ops-pending-list" style="background:#000; padding:10px; height:180px; overflow-y:auto; border:1px solid #333; border-radius:5px;">
                <div style="text-align:center; color:#666; font-style:italic; padding-top:20px;">Đang tải dữ liệu...</div>
            </div>
        </div>
    `;

    // 2. Lắng nghe realtime các file có status = 'pending'
    const q = query(collection(db, "resources"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        const container = document.getElementById('ops-pending-list');
        const bridgeNav = document.getElementById('bridge-nav'); // Icon Radar ở Sidebar
        
        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align:center; color:#666; font-size:12px; padding-top:20px;">Không có tài liệu chờ duyệt.</div>';
            // Tắt đèn báo hiệu
            if(bridgeNav) {
                bridgeNav.style.border = "none";
                bridgeNav.style.boxShadow = "none";
            }
        } else {
            // CÓ FILE MỚI: 
            // a. Bật đèn báo hiệu (viền đỏ) ở Sidebar
            if(bridgeNav) {
                bridgeNav.style.border = "1px solid #FF4500";
                bridgeNav.style.boxShadow = "0 0 10px #FF4500";
            }
            // b. Hiện Banner thông báo
            window.showNotificationBanner(`⚠️ OPS ALERT: Có ${snapshot.size} tài liệu cần duyệt!`);

             // c. Render danh sách
            let html = "";
            snapshot.forEach(doc => {
                const data = doc.data();
                const safeTitle = data.title.replace(/'/g, "\\'");
                const safeUrl = (data.fileUrl || "").replace(/'/g, "\\'");
                
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #333;">
                        <div style="width: 55%;">
                            <div style="color:white; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${data.title}</div>
                        </div>        
                        <div style="font-size:10px; color:#888;">Up bởi: ${data.uploader}</div>
                        <div style="display:flex; gap:5px;">
                            <button onclick="openSplitView('${safeTitle}', '${safeUrl}', '${doc.id}', '${data.uploader}')" style="font-size:10px; padding:4px 8px; cursor:pointer; border:1px solid #444; background:transparent; color:#ccc;">Xem</button>
                            <button onclick="approveDocument('${doc.id}')" style="font-size:10px; padding:4px 8px; cursor:pointer; background:var(--neon-blue); color:black; font-weight:bold; border:none;">✔ Duyệt</button>
                            <button onclick="rejectDocument('${doc.id}')" style="font-size:10px; padding:4px 8px; cursor:pointer; background:#FF4500; color:white; border:none;">✘ Xóa</button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    });
};

// Hàm Duyệt (Chuyển status -> approved)
window.approveDocument = async function(docId) {
    if (!confirm("Xác nhận DUYỆT tài liệu này? Nó sẽ được hiển thị cho toàn bộ Brigade.")) return;
    try {
        await updateDoc(doc(db, "resources", docId), {
            status: 'approved',
            approvedBy: window.currentUserName,
            approvedAt: serverTimestamp()
        });
        window.showNotificationBanner("✅ Đã duyệt tài liệu thành công!");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};

// Hàm Từ chối (Xóa tài liệu)
window.rejectDocument = async function(docId) {
    if (!confirm("Từ chối và XÓA VĨNH VIỄN tài liệu này?")) return;
    try {
        await deleteDoc(doc(db, "resources", docId));
        window.showNotificationBanner("🗑️ Đã từ chối và xóa tài liệu.");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};
        document.getElementById('auth-msv').addEventListener('keypress', function (e) { if (e.key === 'Enter') window.handleAuth(); });
        document.getElementById('chat-input-field').addEventListener('keypress', function (e) { if (e.key === 'Enter') window.sendMessage(); });
        document.getElementById('void-input-field').addEventListener('keypress', function (e) { if (e.key === 'Enter') window.sendVoidMessage(); }) 
