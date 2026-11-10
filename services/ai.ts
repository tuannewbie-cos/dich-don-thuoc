import { supabase } from './supabase';
import { MOCK_ITEMS } from '@/mocks/mockData';
import { MockItem } from '@/types';

/**
 * Gọi tính năng AI thông qua Supabase Edge Function
 * Tự động kích hoạt cơ chế Fallback sang Mock Data nếu mạng lag hoặc Edge Function chưa deploy
 */
export async function askAI(userPrompt: string): Promise<MockItem[]> {
  try {
    const { data, error } = await supabase.functions.invoke('chat-ai', {
      body: { prompt: userPrompt },
    });

    if (error || !data) {
      console.warn('⚠️ Lỗi gọi Edge Function hoặc chưa deploy, kích hoạt Mock Data:', error?.message);
      return MOCK_ITEMS;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ Lỗi kết nối mạng, tự động chuyển sang Mock Data dự phòng:', err);
    return MOCK_ITEMS;
  }
}
