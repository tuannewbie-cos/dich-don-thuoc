import { create } from 'zustand';
import { SymptomLog } from '@/types';
import { MOCK_SYMPTOM_LOGS } from '@/mocks/mockData';
import { callGeminiAI } from '@/services/gemini';
import * as Haptics from 'expo-haptics';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    sender: 'ai',
    text: 'Xin chào bạn! Tôi là Trợ Lý AI MediScan. Tôi có thể giúp bạn giải đáp thắc mắc về đơn thuốc, cách uống thuốc, các kiêng cữ cần thiết hoặc phản ứng phụ sau khi uống thuốc. Bạn cần tôi hỗ trợ điều gì hôm nay?',
    time: '08:30',
  },
];

interface CompanionState {
  logs: SymptomLog[];
  chatMessages: ChatMessage[];
  isAiTyping: boolean;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  addSymptomLog: (
    feeling: 'well' | 'moderate' | 'unwell',
    symptoms: string[],
    notes?: string
  ) => void;
  sendChatMessage: (text: string) => Promise<void>;
  resetDefault: () => void;
}

export const useCompanionStore = create<CompanionState>((set, get) => ({
  logs: MOCK_SYMPTOM_LOGS,
  chatMessages: DEFAULT_MESSAGES,
  isAiTyping: false,
  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',

  addSymptomLog: (feeling, symptoms, notes) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const alertLevel: 'low' | 'medium' | 'high' =
      feeling === 'unwell' ? 'high' : feeling === 'moderate' ? 'medium' : 'low';

    const newLog: SymptomLog = {
      id: `sym_${Date.now()}`,
      date: new Date().toISOString(),
      feeling,
      symptoms,
      notes,
      alertLevel,
    };

    set((state) => ({
      logs: [newLog, ...state.logs],
    }));
  },

  setGeminiApiKey: (key: string) => {
    set({ geminiApiKey: key });
  },

  sendChatMessage: async (text: string) => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: timeStr,
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isAiTyping: true,
    }));

    // Call Gemini API in background without blocking UI
    try {
      const apiKey = get().geminiApiKey;
      const aiReply = await callGeminiAI(text.trim(), apiKey);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, aiMsg],
        isAiTyping: false,
      }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      set({ isAiTyping: false });
    }
  },

  resetDefault: () => {
    set({
      chatMessages: DEFAULT_MESSAGES,
      isAiTyping: false,
    });
  },
}));
