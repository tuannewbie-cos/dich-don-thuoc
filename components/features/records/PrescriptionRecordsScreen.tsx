import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  FileText,
  FileDown,
  PhoneCall,
  Stethoscope,
  Pill,
  ShieldAlert,
  ScanLine,
  FileQuestion,
  Sparkles,
} from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { ExportSuccessModal } from '@/components/ui/ExportSuccessModal';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';
import { Prescription } from '@/types';
import { useRouter } from 'expo-router';

export function PrescriptionRecordsScreen() {
  const router = useRouter();
  const { scannedHistory, openScanner, clearScannedHistory } = usePrescriptionStore();
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(scannedHistory[0] || null);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'DOCX' | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  // Sync selectedRx if scannedHistory updates
  const activeRx = selectedRx && scannedHistory.some((p) => p.id === selectedRx.id)
    ? selectedRx
    : scannedHistory[0] || null;

  const handleExport = (format: 'PDF' | 'DOCX') => {
    triggerHaptic('success');
    setExportFormat(format);
  };

  const fileName = activeRx
    ? `BanDich_DonThuoc_${activeRx.id}.${exportFormat?.toLowerCase() || 'pdf'}`
    : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.badgeTop}>
              <FileText size={13} color="#0066FE" />
              <Text style={styles.badgeTopText}>LỊCH SỬ BẢN DỊCH</Text>
            </View>

            {/* Quick 115 SOS */}
            <Pressable
              onPress={() => setShowEmergency(true)}
              style={styles.sosButton}
            >
              <PhoneCall size={12} color="#E11D48" />
              <Text style={styles.sosText}>115</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Bản Dịch Đơn Thuốc</Text>
          <Text style={styles.subTitle}>
            Xem lại các đơn thuốc đã quét và xuất file PDF / DOCX
          </Text>
        </View>

        {/* IF USER HAS NOT SCANNED ANY PRESCRIPTION YET */}
        {scannedHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <FileQuestion size={44} color="#94A3B8" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>Bạn chưa quét đơn thuốc nào</Text>
            <Text style={styles.emptySub}>
              Hãy chụp hoặc tải ảnh đơn thuốc viết tay của bác sĩ để hệ thống tự động bóc tách và dịch sang văn bản in tại đây.
            </Text>

            <Pressable
              onPress={() => {
                triggerHaptic('medium');
                openScanner();
              }}
              style={styles.emptyScanBtn}
            >
              <ScanLine size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.emptyScanBtnText}>Quét Đơn Thuốc Đầu Tiên</Text>
            </Pressable>
          </View>
        ) : (
          /* IF USER HAS SCANNED PRESCRIPTIONS */
          <>
            {/* 2 Big Export Buttons (PDF & DOCX) */}
            <View style={styles.exportRow}>
              <Pressable
                onPress={() => handleExport('PDF')}
                style={[styles.exportBtn, styles.exportBtnPdf]}
              >
                <FileDown size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.exportBtnText}>Xuất File PDF</Text>
              </Pressable>

              <Pressable
                onPress={() => handleExport('DOCX')}
                style={[styles.exportBtn, styles.exportBtnDocx]}
              >
                <FileDown size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.exportBtnText}>Xuất File DOCX</Text>
              </Pressable>
            </View>

            {/* Prescription Switcher Pills */}
            <View style={styles.switcherContainer}>
              <Text style={styles.sectionLabel}>
                Danh sách đơn đã quét ({scannedHistory.length}):
              </Text>
              <View style={styles.switcherRow}>
                {scannedHistory.map((rx) => {
                  const isSelected = activeRx?.id === rx.id;
                  return (
                    <Pressable
                      key={rx.id}
                      onPress={() => {
                        triggerHaptic('light');
                        setSelectedRx(rx);
                      }}
                      style={[
                        styles.switcherCard,
                        isSelected ? styles.switcherCardActive : styles.switcherCardInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.switcherDiagnosis,
                          { color: isSelected ? '#0066FE' : '#334155' },
                        ]}
                        numberOfLines={1}
                      >
                        {rx.diagnosis}
                      </Text>
                      <Text style={styles.switcherDoctor}>{rx.doctorName}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Active Prescription Details */}
            {activeRx && (
              <>
                {/* Doctor & Hospital Info */}
                <View style={styles.card}>
                  <View style={styles.doctorHeader}>
                    <View style={styles.doctorIconBox}>
                      <Stethoscope size={22} color="#0066FE" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.doctorName}>{activeRx.doctorName}</Text>
                      <Text style={styles.hospitalName}>{activeRx.hospital}</Text>
                    </View>
                  </View>

                  <View style={styles.diagnosisSection}>
                    <Text style={styles.sectionLabel}>Chẩn Đoán Lâm Sàng</Text>
                    <View style={styles.diagnosisBox}>
                      <Text style={styles.diagnosisText}>{activeRx.diagnosis}</Text>
                    </View>
                  </View>
                </View>

                {/* Safety Warnings Banner */}
                {activeRx.safetyNotes && activeRx.safetyNotes.length > 0 && (
                  <View style={styles.warningCard}>
                    <View style={styles.warningHeader}>
                      <ShieldAlert size={18} color="#D97706" />
                      <Text style={styles.warningTitle}>Lưu Ý Dược Học & Cảnh Báo An Toàn</Text>
                    </View>
                    {activeRx.safetyNotes.map((note, idx) => (
                      <Text key={idx} style={styles.warningText}>
                        • {note}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Translated Medicine Items */}
                <View style={styles.card}>
                  <View style={styles.medsHeader}>
                    <View style={styles.medsHeaderLeft}>
                      <Pill size={18} color="#0066FE" />
                      <Text style={styles.medsTitle}>
                        Thuốc Đã Dịch ({activeRx.medications.length} loại)
                      </Text>
                    </View>
                    <Text style={styles.medsSub}>Chuẩn GPP</Text>
                  </View>

                  <View style={styles.medsList}>
                    {activeRx.medications.map((med, index) => (
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
                      </View>
                    ))}
                  </View>
                </View>

                {/* Scan Another Prescription CTA */}
                <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
                  <Pressable
                    onPress={() => openScanner()}
                    style={styles.scanMoreBtn}
                  >
                    <ScanLine size={16} color="#0066FE" />
                    <Text style={styles.scanMoreBtnText}>Quét Thêm Đơn Thuốc Khác</Text>
                  </Pressable>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Export Success Modal */}
      {exportFormat && activeRx && (
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badgeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
  },
  badgeTopText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0066FE',
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  sosText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 40,
    padding: 32,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  emptyScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#0066FE',
    shadowColor: '#0066FE',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  emptyScanBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exportRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 20,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  exportBtnPdf: {
    backgroundColor: '#0066FE',
    shadowColor: '#0066FE',
  },
  exportBtnDocx: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  switcherContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  switcherRow: {
    flexDirection: 'row',
    gap: 8,
  },
  switcherCard: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  switcherCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0066FE',
    shadowColor: '#0066FE',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  switcherCardInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  switcherDiagnosis: {
    fontSize: 12,
    fontWeight: '800',
  },
  switcherDoctor: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  card: {
    marginHorizontal: 16,
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
  hospitalName: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
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
    marginHorizontal: 16,
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
  scanMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  scanMoreBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0066FE',
  },
});
