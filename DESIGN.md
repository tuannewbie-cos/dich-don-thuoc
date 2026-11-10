# DESIGN.md — Quy Chuẩn Thiết Kế MedTech Siêu Tinh Gọn (Medexa Minimal Style)

Tài liệu này chuẩn hóa toàn bộ giao diện của **MediScan (Medexa Style)** theo thiết kế hiện đại nhất, tập trung tối đa vào **1 Nút Scan Trung Tâm** và **Cửa Sổ Chatbot Bác Sĩ Online**.

---

## 1. Triết Lý Thiết Kế (Modern MedTech Aesthetic)
- **Tối giản & Đẳng cấp:** Lấy cảm hứng trực tiếp từ giao diện Medexa iOS:
  - Nền app: Xám pha xanh dương siêu nhạt `bg-[#F8FAFC]` hoặc `bg-[#F5F7FB]`.
  - Thẻ card: Trắng tinh khiết `bg-white rounded-[28px] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100`.
  - Màu điểm nhấn: **Electric Medical Blue** (`#2563EB`, `#0284C7`).
- **Thanh Dock Điều Hướng Dưới Cùng (Floating Elevated Dock):**
  - Thanh tab bar màu trắng bo góc mềm mại.
  - **Ở CHÍNH GIỮA LÀ NÚT QUÉT SCAN TO NỔI BẬT:** Nút tròn màu xanh dương điện (`size-16`, `-top-5`), đổ bóng nhẹ `shadow-lg shadow-blue-500/35`. Bấm vào sẽ mở luồng Quét Đơn Viết Tay Bác Sĩ & Xem Bản Dịch.

---

## 2. Các Thành Phần Trọng Tâm Trên Giao Diện Chính

### 2.1. Thanh Tiêu Đề & Lời Chào (Header & Greeting)
- Top Bar:
  - Logo thương hiệu: Icon chữ thập y tế xanh + chữ **MediScan** (hoặc **Medexa**).
  - Phía bên phải: Avatar người dùng tròn, chuông thông báo (Bell with red dot) và **Nút Gọi Khẩn Cấp 115** màu đỏ/hồng nhẹ (`📞 115`).
- Tiêu đề phong cách Medexa:
  - Dòng trên: `Hi Nguyễn Văn An` (text-zinc-500).
  - Dòng dưới: `Good ` + `<Text className="text-blue-600 font-extrabold">Morning</Text>` (hoặc `Sức Khỏe ` + `<Text className="text-blue-600 font-extrabold">Hôm Nay</Text>`).
- Thanh Pills Lọc Ngang:
  - Pill màu đen active: `[Tất cả / Overview]` (nền đen `bg-zinc-900 text-white rounded-full`).
  - Pills phụ: `[Bản Dịch Đơn]`, `[Lịch Uống]`, `[Bác Sĩ]`.
  - Nút tìm kiếm tròn màu xanh dương nhạt bên phải `[🔍]`.

### 2.2. Khối Điểm Sức Khỏe & An Toàn Thuốc (Health Score Curve)
- Thẻ lớn cong bo tròn `rounded-[28px]`:
  - Tiêu đề: `Chỉ Số Đơn Thuốc: 95/100 ↑ 12% An toàn`.
  - Biểu đồ đường cong uốn lượn màu xanh thanh lịch (Vector curve line) thể hiện tiến trình điều trị và kiểm định an toàn dược học.

### 2.3. Hàng Thẻ Chỉ Số Kép (Two Metrics Row)
- Thẻ trái: `Nhịp Tim / 110 bpm / Bình thường` kèm đồ thị nhịp tim mini.
- Thẻ phải: `Cữ Thuốc / 3/4 Đã uống / Tốt` kèm biểu đồ cột mini.

### 2.4. Cửa Sổ Chatbot Bác Sĩ Online (AI Doctor Window)
- Nằm nổi bật ở nửa trên giao diện:
  - Thẻ `AI Health Insights / Bác Sĩ Trực Tuyến` với avatar Bác Sĩ / Robot 3D thân thiện.
  - Khung hội thoại trực tuyến giải thích đơn thuốc, kiêng cữ, nhắc lịch.
  - Bấm vào mở hộp thoại chat 2 chiều thời gian thực.

---

## 3. Luồng Quét & Bản Dịch Đơn Thuốc (Centered Scan Flow)
- Bấm vào **Nút Scan Tròn Trung Tâm**:
  - Mở camera scanner / bộ quét mô phỏng AI OCR chữ bác sĩ.
  - **Bản Dịch Đơn Thuốc (Prescription Translation):**
    - Chuyển dịch toàn bộ chữ viết tay bác sĩ sang văn bản chuẩn y khoa:
      - Bác sĩ kê đơn & Bệnh viện.
      - Chẩn đoán chi tiết.
      - Danh sách thuốc: Hoạt chất, hàm lượng, số lượng, liều dùng theo bữa.
      - Cảnh báo tương tác thuốc & kiêng khem.
    - **2 Nút Xuất File Bắt Buộc:**
      - **[📄 Xuất PDF]**: Sinh file PDF bản dịch rõ nét gửi in hoặc lưu trữ.
      - **[📝 Xuất DOCX]**: Sinh file Word bản dịch phục vụ chỉnh sửa.
    - **Nút Cấp Cứu 115:** Gọi trực tiếp tổng đài 115 khi bệnh nhân có biểu hiện sốc phản vệ hoặc nguy kịch.

---

## 4. Phân Công Đồng Bộ Trên 3 Nhánh
- **Nhánh `1` (Scan & Bản Dịch + Xuất PDF/DOCX):** Chịu trách nhiệm nút Scan trung tâm, màn hình quét OCR và xuất file PDF/DOCX.
- **Nhánh `2` (Giao Diện Chính Medexa Style):** Chịu trách nhiệm toàn bộ Dashboard màn hình chính theo hình mẫu (Header, Curve Card, Metrics, 115 Action).
- **Nhánh `3` (Cửa Sổ Chatbot Bác Sĩ Online & Hotline 115):** Chịu trách nhiệm Cửa sổ Chatbot Bác sĩ Online và kết nối khẩn cấp 115.
