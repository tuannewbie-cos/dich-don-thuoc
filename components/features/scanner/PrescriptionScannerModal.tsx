import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  ScanLine,
  Sparkles,
  Stethoscope,
  Building2,
  Pill,
  FileDown,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Bot,
} from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { Prescription } from '@/types';
import { ExportSuccessModal } from '@/components/ui/ExportSuccessModal';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

interface PrescriptionScannerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PrescriptionScannerModal({ visible, onClose }: PrescriptionScannerModalProps) {
  const {
    prescriptions,
    activePrescription,
    isAnalyzing,
    addScannedPrescription,
    setAnalyzing,
  } = usePrescriptionStore();

  const [viewMode, setViewMode] = useState<'scan' | 'result'>('scan');
  const [currentRx, setCurrentRx] = useState<Prescription | null>(null);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'DOCX' | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  const handleScanPreset = (rx: Prescription) => {
    triggerHaptic('medium');
    setAnalyzing(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Fast simulated AI OCR (450ms) with unmount protection
    timerRef.current = setTimeout(() => {
      setAnalyzing(false);
      setCurrentRx(rx);
      addScannedPrescription(rx);
      triggerHaptic('success');
      setViewMode('result');
    }, 450);
  };

  const handleExport = (format: 'PDF' | 'DOCX') => {
    triggerHaptic('success');
    setExportFormat(format);
  };

  const handleClose = () => {
    triggerHaptic('light');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setAnalyzing(false);
    setViewMode('scan');
    onClose();
  };

  const handleScanAnother = () => {
    triggerHaptic('light');
    setViewMode('scan');
  };

  const displayedRx = currentRx || activePrescription || prescriptions[0];
  const exportFileName = displayedRx
    ? `BanDich_DonThuoc_${displayedRx.id}.${exportFormat?.toLowerCase() || 'pdf'}`
    : '';

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlayWrapper]}>
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: viewMode === 'scan' ? '#0F172A' : '#F5F7FB' },
        ]}
      >
        {/* ===================== VIEW MODE: SCANNER ===================== */}
        {viewMode === 'scan' ? (
          <>
            {/* Top Bar Dark */}
            <View style={styles.topBarDark}>
              <View style={styles.headerLeft}>
                <View style={styles.iconBoxDark}>
                  <ScanLine size={18} color="#60A5FA" />
                </View>
                <View>
                  <Text style={styles.titleDark}>Quét Đơn Viết Tay Bác Sĩ</Text>
                  <Text style={styles.subTitleDark}>
                    Dịch tự động chữ bác sĩ sang văn bản
                  </Text>
                </View>
              </View>

              <Pressable onPress={handleClose} style={styles.closeBtnDark} hitSlop={10}>
                <X size={20} color="#E2E8F0" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentDark}
            >
              {/* Camera Viewfinder Box */}
              <View style={styles.viewfinderBox}>
                <View style={styles.viewfinderFrame}>
                  {/* Corner brackets */}
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />

                  <View style={styles.centerTarget}>
                    {isAnalyzing ? (
                      <>
                        <ActivityIndicator size="large" color="#60A5FA" />
                        <Text style={styles.targetText}>
                          Đang dịch chữ viết tay bằng AI OCR...
                        </Text>
                      </>
                    ) : (
                      <>
                        <ScanLine size={48} color="#60A5FA" strokeWidth={1.5} />
                        <Text style={styles.targetText}>
                          Đặt đơn thuốc hoặc phiếu khám vào khung
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Scan Action Button */}
                <Pressable
                  onPress={() => handleScanPreset(prescriptions[0])}
                  disabled={isAnalyzing}
                  style={[
                    styles.captureBtn,
                    { backgroundColor: isAnalyzing ? '#475569' : '#0066FE' },
                  ]}
                >
                  <ScanLine size={20} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.captureBtnText}>
                    {isAnalyzing ? 'Đang Xử Lý Dịch...' : 'Chụp & Dịch Đơn Thuốc'}
                  </Text>
                </Pressable>
              </View>

              {/* Quick Demo Presets */}
              <View style={styles.presetsSection}>
                <View style={styles.presetsHeader}>
                  <Sparkles size={14} color="#60A5FA" />
                  <Text style={styles.presetsTitle}>
                    Đơn Thuốc Viết Tay Mẫu (Bấm Để Thử Ngay):
                  </Text>
                </View>

                <View style={styles.presetCardsGap}>
                  {prescriptions.map((rx) => (
                    <Pressable
                      key={rx.id}
                      onPress={() => handleScanPreset(rx)}
                      disabled={isAnalyzing}
                      style={styles.presetCard}
                    >
                      <View style={styles.presetCardLeft}>
                        <View style={styles.presetIconBox}>
                          <Stethoscope size={20} color="#0066FE" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.presetDiagnosis}>{rx.diagnosis}</Text>
                          <Text style={styles.presetDoctor}>
                            {rx.doctorName} • {rx.hospital}
                          </Text>
                          <Text style={styles.presetMeds}>
                            Gồm {rx.medications.length} loại thuốc (
                            {rx.medications.map((m) => m.name).join(', ')})
                          </Text>
                        </View>
                      </View>
                      <View style={styles.presetSelectBadge}>
                        <Text style={styles.presetSelectText}>Quét Đơn Này</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>
          </>
        ) : (
          /* ===================== VIEW MODE: RESULT (BẢN DỊCH) ===================== */
          <>
            {/* Top Bar Light */}
            <View style={styles.topBarLight}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconBoxLight}>
                  <Sparkles size={18} color="#0066FE" />
                </View>
                <View>
                  <Text style={styles.titleLight}>Bản Dịch Đơn Thuốc Bác Sĩ</Text>
                  <Text style={styles.subTitleLight}>
                    ✓ Đã nhận diện chữ viết tay bằng AI
                  </Text>
                </View>
              </View>

              <Pressable onPress={handleClose} style={styles.closeBtnLight} hitSlop={10}>
                <X size={20} color="#475569" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentLight}
            >
              {/* Quick Action Toolbar: PDF, DOCX, 115 */}
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

              {/* Diagnosis & Doctor Header Card */}
              <View style={styles.doctorCard}>
                <View style={styles.doctorHeaderRow}>
                  <View style={styles.doctorAvatar}>
                    <Stethoscope size={22} color="#0066FE" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.diagnosisTitle}>
                      {displayedRx.diagnosis}
                    </Text>
                    <Text style={styles.doctorMeta}>
                      Bác sĩ điều trị: {displayedRx.doctorName}
                    </Text>
                    <View style={styles.hospitalRow}>
                      <Building2 size={13} color="#64748B" />
                      <Text style={styles.hospitalText}>
                        {displayedRx.hospital}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.doctorFooterRow}>
                  <Text style={styles.footerDateText}>
                    Ngày khám: {displayedRx.scanDate}
                  </Text>
                  <View style={styles.verifiedTag}>
                    <CheckCircle2 size={13} color="#059669" />
                    <Text style={styles.verifiedTagText}>Độ chính xác: 98%</Text>
                  </View>
                </View>
              </View>

              {/* Prescription Medications List (Danh Sách Thuốc Đã Bóc Tách) */}
              <View style={styles.medsCard}>
                <View style={styles.medsHeader}>
                  <View style={styles.medsIconBox}>
                    <Pill size={16} color="#0066FE" />
                  </View>
                  <Text style={styles.medsTitle}>
                    Danh Mục Thuốc Đã Dịch ({displayedRx.medications.length} loại)
                  </Text>
                </View>

                <View style={styles.medsList}>
                  {displayedRx.medications.map((item, idx) => (
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

              {/* Drug Interaction & Safety Warning */}
              {displayedRx.safetyNotes && displayedRx.safetyNotes.length > 0 && (
                <View style={styles.warningCard}>
                  <View style={styles.warningHeader}>
                    <ShieldAlert size={18} color="#D97706" />
                    <Text style={styles.warningTitle}>
                      Lưu Ý & Cảnh Báo Tương Tác Thuốc
                    </Text>
                  </View>
                  {displayedRx.safetyNotes.map((warn: string, i: number) => (
                    <Text key={i} style={styles.warningItem}>
                      • {warn}
                    </Text>
                  ))}
                </View>
              )}

              {/* Bottom Buttons: Scan Another & Done */}
              <View style={styles.bottomButtonGroup}>
                <Pressable
                  onPress={handleScanAnother}
                  style={styles.scanAnotherBtn}
                >
                  <RotateCcw size={16} color="#0066FE" strokeWidth={2.4} />
                  <Text style={styles.scanAnotherBtnText}>Quét Đơn Khác</Text>
                </Pressable>

                <Pressable onPress={handleClose} style={styles.doneBtn}>
                  <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.doneBtnText}>Hoàn Tất & Lưu Lịch Sử</Text>
                </Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* Global Export Success Modal */}
        {exportFormat && (
          <ExportSuccessModal
            visible={!!exportFormat}
            format={exportFormat}
            fileName={exportFileName}
            onClose={() => setExportFormat(null)}
          />
        )}

        {/* Global 115 Emergency Modal */}
        <EmergencyCallModal
          visible={showEmergency}
          onClose={() => setShowEmergency(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    elevation: 99999,
  },
  safeArea: {
    flex: 1,
  },
  // DARK SCANNER STYLES
  topBarDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBoxDark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleDark: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subTitleDark: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtnDark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContentDark: {
    paddingBottom: 40,
  },
  viewfinderBox: {
    margin: 16,
    padding: 16,
    borderRadius: 28,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  viewfinderFrame: {
    height: 220,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#0066FE',
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  centerTarget: {
    alignItems: 'center',
    gap: 10,
  },
  targetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 16,
    shadowColor: '#0066FE',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  captureBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  presetsSection: {
    marginHorizontal: 16,
  },
  presetsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  presetsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  presetCardsGap: {
    gap: 10,
  },
  presetCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  presetCardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  presetIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 102, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetDiagnosis: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  presetDoctor: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  presetMeds: {
    fontSize: 11,
    color: '#60A5FA',
    marginTop: 4,
    lineHeight: 16,
  },
  presetSelectBadge: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#0066FE',
  },
  presetSelectText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // LIGHT RESULT STYLES
  topBarLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIconBoxLight: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 102, 254, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleLight: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTitleLight: {
    fontSize: 11,
    color: '#059669',
    marginTop: 1,
    fontWeight: '600',
  },
  closeBtnLight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContentLight: {
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
  bottomButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  scanAnotherBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  scanAnotherBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0066FE',
  },
  doneBtn: {
    flex: 1.2,
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
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
