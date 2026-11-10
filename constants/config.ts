/**
 * Cấu hình hệ thống Zero-Config (An toàn commit lên Git)
 * Khi bạn tạo project trên supabase.com, chỉ cần dán URL và Anon Key vào đây.
 */
export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
};

export const APP_CONFIG = {
  appName: 'Hackathon Mobile AI',
  defaultTheme: 'light', // Apple Light Grouped Mode
};
