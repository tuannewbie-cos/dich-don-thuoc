import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  SafeAreaView,
  Image,
  StyleSheet,
} from 'react-native';
import {
  FileText,
  FileDown,
  PhoneCall,
  Bot,
  ShieldAlert,
  X,
  Stethoscope,
  Building2,
  Pill,
  ArrowRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Prescription } from '@/types';
import { ExportSuccessModal } from '@/components/ui/ExportSuccessModal';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

interface PrescriptionTranslationModalProps {
  visible: boolean;
  prescription: Prescription | null;
  onClose: () => void;
  onOpenChatbot?: () => void;
}

export function PrescriptionTranslationModal({
  visible,
  prescription,
  onClose,
  onOpenChatbot,
}: PrescriptionTranslationModalProps) {
  const [exportFormat, setExportFormat] = useState<'PDF' | 'DOCX' | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  if (!prescription) return null;

  const handleExport = (format: 'PDF' | 'DOCX') => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setExportFormat(format);
  };

  const fileName = `BanDich_DonThuoc_${prescription.id}.${exportFormat?.toLowerCase() || 'pdf'}`;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <FileText size={18} color="#0066FE" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Bản Dịch Đơn Thuốc Bác Sĩ</Text>
              <Text style={styles.headerSub}>
                ✓ Đã số hóa từ chữ viết tay bằng AI OCR
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            style={styles.closeBtn}
          >
            <X size={18} color="#64748B" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Action Bar: Export PDF, DOCX, Call 115 */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => handleExport('PDF')}
              style={[styles.actionBtn, styles.actionBtnPdf]}
            >
              <FileDown size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.actionBtnText}>Xuất PDF</Text>
            </Pressable>

            <Pressable
              onPress={() => handleExport('DOCX')}
              style={[styles.actionBtn, styles.actionBtnDocx]}
            >
              <FileDown size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.actionBtnText}>Xuất DOCX</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEmergency(true)}
              style={styles.sosActionBtn}
            >
              <PhoneCall size={16} color="#E11D48" />
              <Text style={styles.sosActionText}>Gọi 115</Text>
            </Pressable>
          </View>

          {/* Scanned Original Photo Comparison */}
          {prescription.imageUrl && (
            <View style={styles.card}>
              <View style={styles.cardHeaderSmall}>
                <Text style={styles.cardSectionTag}>Ảnh Chụp Đơn Viết Tay Bác Sĩ</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>Độ tin cậy 99.4%</Text>
                </View>
              </View>
              <Image
                source={{ uri: prescription.imageUrl }}
                style={styles.originalImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Hospital & Doctor Metadata Card */}
          <View style={styles.card}>
            <View style={styles.doctorHeader}>
              <View style={styles.doctorIconBox}>
                <Stethoscope size={22} color="#0066FE" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.doctorName}>{prescription.doctorName}</Text>
                <View style={styles.hospitalRow}>
                  <Building2 size={12} color="#64748B" />
                  <Text style={styles.hospitalText} numberOfLines={1}>
                    {prescription.hospital}
                  </Text>
                </View>
              </View>
            </View>

            {/* Diagnosis */}
            <View style={styles.diagnosisSection}>
              <Text style={styles.cardSectionTag}>Chẩn Đoán Lâm Sàng</Text>
              <View style={styles.diagnosisBox}>
                <Text style={styles.diagnosisText}>{prescription.diagnosis}</Text>
              </View>
            </View>
          </View>

          {/* Safety Warnings Banner */}
          {prescription.safetyNotes && prescription.safetyNotes.length > 0 && (
            <View style={styles.warningCard}>
              <View style={styles.warningHeader}>
                <ShieldAlert size={18} color="#D97706" />
                <Text style={styles.warningTitle}>Cảnh Báo An Toàn & Kiêng Khem</Text>
              </View>
              {prescription.safetyNotes.map((note, idx) => (
                <Text key={idx} style={styles.warningText}>
                  • {note}
                </Text>
              ))}
            </View>
          )}

          {/* Translated Medications Table */}
          <View style={styles.card}>
            <View style={styles.medsHeader}>
              <View style={styles.medsHeaderLeft}>
                <Pill size={18} color="#0066FE" />
                <Text style={styles.medsTitle}>
                  Danh Mục Thuốc Đã Dịch ({prescription.medications.length} loại)
                </Text>
              </View>
              <Text style={styles.medsSub}>Chuẩn GPP</Text>
            </View>

            <View style={styles.medsList}>
              {prescription.medications.map((med, index) => (
                <View key={med.id || index} style={styles.medItem}>
                  <View style={styles.medItemHeader}>
                    <View style={styles.medNameRow}>
                      <View style={styles.medIndexBadge}>
                        <Text style={styles.medIndexText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.medNameText}>{med.name}</Text>
                    </View>
                    <View style={styles.medDosageBadge}>
                      <Text style={styles.medDosageText}>{med.dosage}</Text>
                    </View>
                  </View>

                  <Text style={styles.medInstructionText}>
                    Số lượng: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{med.quantity}</Text> • {med.instruction}
                  </Text>

                  {/* Time slots badges */}
                  <View style={styles.slotsRow}>
                    {med.timeSlots.map((slot) => {
                      const labels: Record<string, string> = {
                        morning: 'Sáng',
                        noon: 'Trưa',
                        evening: 'Chiều',
                        night: 'Tối',
                      };
                      return (
                        <View key={slot} style={styles.slotBadge}>
                          <Text style={styles.slotText}>{labels[slot] || slot}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Export Success Modal */}
        {exportFormat && (
          <ExportSuccessModal
            visible={!!exportFormat}
            format={exportFormat}
            fileName={fileName}
            onClose={() => setExportFormat(null)}
          />
        )}

        {/* Emergency 115 Modal */}
        <EmergencyCallModal
          visible={showEmergency}
          onClose={() => setShowEmergency(false)}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 18,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  actionBtnPdf: {
    backgroundColor: '#0066FE',
    shadowColor: '#0066FE',
  },
  actionBtnDocx: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sosActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  sosActionText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#E11D48',
  },
  card: {
    marginBottom: 14,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
  },
  cardHeaderSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardSectionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0066FE',
  },
  originalImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  doctorIconBox: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  hospitalText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  diagnosisSection: {
    paddingTop: 12,
  },
  diagnosisBox: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  diagnosisText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  warningCard: {
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    textTransform: 'uppercase',
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    marginBottom: 4,
  },
  medsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  medsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  medsSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  medsList: {
    gap: 10,
  },
  medItem: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  medNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medIndexBadge: {
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  medNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  medDosageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
  },
  medDosageText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E40AF',
  },
  medInstructionText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  slotBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
});
