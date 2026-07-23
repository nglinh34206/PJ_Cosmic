# Sửa lỗi nút "Tiếp tục với tư cách Khách"

## Các bước thực hiện:

- [x] **Bước 1**: Thêm flag `window.__guestActive = false` vào biến toàn cục ✅
- [x] **Bước 2**: Sửa `onAuthStateChanged` — kiểm tra `window.__guestActive` trước khi ẩn app ✅
- [x] **Bước 3**: Cập nhật `enterAsGuest()` — set `__guestActive = true`, render UI đầy đủ qua `loadUserProfile()` ✅
- [x] **Bước 4**: Sửa `handleLogout()` — reset `__guestActive`, chỉ gọi `signOut()` nếu có user ✅
- [x] **Bước 5**: ✅ **HOÀN TẤT**

