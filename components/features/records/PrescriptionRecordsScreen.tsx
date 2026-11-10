import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView, Image } from 'react-native';
import {
  FileText,
  FileDown,
  PhoneCall,
  Bot,
  Stethoscope,
  Building2,
  Calendar,
  Pill,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { ExportSuccessModal } from '@/components/ui/ExportSuccessModal';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';
import { DoctorChatbotModal } from '@/components/features/companion/DoctorChatbotModal';
import { Prescription } from '@/types';

export function PrescriptionRecordsScreen() {
  const { prescriptions, activePrescription, setActivePrescription } = usePrescriptionStore();
  const [selectedRx, setSelectedRx] = useState<Prescription>(activePrescription || prescriptions[0]);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'DOCX' | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleExport = (format: 'PDF' | 'DOCX') => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setExportFormat(format);
  };

  const fileName = `BanDich_DonThuoc_${selectedRx.id}.${exportFormat?.toLowerCase() || 'pdf'}`;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Header */}
        <View className="px-5 pt-3 pb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 self-start mb-1">
              <FileText size={13} color="#2563EB" />
              <Text className="text-xs font-bold text-blue-700">BẢN DỊCH CHỮ BÁC SĨ</Text>
            </View>

            {/* Quick 115 SOS */}
            <Pressable
              onPress={() => setShowEmergency(true)}
              className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 active:scale-[0.95]"
            >
              <PhoneCall size={12} color="#E11D48" />
              <Text className="text-xs font-bold text-rose-700">115 Cấp Cứu</Text>
            </Pressable>
          </View>
          <Text className="text-3xl font-extrabold tracking-tight text-zinc-900 mt-1">
            Bản Dịch Đơn Thuốc
          </Text>
          <Text className="text-xs text-zinc-500 mt-0.5">
            Đã dịch tự động từ chữ viết tay & lưu trữ chuẩn y khoa
          </Text>
        </View>

        {/* 2 Big Export Buttons (PDF & DOCX) */}
        <View className="flex-row gap-2.5 px-4 mb-4">
          <Pressable
            onPress={() => handleExport('PDF')}
            className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 shadow-md shadow-blue-500/25 active:scale-[0.98]"
          >
            <FileDown size={18} color="#FFFFFF" strokeWidth={2.2} />
            <Text className="text-sm font-bold text-white">Xuất File PDF</Text>
          </Pressable>

          <Pressable
            onPress={() => handleExport('DOCX')}
            className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-500/25 active:scale-[0.98]"
          >
            <FileDown size={18} color="#FFFFFF" strokeWidth={2.2} />
            <Text className="text-sm font-bold text-white">Xuất File DOCX</Text>
          </Pressable>
        </View>

        {/* Prescription Switcher Pills */}
        <View className="px-4 mb-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1">
            Chọn đơn thuốc cần xem / xuất:
          </Text>
          <View className="flex-row gap-2">
            {prescriptions.map((rx) => {
              const isSelected = selectedRx.id === rx.id;
              return (
                <Pressable
                  key={rx.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedRx(rx);
                    setActivePrescription(rx);
                  }}
                  className={`flex-1 p-3 rounded-2xl border active:scale-[0.98] ${
                    isSelected
                      ? 'bg-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-slate-50 border-slate-200/60'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-blue-700' : 'text-zinc-700'
                    }`}
                    numberOfLines={1}
                  >
                    {rx.diagnosis}
                  </Text>
                  <Text className="text-[10px] text-zinc-400 mt-0.5">{rx.doctorName}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Prescription Metadata Card */}
        <View className="mx-4 mb-4 rounded-[28px] bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100">
          <View className="flex-row items-center gap-3 pb-3 border-b border-slate-100">
            <View className="size-11 items-center justify-center rounded-2xl bg-blue-50">
              <Stethoscope size={22} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-zinc-900">{selectedRx.doctorName}</Text>
              <Text className="text-xs text-zinc-500">{selectedRx.hospital}</Text>
            </View>
          </View>

          <View className="pt-3">
            <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Chẩn Đoán Lâm Sàng
            </Text>
            <View className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
              <Text className="text-sm font-bold text-blue-900">{selectedRx.diagnosis}</Text>
            </View>
          </View>
        </View>

        {/* Safety Warnings Banner */}
        {selectedRx.safetyNotes && selectedRx.safetyNotes.length > 0 && (
          <View className="mx-4 mb-4 rounded-[26px] bg-amber-50/80 p-4 border border-amber-200/80">
            <View className="flex-row items-center gap-2 mb-2">
              <ShieldAlert size={18} color="#D97706" />
              <Text className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Lưu Ý Dược Học & Cảnh Báo An Toàn
              </Text>
            </View>
            {selectedRx.safetyNotes.map((note, idx) => (
              <Text key={idx} className="text-xs text-amber-900 leading-relaxed mb-1">
                • {note}
              </Text>
            ))}
          </View>
        )}

        {/* Translated Medicine Items */}
        <View className="mx-4 mb-4 rounded-[28px] bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100">
          <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <View className="flex-row items-center gap-2">
              <Pill size={18} color="#2563EB" />
              <Text className="text-sm font-bold text-zinc-900">
                Thuốc Đã Dịch ({selectedRx.medications.length} loại)
              </Text>
            </View>
            <Text className="text-xs text-zinc-400">Chuẩn GPP</Text>
          </View>

          <View className="gap-3">
            {selectedRx.medications.map((med, index) => (
              <View
                key={med.id || index}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60"
              >
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2">
                    <View className="size-6 items-center justify-center rounded-lg bg-blue-100">
                      <Text className="text-xs font-bold text-blue-700">{index + 1}</Text>
                    </View>
                    <Text className="text-base font-bold text-zinc-900">{med.name}</Text>
                  </View>
                  <View className="px-2.5 py-0.5 rounded-full bg-blue-100">
                    <Text className="text-xs font-bold text-blue-800">{med.dosage}</Text>
                  </View>
                </View>

                <Text className="text-xs text-zinc-600 leading-relaxed mb-2">
                  Số lượng: <Text className="font-bold text-zinc-800">{med.quantity}</Text> •{' '}
                  {med.instruction}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Chat with AI Doctor Banner */}
        <View className="mx-4 mb-4">
          <Pressable
            onPress={() => setShowChatbot(true)}
            className="flex-row items-center justify-between p-4 rounded-[26px] bg-blue-600 shadow-md shadow-blue-500/25 active:scale-[0.98]"
          >
            <View className="flex-row items-center gap-3">
              <View className="size-10 items-center justify-center rounded-2xl bg-white/20">
                <Bot size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-sm font-bold text-white">Hỏi Bác Sĩ AI Về Đơn Này</Text>
                <Text className="text-xs text-blue-100">Giải thích chi tiết tác dụng phụ & kiêng khem</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#FFFFFF" />
          </Pressable>
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

      {/* Chatbot Modal */}
      <DoctorChatbotModal
        visible={showChatbot}
        onClose={() => setShowChatbot(false)}
      />
    </SafeAreaView>
  );
}
