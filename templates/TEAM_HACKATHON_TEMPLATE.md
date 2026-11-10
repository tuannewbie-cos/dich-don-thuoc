# TEAM HACKATHON REPOSITORY TEMPLATE (TheNerdSqu4d / Team 4 Người)

Tài liệu này là bản đặc tả cấu trúc chuẩn (Single Source of Truth) cho repository template của nhóm:
`https://github.com/TheNerdSqu4d/expo-hackathon-template`

---

## 1. Cấu Trúc Khung Dự Án (Folder Architecture)

```text
├── app/                  # Expo Router (File-based navigation)
│   ├── (auth)/           # Route xác thực (nếu cần)
│   ├── (tabs)/           # 3 tab chính: Trang Chủ, Tính Năng, Trợ Lý AI
│   │   ├── _layout.tsx   # Tab bar layout + Root Modals
│   │   ├── index.tsx     # Tab 1: Trang Chủ (Hero + Action CTA)
│   │   ├── two.tsx       # Tab 2: Tính năng cốt lõi / Records
│   │   └── three.tsx     # Tab 3: Trợ Lý AI
│   ├── _layout.tsx       # Root Layout: SafeAreaProvider, ThemeProvider, ErrorBoundary
│   ├── +not-found.tsx    # 404 Fallback screen
│   └── +html.tsx         # Web Root
├── components/           # UI Components
│   ├── ui/               # Thành phần cơ sở: Button, Card, InsetList, Dialog
│   ├── navigation/       # CustomBottomTabBar (Haptics an toàn, không deadlock)
│   └── features/         # Thành phần tính năng độc lập (Zero-conflict)
│       ├── home/
│       ├── scanner/
│       ├── records/
│       └── companion/
├── constants/            # Cấu hình Zero-Config
│   ├── config.ts         # Public Client Identifiers (Supabase, App Config)
│   └── Colors.ts         # Palette màu Apple Light
├── mocks/                # Dữ liệu giả lập (Resilient Data Fallback)
│   └── mockData.ts       # Mock items đảm bảo offline 100% không crash
├── services/             # Giao tiếp API & Backend
│   ├── supabase.ts       # Supabase Client khởi tạo an toàn
│   ├── gemini.ts         # AI Service tích hợp Timeout & Fallback thông minh
│   └── ai.ts             # Supabase Edge Functions caller
├── store/                # Zustand client state
├── types/                # TypeScript strict definitions
├── utils/                # Tiện ích chung
│   └── haptics.ts        # Trigger rung an toàn chống crash
├── .env.example          # Mẫu biến môi trường EXPO_PUBLIC_
├── AGENTS.md             # Hiến pháp điều phối Agent & Dev
├── babel.config.js       # NativeWind Babel preset
└── tailwind.config.js    # Cấu hình Tailwind CSS
```

---

## 2. Quy Chuẩn Biến Môi Trường (Zero-Config + Optional Override)

Tất cả biến môi trường được gọi trong React Native Expo PHẢI có tiền tố `EXPO_PUBLIC_`:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GEMINI_API_KEY`

Nếu chưa có `.env`, app luôn tự động đọc giá trị mặc định từ `constants/config.ts` để demo không bao giờ gián đoạn.

---

## 3. Checklist Khởi Động Cho Mỗi Thành Viên (5 Phút Setup)

1. Clone repo:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   npm install
   ```
2. Tạo nhánh làm việc:
   ```bash
   git checkout -b feat/<ten-thanh-vien>-<tinh-nang>
   ```
3. Khởi chạy app với cache sạch:
   ```bash
   npx expo start -c
   ```
4. Kiểm tra TypeScript:
   ```bash
   npx tsc --noEmit
   ```
