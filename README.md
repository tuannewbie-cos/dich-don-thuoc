# MediScan AI — Trợ Lý Nhận Diện Đơn Thuốc Bác Sĩ & Bám Sát Người Bệnh

> **Hackathon MVP**: Giải pháp AI nhận diện chữ viết tay bác sĩ, ngăn ngừa sai sót y khoa và đồng hành cùng người bệnh tuân thủ phác đồ điều trị.

---

## 🎯 3 Tính Năng Cốt Lõi & Phân Chia Nhánh (Branches 1, 2, 3)

| Nhánh Git | Tên Tính Năng | Mô Tả Nghiệp Vụ Cốt Lõi |
| :--- | :--- | :--- |
| **`1`** | **AI Rx OCR & Safety Check** | Quét ảnh chụp đơn thuốc viết tay bác sĩ bằng AI OCR, bóc tách tên thuốc, liều lượng, cách dùng và kiểm tra cảnh báo tương tác thuốc/dị ứng. |
| **`2`** | **Smart MedSchedule** | Tự động đồng bộ đơn thuốc thành lịch uống thuốc thông minh theo 4 khung giờ (Sáng / Trưa / Chiều / Tối), theo dõi tiến độ tuân thủ liều dùng. |
| **`3`** | **Health Companion & Side-Effect Monitor** | Trợ lý giải thích đơn thuốc bằng ngôn ngữ dễ hiểu, ghi nhận phản ứng phụ sau khi uống thuốc và gửi cảnh báo sớm cho người thân/bác sĩ. |

---

## 🛠 Tech Stack Cố Định
- **Framework:** React Native (Expo SDK 58, Expo Router)
- **Language:** TypeScript Strict Mode
- **Styling:** NativeWind v4 (Tailwind CSS)
- **Icons:** `lucide-react-native`
- **State & Server:** Zustand + TanStack Query
- **Backend/Storage:** Supabase & Expo SecureStore
- **Demo Resilience:** Mock Data Fallback 100% trong `mocks/mockData.ts`
