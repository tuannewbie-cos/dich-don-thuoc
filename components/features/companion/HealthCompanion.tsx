import React from 'react';
import { ScrollView, View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompanionHeader } from './CompanionHeader';
import { SymptomLogger } from './SymptomLogger';
import { AIPharmacistChat } from './AIPharmacistChat';
import { EmergencySupportCard } from './EmergencySupportCard';
import { useCompanionStore } from '@/store/useCompanionStore';
import { RefreshCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export function HealthCompanion() {
  const { resetDefault } = useCompanionStore();

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F7]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <CompanionHeader />

          {/* Emergency SOS Banner */}
          <EmergencySupportCard />

          {/* Symptom Logger */}
          <SymptomLogger />

          {/* AI Pharmacist Chat */}
          <AIPharmacistChat />

          {/* Reset Demo Button */}
          <View className="mx-4 mt-4 items-center">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                resetDefault();
              }}
              className="flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-slate-200/70 active:bg-slate-300"
            >
              <RefreshCcw size={13} color="#475569" />
              <Text className="text-xs font-semibold text-slate-700">Khôi phục hội thoại mẫu (Demo)</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
