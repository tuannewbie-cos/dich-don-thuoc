# AGENTS.md — Quy Chuẩn Dự Án Mobile Hackathon Tích Hợp AI (Team 4 Người)

Tài liệu này là "Hiến pháp" của dự án. Mọi AI Assistant (Antigravity, Cursor, Copilot) và các thành viên trong team BẮT BUỘC phải đọc và tuân thủ các quy tắc dưới đây trước khi viết bất kỳ dòng code nào.

---

## 1. Tinh Thần Cốt Lõi (Hackathon Mindset - 5 Tiếng Tốc Chiến)
- **Tốc độ & Tính ổn định của Demo là ưu tiên số 1:** Ưu tiên code chạy được, giao diện mượt, không lỗi crash trên thiết bị thật.
- **Không over-engineering:** Không viết code trừu tượng phức tạp không cần thiết.
- **Zero-Config Onboarding:** Cả 4 thành viên kéo code về là chạy được ngay, không phụ thuộc vào việc phải copy file `.env` thủ công.
- **Resilient Data (Dữ liệu chống sập):** Mọi màn hình phải có **Mock Data Fallback**. Nếu mạng lag hoặc Supabase chưa kịp tạo bảng, App VẪN PHẢI HIỂN THỊ DỮ LIỆU ĐẸP ĐỂ DEMO.
- **Single Theme Rule (Phong Cách Sáng Sủa Kiểu Apple):** App sử dụng **1 Theme duy nhất: Apple Light Grouped Mode** (Nền xám nhạt dịu mắt, thẻ trắng tinh khiết, sạch sẽ, hiện đại). Tuyệt đối KHÔNG viết logic toggle theme để tránh lỗi màu và mất thời gian.

---

## 2. Tech Stack Cố Định (Approved Tech Stack)

| Hạng mục | Công nghệ & Thư viện quy định |
| :--- | :--- |
| **Framework** | React Native (Expo SDK mới nhất, Managed Workflow) |
| **Language** | TypeScript (Strict mode, cấm dùng `any`) |
| **Navigation** | **Expo Router** (File-based routing tại thư mục `app/`) |
| **Styling** | **NativeWind v4** (Tailwind CSS cho React Native) |
| **Design Language**| **Apple Fluid Minimal (iOS Native Look & Feel)** |
| **Icons** | `lucide-react-native` (Kích thước chuẩn: `size={20}` hoặc `size={24}`) |
| **Haptics** | `expo-haptics` (Phản hồi rung Taptic Engine chuẩn iOS) |
| **State Management** | **Zustand** (Client state đơn giản, lưu giỏ hàng, user profile, UI flags) |
| **Server State / Cache**| **TanStack Query (React Query)** (Quản lý fetching, caching, loading/error state) |
| **Backend & Database** | **Supabase** (`@supabase/supabase-js` + `expo-secure-store`) |
| **AI Integration** | **Supabase Edge Functions** (Lưu AI API Key an toàn trên Cloud Secrets) kèm Fallback |
| **Animations** | `react-native-reanimated` (Chỉ dùng cho micro-interactions mượt mà) |

> ⚠️ **Quy tắc cài thư viện:** AI không tự ý cài các thư viện lạ nếu trong stack đã có giải pháp tương đương. Nếu thật sự cần thư viện mới (ví dụ: Camera, Audio), AI phải gợi ý lệnh `npx expo install <package>` trước.

---

## 3. Cấu Trúc Thư Mục Chuẩn (Project Structure)

Mọi file phải được đặt đúng vị trí theo quy định sau:

```text
├── app/                  # Expo Router (Màn hình & Navigation)
│   ├── (auth)/           # Route nhóm xác thực: login, register (nếu cần)
│   ├── (tabs)/           # Màn hình chính dạng Bottom Tabs
│   ├── _layout.tsx       # Root layout (QueryClientProvider, AuthProvider)
│   └── index.tsx         # Direct Redirect logic
├── components/           # UI Components
│   ├── ui/               # Component hạt nhân chuẩn Apple (Button, Card, Input, Badge, InsetList, Skeleton)
│   └── features/         # Component riêng của từng tính năng
├── hooks/                # Custom React Hooks & TanStack Query hooks (e.g. useProducts.ts)
├── store/                # Zustand stores (e.g. useAuthStore.ts, useAppStore.ts)
├── services/             # API services & Database clients
│   ├── supabase.ts       # Khởi tạo Supabase client từ constants/config.ts
│   ├── ai.ts             # Service gọi AI (gọi Supabase Edge Function hoặc REST fallback)
│   └── api.ts            # Hàm fetch dữ liệu ứng dụng
├── mocks/                # Dữ liệu giả lập phục vụ Demo (mockData.ts)
├── types/                # TypeScript interfaces & Supabase generated types
└── constants/            # Cấu hình công khai (config.ts) & theme tokens
```

---

## 4. Quy Chuẩn Code Mobile (Mobile-Native Guidelines)

1. **Tuyệt đối KHÔNG dùng thẻ HTML Web:**
   - ❌ Cấm: `<div>`, `<span>`, `<p>`, `<button>`, `<img>`, `<a>`
   - ✅ Dùng: `<View>`, `<Text>`, `<Pressable>`, `<Image>`, `<Link>` (từ `expo-router`)
2. **Xử lý Tai thỏ & Nút Home (Safe Area):**
   - Luôn sử dụng `SafeAreaView` từ `react-native-safe-area-context` hoặc dùng `useSafeAreaInsets` cho header/footer.
3. **Xử lý Bàn phím & Danh sách cuộn:**
   - Màn hình có Input phải bọc trong `KeyboardAvoidingView` hoặc `ScrollView` với `keyboardShouldPersistTaps="handled"`.
   - Danh sách nhiều phần tử phải dùng `FlatList`, không dùng `map()` bên trong `ScrollView`.
4. **Trải nghiệm chạm & Haptics (Apple Direct Touch):**
   - Dùng `<Pressable>` kèm hiệu ứng co giãn vật lý `active:scale-[0.98] active:opacity-85` và kích hoạt qua utility an toàn (`triggerHaptic`) để không bị crash khi thiết bị không hỗ trợ Taptic engine.

---

## 5. Quy Chuẩn Xử Lý Dữ Liệu & Mock Data (Phục Vụ Demo)

Mọi service gọi API/Database phải tuân theo cấu trúc mẫu sau để không bao giờ bị crash app:

```typescript
// services/exampleService.ts
import { supabase } from './supabase';
import { MOCK_ITEMS } from '@/mocks/mockData';

export async function fetchItems() {
  try {
    const { data, error } = await supabase.from('items').select('*');
    if (error || !data || data.length === 0) {
      console.warn('Dùng Mock Data dự phòng:', error?.message);
      return MOCK_ITEMS; // Fallback ngay lập tức
    }
    return data;
  } catch (err) {
    console.warn('Lỗi mạng, fallback sang Mock Data');
    return MOCK_ITEMS;
  }
}
```

---

## 6. Cấu Hình Supabase Client Chuẩn Zero-Config (`constants/config.ts` & `services/supabase.ts`)

Để đảm bảo cả 4 thành viên **không cần tạo file `.env` ở máy tính** mà vẫn bảo mật đúng chuẩn:
- `url` và `anonKey` là thông tin **công khai an toàn** (Public Client Identifiers, bảo vệ bằng Row Level Security).
- Được lưu tại `constants/config.ts` và commit thẳng lên Git.

```typescript
// constants/config.ts (An toàn commit lên Git)
export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};
```

```typescript
// services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { SUPABASE_CONFIG } from '@/constants/config';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 7. Quy Tắc Phối Hợp Git & Commit
- Nhánh chính: `main` (Luôn phải ở trạng thái build được, không lỗi TS).
- Nhánh tính năng: `feat/<tên-thành-viên>-<tính-năng>` (VD: `feat-hiep-auth`, `feat-nam-dashboard`).
- Khi gặp lỗi TypeScript: Ưu tiên sửa đúng kiểu dữ liệu, không ép kiểu `as any`.

---

## 8. Quy Chuẩn Giao Diện: Apple Fluid Native Design System (Sáng Sủa & Tinh Tế)

Hệ thống giao diện được tối ưu chuẩn theo **Apple Human Interface Guidelines (HIG)**, mang đến cảm giác mượt mà, cao cấp như ứng dụng cài sẵn của iOS:

### 8.1. Hệ Thống Phân Tầng Bề Mặt (Surface Hierarchy)
- **Base Canvas (Nền chính toàn app):** Dùng màu xám dịu mắt `bg-[#F2F2F7]` (System Grouped Background của iOS). Tuyệt đối không dùng màu trắng toát `bg-white` làm nền màn hình vì sẽ làm chói mắt và mất chiều sâu.
- **Card / Group Surface (Thẻ nội dung):** Dùng màu trắng tinh khiết `bg-white` nổi bật trên nền xám, viền siêu mỏng `border border-slate-200/60` và đổ bóng nhẹ `shadow-sm`.
- **Primary Accent Tint (Màu điểm nhấn):**
  - Mặc định: **Apple System Blue** (`bg-blue-600 active:bg-blue-700 text-white`).
  - *Lưu ý lúc thi:* Nếu đề bài là Sức khỏe (Health) -> đổi sang Xanh Mint (`bg-emerald-600`); nếu là AI/Sáng tạo -> đổi sang Tím Indigo (`bg-indigo-600`). Chỉ cần thay đổi 1 class màu này.

### 8.2. Hệ Thống Chữ Chuẩn iOS (Typography Hierarchy)
- **Large Title (Tiêu đề đầu màn hình):** `text-3xl font-bold tracking-tight text-zinc-900 px-4 pt-2 pb-3` (Căn trái rộng rãi, phong cách Settings/App Store).
- **Group Section Header (Tiêu đề nhóm thẻ):** `text-xs font-semibold uppercase tracking-wider text-zinc-400 px-5 mb-2 mt-4`.
- **Body Text:** `text-base text-zinc-800 leading-relaxed`.
- **Subheadline / Caption:** `text-xs text-zinc-400 font-medium`.

### 8.3. Điều Khiển Native iOS (Controls & Form)
- **Switch Native:** Dùng thẻ `<Switch>` native của React Native (tự động có animation và độ nảy chuẩn của iOS):
  ```tsx
  <Switch trackColor={{ false: '#E2E8F0', true: '#34C759' }} ios_backgroundColor="#E2E8F0" value={value} onValueChange={setValue} />
  ```
- **Haptic Touch (Rung phản hồi Taptic Engine):**
  - Sử dụng utility bọc an toàn `triggerHaptic`:
  ```typescript
  import { triggerHaptic } from '@/utils/haptics';
  // Khi chạm nút:
  triggerHaptic('light');
  ```

### 8.4. Cấu Trúc Danh Sách Nhóm (iOS Inset Grouped List)
Mọi danh sách tính năng, cài đặt hoặc tùy chọn nên trình bày theo cấu trúc Inset Grouped của Apple:
```tsx
// Component mẫu Inset Grouped
<View className="mx-4 my-2 overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
  {/* Hàng 1 */}
  <Pressable 
    onPress={() => triggerHaptic('light')}
    className="flex-row items-center justify-between border-b border-slate-100 p-4 active:bg-slate-50 active:opacity-80"
  >
    <View className="flex-row items-center gap-3">
      <View className="size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Sparkles size={18} color="#2563EB" />
      </View>
      <Text className="text-base font-medium text-zinc-800">Tính năng AI</Text>
    </View>
    <ChevronRight size={18} color="#94A3B8" />
  </Pressable>
</View>
```

### 8.5. Quy Chuẩn Nút Bấm & Bo Góc (Geometry & Feedback)
- **Nút Bấm Chính (Primary CTA Button):**
  ```tsx
  <Pressable 
    onPress={() => { triggerHaptic('medium'); handlePress(); }}
    className="flex-row items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 px-6 shadow-sm shadow-blue-500/20 transition-transform active:scale-[0.98] active:opacity-90"
  >
    <Text className="text-base font-semibold text-white">Bắt đầu ngay</Text>
  </Pressable>
  ```
- **Bo góc (Continuous Curves - Squircles):**
  - Khối chứa / Thẻ lớn (Cards): `rounded-3xl` (24px).
  - Nút bấm & Ô nhập liệu (Buttons & Inputs): `rounded-2xl` (16px).
  - Huy hiệu / Tag (Badges): `rounded-full px-3 py-1 bg-slate-100 text-xs font-medium text-slate-600`.
- **Ô Nhập Liệu (Inputs):** `bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500`.

---

## 9. Quy Chuẩn Tích Hợp AI (AI Engine & Bảo Mật Serverless)

- **Kiến trúc Serverless Bảo Mật (Zero-Config cho Mobile):** 
  - `GEMINI_API_KEY` được bảo vệ an toàn trên **Supabase Cloud Secrets**, tuyệt đối KHÔNG lưu trong mã nguồn client.
  - App Mobile gọi tính năng AI thông qua Supabase Edge Function hoặc REST fallback có Timeout:
    ```typescript
    // services/ai.ts
    import { supabase } from './supabase';
    import { MOCK_ITEMS } from '@/mocks/mockData';

    export async function askAI(userPrompt: string) {
      try {
        const { data, error } = await supabase.functions.invoke('chat-ai', {
          body: { prompt: userPrompt },
        });

        if (error || !data) {
          console.warn('Lỗi gọi Edge Function, kích hoạt Mock Data:', error);
          return MOCK_ITEMS;
        }
        return data;
      } catch (err) {
        console.warn('Mạng lag, fallback ngay sang Mock Data');
        return MOCK_ITEMS;
      }
    }
    ```
- **Quy tắc ép kiểu dữ liệu AI (Structured JSON Output):**
  - Mọi Prompt gửi lên AI PHẢI yêu cầu: `"Respond strictly in raw JSON format matching this schema: { ... }. Do not include markdown codeblocks like \`\`\`json."`
  - Nếu parse lỗi hoặc API timeout quá 8 giây, lập tức fallback sang `mocks/mockData.ts`.
- **Trải nghiệm chờ AI (UX Latency):**
  - Nút bấm kích hoạt AI phải hiển thị trạng thái Loading rõ ràng (`ActivityIndicator` hoặc nút bị disable).
  - Vùng hiển thị kết quả AI phải có Skeleton loader giả lập chuyển động trong khi đang chờ kết quả.

---

## 10. Giao Thức Khởi Động: Từ Khóa "hackathon"
Khi người dùng mở chat và nhắc đến từ khóa **"hackathon"**:
1. **Nhắc lại Quy trình Phối hợp 2 màn hình song song cực nhanh:**
   - Bạn chỉ cần bảo: *"Clone repo [link] về, nhiệm vụ của tôi là làm màn hình [tính năng X]"*.
   - Tôi sẽ tự clone, tạo nhánh `feat/<tên-thành-viên>-<tính-năng>`, dựng khung chuẩn theo `AGENTS.md`.
   - Bạn gõ prompt yêu cầu → Tôi thi công & kiểm tra typecheck → Bạn quan sát code cập nhật trên IDE và test trực tiếp trên Expo Go.
2. **Điểm lại 5 nguyên tắc cốt lõi của "Hiến pháp" AGENTS.md:**
   - Ưu tiên tính ổn định demo số 1, không over-engineering.
   - Cấm 100% thẻ HTML Web (`<div>`, `<p>`, `<button>`), chỉ dùng `<View>`, `<Text>`, `<Pressable>`, `<SafeAreaView>`, `FlatList`.
   - Tech stack: React Native Expo SDK mới nhất, TypeScript strict, NativeWind v4, `lucide-react-native`, Zustand, Supabase.
   - Dữ liệu chống sập (Resilient Data): 100% màn hình phải có Mock Data Fallback trong `mocks/mockData.ts`.
   - Không gây xung đột Git: Chỉ code trong `components/features/<tên-tính-năng>/`, không sửa file chung.
3. **Sẵn sàng nhận Link Repo và Tên Task** để bắt tay vào việc ngay.
