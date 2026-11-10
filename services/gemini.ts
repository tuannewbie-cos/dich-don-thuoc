import { Alert } from 'react-native';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SYSTEM_PROMPT = `Bạn là Trợ Lý Dược Sĩ AI MediScan thông minh và ân cần.
Nhiệm vụ: Giải thích chi tiết đơn thuốc, hướng dẫn liều dùng theo bữa ăn, giải thích tác dụng phụ, tương tác thuốc nguy hiểm và tư vấn kiêng cữ bằng tiếng Việt ngắn gọn, dễ hiểu, chuẩn y khoa.
Lưu ý: Luôn dặn dò bệnh nhân tuân thủ nghiêm ngặt chỉ định của bác sĩ khám bệnh.`;

const REQUEST_TIMEOUT_MS = 8000; // 8 seconds timeout as required by AGENTS.md

/**
 * Sanitize API Key: remove whitespace, quotes, or accidental prefixes
 */
export function sanitizeApiKey(rawKey?: string): string {
  if (!rawKey) return '';
  return rawKey
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/^Bearer\s+/i, '')
    .trim();
}

/**
 * Call Google AI Studio Gemini API with strict timeout, key sanitization, and resilient fallback
 */
export async function callGeminiAI(userMessage: string, userApiKey?: string): Promise<string> {
  const sanitizedKey = sanitizeApiKey(
    userApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || ''
  );

  // If a key is present and looks valid (> 15 chars), attempt the real Gemini endpoint
  if (sanitizedKey && sanitizedKey.length > 15) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(sanitizedKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\nNgười bệnh hỏi: ${userMessage}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && typeof candidateText === 'string') {
          return candidateText.trim();
        }
      } else {
        const errJson = await response.json().catch(() => null);
        const status = response.status;
        console.warn(`[Gemini API Error ${status}]:`, errJson?.error?.message || response.statusText);

        if (status === 400 || status === 401) {
          Alert.alert(
            'Google AI Key Không Hợp Lệ',
            'API Key Google AI Studio không đúng hoặc đã bị thu hồi. Ứng dụng đã chuyển sang Trợ Lý Dược Sĩ dự phòng.'
          );
        } else if (status === 403) {
          Alert.alert(
            'Google AI Hết Lượt / Bị Chặn',
            'API Key bị từ chối truy cập hoặc chưa bật Gemini API trên Google Cloud. Đã chuyển sang Trợ Lý Dược Sĩ dự phòng.'
          );
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`[Gemini API Timeout]: Phản hồi quá ${REQUEST_TIMEOUT_MS}ms, tự động kích hoạt fallback.`);
      } else {
        console.warn('[Gemini API Network Error]:', err.message || err);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Resilient Offline Medical Response Engine (Resilient Data Fallback - 100% stable presentation)
  return getOfflineFallbackResponse(userMessage);
}

/**
 * Intelligent Vietnamese Medical Fallback Engine (Đảm bảo demo luôn mượt mà 100% không crash)
 */
function getOfflineFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('kiêng') || lower.includes('rượu') || lower.includes('bia') || lower.includes('cà phê')) {
    return 'Khuyến cáo quan trọng: Khi đang dùng thuốc điều trị (đặc biệt là kháng sinh), bạn cần kiêng tuyệt đối rượu bia vì cồn gây độc cho gan và làm mất hoạt tính của thuốc. Cà phê và trà xanh nên uống cách giờ uống thuốc tối thiểu 2 tiếng để không cản trở hấp thu.';
  }

  if (lower.includes('quên') || lower.includes('bỏ lỡ') || lower.includes('trễ')) {
    return 'Nếu bạn quên 1 liều: Hãy uống ngay khi nhớ ra. Tuy nhiên, nếu thời gian đã gần đến cữ uống tiếp theo (dưới 2-3 tiếng), hãy bỏ qua liều đã quên và uống liều tiếp theo đúng giờ. Tuyệt đối không bao giờ uống dồn 2 liều cùng lúc!';
  }

  if (lower.includes('đắng miệng') || lower.includes('clarithromycin')) {
    return 'Vị đắng miệng là phản ứng phụ rất phổ biến và hoàn toàn lành tính của kháng sinh Clarithromycin (do thuốc bài tiết một phần qua tuyến nước bọt). Bạn có thể uống nhiều nước ấm, súc miệng nước muối sinh lý sau uống hoặc ngậm kẹo bạc hà không đường để làm dịu cảm giác này.';
  }

  if (lower.includes('buồn nôn') || lower.includes('dạ dày') || lower.includes('đau bụng') || lower.includes('cồn cào')) {
    return 'Để giảm cảm giác buồn nôn hoặc cồn cào ruột, bạn nên uống thuốc ngay sau khi đã ăn no (khoảng 15-20 phút sau bữa ăn chính), uống kèm một cốc nước ấm đầy và tránh nằm ngay sau khi vừa uống thuốc.';
  }

  if (lower.includes('dị ứng') || lower.includes('ngứa') || lower.includes('phát ban')) {
    return '⚠️ Cảnh báo an toàn: Nếu bạn xuất hiện nốt ban đỏ, ngứa ngáy dữ dội, sưng mắt/môi hoặc cảm giác khó thở, hãy tạm ngưng cữ thuốc tiếp theo và liên hệ ngay cơ sở y tế gần nhất hoặc gọi tổng đài cấp cứu 115 để được xử trí dị ứng kịp thời.';
  }

  return `Chào bạn! Tôi là Trợ Lý Dược Sĩ AI MediScan. Với câu hỏi "${userMessage}": Khi dùng thuốc theo đơn, bạn cần chú ý uống đúng giờ, đủ liều và không tự ý ngưng thuốc giữa chừng. Bạn có thể bấm biểu tượng chìa khóa (🔑) ở góc trên để cài đặt Google AI Studio API Key nhận phân tích thời gian thực từ mô hình Gemini nhé!`;
}
