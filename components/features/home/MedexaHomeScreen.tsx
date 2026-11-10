import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Bell,
  Search,
  Heart,
  Pill,
  Bot,
  Sparkles,
  PhoneCall,
  ChevronRight,
  TrendingUp,
  Activity,
  FileText,
  ScanLine,
  Flame,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { useRouter } from 'expo-router';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

export function MedexaHomeScreen() {
  const router = useRouter();
  const { openScanner } = usePrescriptionStore();
  const [activePill, setActivePill] = useState<'overview' | 'report' | 'appointments'>('overview');
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Bar: Brand + Avatar + Notification + 115 SOS */}
        <View style={styles.topBar}>
          {/* Brand Logo (Medexa Style) */}
          <View style={styles.brandContainer}>
            <View style={styles.brandIconBox}>
              <Activity size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.brandText}>
              Medexa<Text style={{ color: '#0066FE' }}>Scan</Text>
            </Text>
          </View>

          {/* Right Actions */}
          <View style={styles.rightActions}>
            {/* Quick 115 SOS Button */}
            <Pressable
              onPress={() => setShowEmergency(true)}
              style={styles.sosButton}
            >
              <PhoneCall size={12} color="#E11D48" />
              <Text style={styles.sosText}>115</Text>
            </Pressable>

            {/* Notification Bell */}
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={styles.bellButton}
            >
              <Bell size={18} color="#1E293B" />
              <View style={styles.bellBadge} />
            </Pressable>

            {/* User Avatar */}
            <View style={styles.avatarBox}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
                style={styles.avatarImg}
              />
            </View>
          </View>
        </View>

        {/* Greeting Headline: "Chào bạn," -> "Good Morning" (KHÔNG CÓ TÊN BỆNH NHÂN) */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSub}>Chào bạn,</Text>
          <Text style={styles.greetingMain}>
            Good <Text style={styles.greetingAccent}>Morning</Text>
          </Text>
        </View>

        {/* Quick Filter Pills Row (Overview, Report, Appointments + Search) */}
        <View style={styles.pillsRow}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActivePill('overview');
            }}
            style={[
              styles.pill,
              activePill === 'overview' ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                activePill === 'overview' ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              Overview
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActivePill('report');
              router.navigate('/two');
            }}
            style={[
              styles.pill,
              activePill === 'report' ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                activePill === 'report' ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              Report
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActivePill('appointments');
            }}
            style={[
              styles.pill,
              activePill === 'appointments' ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                activePill === 'appointments' ? styles.pillTextActive : styles.pillTextInactive,
              ]}
            >
              Appointments
            </Text>
          </Pressable>

          {/* Search Icon Circle Button */}
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={styles.searchButton}
          >
            <Search size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Hero Card: Health Score with Smooth Curve Graph */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardSubTitle}>Health Score</Text>
              <Text style={styles.scoreText}>
                85<Text style={styles.scoreSub}>/100</Text>
              </Text>
            </View>
            <View style={styles.badgeSuccess}>
              <TrendingUp size={13} color="#059669" />
              <Text style={styles.badgeSuccessText}>↑ 12%</Text>
            </View>
          </View>

          {/* Smooth Blue Wave Graphic Container */}
          <View style={styles.graphContainer}>
            <View style={styles.graphBarsRow}>
              {[
                { h: 32, active: false },
                { h: 42, active: false },
                { h: 36, active: false },
                { h: 58, active: false },
                { h: 72, active: true },
                { h: 50, active: false },
                { h: 54, active: false },
              ].map((bar, i) => (
                <View key={i} style={styles.barColumn}>
                  {bar.active && <View style={styles.activeDot} />}
                  <View
                    style={[
                      styles.barTrack,
                      {
                        height: bar.h,
                        backgroundColor: bar.active ? '#0066FE' : '#E0EDFF',
                      },
                    ]}
                  />
                </View>
              ))}
            </View>

            {/* Days of week axis */}
            <View style={styles.axisRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <Text
                  key={d}
                  style={[
                    styles.axisText,
                    i === 4 && { color: '#0066FE', fontWeight: '800' },
                  ]}
                >
                  {d}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Two Metrics Row: Health Rate & Sleep / Medication */}
        <View style={styles.twoMetricsRow}>
          {/* Card Left: Health Rate */}
          <View style={[styles.card, styles.metricCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Health Rate</Text>
              <Heart size={14} color="#E11D48" />
            </View>
            <Text style={styles.metricValue}>
              110<Text style={styles.metricUnit}>bpm</Text>
            </Text>
            <Text style={styles.metricStatusNormal}>Normal</Text>

            {/* Heartbeat ECG waveform graphic */}
            <View style={styles.ecgContainer}>
              {[8, 14, 5, 22, 10, 18, 6, 26, 12, 7].map((h, i) => (
                <View
                  key={i}
                  style={[styles.ecgBar, { height: h }]}
                />
              ))}
            </View>
          </View>

          {/* Card Right: Sleep / Medication */}
          <View style={[styles.card, styles.metricCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Sleep</Text>
              <Pill size={14} color="#0066FE" />
            </View>
            <Text style={styles.metricValue}>
              7<Text style={styles.metricUnit}>h </Text>45<Text style={styles.metricUnit}>m</Text>
            </Text>
            <Text style={styles.metricStatusGood}>Good</Text>

            {/* Vertical Bars Graphic */}
            <View style={styles.sleepBarsContainer}>
              {[14, 24, 18, 28, 20].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.sleepBar,
                    {
                      height: h,
                      backgroundColor: i % 2 === 0 ? '#0066FE' : '#BFDBFE',
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* AI Health Insights / Chatbot Bác Sĩ Online Window */}
        <View style={styles.card}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightTitle}>AI Health Insights</Text>
            <Pressable onPress={() => router.navigate('/three')}>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.navigate('/three');
            }}
            style={styles.insightContentBox}
          >
            <View style={styles.insightLeft}>
              <View style={styles.insightIconBox}>
                <Sparkles size={20} color="#0066FE" />
              </View>
              <View style={styles.insightTextBox}>
                <Text style={styles.insightMainText}>
                  Bác sĩ AI đã sẵn sàng tư vấn
                </Text>
                <Text style={styles.insightSubText}>
                  Bấm vào đây để trò chuyện & hỏi đáp ngay
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Quick Prescription Scan Entry Banner */}
        <View style={[styles.card, styles.scanBannerCard]}>
          <View style={styles.scanBannerContent}>
            <View style={styles.scanBannerIcon}>
              <ScanLine size={24} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scanBannerTitle}>Quét Đơn Thuốc Bác Sĩ</Text>
              <Text style={styles.scanBannerSub}>
                Dịch chữ viết tay, kiểm tra liều dùng & xuất file PDF/DOCX
              </Text>
            </View>
          </View>

          <Pressable onPress={openScanner} style={styles.scanCTAButton}>
            <Text style={styles.scanCTAText}>Bắt Đầu Quét Ngay</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>
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
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  sosText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  bellBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#0066FE',
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#CBD5E1',
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  greetingSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  greetingMain: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  greetingAccent: {
    color: '#0066FE',
    fontWeight: '900',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
  },
  pillActive: {
    backgroundColor: '#0F172A',
  },
  pillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  pillTextInactive: {
    color: '#64748B',
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0066FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    shadowColor: '#0066FE',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  scoreText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  scoreSub: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
  },
  badgeSuccessText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  graphContainer: {
    marginTop: 6,
  },
  graphBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 76,
    paddingHorizontal: 6,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0066FE',
    shadowColor: '#0066FE',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  barTrack: {
    width: 10,
    borderRadius: 5,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  axisText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  twoMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 0,
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  metricStatusNormal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  metricStatusGood: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0066FE',
    marginTop: 2,
  },
  ecgContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8,
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
  },
  ecgBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#FB7185',
  },
  sleepBarsContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 4,
    marginTop: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  sleepBar: {
    width: 8,
    borderRadius: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0066FE',
  },
  insightContentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  insightIconBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#E0EDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTextBox: {
    flex: 1,
  },
  insightMainText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  insightSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scanBannerCard: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  scanBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  scanBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: '#0066FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scanBannerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  scanCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#0066FE',
  },
  scanCTAText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
