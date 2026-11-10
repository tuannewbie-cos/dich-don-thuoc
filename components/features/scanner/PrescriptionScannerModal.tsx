import React, { useState } from 'react';
import { View, Text, Pressable, Modal, SafeAreaView, ScrollView } from 'react-native';
import { X, Camera, Image as ImageIcon, Sparkles, Stethoscope, HeartPulse, ScanLine } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ScannerViewfinder } from './ScannerViewfinder';
import { AnalysisProgress } from './AnalysisProgress';
import { QuickPresets } from './QuickPresets';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { Prescription } from '@/types';
import { PrescriptionTranslationModal } from './PrescriptionTranslationModal';

interface PrescriptionScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenChatbot?: () => void;
}

export function PrescriptionScannerModal({
  visible,
  onClose,
  onOpenChatbot,
}: PrescriptionScannerModalProps) {
  const {
    prescriptions,
    activePrescription,
    isAnalyzing,
    analysisStep,
    setActivePrescription,
    setAnalyzing,
    setAnalysisStep,
  } = usePrescriptionStore();

  const [showTranslation, setShowTranslation] = useState(false);

  const startAnalysis = (selectedRx: Prescription) => {
    setActivePrescription(selectedRx);
    setAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      usePrescriptionStore.setState((state) => {
        if (state.analysisStep < 3) {
          return { analysisStep: state.analysisStep + 1 };
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setAnalyzing(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowTranslation(true);
          }, 400);
          return { isAnalyzing: false };
        }
      });
    }, 700);
  };

  const handleCapture = () => {
    startAnalysis(prescriptions[0]);
  };

  const handleSelectPreset = (rx: Prescription) => {
    startAnalysis(rx);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-[#0F172A]">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <View className="flex-row items-center gap-2">
            <View className="size-8 items-center justify-center rounded-xl bg-blue-600/30">
              <ScanLine size={18} color="#60A5FA" />
            </View>
            <View>
              <Text className="text-base font-bold text-white">Quét Chữ Viết Tay Bác Sĩ</Text>
              <Text className="text-[11px] text-blue-300">Nhận diện đơn thuốc & phiếu khám</Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            className="size-9 items-center justify-center rounded-full bg-slate-800 active:bg-slate-700"
          >
            <X size={20} color="#E2E8F0" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Scanner Viewfinder Box */}
          <ScannerViewfinder
            isAnalyzing={isAnalyzing}
            onCapture={handleCapture}
            onUpload={handleCapture}
          />

          {/* AI OCR Analysis Step Indicator */}
          {isAnalyzing && (
            <View className="mx-4 my-2">
              <AnalysisProgress currentStep={analysisStep} />
            </View>
          )}

          {/* Quick Presets Demo */}
          <View className="mt-2">
            <QuickPresets
              prescriptions={prescriptions}
              activePrescriptionId={activePrescription?.id}
              onSelectPreset={handleSelectPreset}
              disabled={isAnalyzing}
            />
          </View>

          {/* View Last Translation CTA */}
          {activePrescription && !isAnalyzing && (
            <View className="mx-4 mt-3">
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowTranslation(true);
                }}
                className="flex-row items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/20 py-3.5 px-4 active:bg-white/20"
              >
                <Text className="text-sm font-semibold text-white">
                  Xem lại Bản Dịch gần nhất ({activePrescription.doctorName})
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {/* Prescription Translation Modal */}
        <PrescriptionTranslationModal
          visible={showTranslation}
          prescription={activePrescription}
          onClose={() => setShowTranslation(false)}
          onOpenChatbot={onOpenChatbot}
        />
      </SafeAreaView>
    </Modal>
  );
}
