# DESIGN.md — Hệ Thống Thiết Kế UI Chuẩn Cho Toàn Dự Án (Apple Fluid Native)

Tài liệu này quy chuẩn toàn bộ Design System của ứng dụng **MediScan AI**. Mọi thành viên và các agent thi công nhánh **`1`**, **`2`**, và **`3`** **BẮT BUỘC TUÂN THỦ 100%** để đảm bảo ứng dụng có giao diện đồng nhất, cao cấp chuẩn Apple iOS.

---

## 1. Triết Lý Thiết Kế (Apple Fluid Native)
- **Phong cách:** Apple Light Grouped Mode (tương tự Apple Health, Settings, App Store).
- **Cảm giác tiếp xúc (Direct Touch):** Nút bấm và thẻ tương tác phải có độ nảy vật lý (`active:scale-[0.98] active:opacity-90`) và phản hồi xúc giác Taptic Engine thông qua `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`.
- **Phân tầng bề mặt (Surface Hierarchy):**
  - **Base Background:** `#F2F2F7` (System Grouped Background - xám nhạt dịu mắt). Tuyệt đối **không** dùng `#FFFFFF` làm nền màn hình.
  - **Cards & Surfaces:** `#FFFFFF` (Trắng tinh khiết) nổi trên nền xám, bo góc `rounded-3xl` (24px), viền mỏng `border border-slate-200/60`, đổ bóng nhẹ `shadow-sm`.

---

## 2. Bảng Màu Chuẩn (Color Palette & Tokens)

| Token | Class Tailwind | Mã HEX / Công Dụng |
| :--- | :--- | :--- |
| **Canvas** | `bg-[#F2F2F7]` | `#F2F2F7` — Nền chính toàn bộ app |
| **Card Surface** | `bg-white` | `#FFFFFF` — Bề mặt thẻ, container |
| **Card Border** | `border-slate-200/60` | Viền siêu mỏng tạo chiều sâu |
| **Primary Accent** | `bg-blue-600 text-blue-600` | `#2563EB` — Apple System Blue (CTA, tab active, trạng thái chính) |
| **Accent Light** | `bg-blue-50 text-blue-700` | Nền icon / badge công nghệ cao |
| **Health / Success** | `bg-emerald-50 text-emerald-700 border-emerald-200/60` | Đã uống thuốc, đơn thuốc đã thẩm định, trạng thái an toàn |
| **Warning / Alert** | `bg-amber-50 text-amber-700 border-amber-200/60` | Cảnh báo tương tác thuốc, lưu ý kiêng khem, tác dụng phụ |
| **Danger / Stop** | `bg-rose-50 text-rose-700 border-rose-200/60` | Thuốc chống chỉ định, dị ứng nặng, báo cáo triệu chứng xấu |
| **Title Text** | `text-zinc-900` | Tiêu đề lớn, chữ đậm nổi bật |
| **Body Text** | `text-zinc-800` / `text-zinc-700` | Nội dung thuốc, hướng dẫn liều dùng |
| **Caption / Muted** | `text-zinc-400` / `text-zinc-500` | Ngày tháng, tên bệnh viện, số liều |

---

## 3. Hệ Thống Chữ (Typography Hierarchy)

```tsx
// 1. Tiêu đề lớn đầu màn hình (Large Title - iOS Style)
<View className="px-5 pt-3 pb-4">
  <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 self-start mb-1.5">
    <Sparkles size={13} color="#2563EB" />
    <Text className="text-xs font-semibold text-blue-700">TÊN PHÂN HỆ</Text>
  </View>
  <Text className="text-3xl font-bold tracking-tight text-zinc-900">Tiêu Đề Màn Hình</Text>
  <Text className="text-sm text-zinc-500 mt-1">Mô tả ngắn gọn công dụng cho người dùng</Text>
</View>

// 2. Tiêu đề nhóm danh sách (Group Section Header)
<Text className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-5 mb-2 mt-4">
  TÊN NHÓM DỮ LIỆU
</Text>
```

---

## 4. Quy Chuẩn Thẻ Thao Tác (Inset Grouped Card)

Mọi danh sách hoặc khối chức năng đều phải bọc trong khối Card tiêu chuẩn:
```tsx
<View className="mx-4 my-2 overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
  {/* Header Thẻ */}
  <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
    <View className="flex-row items-center gap-3">
      <View className="size-10 items-center justify-center rounded-2xl bg-blue-50">
        <Pill size={20} color="#2563EB" />
      </View>
      <View>
        <Text className="text-base font-semibold text-zinc-900">Tên Thẻ</Text>
        <Text className="text-xs text-zinc-400">Thông tin phụ</Text>
      </View>
    </View>
    <View className="rounded-full bg-emerald-50 px-2.5 py-1">
      <Text className="text-xs font-semibold text-emerald-700">Trạng Thái</Text>
    </View>
  </View>
</View>
```

---

## 5. Quy Chuẩn Nút Bấm Chính (Primary CTA Button)

```tsx
<Pressable
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleAction();
  }}
  className="flex-row items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 px-6 shadow-sm shadow-blue-500/25 active:scale-[0.98] active:opacity-90"
>
  <Text className="text-base font-semibold text-white">Bắt đầu hành động</Text>
</Pressable>
```

---

## 6. Quy Định Chi Tiết Từng Phân Hệ (3 Nhánh)

### 🩺 Nhánh 1: Quét Đơn Thuốc Bác Sĩ (AI PrescriptScan) — `app/(tabs)/index.tsx`
- **Mục tiêu:** Quét chữ viết tay bác sĩ, khử nhiễu ảnh, bóc tách tên thuốc, hàm lượng, số lượng, liều dùng theo cữ.
- **Tính năng bắt buộc:**
  - Vùng ngắm chụp OCR có viền đo góc và quét tia laser mô phỏng.
  - **Quick Presets Demo:** 2 đơn thuốc mẫu (Viêm họng cấp & Tim mạch huyết áp) phục vụ ban giám khảo test ngay.
  - Khối Cảnh báo Tương tác & Dị ứng thuốc (Safety Alert Banner) màu hổ phách/đỏ nổi bật.
  - Nút CTA chuyển đơn sang Lịch uống thuốc.

### ⏰ Nhánh 2: Lịch Uống Thuốc Thông Minh (Smart MedSchedule) — `app/(tabs)/two.tsx`
- **Mục tiêu:** Tự động đồng bộ từ đơn thuốc vừa quét, theo dõi tuân thủ liều dùng theo ngày.
- **Cấu trúc giao diện:**
  - **Thanh đo tiến độ tuân thủ (Daily Adherence Streak):** Tỷ lệ % cữ thuốc đã uống trong ngày (ví dụ: `2/4 cữ đã hoàn thành - 50%`).
  - **Lọc theo 4 khung giờ:** Tab lọc ngang [Tất cả] [Sáng 08:00] [Trưa 12:30] [Chiều 18:30] [Tối 21:30].
  - **Hàng thuốc tương tác:** Thẻ thuốc với nút Checkbox tròn to; bấm vào kích hoạt `Haptics` và chuyển trạng thái "Đã uống lúc 08:15" sang màu xanh lá nhạt (`bg-emerald-50`).
  - Nút thêm nhanh cữ thuốc hoặc xem lại đơn gốc từ Nhánh 1.

### 💬 Nhánh 3: Trợ Lý Đồng Hành & Báo Cáo Triệu Chứng (Health Companion) — `app/(tabs)/three.tsx`
- **Mục tiêu:** Bám sát sức khỏe bệnh nhân sau khi uống thuốc, phòng ngừa biến chứng.
- **Cấu trúc giao diện:**
  - **Nhật ký cảm giác nhanh (One-tap Symptom Logger):** 3 nút chọn nhanh biểu tượng cảm xúc [Khỏe re] [Hơi mệt] [Bất thường].
  - **Thẻ Triệu chứng phổ biến:** Chips chọn nhanh [Đắng miệng] [Buồn nôn] [Chóng mặt] [Ngứa/Phát ban] [Đau bụng].
  - **Khung Hỏi Đáp AI Trợ Lý Dược Sĩ:** Giải đáp thắc mắc về đơn thuốc bằng tiếng Việt đời thường (VD: "Uống thuốc này có kiêng rượu bia không?", "Quên uống thì làm thế nào?").
  - **Hỗ trợ Khẩn Cấp (SOS Banner):** Nút gọi nhanh hotline y tế 115 hoặc gửi báo cáo phản ứng thuốc cho bác sĩ điều trị.

---

## 7. Nguyên Tắc Cốt Lõi Cho Mọi Nhánh
1. **Zero-Crash Rule:** 100% màn hình phải có mock data dự phòng trong `mocks/mockData.ts` để demo không phụ thuộc mạng.
2. **Strict TypeScript:** Chạy `npx tsc --noEmit` phải đạt 0 lỗi trước khi commit.
3. **Icons:** Chỉ dùng từ `lucide-react-native` với `size={20}` hoặc `size={24}`.
