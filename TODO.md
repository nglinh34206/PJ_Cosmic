# TODO: Sửa tính năng tính xu

## Mục tiêu
Tích hợp hệ thống Xu (coin) vào Firestore real-time, hiển thị trên user page.html với hiệu ứng cộng/trừ xu.

## Các bước thực hiện

### ✅ Bước 1: Back_end.js — Thêm hàm `window.addEnergy()` 
- [x] Định nghĩa `window.addEnergy(amount, statType)` dùng `updateDoc` + `increment` của Firestore
- [x] Cập nhật `energy` và `stats.{statType}` trong Firestore user doc

### ✅ Bước 2: Back_end.js — Sửa class CoinAPI thành Firestore-backed
- [x] Xóa export, gắn `window.COIN_POLICY`, `window.formatCoin`, `window.showCoinEffect`
- [x] `window.rewardCoins()`: cộng `coins.received` dùng `increment`, kiểm tra `once`
- [x] `window.spendCoins()`: trừ `coins.used` dùng `increment`, kiểm tra số dư

### ✅ Bước 3: Back_end.js — Gọi xu vào các action
- [x] `submitUpload()`: reward `UPLOAD_DOCUMENT` (+2 xu) + addEnergy
- [x] `approveDocument()`: reward `DOCUMENT_APPROVED` (+8 xu) cho người upload
- [x] `ensureUserProfile()` (khi tạo mới): đã có field `coins: { received: 0, used: 0 }` trong profile mới

### ✅ Bước 4: Back_end.js — Load xu vào profile
- [x] `loadUserProfile()`: đọc `coins` từ Firestore (đã có sẵn trong data)

### ✅ Bước 5: user page.html — Kết nối Firestore real-time
- [x] Thêm Firebase SDK imports
- [x] Thêm auth + onAuthStateChanged + onSnapshot user doc
- [x] Cập nhật số dư, đã nhận, đã sử dụng động
- [x] Đảm bảo popup thông tin xu cũng cập nhật

### ✅ Bước 6: Kiểm tra
- [x] Đăng ký mới: có thể thêm `rewardCoins('REGISTER_ACCOUNT')` trong `handleAuth` (tùy chọn)
- [x] Upload tài liệu: +2 xu (UPLOAD_DOCUMENT) + +10 Energy (Guardian) 
- [x] Duyệt tài liệu: +8 xu (DOCUMENT_APPROVED) cho người upload
- [x] user page.html hiển thị real-time từ Firestore
- [x] Hiệu ứng cộng/trừ xu giữa màn hình (showCoinEffect)

## Kết luận
✅ **Hệ thống xu (coin) đã được tích hợp hoàn chỉnh:**
1. **Back_end.js**: 
   - `window.addEnergy()` — cập nhật Energy + Stats lên Firestore
   - `window.rewardCoins()` / `window.spendCoins()` — cộng/trừ xu real-time
   - `window.showCoinEffect()` — hiệu ứng + / - xu giữa màn hình
   - `submitUpload()` → +2 xu + +10 Energy
   - `approveDocument()` → +8 xu cho người upload
   - `ensureUserProfile()` → tự động sửa field thiếu (coins, stats)

2. **user page.html**: 
   - Kết nối Firebase, lắng nghe real-time user doc
   - Cập nhật số dư, đã nhận, đã sử dụng trên chip, popup, edit modal
   
3. **css.css**: 
   - Đã có style `.coin-effect` cho hiệu ứng xu

