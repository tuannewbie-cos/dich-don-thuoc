import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScanLine,
  PhoneCall,
  Sparkles,
  Bot,
  ChevronRight,
  FileText,
  ShieldCheck,
  Camera,
  CheckCircle2,
} from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { useRouter } from 'expo-router';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

export function MedexaHomeScreen() {
  const router = useRouter();
  const { openScanner } = usePrescriptionStore();
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandContainer}>
            <View style={styles.brandIconBox}>
              <ScanLine size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.brandText}>
              Medi<Text style={{ color: '#0066FE' }}>Scan AI</Text>
            </Text>
          </View>

          {/* 115 SOS Call Button */}
          <Pressable
            onPress={() => setShowEmergency(true)}
            style={styles.sosButton}
          >
            <PhoneCall size={12} color="#E11D48" />
            <Text style={styles.sosText}>115 Cấp Cứu</Text>
          </Pressable>
        </View>

        {/* Greeting Section: Chào bạn, Chúc bạn một ngày tốt lành */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSub}>Chào bạn,</Text>
          <Text style={styles.greetingMain}>
            Chúc bạn một ngày <Text style={styles.greetingAccent}>tốt lành</Text>
          </Text>
        </View>

        {/* Hero Card: Mô Tả Ứng Dụng Quét Chữ Bác Sĩ */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Sparkles size={13} color="#0066FE" />
            <Text style={styles.heroBadgeText}>AI VISION QUÉT CHỮ BÁC SĨ</Text>
          </View>

          <Text style={styles.heroTitle}>
            Giải Mã Đơn Thuốc Viết Tay Chuẩn Xác
          </Text>

          <Text style={styles.heroDesc}>
            Chụp ảnh đơn thuốc viết tay hoặc phiếu khám bệnh. Hệ thống AI sẽ tự động đọc chữ bác sĩ, bóc tách danh mục thuốc, dịch sang văn bản in rõ nét và cảnh báo kiêng khem tương tác thuốc.
          </Text>

          {/* Big CTA Scan Button */}
          <Pressable
            onPress={() => {
              triggerHaptic('medium');
              openScanner();
            }}
            style={styles.heroScanBtn}
          >
            <Camera size={20} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.heroScanBtnText}>Quét Đơn Thuốc Ngay</Text>
            <ChevronRight size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* 3 Steps Guide (Cách thức hoạt động) */}
        <View style={styles.guideCard}>
          <Text style={styles.guideHeaderTitle}>Quy Trình 3 Bước Đơn Giản</Text>

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepTextBox}>
              <Text style={styles.stepTitle}>Chụp đơn thuốc của bác sĩ</Text>
              <Text style={styles.stepDesc}>
                Đặt đơn thuốc viết tay vào khung ngắm để AI nhận diện.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepTextBox}>
              <Text style={styles.stepTitle}>AI tự động dịch sang văn bản in</Text>
              <Text style={styles.stepDesc}>
                Bóc tách tên thuốc, hàm lượng, số lượng và liều dùng theo cữ.
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepTextBox}>
              <Text style={styles.stepTitle}>Xuất file PDF / DOCX & Hỏi đáp AI</Text>
              <Text style={styles.stepDesc}>
                Lưu trữ đơn thuốc và trò chuyện trực tiếp cùng Trợ Lý AI.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick AI Assistant Card */}
        <Pressable
          onPress={() => {
            triggerHaptic('light');
            router.navigate('/three');
          }}
          style={styles.assistantCard}
        >
          <View style={styles.assistantLeft}>
            <View style={styles.assistantIconBox}>
              <Bot size={22} color="#0066FE" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.assistantTitle}>Cần Hỏi Thêm Về Thuốc?</Text>
              <Text style={styles.assistantSub}>
                Trò chuyện trực tuyến cùng Trợ Lý AI (Google Gemini)
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#0066FE" />
        </Pressable>
      </ScrollView>

      {/* Emergency 115 Modal */}
      <EmergencyCallModal
        visible={showEmergency}
        onClose={() => setShowEmergency(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: '#0066FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FE',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  sosText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#E11D48',
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  greetingSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  greetingMain: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  greetingAccent: {
    color: '#0066FE',
    fontWeight: '900',
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 22,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0066FE',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  heroScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: '#0066FE',
    shadowColor: '#0066FE',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  heroScanBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  guideCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
  },
  guideHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0066FE',
  },
  stepTextBox: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  stepDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
    marginLeft: 40,
  },
  assistantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  assistantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  assistantIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FE',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  assistantTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E40AF',
  },
  assistantSub: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2,
  },
});
