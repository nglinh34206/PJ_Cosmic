# PJ_Cosmic
# 🌌 THE COSMIC PROJECT  
**No One Fly Alone – NO F.A**
## 📌 Giới thiệu
**Cosmic** là một hệ thống học tập & kết nối nội bộ dành cho tập thể lớp (~60 sinh viên), được xây dựng với mục tiêu:

> **Giúp cả lớp qua môn – và không ai bị bỏ lại phía sau.**

Cosmic không hướng đến việc tạo ra người giỏi nhất, mà tập trung **giảm gánh nặng học tập âm thầm**:  
- không phải tự mò tài liệu  
- không phải gánh nhóm một mình  
- không bị cô lập khi gặp khó  

Triết lý cốt lõi:
> *“Làm tốt những điều nhỏ nhất. Lắng nghe nhu cầu, giải quyết thầm lặng.”*

## 🧭 Định vị & Thông điệp
- **Key Message:** *No one fly alone*  
- **Bản chất:** Cosmic là người đồng hành đáng tin cậy trong hành trình học tập, không phô trương, không ép buộc.

---

## 🏗️ Cấu trúc hệ thống (Core Modules)

### 🏛️ Module 1: Resource Hub – Kho Tri Thức
**Vai trò:** Trái tim của hệ thống  

**Tính năng:**
- Upload tài liệu đa nguồn (File qua Supabase hoặc Google Drive link)
- Quy trình kiểm duyệt:  
  `User Upload → Pending → Admin/Ops Duyệt → Public`
- **Split View:** Xem tài liệu & Chat/SOS song song
- Tracking hành vi: thời gian đọc, số lượt mở

---

### 🔋 Module 2: Energy Cabin – Khoang Cá Nhân
**Vai trò:** Động cơ thúc đẩy (Gamification)

**Tính năng:**
- Hồ sơ phi hành gia: Tên, MSV, Rank, Energy Bar
- Cộng điểm realtime theo hành vi (đọc, upload, chat, login)
- Tracking: tần suất đăng nhập, retention

---

### 📡 Module 3: The Bridge – Đài Chỉ Huy (Admin/Ops)
**Vai trò:** Bộ não điều hành hệ thống  

**Tính năng:**
- Radar: theo dõi tín hiệu SOS realtime
- Ops Center: duyệt tài liệu Pending
- Admin Inbox: quản lý đề xuất & broadcast

---

### 🌌 Module 4: The Void & SOS – Mạng Lưới Kết Nối
**Vai trò:** Hệ thần kinh cảm xúc của hệ thống

**Tính năng:**
- Void Chat: chat chung / ẩn danh
- SOS Network: nút hỗ trợ khẩn cấp → cộng đồng ứng cứu ngay

---

## 🎮 Hệ thống Gamification (4 Trụ Cột)

| Pillar | Hành vi | Ý nghĩa | Archetype |
|------|-------|-------|---------|
| NAVIGATOR | Đọc tài liệu (>60s) | Chuyên cần | Probe → Horizon |
| GUARDIAN | Upload / Báo lỗi | Cống hiến | Dust → Galaxy |
| DIPLOMAT | Chat / SOS | Kết nối | Ping → Spectrum |
| VOYAGER | Login hàng ngày | Nhiệt huyết | Second → Eternity |

**Visual Tiers:**  
Standard → Neon Pulse → Nebula Flow → Horizon  
Special:
- **Genesis (Staff):** Heartbeat  
- **Supernova (Commander):** Burning Core  

> Rank **không phản ánh học lực** – Rank phản ánh mức độ **gánh trách nhiệm cho tập thể**.

---

## 📊 Data Intelligence & Tracking
Cosmic sử dụng **Google Analytics 4 + Telemetry Code** để hỗ trợ vận hành:

- **WHEN:** active_hour, day_of_week → xác định giờ vàng
- **WHAT:** search_term, dead_search → biết lớp đang thiếu gì
- **WHO:** user_role, user_rank → tìm MVP để ghi nhận

(Toàn bộ dữ liệu này **chỉ dành cho Admin/Ops**)

---

## 🧠 Chiến lược Marketing Nội Bộ (Silent Marketing)
Cosmic **không marketing để thuyết phục**, mà để **chứng minh giá trị**.

Nguyên tắc:
- Không CTA  
- Không kêu gọi  
- Không giải thích dài  

Chỉ xuất hiện **đúng lúc người học đang cần**, rồi rút lui.

Thông điệp ngầm:
> *Ở đây, không ai bị ép phải giỏi – nhưng cũng không ai bị bỏ mặc.*

---

## 👻 Operation “Ghost Signal” – Seeding The Void
Chiến lược kích hoạt chat ẩn danh:
- Seed bằng tài khoản phụ (rank thấp)
- Đánh vào:
  - Nỗi đau chung
  - Sự tò mò
  - Xác nhận hệ thống SOS hoạt động thật

Mục tiêu:  
> *Xóa bỏ cảm giác “App này chắc chả ai dùng đâu”*

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend:** HTML5 / CSS3 (Neon Space Theme), Vanilla JavaScript
- **Authentication:** Firebase Auth (Login bằng MSV)
- **Database:** Firebase Firestore (NoSQL)
- **File Storage:** Supabase Storage
- **Analytics:** Google Analytics 4 (Custom Events)

---

## 🚀 Mục tiêu dự án
- Tạo “ngôi nhà chung” cho tập thể lớp
- Giảm gánh nặng học tập cá nhân
- Dịch chuyển từ cạnh tranh → tiến bộ tập thể

> **Cosmic được xây dựng để cả lớp đi lên – không phải để một người nổi bật.**

---

## 👥 Đối tượng sử dụng
Sinh viên:
- Kẹt môn
- Quá tải
- Đi làm song song
- Gánh nhóm trong im lặng
- Cần ôn tập cấp tốc

---

## 📅 Launch
- **Thời điểm:** 08/03  
- **Thông điệp duy nhất:**  
  > *“Cái này làm để anh em đỡ khổ.”*

---

## 🛰️ Ghi chú
Cosmic là dự án **phi thương mại**, phục vụ mục tiêu học tập & cộng đồng nội bộ.

---

🌠 *No one fly alone.*
