import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  FileText,
  FileDown,
  PhoneCall,
  ShieldAlert,
  X,
  Stethoscope,
  Building2,
  Pill,
  CheckCircle2,
} from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
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
}: PrescriptionTranslationModalProps) {
  const [exportFormat, setExportFormat] = useState<'PDF' | 'DOCX' | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  if (!visible || !prescription) return null;

  const handleExport = (format: 'PDF' | 'DOCX') => {
    triggerHaptic('success');
    setExportFormat(format);
  };

  const fileName = `BanDich_DonThuoc_${prescription.id}.${exportFormat?.toLowerCase() || 'pdf'}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
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
              triggerHaptic('light');
              onClose();
            }}
            style={styles.closeBtn}
            hitSlop={10}
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
              <FileDown size={15} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.actionBtnText}>Xuất PDF</Text>
            </Pressable>

            <Pressable
              onPress={() => handleExport('DOCX')}
              style={[styles.actionBtn, styles.actionBtnDocx]}
            >
              <FileDown size={15} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.actionBtnText}>Xuất DOCX</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEmergency(true)}
              style={[styles.actionBtn, styles.actionBtnSos]}
            >
              <PhoneCall size={15} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.actionBtnText}>115 SOS</Text>
            </Pressable>
          </View>

          {/* Doctor & Hospital Card */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorHeaderRow}>
              <View style={styles.doctorAvatar}>
                <Stethoscope size={22} color="#0066FE" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.diagnosisTitle}>
                  {prescription.diagnosis}
                </Text>
                <Text style={styles.doctorMeta}>
                  Bác sĩ điều trị: {prescription.doctorName}
                </Text>
                <View style={styles.hospitalRow}>
                  <Building2 size={13} color="#64748B" />
                  <Text style={styles.hospitalText}>{prescription.hospital}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.doctorFooterRow}>
              <Text style={styles.footerDateText}>
                Ngày khám: {prescription.scanDate}
              </Text>
              <View style={styles.verifiedTag}>
                <CheckCircle2 size={13} color="#059669" />
                <Text style={styles.verifiedTagText}>Độ chính xác: 98%</Text>
              </View>
            </View>
          </View>

          {/* Prescription Medications List */}
          <View style={styles.medsCard}>
            <View style={styles.medsHeader}>
              <View style={styles.medsIconBox}>
                <Pill size={16} color="#0066FE" />
              </View>
              <Text style={styles.medsTitle}>
                Danh Mục Thuốc Đã Dịch ({prescription.medications.length} loại)
              </Text>
            </View>

            <View style={styles.medsList}>
              {prescription.medications.map((item, idx) => (
                <View key={item.id} style={styles.medItem}>
                  <View style={styles.medItemTop}>
                    <View style={styles.medNumber}>
                      <Text style={styles.medNumberText}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.medNameText}>{item.name}</Text>
                      <Text style={styles.medDosageText}>
                        Liều lượng: {item.dosage} • Số lượng: {item.quantity}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.instructionsBox}>
                    <Text style={styles.instructionsText}>
                      👉 Hướng dẫn: {item.instruction}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Drug Interactions & Cautions */}
          {prescription.safetyNotes && prescription.safetyNotes.length > 0 && (
            <View style={styles.warningCard}>
              <View style={styles.warningHeader}>
                <ShieldAlert size={18} color="#D97706" />
                <Text style={styles.warningTitle}>
                  Lưu Ý & Cảnh Báo Tương Tác Thuốc
                </Text>
              </View>
              {prescription.safetyNotes.map((warn: string, i: number) => (
                <Text key={i} style={styles.warningItem}>
                  • {warn}
                </Text>
              ))}
            </View>
          )}

          {/* Close button */}
          <Pressable
            onPress={() => {
              triggerHaptic('light');
              onClose();
            }}
            style={styles.doneBtn}
          >
            <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.doneBtnText}>Đóng Bản Dịch</Text>
          </Pressable>
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

        {/* Emergency Modal */}
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
    paddingHorizontal: 18,
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
    backgroundColor: 'rgba(0, 102, 254, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#059669',
    marginTop: 1,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnPdf: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
  },
  actionBtnDocx: {
    backgroundColor: '#0066FE',
    shadowColor: '#0066FE',
  },
  actionBtnSos: {
    backgroundColor: '#E11D48',
    shadowColor: '#E11D48',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  doctorHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 102, 254, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagnosisTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  doctorMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  hospitalText: {
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  doctorFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerDateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  medsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  medsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  medsIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 102, 254, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  medsList: {
    gap: 12,
  },
  medItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medItemTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  medNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  medNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  medNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  medDosageText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    fontWeight: '600',
  },
  instructionsBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  instructionsText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '600',
  },
  warningCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  warningItem: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    marginTop: 4,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#0066FE',
    shadowColor: '#0066FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
