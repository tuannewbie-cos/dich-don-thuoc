import { supabase } from './supabase';
import { MOCK_ITEMS } from '@/mocks/mockData';
import { MockItem } from '@/types';
import { SUPABASE_CONFIG } from '@/constants/config';

/**
 * Gọi tính năng AI thông qua Supabase Edge Function
 * Tự động kích hoạt cơ chế Fallback sang Mock Data nếu mạng lag hoặc Edge Function chưa deploy
 */
export async function askAI(userPrompt: string): Promise<MockItem[]> {
  // Nếu chưa cấu hình Supabase URL thật, fallback ngay lập tức không tốn thời gian chờ
  if (
    !SUPABASE_CONFIG.url ||
    SUPABASE_CONFIG.url.includes('placeholder') ||
    !SUPABASE_CONFIG.anonKey ||
    SUPABASE_CONFIG.anonKey.includes('placeholder')
  ) {
    return MOCK_ITEMS;
  }

  try {
    // Timeout 8 giây an toàn
    const invokePromise = supabase.functions.invoke('chat-ai', {
      body: { prompt: userPrompt },
    });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase Edge Function timeout after 8s')), 8000)
    );

    const { data, error } = await Promise.race([invokePromise, timeoutPromise]);

    if (error || !data) {
      console.warn('⚠️ Lỗi gọi Edge Function, kích hoạt Mock Data:', error?.message);
      return MOCK_ITEMS;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ Lỗi kết nối Edge Function, tự động chuyển sang Mock Data dự phòng');
    return MOCK_ITEMS;
  }
}
