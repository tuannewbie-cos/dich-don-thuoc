import React, { useState } from 'react';
import { View, Text, Pressable, Modal, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { X, ScanLine, Sparkles, Stethoscope, HeartPulse, FileText, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { Prescription } from '@/types';
import { PrescriptionTranslationModal } from './PrescriptionTranslationModal';

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

  const [showTranslation, setShowTranslation] = useState(false);

  const handleScanPreset = (rx: Prescription) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAnalyzing(true);

    // Fast simulated scan (500ms) with zero UI freeze
    setTimeout(() => {
      setAnalyzing(false);
      addScannedPrescription(rx);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowTranslation(true);
    }, 600);
  };

  return (
    <>
      <Modal visible={visible && !showTranslation} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
        <SafeAreaView style={styles.safeArea}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <ScanLine size={18} color="#60A5FA" />
              </View>
              <View>
                <Text style={styles.title}>Quét Đơn Viết Tay Bác Sĩ</Text>
                <Text style={styles.subTitle}>Dịch tự động chữ bác sĩ sang văn bản</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={styles.closeBtn}
            >
              <X size={20} color="#E2E8F0" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Camera Viewfinder Box */}
            <View style={styles.viewfinderBox}>
              <View style={styles.viewfinderFrame}>
                {/* Corner brackets */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />

                <View style={styles.centerTarget}>
                  <ScanLine size={48} color="#60A5FA" strokeWidth={1.5} />
                  <Text style={styles.targetText}>
                    {isAnalyzing ? 'Đang dịch chữ bác sĩ bằng AI...' : 'Đặt đơn thuốc vào khung hình'}
                  </Text>
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
                <Text style={styles.presetsTitle}>Đơn Thuốc Viết Tay Mẫu (Test Nhanh):</Text>
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
                        <Text style={styles.presetDoctor}>{rx.doctorName} • {rx.hospital}</Text>
                        <Text style={styles.presetMeds}>
                          Gồm {rx.medications.length} loại thuốc ({rx.medications.map((m) => m.name).join(', ')})
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
        </SafeAreaView>
      </Modal>

      {/* Prescription Translation Modal (Opened ONLY after closing scanner to avoid modal deadlock on iOS) */}
      <PrescriptionTranslationModal
        visible={showTranslation}
        prescription={activePrescription}
        onClose={() => {
          setShowTranslation(false);
          onClose();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBar: {
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
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(37,99,235,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
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
    backgroundColor: 'rgba(0,102,254,0.15)',
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
});
