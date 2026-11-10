import React, { useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, ShieldCheck, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { ScannerViewfinder } from './ScannerViewfinder';
import { QuickPresets } from './QuickPresets';
import { AnalysisProgress } from './AnalysisProgress';
import { PrescriptionDetails } from './PrescriptionDetails';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { Prescription } from '@/types';

export function PrescriptionScanner() {
  const scrollViewRef = useRef<ScrollViewInstance>(null);

  const {
    prescriptions,
    activePrescription,
    isAnalyzing,
    analysisStep,
    syncedPrescriptionIds,
    setActivePrescription,
    setAnalyzing,
    setAnalysisStep,
    syncPrescriptionToSchedule,
  } = usePrescriptionStore();

  // Simulated AI OCR Scanning Workflow
  const runScanningSimulation = (targetPrescription: Prescription) => {
    setAnalyzing(true);
    setAnalysisStep(0);

    // Scroll to top of scanner so user sees the laser animation
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    // Step 0: Dewarping
    setTimeout(() => {
      setAnalysisStep(1);
    }, 350);

    // Step 1: Handwritten OCR
    setTimeout(() => {
      setAnalysisStep(2);
    }, 700);

    // Step 2: BioBERT NER
    setTimeout(() => {
      setAnalysisStep(3);
    }, 1050);

    // Complete: Set active prescription & finish
    setTimeout(() => {
      setActivePrescription(targetPrescription);
      setAnalyzing(false);
      setAnalysisStep(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Smoothly scroll down to the parsed structured results
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 340, animated: true });
      }, 150);
    }, 1400);
  };

  const handleCapture = () => {
    // Pick the alternative preset or cycle
    const nextRx =
      activePrescription?.id === 'rx_01'
        ? prescriptions.find((p) => p.id === 'rx_02') || prescriptions[0]
        : prescriptions[0];
    runScanningSimulation(nextRx);
  };

  const handleUpload = () => {
    // Pick preset 1
    runScanningSimulation(prescriptions[0]);
  };

  const handleSelectPreset = (rx: Prescription) => {
    runScanningSimulation(rx);
  };

  const isCurrentSynced = activePrescription
    ? syncedPrescriptionIds.includes(activePrescription.id)
    : false;

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F7]" edges={['top', 'left', 'right']}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Apple HIG Large Title Header */}
        <View className="px-5 pt-3 pb-2">
          <View className="flex-row items-center gap-2 mb-1.5">
            <View className="flex-row items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1">
              <Sparkles size={13} color="#2563EB" />
              <Text className="text-xs font-semibold text-blue-700">
                AI Medical Vision OCR
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-slate-200/60 px-2.5 py-1">
              <ShieldCheck size={12} color="#475569" />
              <Text className="text-[11px] font-medium text-slate-700">
                Dược Thư Quốc Gia
              </Text>
            </View>
          </View>
          <Text className="text-3xl font-bold tracking-tight text-zinc-900">
            Nhận Diện Đơn Thuốc
          </Text>
          <Text className="text-sm text-zinc-500 mt-1 leading-snug">
            Quét chữ viết tay bác sĩ & phiếu khám bệnh bằng AI OCR Vision
          </Text>
        </View>

        {/* 1. Camera Viewfinder Box */}
        <ScannerViewfinder
          imageUrl={activePrescription?.imageUrl}
          isAnalyzing={isAnalyzing}
          onCapture={handleCapture}
          onUpload={handleUpload}
        />

        {/* 2. Hackathon Quick Demo Presets */}
        <QuickPresets
          prescriptions={prescriptions}
          activePrescriptionId={activePrescription?.id}
          onSelectPreset={handleSelectPreset}
          disabled={isAnalyzing}
        />

        {/* 3. OCR Analysis Progress Indicator */}
        {isAnalyzing && <AnalysisProgress currentStep={analysisStep} />}

        {/* 4. Structured Prescription Results & Safety Alerts */}
        {!isAnalyzing && activePrescription && (
          <PrescriptionDetails
            prescription={activePrescription}
            isSynced={isCurrentSynced}
            onSync={syncPrescriptionToSchedule}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
