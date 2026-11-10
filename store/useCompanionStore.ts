import { create } from 'zustand';
import { SymptomLog } from '@/types';
import { MOCK_SYMPTOM_LOGS } from '@/mocks/mockData';
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
    text: 'Xin chào Nguyễn Văn An! Tôi là Trợ Lý Dược Sĩ AI MediScan. Tôi đã nắm rõ đơn thuốc và lịch uống của bạn. Bạn có thắc mắc gì về cách uống, tác dụng phụ hay cần tư vấn triệu chứng không?',
    time: '08:35',
  },
  {
    id: 'msg_02',
    sender: 'user',
    text: 'Uống Clarithromycin có bị đắng miệng không bác sĩ?',
    time: '08:36',
  },
  {
    id: 'msg_03',
    sender: 'ai',
    text: 'Vị đắng miệng là phản ứng phụ rất phổ biến và lành tính của kháng sinh Clarithromycin (do hoạt chất bài tiết một phần qua nước bọt). Bạn yên tâm nhé! Bạn có thể uống nhiều nước lọc, súc miệng sau uống hoặc ngậm kẹo bạc hà không đường để giảm bớt cảm giác này.',
    time: '08:36',
  },
];

interface CompanionState {
  logs: SymptomLog[];
  chatMessages: ChatMessage[];
  isAiTyping: boolean;
  addSymptomLog: (
    feeling: 'well' | 'moderate' | 'unwell',
    symptoms: string[],
    notes?: string
  ) => void;
  sendChatMessage: (text: string) => void;
  resetDefault: () => void;
}

export const useCompanionStore = create<CompanionState>((set, get) => ({
  logs: MOCK_SYMPTOM_LOGS,
  chatMessages: DEFAULT_MESSAGES,
  isAiTyping: false,

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

  sendChatMessage: (text) => {
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

    // Generate intelligent medical response based on user input
    setTimeout(() => {
      let reply =
        'Cảm ơn bạn đã chia sẻ. Đơn thuốc của bạn hiện được thiết kế an toàn. Nếu các triệu chứng kéo dài hoặc nặng hơn, bạn nên liên hệ trực tiếp với bác sĩ kê đơn hoặc gọi hotline y tế 115.';
      const lower = text.toLowerCase();

      if (lower.includes('quên') || lower.includes('bỏ lỡ')) {
        reply =
          'Nếu quên liều thuốc: Hãy uống ngay khi nhớ ra. Tuy nhiên nếu đã gần đến giờ của liều kế tiếp (dưới 2-3 tiếng), hãy bỏ qua liều quên và uống liều tiếp theo đúng lịch. Tuyệt đối không uống gấp đôi liều!';
      } else if (lower.includes('cà phê') || lower.includes('rượu') || lower.includes('bia') || lower.includes('kiêng')) {
        reply =
          'Khuyến cáo y khoa: Tuyệt đối tránh rượu bia trong suốt đợt dùng kháng sinh vì sẽ gây quá tải gan và giảm tác dụng thuốc. Cà phê và trà xanh nên uống cách xa thời điểm uống thuốc ít nhất 2 giờ.';
      } else if (lower.includes('dị ứng') || lower.includes('phát ban') || lower.includes('ngứa')) {
        reply =
          '⚠️ Cảnh báo: Nếu bạn xuất hiện nốt ban đỏ, ngứa ngáy toàn thân hoặc khó thở, hãy tạm ngưng cữ thuốc tiếp theo và liên hệ ngay cơ sở y tế gần nhất để kiểm tra phản ứng dị ứng thuốc.';
      } else if (lower.includes('đau bao tử') || lower.includes('dạ dày') || lower.includes('buồn nôn')) {
        reply =
          'Để giảm cảm giác cồn cào hoặc buồn nôn, hãy đảm bảo bạn luôn uống thuốc sau khi đã ăn no (khoảng 15-20 phút sau bữa ăn chính) và uống kèm 1 cốc nước ấm đầy.';
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, aiMsg],
        isAiTyping: false,
      }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 900);
  },

  resetDefault: () => {
    set({
      logs: MOCK_SYMPTOM_LOGS,
      chatMessages: DEFAULT_MESSAGES,
      isAiTyping: false,
    });
  },
}));
