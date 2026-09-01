import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, where, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
    "SPT02A - Giáo dục thể chất I (Đại cương)",
    "TOEIC",
    "MOS",
    "Tài liệu đặc biệt"
];

// --- DANH SÁCH TRƯỜNG ĐẠI HỌC (cho autocomplete ô "Trường") ---
// Format: "Tên đầy đủ - MÃ"
const SCHOOL_LIST = [
    "Đại học Kinh tế Quốc dân - NEU",
    "Học viện Ngân hàng - BA",
    "Đại học Bách khoa Hà Nội - HUST",
    "Đại học Xây dựng Hà Nội - HUCE",
    "Đại học Ngoại thương - FTU",
    "Đại học Thương mại - TMU",
    "Đại học Hà Nội - HANU",
    "Đại học Giao thông Vận tải - UTC",
    "Đại học Mỏ - Địa chất - HUMG",
    "Đại học Kiến trúc Hà Nội - HAU",
    "Đại học Công nghiệp Hà Nội - HaUI",
    "Đại học Điện lực - EPU",
    "Học viện Công nghệ Bưu chính Viễn thông - PTIT",
    "Học viện Tài chính - AOF",
    "Học viện Ngoại giao - DAV",
    "Học viện Báo chí và Tuyên truyền - AJC",
    "Học viện Nông nghiệp Việt Nam - VNUA",
    "Học viện Kỹ thuật Quân sự - MTA",
    "Học viện Kỹ thuật Mật mã - ACT",
    "Đại học Sư phạm Hà Nội - HNUE",
    "Đại học Y Hà Nội - HMU",
    "Đại học Dược Hà Nội - HUP",
    "Đại học Luật Hà Nội - HLU",
    "Đại học Quốc gia Hà Nội - VNU",
    "Đại học Công nghệ (ĐHQGHN) - UET",
    "Đại học Khoa học Tự nhiên (ĐHQGHN) - HUS",
    "Đại học Khoa học Xã hội và Nhân văn (ĐHQGHN) - USSH",
    "Đại học Ngoại ngữ (ĐHQGHN) - ULIS",
    "Đại học Kinh tế (ĐHQGHN) - UEB",
    "Đại học FPT - FPTU",
    "Đại học Phenikaa - PHENIKAA",
    "Đại học Đại Nam - DNU",
    "Đại học Thăng Long - TLU",
    "Đại học Mở Hà Nội - HOU",
    "Đại học Quốc gia TP.HCM - VNU-HCM",
    "Đại học Bách khoa TP.HCM - HCMUT",
    "Đại học Công nghệ Thông tin - UIT",
    "Đại học Kinh tế - Luật - UEL",
    "Đại học Khoa học Tự nhiên TP.HCM - HCMUS",
    "Đại học Khoa học Xã hội và Nhân văn TP.HCM - HCMUSSH",
    "Đại học Quốc tế - IU",
    "Đại học Kinh tế TP.HCM - UEH",
    "Đại học Sư phạm Kỹ thuật TP.HCM - HCMUTE",
    "Đại học Sư phạm TP.HCM - HCMUE",
    "Đại học Y Dược TP.HCM - UMP",
    "Đại học Ngân hàng TP.HCM - HUB",
    "Đại học Công nghiệp TP.HCM - IUH",
    "Đại học Nông Lâm TP.HCM - NLU",
    "Đại học Tôn Đức Thắng - TDTU",
    "Đại học Mở TP.HCM - OU",
    "Đại học Luật TP.HCM - ULAW",
    "Đại học Văn Lang - VLU",
    "Đại học Công nghệ TP.HCM - HUTECH",
    "Đại học Kinh tế - Tài chính TP.HCM - UEF",
    "Đại học Quốc tế Hồng Bàng - HIU",
    "Đại học Nguyễn Tất Thành - NTTU",
    "Đại học Hoa Sen - HSU",
    "Đại học Ngoại ngữ - Tin học TP.HCM - HUFLIT",
    "Đại học Đà Nẵng - UDN",
    "Đại học Bách khoa Đà Nẵng - DUT",
    "Đại học Kinh tế Đà Nẵng - DUE",
    "Đại học Sư phạm Đà Nẵng - UED",
    "Đại học Huế - HU",
    "Đại học Kinh tế Huế - HCE",
    "Đại học Y Dược Huế - HUMP",
    "Đại học Cần Thơ - CTU",
    "Đại học Nha Trang - NTU",
    "Đại học Hàng hải Việt Nam - VMU",
    "Đại học Duy Tân - DTU",
    "Đại học Quy Nhơn - QNU",
    "Đại học Vinh - VINHUNI", // Lưu ý: đổi mã từ "VNU" -> "VINHUNI" vì trùng với Đại học Quốc gia Hà Nội ở trên
    "Đại học Thái Nguyên - TNU",
    "Đại học Trà Vinh - TVU",
    "Khác (trường không có trong danh sách)" // Lựa chọn đặc biệt, xử lý riêng trong handleSchoolInput/selectSchool
];

const SCHOOL_OTHER_LABEL = "Khác (trường không có trong danh sách)";

// --- CHUẨN HÓA KHÓA GOM NHÓM (dùng chung cho Trường & Môn học) ---
window.normalizeKey = function(str) {
    if (!str) return '';
    return str
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // bỏ dấu
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')             // đ/Đ không nằm trong NFD diacritics
        .toLowerCase()
        .replace(/\s+/g, ' ')                               // gộp khoảng trắng thừa
        .trim();
};

// Hàm xử lý khi nhập liệu (Filter & Show Suggestion)
window.handleCategoryInput = function(input) {
    const val = input.value.toLowerCase();
    const box = document.getElementById('suggestion-box');

    const filtered = SUBJECT_LIST.filter(sub => sub.toLowerCase().includes(val));

    if (filtered.length === 0) {
        box.style.display = 'none';
        return;
    }

    const display = filtered.slice(0, 8);

    let html = '';
    display.forEach(sub => {
        const regex = new RegExp(`(${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const highlighted = sub.replace(regex, '<strong>$1</strong>');
        html += `<div class="suggestion-item" onclick="selectCategory('${sub.replace(/'/g, "\\'")}')">${highlighted}</div>`;
    });

    box.innerHTML = html;
    box.style.display = 'block';
};

// Hàm chọn môn học từ list
window.selectCategory = function(value) {
    document.getElementById('up-category').value = value;
    document.getElementById('suggestion-box').style.display = 'none';
};

// --- AUTOCOMPLETE Ô "TRƯỜNG ĐẠI HỌC" (modal upload) ---
window.handleSchoolInput = function(input) {
    const val = input.value.toLowerCase();
    const box = document.getElementById('school-suggestion-box');

    const matches = SCHOOL_LIST.filter(sub => sub !== SCHOOL_OTHER_LABEL && sub.toLowerCase().includes(val));

    const display = matches.slice(0, 8);
    display.push(SCHOOL_OTHER_LABEL);

    let html = '';
    display.forEach(sub => {
        const isOther = sub === SCHOOL_OTHER_LABEL;
        let displayHtml = sub;
        if (val && !isOther) {
            const regex = new RegExp(`(${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            displayHtml = sub.replace(regex, '<strong>$1</strong>');
        }
        const extraStyle = isOther ? ' style="color:var(--neon-gold); font-style:italic; border-top:1px solid rgba(255,255,255,0.15);"' : '';
        html += `<div class="suggestion-item"${extraStyle} onclick="selectSchool('${sub.replace(/'/g, "\\'")}')">${displayHtml}</div>`;
    });

    box.innerHTML = html;
    box.style.display = 'block';
};

// Hàm chọn trường từ list. Nếu chọn "Khác" thì hiện ô nhập mã trường phụ.
window.selectSchool = function(value) {
    const schoolInput = document.getElementById('up-school');
    const otherWrap = document.getElementById('up-school-other-wrap');
    const otherInput = document.getElementById('up-school-other');

    if (value === SCHOOL_OTHER_LABEL) {
        schoolInput.value = SCHOOL_OTHER_LABEL;
        schoolInput.disabled = true;
        otherWrap.style.display = 'block';
        otherInput.focus();
    } else {
        schoolInput.value = value;
        schoolInput.disabled = false;
        otherWrap.style.display = 'none';
        otherInput.value = '';
    }
    document.getElementById('school-suggestion-box').style.display = 'none';
};

// Cho phép bỏ chọn "Khác" để quay lại gõ tự do trong ô chính
window.resetSchoolOther = function() {
    const schoolInput = document.getElementById('up-school');
    const otherWrap = document.getElementById('up-school-other-wrap');
    const otherInput = document.getElementById('up-school-other');
    schoolInput.value = '';
    schoolInput.disabled = false;
    otherWrap.style.display = 'none';
    otherInput.value = '';
    schoolInput.focus();
};

// Ẩn box khi click ra ngoài
document.addEventListener('click', function(e) {
    document.querySelectorAll('.autocomplete-wrapper').forEach(wrapper => {
        if (!wrapper.contains(e.target)) {
            const box = wrapper.querySelector('[id$="suggestion-box"]');
            if (box) box.style.display = 'none';
        }
    });
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
// Đăng ký mới đang chờ xác nhận mã OTP (chỉ tồn tại trong bộ nhớ, không lưu localStorage)
window.__pendingRegistration = null; // { email, password, name, age, gender }



// --- MODULE TELEMETRY (TRACKING SYSTEM) ---
window.docStartTime = 0; // Biến đếm giờ đọc

// Hàm bắn event chung
window.trackTelemetry = function(eventName, params = {}) {
    if (!analytics) return; // Chưa init xong thì bỏ qua

    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const timeContext = {
        hour_of_day: now.getHours(),      // 0-23
        day_of_week: days[now.getDay()],  // Thứ
        timestamp_iso: now.toISOString()
    };

    const finalParams = { ...timeContext, ...params };

    try {
        logEvent(analytics, eventName, finalParams);
        // console.log(`📡 SENT [${eventName}]`, finalParams);
    } catch (e) {
        console.warn("Telemetry Error:", e);
    }
};

// --- AUTH & PROFILE LOGIC ---

//Hàm Ẩn/hiện mật khẩu
window.togglePasswordCheck = function(checkbox) {
    const passInput = document.getElementById('auth-pass');
    if (checkbox.checked) {
        passInput.type = 'text';
    } else {
        passInput.type = 'password';
    }
};

// XỬ LÝ VẤN ĐỀ ĐĂNG NHẬP / ĐĂNG KÝ
window.isLoginMode = true;

// 1. Tự động kiểm tra trạng thái khi vừa vào web
// === GATE THEO emailVerified: chặn user chưa xác minh vào thẳng app ===
if (auth) {
    onAuthStateChanged(auth, async (user) => {
        const loginScreen = document.getElementById('login-screen');
        const appContainer = document.getElementById('app-container');
        const otpScreen = document.getElementById('verify-otp-screen');

        if (user) {
            // Tài khoản Firebase chỉ được TẠO sau khi mã OTP đã xác nhận thành công
            // (xem window.verifyRegistrationOtp), nên tới đây user coi như đã xác thực.
            console.log("✅ Đã xác thực Auth:", user.email);
            if (otpScreen) otpScreen.style.display = 'none';
            window.__loginPromptOpen = false;
            if (typeof window.updateAccountMenuUI === 'function') window.updateAccountMenuUI(true);

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
            // KHÁCH (CHƯA ĐĂNG NHẬP): KHÔNG ép vào màn hình Login nữa.
            // Cho phép khách xem thẳng "Kho tài liệu" và dùng hầu hết tính năng.
            // Chỉ hiện màn Login khi khách chủ động bấm đăng nhập,
            // hoặc khi cố thực hiện hành động cần tài khoản (tải tài liệu, khoang cá nhân...).
            if (otpScreen && otpScreen.style.display === 'flex') {
                console.log("🔐 Đang chờ xác nhận mã OTP, giữ nguyên màn hình.");
                return;
            }

            // Reset về trạng thái khách (không quyền hạn đặc biệt)
            window.currentUserRank = "GUEST";
            window.currentUserName = "Khách";
            window.currentUserRoles = [];

            if (!window.__loginPromptOpen) {
                loginScreen.style.display = 'none';
            }
            appContainer.style.display = 'flex';
            appContainer.style.opacity = '1';
            appContainer.style.visibility = 'visible';

            // Ẩn các khu vực chỉ dành cho tài khoản đã đăng nhập/nhân sự
            const adminPanelGuest = document.getElementById('admin-panel');
            if (adminPanelGuest) adminPanelGuest.style.display = 'none';
            if (typeof window.updateAccountMenuUI === 'function') window.updateAccountMenuUI(false);

            // Vẫn cho khách xem Kho tài liệu (chỉ tài liệu đã duyệt) & The Void
            if (typeof window.initResourceHub === 'function') window.initResourceHub();
            if (typeof window.initVoidChat === 'function') window.initVoidChat();

            console.log("🌌 Đang ở chế độ Khách. Đăng nhập để tải tài liệu hoặc vào Khoang cá nhân.");
        }
    });
}

// 1b. Hiện màn hình Login khi khách cần đăng nhập cho 1 hành động cụ thể
//     (tải tài liệu, vào khoang cá nhân...), có thể đóng lại để tiếp tục xem khách.
window.promptLogin = function(message) {
    window.__loginPromptOpen = true;
    if (message && typeof window.showNotificationBanner === 'function') {
        window.showNotificationBanner(message);
    }
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.style.opacity = '1';
        loginScreen.style.display = 'flex';
    }
    const subtitle = document.getElementById('login-subtitle');
    if (subtitle && message) {
        subtitle.innerText = message.replace(/^[^\wÀ-ỹ]+/, '').trim();
    }
};

// Đóng màn hình Login, quay lại xem web với tư cách khách
window.closeLoginPrompt = function() {
    window.__loginPromptOpen = false;
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.style.display = 'none';
};

// 2. Chuyển đổi giao diện Đăng nhập / Đăng ký
window.toggleAuthMode = function() {
    isLoginMode = !isLoginMode;
    const title = document.querySelector('.login-title');
    const subtitle = document.getElementById('login-subtitle');
    const btnAction = document.getElementById('btn-auth-action');
    const switchText = document.querySelector('.auth-switch');
    const regFields = document.getElementById('register-fields');
    const loginBox = document.querySelector('.login-box');

    // Reset thông báo lỗi
    const errorMsg = document.getElementById('login-error');
    errorMsg.style.display = 'none';

    if (isLoginMode) {
        title.innerText = 'THE AIRLOCK';
        subtitle.innerText = 'Nhập thông tin truy cập Cosmic Base.';
        btnAction.innerText = 'LOGIN';
        switchText.innerHTML = 'Chưa có tài khoản? <b>Đăng ký ngay</b>';
        regFields.style.display = 'none';
        if (loginBox) loginBox.classList.remove('mode-register');
    } else {
        title.innerText = 'REGISTRATION';
        subtitle.innerText = 'Điền thông tin để tạo tài khoản mới.';
        btnAction.innerText = 'CREATE ACCOUNT';
        switchText.innerHTML = 'Đã có tài khoản? <b>Đăng nhập</b>';
        if (regFields) regFields.style.display = 'block';
        if (loginBox) loginBox.classList.add('mode-register');
    }
}

// 3. Xử lý nút bấm chính (Login hoặc Register)
window.handleAuth = async function() {
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();
    const name = document.getElementById('auth-name').value.trim();
    const age = document.getElementById('auth-age').value;
    const gender = document.getElementById('auth-gender').value;

    if (!email || !pass) {
        showError("Vui lòng nhập Email và Mật khẩu.");
        return;
    }

    try {
        if (window.isLoginMode) {
            // Logic ĐĂNG NHẬP (tài khoản đã xác minh OTP từ lúc đăng ký, vào thẳng)
            await signInWithEmailAndPassword(auth, email, pass);
        } else {
            // Logic ĐĂNG KÝ — bước 1: gửi mã OTP xác nhận, CHƯA tạo tài khoản
            if (!name) { showError("Vui lòng nhập họ và tên đầy đủ"); return; }
            if (pass.length < 6) { showError("Mật khẩu cần tối thiểu 6 ký tự."); return; }

            const btn = document.getElementById('btn-auth-action');
            if (btn) { btn.disabled = true; btn.innerText = 'ĐANG GỬI MÃ...'; }

            try {
                const { error: otpError } = await supabase.auth.signInWithOtp({
                    email: email,
                    options: { shouldCreateUser: true }
                });
                if (otpError) throw otpError;
            } finally {
                if (btn) { btn.disabled = false; btn.innerText = 'CREATE ACCOUNT'; }
            }

            // Lưu thông tin đăng ký tạm trong bộ nhớ, chờ người dùng nhập mã OTP
            window.__pendingRegistration = { email, password: pass, name, age, gender };
            localStorage.setItem('otp_last_sent_' + email, Date.now().toString());

            // Chuyển sang màn hình nhập mã OTP
            const loginScreen = document.getElementById('login-screen');
            const otpScreen = document.getElementById('verify-otp-screen');
            const otpEmailEl = document.getElementById('otp-target-email');
            const otpInput = document.getElementById('otp-code-input');
            const otpErrorEl = document.getElementById('otp-error');

            if (otpEmailEl) otpEmailEl.innerText = email;
            if (otpInput) otpInput.value = '';
            if (otpErrorEl) otpErrorEl.style.display = 'none';
            if (loginScreen) loginScreen.style.display = 'none';
            if (otpScreen) otpScreen.style.display = 'flex';
        }
    } catch (error) {
        console.error("Auth Error:", error);
        let msg = "Lỗi xác thực. Vui lòng thử lại.";

        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            msg = "Email hoặc mật khẩu không chính xác.";
        } else if (error.code === 'auth/wrong-password') {
            msg = "Mật khẩu không đúng. Vui lòng thử lại.";
        } else if (error.code === 'auth/email-already-in-use') {
            msg = "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.";
        } else if (error.code === 'auth/invalid-email') {
            msg = "Định dạng email không hợp lệ.";
        } else if (error.message) {
            msg = error.message;
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
        if (auth.currentUser) {
            await signOut(auth);
        }
        location.reload();
    } catch (error) { console.error("Logout error", error); }
};

// Menu tài khoản: nếu đã đăng nhập -> Đăng xuất, nếu là khách -> mở màn hình Đăng nhập
window.handleLogoutOrLogin = function() {
    if (auth && auth.currentUser) {
        window.handleLogout();
    } else {
        const menu = document.getElementById('user-menu');
        if (menu) menu.classList.remove('open');
        window.promptLogin();
    }
};

// Cập nhật nhãn nút trong menu tài khoản theo trạng thái đăng nhập
window.updateAccountMenuUI = function(isLoggedIn) {
    const icon = document.getElementById('logout-menu-icon');
    const text = document.getElementById('logout-menu-text');
    const item = document.getElementById('logout-menu-item');
    if (text) text.innerText = isLoggedIn ? 'Đăng xuất' : 'Đăng nhập';
    if (icon) icon.className = isLoggedIn ? 'fa-solid fa-right-from-bracket' : 'fa-solid fa-right-to-bracket';
    if (item) item.title = isLoggedIn ? 'Đăng xuất' : 'Đăng nhập';
};

// Hàm định danh User (Gọi khi Login xong)
window.identifyUserForTracking = function(profile) {
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
    const isAdminAccount = (userEmail === 'huybiyb0000@gmail.com');

    if (userSnap.exists()) {
        // --- TRƯỜNG HỢP 1: PROFILE ĐÃ CÓ TRÊN DATABASE ---
        let data = userSnap.data();

        // ĐẢM BẢO CÁC FIELD QUAN TRỌNG LUÔN CÓ (kể cả khi đăng ký cũ chưa có)
        let needsUpdate = false;
        const fallbackName = "Cadet " + msv;
        const defaults = {
            coins: { received: 0, used: 0 },
            stats: { focus: 0, upload: 0, interact: 0, online: 1 },
            roles: data.roles || ['user'],
            rank: data.rank || "Space Debris",
            energy: typeof data.energy === 'number' ? data.energy : 0,
            msv: data.msv || msv,
            displayName: data.displayName || data.fullName || fallbackName
        };

        const updatesToApply = {};
        if (!data.coins) { updatesToApply.coins = defaults.coins; needsUpdate = true; }
        if (!data.stats) { updatesToApply.stats = defaults.stats; needsUpdate = true; }
        if (!data.rank) { updatesToApply.rank = defaults.rank; needsUpdate = true; }
        if (typeof data.energy !== 'number') { updatesToApply.energy = defaults.energy; needsUpdate = true; }
        if (!data.msv) { updatesToApply.msv = defaults.msv; needsUpdate = true; }
        if (!data.roles) { updatesToApply.roles = defaults.roles; needsUpdate = true; }
        if (!data.displayName) { updatesToApply.displayName = defaults.displayName; needsUpdate = true; }

        if (needsUpdate) {
            try {
                await updateDoc(userRef, updatesToApply);
                data = { ...data, ...updatesToApply };
                console.log("🔄 Đã cập nhật thiếu field cho user:", user.email);
            } catch(err) {
                console.error("Lỗi cập nhật field mặc định:", err);
            }
        }

        // Kiểm tra nếu là email của bạn nhưng chưa có quyền Admin trong DB thì ép cập nhật
        if (isAdminAccount) {
            const currentRoles = data.roles || [];
            if (!currentRoles.includes('admin') || data.rank !== 'SUPERNOVA') {
                console.log("Commander detected. Updating system privileges...");

                const adminUpdates = {
                    rank: "SUPERNOVA",
                    energy: 99999,
                    displayName: "Admin tổng",
                    roles: ['admin', 'tester', 'op', 'mkt']
                };

                try {
                    await updateDoc(userRef, adminUpdates);
                    data = { ...data, ...adminUpdates };
                    alert("📡 HỆ THỐNG: Đã xác nhận Admin tổng. Toàn quyền truy cập được kích hoạt!");
                } catch(err) {
                    console.error("Lỗi cập nhật quyền Admin:", err);
                }
            }
        }

        // === THƯỞNG 100 XU ĐĂNG KÝ (chỉ 1 lần, chỉ khi email đã verify) ===
        // Đặt ở đây (sau khi có "data" hợp lệ) để tránh lỗi tham chiếu biến chưa khai báo.
        if (user.emailVerified) {
            const claimed = data.claimedOnce || [];
            if (!claimed.includes('REGISTER_ACCOUNT')) {
                const result = await window.rewardCoins('REGISTER_ACCOUNT');
                if (result && result.success) {
                    data.claimedOnce = claimed.concat(['REGISTER_ACCOUNT']);
                    const prevCoins = data.coins || { received: 0, used: 0 };
                    data.coins = { ...prevCoins, received: (prevCoins.received || 0) + result.amount };
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

        if (isAdminAccount) {
            initialRank = "SUPERNOVA";
            initialEnergy = 99999;
            initialName = "Admin Tổng";
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
            coins: { received: 0, used: 0 },
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
        const current = inbox.innerHTML;
        if (current.includes('Đang tải')) {
            inbox.innerHTML = '';
        }
        inbox.innerHTML += newHtml;
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

    const nameEl = document.getElementById('user-display-name');
    const welcomeEl = document.getElementById('welcome-name');
    if (nameEl) nameEl.innerText = displayName;
    if (welcomeEl) welcomeEl.innerText = displayName;
    else console.warn("⚠️ [loadUserProfile] Không tìm thấy phần tử #welcome-name trong HTML.");

    // Năm học / Chuyên ngành / Giới thiệu bản thân trên khoang cá nhân
    const cabinYearEl = document.getElementById('cabin-year-text');
    const cabinRoleSubEl = document.getElementById('cabin-role-sub');
    const cabinIntroEl = document.getElementById('cabin-profile-intro');
    if (cabinYearEl) cabinYearEl.innerText = data.year || "Chưa cập nhật";
    if (cabinRoleSubEl) cabinRoleSubEl.innerText = "Chuyên ngành: " + (data.major || "Chưa cập nhật");
    if (cabinIntroEl) cabinIntroEl.innerText = data.bio || "Chưa có giới thiệu.";

    // --- 2. LOGIC TÍNH TOÁN RANK & TIER (MỚI) ---
    const rankTitle = document.getElementById('user-rank-title');
    const tierTag = document.getElementById('user-tier-tag');
    const avatarFrame = document.getElementById('user-avatar-frame');
    const quoteBox = document.getElementById('quote-box');
    const energyBar = document.getElementById('energy-bar');
    if (!quoteBox) console.warn("⚠️ [loadUserProfile] Không tìm thấy phần tử #quote-box trong HTML.");

    let displayRank = "Probe";
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
        let levelIndex = 0;
        for (let i = 0; i < RANK_SYSTEM.thresholds.length; i++) {
            if (energy >= RANK_SYSTEM.thresholds[i]) levelIndex = i;
        }
        const currentLevel = levelIndex + 1;

        const s = data.stats || { focus: 0, upload: 0, interact: 0, online: 0 };
        let maxStat = 'focus';
        let maxVal = s.focus || 0;
        let archetypeName = "NAVIGATOR";

        if ((s.upload || 0) > maxVal) { maxStat = 'upload'; maxVal = s.upload; archetypeName = "GUARDIAN"; }
        if ((s.interact || 0) > maxVal) { maxStat = 'interact'; maxVal = s.interact; archetypeName = "DIPLOMAT"; }
        if (maxVal === 0 && (s.online || 0) > 0) { maxStat = 'online'; archetypeName = "VOYAGER"; }

        if (maxStat === 'upload') displayRank = RANK_SYSTEM.titles.guardian[levelIndex];
        else if (maxStat === 'interact') displayRank = RANK_SYSTEM.titles.diplomat[levelIndex];
        else if (maxStat === 'online') displayRank = RANK_SYSTEM.titles.voyager[levelIndex];
        else displayRank = RANK_SYSTEM.titles.navigator[levelIndex];

        displayRank = displayRank.toUpperCase();

        if (currentLevel <= 5) {
            tierClass = "rank-standard";
            tagClass = "tag-standard";
            frameClass = "basic";
            tierName = `Tier 1 • Lv.${currentLevel}`;
        } else if (currentLevel === 6) {
            tierClass = "rank-neon";
            tagClass = "tag-neon";
            frameClass = "basic";
            tierName = "NEON PULSE (Tier 2)";
        } else if (currentLevel === 7) {
            tierClass = "rank-nebula";
            tagClass = "tag-nebula";
            frameClass = "supernova";
            tierName = "NEBULA FLOW (Tier 3)";
        } else {
            tierClass = "rank-horizon";
            tagClass = "tag-horizon";
            frameClass = "supernova";
            tierName = "HORIZON (Tier 4)";
        }

        const nextXp = RANK_SYSTEM.thresholds[levelIndex + 1];
        const xpText = nextXp ? `Next: ${nextXp} XP` : 'MAX LEVEL';

        quoteHtml = `<h4 style="color: #aaa;">${displayRank}</h4><p style="font-size:12px; color:#666;">${archetypeName} Class • ${xpText}</p>`;
    }

    // --- 3. RENDER UI ---
    if (rankTitle) {
        rankTitle.className = "rank-title " + tierClass;
        rankTitle.innerText = displayRank;
    }

    if (tierTag) {
        tierTag.className = "tier-tag " + tagClass;
        tierTag.innerText = tierName;
    }

    if (avatarFrame) avatarFrame.className = "avatar-container avatar-frame " + frameClass;
    if (quoteBox) quoteBox.innerHTML = quoteHtml;

    const energyTextEl = document.getElementById('energy-text');
    if (energyTextEl) energyTextEl.innerText = energy;

    // --- 4. THANH NĂNG LƯỢNG (ENERGY BAR) ---
    if (energyBar) {
        if (roles.includes('admin') || tierClass === "rank-genesis" || energy >= 10000) {
            energyBar.style.width = "100%";
        } else {
            let currentBase = 0;
            let nextTarget = 200;

            for (let i = 0; i < RANK_SYSTEM.thresholds.length; i++) {
                if (energy >= RANK_SYSTEM.thresholds[i]) {
                    currentBase = RANK_SYSTEM.thresholds[i];
                    nextTarget = RANK_SYSTEM.thresholds[i+1] || 10000;
                }
            }

            let range = nextTarget - currentBase;
            let gained = energy - currentBase;
            let pct = (range > 0) ? (gained / range) * 100 : 100;
            energyBar.style.width = Math.max(5, pct) + "%";
        }
    }

    // --- 5. KHỞI TẠO CÁC MODULE KHÁC ---

    // Admin Panel
    if (roles.includes('admin')) {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'block';
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
    if (typeof window.loadActivityHistory === 'function') window.loadActivityHistory();
    window.renderCoinDisplay(data.coins);
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
};
window.markAsRead = async function(id, collectionName) {
    try {
        await updateDoc(doc(db, collectionName, id), { status: 'read' });
        alert("✅ Marked as read!");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};
window.switchTab = function(tabId, element) {
    // Khoang cá nhân yêu cầu đăng nhập
    if (tabId === 'cabin' && (!auth || !auth.currentUser)) {
        window.promptLogin('🔒 Vui lòng đăng nhập để vào Khoang cá nhân.');
        return;
    }

    if (tabId === 'bridge') {
        const hasAccess = window.currentUserRoles.some(r => ['admin','tester','op','mkt'].includes(r));
        const bridgeLocked = document.getElementById('bridge-locked');
        const bridgeContent = document.getElementById('bridge-content');
        if (bridgeLocked) bridgeLocked.style.display = hasAccess ? 'none' : 'block';
        if (bridgeContent) bridgeContent.style.display = hasAccess ? 'block' : 'none';

        if (hasAccess) {
            const panelAdmin = document.getElementById('panel-admin');
            const panelTester = document.getElementById('panel-tester');
            const panelOp = document.getElementById('panel-op');
            const panelMkt = document.getElementById('panel-mkt');
            if (panelAdmin) panelAdmin.style.display = window.currentUserRoles.includes('admin') ? 'block' : 'none';
            if (panelTester) panelTester.style.display = window.currentUserRoles.includes('tester') ? 'block' : 'none';
            if (panelOp) panelOp.style.display = window.currentUserRoles.includes('op') ? 'block' : 'none';
            if (panelMkt) panelMkt.style.display = window.currentUserRoles.includes('mkt') ? 'block' : 'none';
        }
    }

    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const targetSection = document.getElementById(tabId);
    if (targetSection) targetSection.classList.add('active');
    else console.warn(`⚠️ [switchTab] Không tìm thấy tab #${tabId} trong HTML.`);
    if (element) element.classList.add('active');
};

// --- ADMIN: CREW MANAGEMENT LOGIC ---
window.loadCrewList = function() {
    const q = query(collection(db, "users"), orderBy("msv", "asc"), limit(100));
    onSnapshot(q, (snapshot) => {
        const table = document.getElementById('crew-list');
        let html = `<tr><th>MSV</th><th>Tên</th><th>Vai trò</th><th>Action</th></tr>`;

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

    const newRoles = ['user'];
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

// --- ROLE ACTIONS ---
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

// Chuyển sang tab "Resource Hub" rồi mới mở tài liệu
window.jumpToDocument = function(docName, fileUrl, docId, uploaderName) {
    const resourcesNav = document.getElementById('resources-nav');
    if (typeof window.switchTab === 'function') {
        window.switchTab('resources', resourcesNav);
    }
    window.openSplitView(docName, fileUrl, docId, uploaderName);
};

window.openSplitView = function(docName, fileUrl, docId, uploaderName) {
    window.docStartTime = Date.now();
    window.trackTelemetry('view_document', {
        doc_title: docName,
        doc_id: docId
    });
    window.logActivity('view', docName, { docId, fileUrl, uploaderName: uploaderName || '' });
    if (typeof window.triggerSmartlink === 'function') {
        window.triggerSmartlink();
    }
    document.getElementById('resource-hub-main').style.display = 'none';
    document.getElementById('doc-review-container').style.display = 'flex';
    document.getElementById('doc-title').innerText = docName;
    window.currentDocId = docId;

    const userRoles = window.currentUserRoles || [];
    const isStaff = userRoles.includes('admin') || userRoles.includes('op');
    const currentUid = auth.currentUser ? auth.currentUser.uid : null;

    const statusBadge = document.getElementById('doc-status-badge');
    const btnApprove = document.getElementById('btn-approve-doc');
    const btnReject = document.getElementById('btn-reject-doc');
    const reasonBanner = document.getElementById('rejection-reason-banner');
    const reasonText = document.getElementById('rejection-reason-text');
    const btnDelete = document.getElementById('btn-delete-current-doc');

    statusBadge.style.display = 'none';
    btnApprove.style.display = 'none';
    btnReject.style.display = 'none';
    reasonBanner.style.display = 'none';
    btnDelete.style.display = 'none';

    getDoc(doc(db, "resources", docId)).then(snap => {
        if (!snap.exists()) return;
        const data = snap.data();
        const status = data.status || 'pending';
        const isOwner = data.uploaderUid === currentUid;

        statusBadge.style.display = 'inline-block';
        statusBadge.className = 'doc-status-badge ' + status;
        if (status === 'pending') statusBadge.innerText = 'Chờ duyệt';
        else if (status === 'approved') statusBadge.innerText = 'Đã duyệt';
        else if (status === 'rejected') statusBadge.innerText = 'Từ chối';

        if (status === 'pending' && isStaff) {
            btnApprove.style.display = 'inline-flex';
            btnReject.style.display = 'inline-flex';
        }

        if (status === 'rejected' && (isStaff || isOwner)) {
            reasonBanner.style.display = 'flex';
            reasonText.innerText = data.rejectionReason
                ? data.rejectionReason
                : 'Tài liệu đã bị từ chối (không có lý do cụ thể).';
        }

        if (userRoles.includes('admin')) {
            btnDelete.style.display = 'block';
        } else if (isOwner) {
            btnDelete.style.display = 'block';
        }
    });

    const iframe = document.getElementById('doc-iframe');
    const placeholderMsg = document.getElementById('doc-placeholder-msg');
    const msgText = document.getElementById('doc-msg-text');
    const extLinkBtn = document.getElementById('external-link-btn');
    const btnDownload = document.getElementById('btn-download-doc');

    if (btnDownload) {
        btnDownload.onclick = function() {
            if (!auth.currentUser) {
                window.promptLogin('🔒 Vui lòng đăng nhập để tải tài liệu.');
                return;
            }
            if (fileUrl) window.open(fileUrl, '_blank');
        };
    }

    if (fileUrl && (fileUrl.includes('supabase.co') || fileUrl.toLowerCase().endsWith('.pdf'))) {
        iframe.style.display = 'block';
        placeholderMsg.style.display = 'none';
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
        iframe.src = googleViewerUrl;
    } else if (fileUrl && fileUrl.startsWith('http')) {
        iframe.style.display = 'none';
        placeholderMsg.style.display = 'block';
        msgText.innerText = "Tài liệu này là liên kết ngoài (Google Drive/Web).";
        extLinkBtn.href = fileUrl;
        extLinkBtn.innerText = "Mở tài liệu tại tab mới ↗";
        extLinkBtn.style.display = 'inline-block';
    } else {
        iframe.style.display = 'none';
        placeholderMsg.style.display = 'block';
        msgText.innerText = "Không tìm thấy tài liệu hoặc preview không hỗ trợ.";
        extLinkBtn.style.display = 'none';
    }
};

window.closeSplitView = function() {
    if (window.docStartTime > 0) {
        const duration = (Date.now() - window.docStartTime) / 1000;
        if (duration > 5) {
            window.trackTelemetry('read_completed', {
                duration_seconds: Math.round(duration)
            });
        }
        window.docStartTime = 0;
    }
    document.getElementById('doc-review-container').style.display = 'none';
    document.getElementById('resource-hub-main').style.display = 'block';
    document.getElementById('doc-iframe').src = "";
    window.currentDocId = null;
};

window.approveCurrentDocument = async function() {
    if (!window.currentDocId) return;

    let priorityInput = prompt("Nhập độ ưu tiên (Số càng lớn tài liệu xếp càng cao, mặc định là 0):", "0");
    if (priorityInput === null) return;

    let priorityScore = parseInt(priorityInput, 10);
    if (isNaN(priorityScore)) priorityScore = 0;

    if (!confirm(`Xác nhận DUYỆT tài liệu này với độ ưu tiên: ${priorityScore}?`)) return;

    try {
        await updateDoc(doc(db, "resources", window.currentDocId), {
            status: 'approved',
            approvedBy: window.currentUserName,
            approvedAt: serverTimestamp(),
            priority: priorityScore
        });
        window.showNotificationBanner(`✅ Đã duyệt và gắn mức ưu tiên: ${priorityScore}`);
        window.closeSplitView();
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};

window.openRejectModal = function() {
    if (!window.currentDocId) return;
    document.getElementById('reject-reason-input').value = '';
    document.getElementById('reject-modal').style.display = 'flex';
};

window.closeRejectModal = function() {
    document.getElementById('reject-modal').style.display = 'none';
};

window.confirmRejectDocument = async function() {
    if (!window.currentDocId) return;
    const reason = document.getElementById('reject-reason-input').value.trim();

    if (!reason) {
        alert("Vui lòng nhập lý do từ chối để người upload biết cần sửa gì.");
        return;
    }

    try {
        await updateDoc(doc(db, "resources", window.currentDocId), {
            status: 'rejected',
            rejectionReason: reason,
            rejectedBy: window.currentUserName,
            rejectedAt: serverTimestamp()
        });
        window.showNotificationBanner("🗑️ Đã từ chối tài liệu. Lý do đã được lưu lại cho người upload.");
        window.closeRejectModal();
        window.closeSplitView();
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
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
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const userRank = window.currentUserRank || "Cadet";
    window.voidIdentity = `${userRank}#${randomNum}`;

    const identityDisplay = document.getElementById('void-user-identity');
    if (identityDisplay) identityDisplay.innerText = "ID: " + window.voidIdentity;

    const q = query(collection(db, "void_messages"), orderBy("createdAt", "asc"), limit(50));

    onSnapshot(q, (snapshot) => {
        const chatBox = document.getElementById('void-messages');
        chatBox.innerHTML = '<div style="text-align: center; color: #444; margin-bottom: 15px; font-style: italic; font-size: 0.8rem;">-- Kênh đã được mã hóa --</div>';

        snapshot.forEach((doc) => {
            const data = doc.data();
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

window.sendVoidMessage = async function() {
    const input = document.getElementById('void-input-field');
    const text = input.value.trim();

    if (!text) return;

    try {
        await addDoc(collection(db, "void_messages"), {
            identity: window.voidIdentity || "Unknown Pilot",
            text: text,
            createdAt: serverTimestamp(),
            timestamp: serverTimestamp()
        });

        input.value = '';
    } catch (e) {
        console.error("Lỗi truyền tín hiệu:", e);
    }
};
// ✅ SỬA THÀNH: Đảm bảo HTML đã load xong mới gán sự kiện
document.addEventListener('DOMContentLoaded', () => {
    const otpCodeEl = document.getElementById('otp-code-input');
    if (otpCodeEl) {
        otpCodeEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.verifyRegistrationOtp(); });
    }

    const authEmailEl = document.getElementById('auth-email');
    if (authEmailEl) {
        authEmailEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.handleAuth(); });
    }

    const chatInputEl = document.getElementById('chat-input-field');
    if (chatInputEl) {
        chatInputEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.sendMessage(); });
    }

    const voidInputEl = document.getElementById('void-input-field');
    if (voidInputEl) {
        voidInputEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.sendVoidMessage(); });
    }
});
// --- HÀM CỘNG NĂNG LƯỢNG (ENERGY) VÀ CHỈ SỐ (STAT) ---
window.addEnergy = async function(amount, statType) {
    if (!auth.currentUser) return;
    try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const statMap = {
            'focus': 'stats.focus',
            'guardian': 'stats.upload',
            'diplomat': 'stats.interact',
            'voyager': 'stats.online'
        };
        const statField = statMap[statType] || 'stats.focus';

        await updateDoc(userRef, {
            energy: increment(amount),
            [statField]: increment(amount)
        });
        console.log(`⚡ +${amount} Energy (${statType})`);
    } catch (e) {
        console.error("Lỗi cộng năng lượng:", e);
    }
};

window.openUploadModal = function() {
    document.getElementById('upload-modal').style.display = 'flex';
};

window.closeUploadModal = function() {
    document.getElementById('upload-modal').style.display = 'none';
    document.getElementById('up-title').value = '';
    document.getElementById('up-school').value = '';
    document.getElementById('up-school').disabled = false;
    document.getElementById('up-school-other-wrap').style.display = 'none';
    document.getElementById('up-school-other').value = '';
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
    if (!auth.currentUser) {
        alert("Vui lòng đăng nhập trước khi upload tài liệu!");
        return;
    }

    const title = document.getElementById('up-title').value.trim();
    const category = document.getElementById('up-category').value.trim();
    const fileInput = document.getElementById('up-file');
    const urlInput = document.getElementById('up-url').value.trim();

    const schoolInputEl = document.getElementById('up-school');
    const isSchoolOther = schoolInputEl.value === SCHOOL_OTHER_LABEL;
    let school = '';
    if (isSchoolOther) {
        school = document.getElementById('up-school-other').value.trim();
    } else {
        school = schoolInputEl.value.trim();
    }

    if (!title || !school || !category || (!fileInput.files.length && !urlInput)) {
        alert("Vui lòng điền đầy đủ thông tin (kể cả Trường) và chọn File hoặc nhập Link!");
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
            fileUrl = urlInput;
            fileName = "External Link";
            progressFill.style.width = '100%';
            progressText.innerText = "Processing external link... 100%";
        } else if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (file.size > 50 * 1024 * 1024) {
                throw new Error("File quá lớn (>50MB). Vui lòng dùng Link Drive.");
            }

            const cleanName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.-]/g, '_');
            const path = `${Date.now()}_${cleanName}`;

            progressText.innerText = "Uploading to Supabase...";
            progressFill.style.width = '20%';

            const { data, error } = await supabase.storage.from('COSMIC file').upload(path, file);
            if (error) throw error;

            const { data: publicData } = supabase.storage.from('COSMIC file').getPublicUrl(path);
            fileUrl = publicData.publicUrl;
            fileName = file.name;

            progressFill.style.width = '100%';
            progressText.innerText = "Upload complete! 100%";
        }

        const schoolKey = window.normalizeKey(school);
        const categoryKey = window.normalizeKey(category);

        const newResourceRef = await addDoc(collection(db, "resources"), {
            title,
            school,
            schoolKey,
            category,
            categoryKey,
            fileName,
            fileUrl,
            uploader: window.currentUserName,
            uploaderUid: auth.currentUser.uid,
            status: 'pending',
            createdAt: serverTimestamp()
        });

        window.trackTelemetry('upload_document', {
            doc_title: title,
            doc_school: school,
            doc_category: category,
            status: 'pending'
        });
        window.logActivity('upload', title, { school, category, docId: newResourceRef.id, fileUrl, uploaderName: window.currentUserName });

        window.addEnergy(10, 'guardian');

        try {
            if (auth.currentUser) {
                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    'coins.received': increment(2)
                });
                if (window.showCoinEffect) window.showCoinEffect(2);
                window.logActivity('coin_receive', 'Upload tài liệu: ' + title, { amount: 2 });
                console.log("🪙 +2 xu (UPLOAD_DOCUMENT)");
            }
        } catch (coinErr) {
            console.warn("Không thể cộng xu:", coinErr);
        }

        setTimeout(() => {
            alert("✅ Upload thành công! 🪙 Bạn được thưởng +2 xu!\nTài liệu đang chờ duyệt.");
            window.closeUploadModal();
        }, 1500);

    } catch (e) {
        console.error("Upload error:", e);
        alert("Lỗi: " + e.message);
        progressContainer.style.display = 'none';
        progressText.style.display = 'none';
    }
};
// --- BƯỚC 1: SỬA LOGIC HIỂN THỊ TẠI RESOURCE HUB ---

window._allResources = [];
window._currentReviewTab = 'approved';
window._activeGroup = null;

window._extractSchoolCode = function(school) {
    if (!school) return '';
    const parts = school.split(' - ');
    return parts.length >= 2 ? parts[parts.length - 1].trim() : school.trim();
};

window._parseCategoryLabel = function(category) {
    if (!category) return { code: '', name: '' };
    const idx = category.indexOf(' - ');
    if (idx === -1) return { code: '', name: category };
    return { code: category.substring(0, idx).trim(), name: category.substring(idx + 3).trim() };
};

window.initResourceHub = function() {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"), limit(50));

    onSnapshot(q, (snapshot) => {
        const currentUid = auth.currentUser ? auth.currentUser.uid : null;
        const userRoles = window.currentUserRoles || [];
        const isStaff = userRoles.includes('admin') || userRoles.includes('op');

        window._allResources = [];
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const status = data.status || 'pending';
            const isOwner = data.uploaderUid === currentUid;
            let isVisible = false;

            if (status === 'approved') {
                isVisible = true;
            } else if (status === 'pending' || status === 'rejected') {
                if (isStaff || isOwner) {
                    isVisible = true;
                }
            }

            if (isVisible) {
                window._allResources.push({ id: docSnap.id, ...data });
            }
        });

        window.updatePendingIndicators();
        window.renderReviewTabs();
        window.applyFilters();
    });
};

window.renderReviewTabs = function() {
    const tabsEl = document.getElementById('review-tabs');
    if (!tabsEl) return;
    const userRoles = window.currentUserRoles || [];
    const isStaff = userRoles.includes('admin') || userRoles.includes('op');
    tabsEl.style.display = isStaff ? 'flex' : 'none';
};

window.updatePendingIndicators = function() {
    const userRoles = window.currentUserRoles || [];
    const isStaff = userRoles.includes('admin') || userRoles.includes('op');
    const badge = document.getElementById('pending-tab-badge');
    const dot = document.getElementById('resources-pending-dot');

    if (!isStaff) {
        if (badge) badge.style.display = 'none';
        if (dot) dot.style.display = 'none';
        return;
    }

    const pendingCount = window._allResources.filter(r => (r.status || 'pending') === 'pending').length;

    if (badge) {
        if (pendingCount > 0) {
            badge.innerText = pendingCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
    if (dot) {
        dot.style.display = pendingCount > 0 ? 'block' : 'none';
    }
};

window.switchReviewTab = function(tabKey, element) {
    window._currentReviewTab = tabKey;
    document.querySelectorAll('.review-tab').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    window.applyFilters();
};

window.openGroupDrilldown = function(schoolKey, categoryKey) {
    const sampleDoc = window._allResources.find(d =>
        (d.schoolKey || window.normalizeKey(d.school || '')) === schoolKey &&
        (d.categoryKey || window.normalizeKey(d.category || '')) === categoryKey
    );
    if (!sampleDoc) return;

    window._activeGroup = { schoolKey, categoryKey, school: sampleDoc.school, category: sampleDoc.category };

    window.applyFilters();
};

window.closeGroupDrilldown = function() {
    window._activeGroup = null;
    window.applyFilters();
};

window.renderResourceList = function(docs) {
    const listContainer = document.getElementById('resource-list-container');
    const countEl = document.getElementById('filter-result-count');
    const userRoles = window.currentUserRoles || [];
    const isStaff = userRoles.includes('admin') || userRoles.includes('op');

    if (docs.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align:center; padding:40px; color:#666;">
                <div style="font-size:32px; margin-bottom:10px;">🔍</div>
                <div>Không tìm thấy tài liệu phù hợp.</div>
                <div style="font-size:12px; margin-top:8px; color:#444;">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</div>
            </div>`;
        if (countEl) countEl.innerText = '0 kết quả';
        return;
    }

    if (window._activeGroup) {
        const g = window._activeGroup;
        const schoolCode = window._extractSchoolCode(g.school);
        const { code: catCode, name: catName } = window._parseCategoryLabel(g.category);
        const label = catCode
            ? `[${schoolCode}] ${catCode} - ${catName}`
            : `[${schoolCode}] ${catName || g.category}`;

        const groupDocs = docs.filter(d => {
            const sk = d.schoolKey || window.normalizeKey(d.school || '');
            const ck = d.categoryKey || window.normalizeKey(d.category || '');
            return sk === g.schoolKey && ck === g.categoryKey;
        });

        if (countEl) countEl.innerText = `${groupDocs.length} tài liệu`;

        let html = `
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
                <button onclick="window.closeGroupDrilldown()"
                    style="background:rgba(255,255,255,0.08); border:1px solid #444; color:#ccc;
                           padding:6px 14px; border-radius:6px; cursor:pointer; font-size:13px;">
                    ← Quay lại
                </button>
                <span style="font-size:15px; font-weight:700; color:var(--neon-teal);">${label}</span>
                <span style="font-size:12px; color:#666;">${groupDocs.length} tài liệu</span>
            </div>`;

        if (groupDocs.length === 0) {
            html += `<div style="text-align:center; padding:30px; color:#666;">Không có tài liệu nào trong nhóm này.</div>`;
        } else {
            groupDocs.forEach((data) => {
                const status = data.status || 'pending';
                const safeTitle = data.title.replace(/'/g, "\\'");
                const safeUrl = (data.fileUrl || "").replace(/'/g, "\\'");
                const uploader = data.uploader || "Unknown";

                let statusBadge = "";
                if (status === 'pending') statusBadge = `<span class="res-tag" style="background:#FF8C00;color:#000;">⏳ PENDING</span>`;
                else if (status === 'rejected') statusBadge = `<span class="res-tag" style="background:var(--neon-red);color:#fff;">✘ TỪ CHỐI</span>`;

                let uploaderHTML = isStaff ? ` • Upload bởi: <b>${uploader}</b>` : '';

                let dateHTML = "";
                if (data.createdAt && data.createdAt.toDate) {
                    const d = data.createdAt.toDate();
                    const now = new Date();
                    const diffDays = Math.floor((now - d) / 86400000);
                    let dateStr = diffDays === 0 ? 'Hôm nay' : diffDays === 1 ? 'Hôm qua' : diffDays < 7 ? `${diffDays} ngày trước` : d.toLocaleDateString('vi-VN');
                    dateHTML = `<span style="font-size:11px;color:#666;margin-left:8px;">📅 ${dateStr}</span>`;
                }

                html += `
                    <div class="resource-item"
                         onclick="openSplitView('${safeTitle}', '${safeUrl}', '${data.id}', '${uploader}')">
                        <div style="display:flex; align-items:center;">
                            <div class="res-icon"><i class="fa-solid fa-file" style="color:var(--neon-purple);"></i></div>
                            <div class="res-info">
                                <h3>${data.title} ${statusBadge}</h3>
                                <p>Upload bởi: <b>${uploader}</b>${uploaderHTML ? '' : ''}${dateHTML}</p>
                            </div>
                        </div>
                        <div style="font-size:12px; color:#888;">Click to view</div>
                    </div>`;
            });
        }

        listContainer.innerHTML = html;
        return;
    }

    if (isStaff && window._currentReviewTab !== 'approved') {
        if (countEl) countEl.innerText = `${docs.length} tài liệu`;
        let html = '';
        docs.forEach((data) => {
            const status = data.status || 'pending';
            const safeTitle = data.title.replace(/'/g, "\\'");
            const safeUrl = (data.fileUrl || "").replace(/'/g, "\\'");
            const uploader = data.uploader || "Unknown";

            let statusBadge = "";
            if (status === 'pending') statusBadge = `<span class="res-tag" style="background:#FF8C00;color:#000;">⏳ PENDING</span>`;
            else if (status === 'rejected') statusBadge = `<span class="res-tag" style="background:var(--neon-red);color:#fff;">✘ TỪ CHỐI</span>`;

            const schoolCode = window._extractSchoolCode(data.school || '');
            const schoolPrefix = schoolCode
                ? `<span style="color:var(--neon-purple);font-weight:600;">[${schoolCode}]</span> `
                : '';

            let dateHTML = "";
            if (data.createdAt && data.createdAt.toDate) {
                const d = data.createdAt.toDate();
                const now = new Date();
                const diffDays = Math.floor((now - d) / 86400000);
                let dateStr = diffDays === 0 ? 'Hôm nay' : diffDays === 1 ? 'Hôm qua' : diffDays < 7 ? `${diffDays} ngày trước` : d.toLocaleDateString('vi-VN');
                dateHTML = `<span style="font-size:11px;color:#666;margin-left:8px;">📅 ${dateStr}</span>`;
            }

            html += `
                <div class="resource-item"
                     onclick="openSplitView('${safeTitle}', '${safeUrl}', '${data.id}', '${uploader}')">
                    <div style="display:flex; align-items:center;">
                        <div class="res-icon">📄</div>
                        <div class="res-info">
                            <h3>${schoolPrefix}${data.title} ${statusBadge}</h3>
                            <p>${data.category} • Upload bởi: <b>${uploader}</b>${dateHTML}</p>
                        </div>
                    </div>
                    <div style="font-size:12px; color:#888;">Click to view</div>
                </div>`;
        });
        listContainer.innerHTML = html;
        return;
    }

    const groups = new Map();
    docs.forEach(data => {
        const sk = data.schoolKey || window.normalizeKey(data.school || '');
        const ck = data.categoryKey || window.normalizeKey(data.category || '');
        const key = sk + '|||' + ck;
        if (!groups.has(key)) {
            groups.set(key, { schoolKey: sk, categoryKey: ck, school: data.school || '', category: data.category || '', docs: [], latestDate: null });
        }
        const g = groups.get(key);
        g.docs.push(data);
        if (data.createdAt && data.createdAt.toDate) {
            const t = data.createdAt.toDate();
            if (!g.latestDate || t > g.latestDate) g.latestDate = t;
        }
    });

    const sortedGroups = [...groups.values()].sort((a, b) => {
        const maxPriorityA = Math.max(...a.docs.map(d => d.priority || 0));
        const maxPriorityB = Math.max(...b.docs.map(d => d.priority || 0));
        if (maxPriorityB !== maxPriorityA) return maxPriorityB - maxPriorityA;
        const ta = a.latestDate ? a.latestDate.getTime() : 0;
        const tb = b.latestDate ? b.latestDate.getTime() : 0;
        return tb - ta;
    });

    if (countEl) countEl.innerText = `${sortedGroups.length} nhóm môn học (${docs.length} tài liệu)`;

    let html = '';
    sortedGroups.forEach(g => {
        const schoolCode = window._extractSchoolCode(g.school);
        const { code: catCode, name: catName } = window._parseCategoryLabel(g.category);

        const displayLabel = catCode
            ? `[${schoolCode}] ${catCode} — ${catName}`
            : `[${schoolCode}] ${catName || g.category}`;

        let dateHTML = '';
        if (g.latestDate) {
            const now = new Date();
            const diffDays = Math.floor((now - g.latestDate) / 86400000);
            let dateStr = diffDays === 0 ? 'Hôm nay' : diffDays === 1 ? 'Hôm qua' : diffDays < 7 ? `${diffDays} ngày trước` : g.latestDate.toLocaleDateString('vi-VN');
            dateHTML = `<span style="font-size:11px;color:#666;margin-left:8px;">📅 ${dateStr}</span>`;
        }

        const safeSchoolKey = g.schoolKey.replace(/'/g, "\\'");
        const safeCategoryKey = g.categoryKey.replace(/'/g, "\\'");

        html += `
            <div class="resource-item"
                 onclick="window.openGroupDrilldown('${safeSchoolKey}', '${safeCategoryKey}')">
                <div style="display:flex; align-items:center; gap:0;">
<div class="res-icon" style="color:var(--neon-cyan);"><i class="fa-solid fa-folder"></i></div>                    <div class="res-info">
                        <h3>
                            <span style="color:var(--neon-purple);font-weight:700;">[${schoolCode}]</span>
                            ${catCode ? `<span style="color:var(--neon-cyan);"> ${catCode}</span> — ` : ' '}${catName || g.category}
                        </h3>
                        <p>${g.docs.length} tài liệu${dateHTML}</p>
                    </div>
                </div>
                <div style="font-size:12px; color:#888;">Xem tài liệu →</div>
            </div>`;
    });

    listContainer.innerHTML = html;
};

window.applyFilters = function() {
    const keyword = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const schoolFilterRaw = (document.getElementById('filter-school')?.value || '').trim();
    const subject = (document.getElementById('filter-subject')?.value || '').toLowerCase().trim();
    const timeVal = document.getElementById('filter-time')?.value || 'all';

    const hasNewFilter = keyword || schoolFilterRaw || subject || timeVal !== 'all';
    if (hasNewFilter && window._activeGroup) {
        window._activeGroup = null;
    }

    const schoolFilterKey = window.normalizeKey(schoolFilterRaw);

    const userRoles = window.currentUserRoles || [];
    const isStaff = userRoles.includes('admin') || userRoles.includes('op');

    const now = new Date();
    const timeMap = {
        today: 1,
        week: 7,
        month: 30,
        '3months': 90
    };

    const filtered = window._allResources.filter(data => {
        const status = data.status || 'pending';

        if (isStaff) {
            if (status !== window._currentReviewTab) return false;
        }

        if (keyword && !data.title.toLowerCase().includes(keyword)) return false;

        if (schoolFilterKey) {
            const docSchoolKey = data.schoolKey || window.normalizeKey(data.school || '');
            if (!docSchoolKey.includes(schoolFilterKey)) return false;
        }

        if (subject && !((data.category || '').toLowerCase().includes(subject))) return false;

        if (timeVal !== 'all' && data.createdAt && data.createdAt.toDate) {
            const days = timeMap[timeVal];
            const docDate = data.createdAt.toDate();
            const diffDays = (now - docDate) / 86400000;
            if (diffDays > days) return false;
        }

        return true;
    });

    filtered.sort((a, b) => {
        const pa = typeof a.priority === 'number' ? a.priority : 0;
        const pb = typeof b.priority === 'number' ? b.priority : 0;
        if (pa !== pb) return pb - pa;

        const da = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
        const db_ = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
        return db_ - da;
    });

    const resetBtn = document.getElementById('filter-reset-btn');
    const hasFilter = keyword || subject || timeVal !== 'all';
    if (resetBtn) resetBtn.style.display = hasFilter ? 'inline-block' : 'none';

    window.renderResourceList(filtered);
};

window.resetFilters = function() {
    const searchInput = document.getElementById('search-input');
    const filterSchool = document.getElementById('filter-school');
    const filterSubject = document.getElementById('filter-subject');
    const filterTime = document.getElementById('filter-time');
    if (searchInput) searchInput.value = '';
    if (filterSchool) filterSchool.value = '';
    if (filterSubject) filterSubject.value = '';
    if (filterTime) filterTime.value = 'all';
    document.getElementById('filter-reset-btn').style.display = 'none';
    document.getElementById('filter-result-count').innerText = '';
    window.applyFilters();
};

window.handleFilterSchoolInput = function(input) {
    const val = input.value.toLowerCase();
    const box = document.getElementById('filter-school-box');
    const filtered = SCHOOL_LIST.filter(sub => sub !== SCHOOL_OTHER_LABEL && sub.toLowerCase().includes(val));

    if (!val || filtered.length === 0) {
        box.style.display = 'none';
        window.applyFilters();
        return;
    }

    let html = '';
    const display = filtered.slice(0, 8);
    display.forEach(sub => {
        const regex = new RegExp(`(${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const highlighted = sub.replace(regex, '<strong>$1</strong>');
        html += `<div class="suggestion-item" onclick="selectFilterSchool('${sub.replace(/'/g, "\\'")}')">${highlighted}</div>`;
    });

    box.innerHTML = html;
    box.style.display = 'block';
    window.applyFilters();
};

window.selectFilterSchool = function(value) {
    document.getElementById('filter-school').value = value;
    document.getElementById('filter-school-box').style.display = 'none';
    window.applyFilters();
};

window.handleFilterSubjectInput = function(input) {
    const val = input.value.toLowerCase();
    const box = document.getElementById('filter-subject-box');
    const filtered = SUBJECT_LIST.filter(sub => sub.toLowerCase().includes(val));

    if (!val || filtered.length === 0) {
        box.style.display = 'none';
        window.applyFilters();
        return;
    }

    let html = '';
    const display = filtered.slice(0, 8);
    display.forEach(sub => {
        const regex = new RegExp(`(${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const highlighted = sub.replace(regex, '<strong>$1</strong>');
        html += `<div class="suggestion-item" onclick="selectFilterSubject('${sub}')">${highlighted}</div>`;
    });

    box.innerHTML = html;
    box.style.display = 'block';
    window.applyFilters();
};

window.selectFilterSubject = function(value) {
    document.getElementById('filter-subject').value = value;
    document.getElementById('filter-subject-box').style.display = 'none';
    window.applyFilters();
};

window.handleSearchInput = function() {
    window.applyFilters();
};

document.addEventListener('click', function(e) {
    const subjectWrapper = document.querySelector('#filter-subject')?.closest('.autocomplete-wrapper');
    if (subjectWrapper && !subjectWrapper.contains(e.target)) {
        const box = document.getElementById('filter-subject-box');
        if (box) box.style.display = 'none';
    }

    const schoolWrapper = document.querySelector('#filter-school')?.closest('.autocomplete-wrapper');
    if (schoolWrapper && !schoolWrapper.contains(e.target)) {
        const box = document.getElementById('filter-school-box');
        if (box) box.style.display = 'none';
    }
});
window.sendMessage = function() {
    const input = document.getElementById('chat-input-field');
    const chatBox = document.getElementById('chat-box');
    const text = input.value.trim();

    if(text) {
        chatBox.innerHTML += `<div class="chat-msg msg-me">${text}</div>`;
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        if(text.toLowerCase().includes('sos')) {
            setTimeout(() => {
                if (!window.isSOSActive) {
                    window.triggerSOS();
                } else {
                    chatBox.innerHTML += `<div class="chat-msg msg-system">SOS signal is already active! Rescue team alerted.</div>`;
                }
            }, 500);
        }

        window.trackTelemetry('send_message', { channel: 'sos_chat' });
    }
};
// --- BƯỚC 2: OPS CENTER ---
window.setupOpsCenter = function() {
    const opsPanel = document.getElementById('panel-op');
    if (!opsPanel) return;

    opsPanel.innerHTML = `
        <h3 style="color:var(--neon-blue);">📋 OPS CENTER</h3>
        <p style="font-size:12px; color:#aaa; margin-bottom:10px;">Báo cáo quy trình vận hành.</p>
        <div style="background:#111; padding:10px; font-size:12px; color:var(--text-dim); border-radius:5px;">
            Việc duyệt tài liệu đã chuyển sang <b style="color:var(--neon-cyan);">Kho tài liệu</b> (Resource Hub) → tab "Chưa duyệt".
        </div>
    `;

    const q = query(collection(db, "resources"), where("status", "==", "pending"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        const container = document.getElementById('ops-pending-list');
        const bridgeNav = document.getElementById('bridge-nav');

        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align:center; color:#666; font-size:12px; padding-top:20px;">Không có tài liệu chờ duyệt.</div>';
            if(bridgeNav) {
                bridgeNav.style.border = "none";
                bridgeNav.style.boxShadow = "none";
            }
        } else {
            if(bridgeNav) {
                bridgeNav.style.border = "1px solid #FF4500";
                bridgeNav.style.boxShadow = "0 0 10px #FF4500";
            }
            window.showNotificationBanner(`⚠️ OPS ALERT: Có ${snapshot.size} tài liệu cần duyệt!`);

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

window.approveDocument = async function(docId) {
    let priorityInput = prompt("Nhập độ ưu tiên (Số càng lớn tài liệu xếp càng cao, mặc định là 0):", "0");

    if (priorityInput === null) return;

    let priorityScore = parseInt(priorityInput, 10);
    if (isNaN(priorityScore)) priorityScore = 0;

    if (!confirm(`Xác nhận DUYỆT tài liệu này với độ ưu tiên: ${priorityScore}?`)) return;

    try {
        await updateDoc(doc(db, "resources", docId), {
            status: 'approved',
            approvedBy: window.currentUserName,
            approvedAt: serverTimestamp(),
            priority: priorityScore
        });
        window.showNotificationBanner(`✅ Đã duyệt và gắn mức ưu tiên: ${priorityScore}`);

        const docSnap = await getDoc(doc(db, "resources", docId));
        if (docSnap.exists()) {
            const docData = docSnap.data();
            if (docData.uploaderUid) {
                try {
                    const targetUid = docData.uploaderUid;
                    const targetUserRef = doc(db, "users", targetUid);
                    const targetUserSnap = await getDoc(targetUserRef);
                    if (targetUserSnap.exists()) {
                        await updateDoc(targetUserRef, {
                            'coins.received': increment(8)
                        });
                        if (window.showCoinEffect) window.showCoinEffect(8);
                        alert("✅ Đã duyệt tài liệu! 🪙 Người upload được thưởng +8 xu!");
                        console.log(`🪙 +8 xu (DOCUMENT_APPROVED) cho user ${targetUid}`);
                    }
                } catch (err) {
                    console.error("Lỗi cộng xu cho người upload:", err);
                }
            }
        }
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};

window.rejectDocument = async function(docId) {
    if (!confirm("Từ chối và XÓA VĨNH VIỄN tài liệu này?")) return;
    try {
        await deleteDoc(doc(db, "resources", docId));
        window.showNotificationBanner("🗑️ Đã từ chối và xóa tài liệu.");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
};
const otpCodeEl = document.getElementById('otp-code-input');
if (otpCodeEl) {
    otpCodeEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.verifyRegistrationOtp(); });
}

const authEmailEl = document.getElementById('auth-email');
if (authEmailEl) {
    authEmailEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.handleAuth(); });
}

const chatInputEl = document.getElementById('chat-input-field');
if (chatInputEl) {
    chatInputEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.sendMessage(); });
}

const voidInputEl = document.getElementById('void-input-field');
if (voidInputEl) {
    voidInputEl.addEventListener('keypress', function (e) { if (e.key === 'Enter') window.sendVoidMessage(); });
}
// --- HỆ THỐNG XU (COIN) FIRESTORE-BACKED ---

window.COIN_POLICY = Object.freeze({
    REGISTER_ACCOUNT: {
        code: "REGISTER_ACCOUNT",
        label: "Đăng ký tài khoản",
        condition: "Hoàn tất đăng ký tài khoản",
        amount: 100,
        once: true,
        note: "Chỉ một lần",
    },
    UPLOAD_DOCUMENT: {
        code: "UPLOAD_DOCUMENT",
        label: "Upload tài liệu",
        condition: "Gửi tài liệu thành công",
        amount: 2,
        once: false,
        note: "Khuyến khích đóng góp",
    },
    DOCUMENT_APPROVED: {
        code: "DOCUMENT_APPROVED",
        label: "Tài liệu được duyệt",
        condition: "Admin phê duyệt",
        amount: 8,
        once: false,
        note: "Chỉ áp dụng với tài liệu hợp lệ",
    },
    UNLOCK_PREMIUM_DOC: {
        code: "UNLOCK_PREMIUM_DOC",
        label: "Mở khóa tài liệu chất lượng cao",
        condition: "Mở khóa tài liệu chất lượng cao",
        amount: -50,
        oncePerTarget: true,
        note: "Chỉ trừ ở lần mở khóa đầu tiên",
    },
});

// --- MODAL: CHỈNH SỬA HỒ SƠ (EDIT PROFILE) ---
window.openEditProfileModal = async function() {
    const modal = document.getElementById('cabin-edit-modal');
    if (!modal) {
        console.warn("⚠️ Không tìm thấy #cabin-edit-modal trong HTML.");
        return;
    }

    if (!auth.currentUser) {
        alert("Bạn cần đăng nhập để chỉnh sửa hồ sơ! (Chế độ khách không thể lưu thay đổi)");
        return;
    }

    modal.classList.add('open');

    try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;

        const d = snap.data();
        const nameEl = document.getElementById('cabin-edit-name');
        const yearEl = document.getElementById('cabin-edit-year');
        const majorEl = document.getElementById('cabin-edit-major');
        const phoneEl = document.getElementById('cabin-edit-phone');
        const introEl = document.getElementById('cabin-edit-intro');
        const emailEl = document.getElementById('cabin-edit-email');
        const coinTextEl = document.getElementById('cabin-edit-coin-text');
        const charCountEl = document.getElementById('cabin-intro-char-count');
        const avatarPreview = document.getElementById('cabin-avatar-circle-preview');

        const displayName = d.displayName || d.fullName || "";
        if (nameEl) nameEl.value = displayName;
        if (yearEl) yearEl.value = d.year || "";
        if (majorEl) majorEl.value = d.major || "";
        if (phoneEl) phoneEl.value = d.phone || "";
        if (introEl) introEl.value = d.bio || "";
        if (emailEl) emailEl.value = d.email || auth.currentUser.email || "";
        if (charCountEl) charCountEl.innerText = (d.bio || "").length;

        const coins = d.coins || { received: 0, used: 0 };
        if (coinTextEl) coinTextEl.innerText = window.formatCoin((coins.received || 0) - (coins.used || 0)) + " Xu";

        if (avatarPreview) {
            const span = avatarPreview.querySelector('span');
            if (span) span.innerText = (displayName.trim()[0] || "?").toUpperCase();
        }
    } catch (e) {
        console.error("Lỗi tải hồ sơ để chỉnh sửa:", e);
        alert("Không thể tải dữ liệu hồ sơ: " + e.message);
    }
};

window.closeEditProfileModal = function() {
    const modal = document.getElementById('cabin-edit-modal');
    if (modal) modal.classList.remove('open');
};

window.saveProfileChanges = async function() {
    if (!auth.currentUser) {
        alert("Bạn cần đăng nhập để lưu thay đổi hồ sơ!");
        return;
    }

    const btn = document.getElementById('cabin-edit-save');
    const originalText = btn ? btn.innerText : "Lưu thay đổi";
    if (btn) { btn.innerText = "Đang lưu..."; btn.disabled = true; }

    try {
        const updates = {
            displayName: (document.getElementById('cabin-edit-name')?.value || "").trim(),
            year: (document.getElementById('cabin-edit-year')?.value || "").trim(),
            major: (document.getElementById('cabin-edit-major')?.value || "").trim(),
            phone: (document.getElementById('cabin-edit-phone')?.value || "").trim(),
            bio: (document.getElementById('cabin-edit-intro')?.value || "").trim()
        };

        await updateDoc(doc(db, "users", auth.currentUser.uid), updates);

        window.currentUserName = updates.displayName || window.currentUserName;

        const nameEl = document.getElementById('user-display-name');
        const welcomeEl = document.getElementById('welcome-name');
        const cabinYearEl = document.getElementById('cabin-year-text');
        const cabinRoleSubEl = document.getElementById('cabin-role-sub');
        const cabinIntroEl = document.getElementById('cabin-profile-intro');

        if (nameEl) nameEl.innerText = updates.displayName || "Unknown Pilot";
        if (welcomeEl) welcomeEl.innerText = updates.displayName || "Unknown Pilot";
        if (cabinYearEl) cabinYearEl.innerText = updates.year || "Chưa cập nhật";
        if (cabinRoleSubEl) cabinRoleSubEl.innerText = "Chuyên ngành: " + (updates.major || "Chưa cập nhật");
        if (cabinIntroEl) cabinIntroEl.innerText = updates.bio || "Chưa có giới thiệu.";

        alert("✅ Đã cập nhật hồ sơ thành công!");
        window.closeEditProfileModal();
    } catch (e) {
        console.error("Lỗi khi lưu hồ sơ:", e);
        alert("❌ Lỗi khi lưu hồ sơ: " + e.message);
    } finally {
        if (btn) { btn.innerText = originalText; btn.disabled = false; }
    }
};

const cabinEditIntroEl = document.getElementById('cabin-edit-intro');
const cabinIntroCharCountEl = document.getElementById('cabin-intro-char-count');
if (cabinEditIntroEl && cabinIntroCharCountEl) {
    cabinEditIntroEl.addEventListener('input', () => {
        cabinIntroCharCountEl.innerText = cabinEditIntroEl.value.length;
    });
}

const btnOpenEditProfile = document.getElementById('btn-open-edit-profile');
if (btnOpenEditProfile) btnOpenEditProfile.addEventListener('click', window.openEditProfileModal);
else console.warn("⚠️ Không tìm thấy #btn-open-edit-profile trong HTML.");

const btnEditClose = document.getElementById('cabin-edit-close');
if (btnEditClose) btnEditClose.addEventListener('click', window.closeEditProfileModal);

const btnEditCancel = document.getElementById('cabin-edit-cancel');
if (btnEditCancel) btnEditCancel.addEventListener('click', window.closeEditProfileModal);

const btnEditSave = document.getElementById('cabin-edit-save');
if (btnEditSave) btnEditSave.addEventListener('click', window.saveProfileChanges);

const cabinEditModalEl = document.getElementById('cabin-edit-modal');
if (cabinEditModalEl) {
    cabinEditModalEl.addEventListener('click', (e) => {
        if (e.target === cabinEditModalEl) window.closeEditProfileModal();
    });
}

// --- LỊCH SỬ HOẠT ĐỘNG (ACTIVITY LOG) ---
window.logActivity = async function(type, title, meta = {}) {
    if (!auth.currentUser) return;
    try {
        const dedupeKey = (meta && meta.docId) ? `${type}_${meta.docId}` : null;

        if (dedupeKey) {
            const dupQ = query(
                collection(db, "activity_logs"),
                where("uid", "==", auth.currentUser.uid),
                where("dedupeKey", "==", dedupeKey),
                limit(1)
            );
            const dupSnap = await getDocs(dupQ);
            if (!dupSnap.empty) {
                const existingRef = dupSnap.docs[0].ref;
                await updateDoc(existingRef, { title, meta, createdAt: serverTimestamp() });
                return;
            }
        }

        await addDoc(collection(db, "activity_logs"), {
            uid: auth.currentUser.uid,
            type,
            title,
            meta,
            dedupeKey,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.warn("⚠️ Không thể ghi lịch sử hoạt động:", e);
    }
};

const ACTIVITY_ICON_MAP = {
    view:         { cls: 'video', icon: 'fa-eye' },
    upload:       { cls: 'doc',   icon: 'fa-cloud-arrow-up' },
    coin_receive: { cls: 'doc',   icon: 'fa-coins', color: '#FFD700' },
    coin_spend:   { cls: 'doc',   icon: 'fa-coins', color: '#FF6B6B' }
};

function formatActivityTimeAgo(date) {
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
}

function renderActivityItem(item) {
    const cfg = ACTIVITY_ICON_MAP[item.type] || { cls: 'doc', icon: 'fa-circle-info' };
    const dateObj = item.createdAt && item.createdAt.toDate ? item.createdAt.toDate() : new Date();
    const timeText = formatActivityTimeAgo(dateObj);

    let subText = timeText;
    if (item.type === 'coin_receive') subText = `+${(item.meta && item.meta.amount) || ''} xu • ${timeText}`;
    if (item.type === 'coin_spend') subText = `-${(item.meta && item.meta.amount) || ''} xu • ${timeText}`;

    const safeTitle = (item.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const iconStyle = cfg.color ? ` style="color:${cfg.color};"` : '';

    let continueBtnHtml = '';
    const meta = item.meta || {};
    if ((item.type === 'view' || item.type === 'upload') && meta.docId && meta.fileUrl) {
        const btnLabel = item.type === 'view' ? 'Xem lại' : 'Xem tài liệu';
        const attrTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const attrUrl = (meta.fileUrl || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const attrDocId = (meta.docId || '').replace(/'/g, "\\'");
        const attrUploader = (meta.uploaderName || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        continueBtnHtml = `<button type="button" class="cabin-btn-continue" onclick="jumpToDocument('${attrTitle}', '${attrUrl}', '${attrDocId}', '${attrUploader}')">${btnLabel}</button>`;
    }

    return `
        <div class="cabin-history-item">
            <div class="cabin-history-icon ${cfg.cls}"${iconStyle}><i class="fa-solid ${cfg.icon}"></i></div>
            <div class="cabin-history-body">
                <p class="cabin-history-title">${safeTitle}</p>
                <div class="cabin-history-foot">
                    <span class="cabin-percent">${subText}</span>
                    ${continueBtnHtml}
                </div>
            </div>
        </div>`;
}

window.loadActivityHistory = function() {
    const listEl = document.getElementById('cabinHistoryList');
    const extraEl = document.getElementById('cabinHistoryExtra');
    const toggleBtn = document.getElementById('cabinToggleAllBtn');

    if (!listEl) return;

    if (!auth.currentUser) {
        listEl.innerHTML = `<div style="text-align:center; padding:16px; color:#666; font-size:13px;">Đăng nhập để xem lịch sử hoạt động.</div>`;
        if (extraEl) extraEl.innerHTML = '';
        if (toggleBtn) toggleBtn.style.display = 'none';
        return;
    }

    const q = query(collection(db, "activity_logs"), where("uid", "==", auth.currentUser.uid), limit(50));
    onSnapshot(q, (snapshot) => {
        let items = [];
        snapshot.forEach(docSnap => items.push({ id: docSnap.id, ...docSnap.data() }));

        items.sort((a, b) => {
            const ta = (a.createdAt && a.createdAt.toMillis) ? a.createdAt.toMillis() : 0;
            const tb = (b.createdAt && b.createdAt.toMillis) ? b.createdAt.toMillis() : 0;
            return tb - ta;
        });

        if (items.length === 0) {
            listEl.innerHTML = `<div style="text-align:center; padding:16px; color:#666; font-size:13px;">Chưa có hoạt động nào.</div>`;
            if (extraEl) extraEl.innerHTML = '';
            if (toggleBtn) toggleBtn.style.display = 'none';
            return;
        }

        const mainItems = items.slice(0, 3);
        const extraItems = items.slice(3, 20);

        listEl.innerHTML = mainItems.map(renderActivityItem).join('');
        if (extraEl) extraEl.innerHTML = extraItems.map(renderActivityItem).join('');
        if (toggleBtn) toggleBtn.style.display = extraItems.length > 0 ? 'flex' : 'none';
    }, (err) => {
        console.error("Lỗi tải lịch sử hoạt động (Kiểm tra Firestore Index/Rules):", err);
        listEl.innerHTML = `<div style="text-align:center; padding:16px; color:#666; font-size:13px;">Không thể tải lịch sử hoạt động.</div>`;
    });
};

const cabinToggleAllBtnEl = document.getElementById('cabinToggleAllBtn');
if (cabinToggleAllBtnEl) {
    cabinToggleAllBtnEl.addEventListener('click', () => {
        const extraEl = document.getElementById('cabinHistoryExtra');
        const labelEl = document.getElementById('cabinToggleAllLabel');
        if (!extraEl) return;
        const isShown = extraEl.classList.toggle('show');
        cabinToggleAllBtnEl.classList.toggle('expanded', isShown);
        if (labelEl) labelEl.innerText = isShown ? 'Ẩn bớt' : 'Xem tất cả lịch sử';
    });
}

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

    if (policy.once && claimedOnce.includes(actionCode)) {
        return { success: false, reason: "ALREADY_CLAIMED" };
    }

    const amount = Math.abs(policy.amount);
    const updateData = {
        'coins.received': increment(amount)
    };

    if (policy.once) {
        updateData.claimedOnce = claimedOnce.concat([actionCode]);
    }

    await updateDoc(userRef, updateData);

    window.showCoinEffect(amount);
    window.logActivity('coin_receive', policy.label, { amount });
    console.log(`🪙 +${amount} xu (${policy.label})`);

    return { success: true, amount };
};

/**
 * Trừ xu cho user hiện tại dựa trên actionCode.
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

    if (policy.oncePerTarget) {
        if (!targetId) return { success: false, reason: "MISSING_TARGET_ID" };
        if (unlockedTargets.includes(targetKey)) {
            return { success: true, amount: 0, alreadyUnlocked: true };
        }
    }

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

    window.showCoinEffect(-amount);
    window.logActivity('coin_spend', policy.label, { amount });
    console.log(`🪙 -${amount} xu (${policy.label})`);

    return { success: true, amount };
};


// Render coin display (vùng UI - chỉ nhận data, không gọi Firestore)
window.renderCoinDisplay = function(coins) {
    const c = coins || { received: 0, used: 0 };
    const received = c.received || 0;
    const used = c.used || 0;
    const balance = received - used;

    const balEl = document.getElementById('coin-balance-text');
    const recEl = document.getElementById('coin-received-text');
    const usedEl = document.getElementById('coin-used-text');

    if (balEl) balEl.innerText = window.formatCoin(balance);
    if (recEl) recEl.innerText = window.formatCoin(received);
    if (usedEl) usedEl.innerText = window.formatCoin(used);
};

// --- OTP REGISTRATION HELPERS (Supabase Auth OTP qua email) ---

// Hiện lỗi trên màn hình nhập OTP
function showOtpError(msg) {
    const errEl = document.getElementById('otp-error');
    if (!errEl) return;
    errEl.innerText = msg;
    errEl.style.display = 'block';
}

// Bước 2: Người dùng nhập mã 6 số -> đối chiếu với Supabase -> nếu đúng thì mới tạo tài khoản Firebase
window.verifyRegistrationOtp = async function() {
    const pending = window.__pendingRegistration;
    const otpInput = document.getElementById('otp-code-input');
    const code = (otpInput ? otpInput.value : '').trim();
    const errEl = document.getElementById('otp-error');
    if (errEl) errEl.style.display = 'none';

    if (!pending) {
        showOtpError("Phiên đăng ký đã hết hạn. Vui lòng đăng ký lại.");
        return;
    }
    if (!/^\d{6}$/.test(code)) {
        showOtpError("Vui lòng nhập đủ 6 chữ số.");
        return;
    }

    const btn = document.getElementById('btn-otp-confirm');
    if (btn) { btn.disabled = true; btn.innerText = 'ĐANG XÁC NHẬN...'; }

    try {
        // Đối chiếu mã OTP với Supabase
        const { error: verifyError } = await supabase.auth.verifyOtp({
            email: pending.email,
            token: code,
            type: 'email'
        });
        if (verifyError) throw verifyError;

        // Mã đúng -> thoát phiên Supabase (chỉ dùng Supabase để xác thực mã, không cần giữ session)
        await supabase.auth.signOut().catch(() => {});

        // Tạo tài khoản chính thức trên Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, pending.email, pending.password);
        const user = userCredential.user;
        const msv = pending.email.split('@')[0];

        // Lưu thông tin bổ sung vào Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: pending.name,
            displayName: pending.name,
            msv: msv,
            age: pending.age || "N/A",
            gender: pending.gender || "N/A",
            email: pending.email,
            createdAt: serverTimestamp(),
            coins: { received: 0, used: 0 },
            roles: ['user']
        });

        // Dọn dữ liệu tạm
        localStorage.removeItem('otp_last_sent_' + pending.email);
        window.__pendingRegistration = null;

        // onAuthStateChanged sẽ tự động đưa người dùng vào app vì user đã đăng nhập
        console.log("✅ Xác minh OTP thành công, tài khoản đã được tạo:", pending.email);
    } catch (error) {
        console.error("Verify OTP Error:", error);
        let msg = "Mã xác nhận không đúng hoặc đã hết hạn. Vui lòng thử lại.";
        if (error.code === 'auth/email-already-in-use') {
            msg = "Email này đã được đăng ký. Vui lòng đăng nhập.";
        } else if (error.message) {
            msg = error.message;
        }
        showOtpError(msg);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = 'XÁC NHẬN MÃ'; }
    }
};

// Gửi lại mã OTP (giới hạn 60s/lần để chặn spam)
window.resendRegistrationOtp = async function() {
    const pending = window.__pendingRegistration;
    if (!pending) {
        showOtpError("Phiên đăng ký đã hết hạn. Vui lòng đăng ký lại.");
        return;
    }

    const key = 'otp_last_sent_' + pending.email;
    const last = parseInt(localStorage.getItem(key) || '0');
    const cooldownMs = 60 * 1000;

    if (Date.now() - last < cooldownMs) {
        const remain = Math.ceil((cooldownMs - (Date.now() - last)) / 1000);
        showOtpError(`Vui lòng đợi ${remain}s trước khi gửi lại mã.`);
        return;
    }

    const btn = document.getElementById('btn-otp-resend');
    if (btn) { btn.disabled = true; btn.innerText = 'ĐANG GỬI...'; }
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: pending.email,
            options: { shouldCreateUser: true }
        });
        if (error) throw error;
        localStorage.setItem(key, Date.now().toString());
        showOtpError("📧 Đã gửi lại mã mới. Vui lòng kiểm tra email (kể cả Spam).");
    } catch (e) {
        showOtpError("Lỗi: " + e.message);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = 'Gửi lại mã'; }
    }
};

// Hủy quá trình xác minh OTP, quay lại màn hình đăng nhập
window.cancelOtpVerification = function() {
    window.__pendingRegistration = null;
    const otpScreen = document.getElementById('verify-otp-screen');
    const loginScreen = document.getElementById('login-screen');
    if (otpScreen) otpScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    window.isRegisterMode = false;
    if (window.isLoginMode === false) window.toggleAuthMode();
};