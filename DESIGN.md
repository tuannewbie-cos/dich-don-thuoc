# DESIGN.md — Quy Chuẩn Ứng Dụng MediScan AI Siêu Tinh Gọn & Tốc Độ Cao

Tài liệu này quy chuẩn giao diện và kiến trúc kỹ thuật của **MediScan AI** sau khi tối ưu loại bỏ hoàn toàn hiện tượng lag/đơ trên iOS, tinh gọn màn hình chính và tích hợp Google AI Studio Gemini API.

---

## 1. Triết Lý Thiết Kế & Chống Lag (Zero-Lag Performance)
- **Tuyệt đối cấm lồng ghép nhiều Modal (No Nested Modals):** Không bao giờ mount nhiều thẻ `<Modal>` lồng nhau trên iOS vì UIKit sẽ xung đột và làm đơ toàn bộ touch event. Mọi modal (Scanner, Bản Dịch, 115 SOS) phải được quản lý đơn lẻ và mượt mà.
- **Phong cách thị giác (Apple MedTech Minimal):**
  - Nền app: Xám sáng `#F5F7FB`.
  - Thẻ card: Trắng tinh khiết `#FFFFFF`, bo góc `borderRadius: 26`, viền siêu mỏng `borderWidth: 1, borderColor: '#F1F5F9'`.
  - Màu điểm nhấn: **Electric Blue** (`#0066FE`), màu cấp cứu **Rose Red** (`#E11D48`).
- **Resilient Styling:** 100% linh kiện sử dụng đồng thời `StyleSheet.create` chuẩn React Native kết hợp NativeWind để đảm bảo không phụ thuộc vào cache của Metro bundler.

---

## 2. Cấu Trúc Các Màn Hình Chính

### 🏠 2.1. Màn Hình Trang Chủ (Home Screen — `app/(tabs)/index.tsx`)
- **Lời chào tinh gọn:** `Chào bạn,` $\rightarrow$ `Chúc bạn một ngày tốt lành` (Tuyệt đối không hiển thị tên riêng bệnh nhân).
- **Mô tả ứng dụng quét chữ bác sĩ:**
  - Khối Hero: Giới thiệu công nghệ AI Vision đọc chữ viết tay bác sĩ, dịch tự động sang văn bản chuẩn y khoa.
  - Nút bấm chính: **`[Quét Đơn Thuốc Ngay]`** (mở trực tiếp camera quét).
  - Quy trình 3 bước trực quan: Chụp đơn thuốc $\rightarrow$ AI tự động dịch $\rightarrow$ Xuất file PDF/DOCX & hỏi đáp AI.
- **Đã loại bỏ:** Không hiển thị nhịp tim, giấc ngủ, health score để tránh rối mắt và chống giật lag.

---

### 🔍 2.2. Nút Scan Tròn Trung Tâm (Bottom Floating Scan Button)
- Nằm ở chính giữa thanh Tab Bar: Nút tròn màu xanh dương điện (`#0066FE`), nổi cao (`marginTop: -22`), viền trắng 4px, đổ bóng xanh với chữ **Scan**.
- **Luồng hoạt động:**
  - Bấm Scan $\rightarrow$ Mở khung quét đơn thuốc $\rightarrow$ Quét xong **lập tức hiển thị Bản Dịch Đơn Thuốc** (Prescription Translation).
  - Đơn thuốc vừa quét tự động được lưu vào lịch sử.

---

### 📄 2.3. Mục Thứ 2: Bản Dịch & Lịch Sử Đơn Thuốc (`app/(tabs)/two.tsx`)
- **Khi chưa quét đơn nào (`scannedHistory.length === 0`):**
  - Hiển thị thông báo: **"Bạn chưa quét đơn thuốc nào"**.
  - Mô tả hướng dẫn và nút CTA: **`[Quét Đơn Thuốc Đầu Tiên]`**.
- **Sau khi đã quét:**
  - Hiển thị danh sách các đơn thuốc đã quét.
  - Bảng dịch chuẩn y khoa từng loại thuốc (hàm lượng, cách dùng theo cữ, cảnh báo tương tác).
  - **2 Nút Xuất File:** `[📄 Xuất PDF]` và `[📝 Xuất DOCX]`.
  - Nút gọi cấp cứu **`[📞 115]`**.

---

### 🤖 2.4. Mục Thứ 3: Trợ Lý AI (Google AI Studio Gemini Chatbot — `app/(tabs)/three.tsx`)
- **Giao diện chuẩn AI Chatbot hiện đại (phong cách ChatGPT):**
  - Khung bong bóng chat thời gian thực.
  - Gợi ý câu hỏi nhanh (Kiêng cữ, quên uống thuốc, buồn nôn, dị ứng...).
  - Thanh nhập tin nhắn bo tròn mềm mại ở dưới cùng.
- **Tích hợp Google AI Studio API:**
  - Tự động gọi mô hình `gemini-1.5-flash` qua endpoint Google AI Studio.
  - Nút biểu tượng chìa khóa `[🔑]` ở góc trên cho phép người dùng dán và tự động cập nhật API Key của riêng mình.
  - Tích hợp động cơ trả lời dự phòng thông minh (Offline Fallback Engine) đảm bảo không bao giờ bị đơ hay báo lỗi mạng khi demo.
