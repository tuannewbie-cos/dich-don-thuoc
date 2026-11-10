import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, SafeAreaView, Image } from 'react-native';
import {
  FileText,
  FileDown,
  PhoneCall,
  Bot,
  ShieldAlert,
  CheckCircle2,
  X,
  Stethoscope,
  Building2,
  Calendar,
  Pill,
  Sparkles,
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

  const fileName = `BanDich_DonThuoc_${prescription.id}.` + (exportFormat?.toLowerCase() || 'pdf');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-[#F5F7FB]">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100">
          <View className="flex-row items-center gap-2">
            <View className="size-8 items-center justify-center rounded-xl bg-blue-50">
              <FileText size={18} color="#2563EB" />
            </View>
            <View>
              <Text className="text-base font-bold text-zinc-900">Bản Dịch Đơn Thuốc Bác Sĩ</Text>
              <Text className="text-[11px] text-emerald-600 font-semibold">
                ✓ Đã số hóa từ chữ viết tay bằng AI OCR
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            className="size-8 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
          >
            <X size={18} color="#64748B" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 50 }}
        >
          {/* Quick Action Bar: Export PDF, DOCX, Call 115 */}
          <View className="flex-row gap-2 mb-4">
            <Pressable
              onPress={() => handleExport('PDF')}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-2xl bg-blue-600 active:scale-[0.98] shadow-sm shadow-blue-500/25"
            >
              <FileDown size={16} color="#FFFFFF" />
              <Text className="text-xs font-bold text-white">Xuất PDF</Text>
            </Pressable>

            <Pressable
              onPress={() => handleExport('DOCX')}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-2xl bg-indigo-600 active:scale-[0.98] shadow-sm shadow-indigo-500/25"
            >
              <FileDown size={16} color="#FFFFFF" />
              <Text className="text-xs font-bold text-white">Xuất DOCX</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEmergency(true)}
              className="flex-row items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-rose-50 border border-rose-200 active:scale-[0.98]"
            >
              <PhoneCall size={16} color="#E11D48" />
              <Text className="text-xs font-bold text-rose-700">Gọi 115</Text>
            </Pressable>
          </View>

          {/* Scanned Original Photo Comparison */}
          {prescription.imageUrl && (
            <View className="mb-4 overflow-hidden rounded-[26px] bg-white p-3.5 border border-slate-100 shadow-sm">
              <View className="flex-row items-center justify-between mb-2 px-1">
                <Text className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Ảnh Chụp Đơn Viết Tay Bác Sĩ (Gốc)
                </Text>
                <View className="px-2 py-0.5 rounded-full bg-blue-50">
                  <Text className="text-[10px] font-bold text-blue-700">Độ tin cậy 99.4%</Text>
                </View>
              </View>
              <Image
                source={{ uri: prescription.imageUrl }}
                className="w-full h-36 rounded-2xl bg-slate-100"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Hospital & Doctor Metadata Card */}
          <View className="mb-4 overflow-hidden rounded-[28px] bg-white p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center gap-3 pb-3 border-b border-slate-100">
              <View className="size-11 items-center justify-center rounded-2xl bg-blue-50">
                <Stethoscope size={22} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-zinc-900">{prescription.doctorName}</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Building2 size={12} color="#64748B" />
                  <Text className="text-xs text-zinc-500" numberOfLines={1}>
                    {prescription.hospital}
                  </Text>
                </View>
              </View>
            </View>

            {/* Diagnosis */}
            <View className="pt-3">
              <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Chẩn Đoán Lâm Sàng
              </Text>
              <View className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100/80">
                <Text className="text-sm font-bold text-blue-900">{prescription.diagnosis}</Text>
              </View>
            </View>
          </View>

          {/* Safety Warnings Banner */}
          {prescription.safetyNotes && prescription.safetyNotes.length > 0 && (
            <View className="mb-4 overflow-hidden rounded-[26px] bg-amber-50/80 p-4 border border-amber-200/80 shadow-sm">
              <View className="flex-row items-center gap-2 mb-2">
                <ShieldAlert size={18} color="#D97706" />
                <Text className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Cảnh Báo An Toàn & Kiêng Khem
                </Text>
              </View>
              {prescription.safetyNotes.map((note, idx) => (
                <Text key={idx} className="text-xs text-amber-900 leading-relaxed mb-1">
                  • {note}
                </Text>
              ))}
            </View>
          )}

          {/* Translated Medications Table */}
          <View className="mb-4 overflow-hidden rounded-[28px] bg-white p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <View className="flex-row items-center gap-2">
                <Pill size={18} color="#2563EB" />
                <Text className="text-sm font-bold text-zinc-900">
                  Danh Mục Thuốc Đã Dịch ({prescription.medications.length} loại)
                </Text>
              </View>
              <Text className="text-xs text-zinc-400">Chuẩn hóa GPP</Text>
            </View>

            <View className="gap-3">
              {prescription.medications.map((med, index) => (
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

                  {/* Time slots badges */}
                  <View className="flex-row items-center gap-1.5">
                    {med.timeSlots.map((slot) => {
                      const labels: Record<string, string> = {
                        morning: 'Sáng',
                        noon: 'Trưa',
                        evening: 'Chiều',
                        night: 'Tối',
                      };
                      return (
                        <View key={slot} className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                          <Text className="text-[10px] font-semibold text-slate-700">
                            {labels[slot] || slot}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Ask AI Doctor Banner */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
              if (onOpenChatbot) onOpenChatbot();
            }}
            className="flex-row items-center justify-between p-4 rounded-[26px] bg-gradient-to-r from-blue-600 to-indigo-600 bg-blue-600 shadow-md shadow-blue-500/25 active:scale-[0.98]"
          >
            <View className="flex-row items-center gap-3">
              <View className="size-10 items-center justify-center rounded-2xl bg-white/20">
                <Bot size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-sm font-bold text-white">Bạn chưa hiểu rõ đơn thuốc này?</Text>
                <Text className="text-xs text-blue-100">Bấm để chat với Bác Sĩ Dược Sĩ AI ngay</Text>
              </View>
            </View>
            <ArrowRight size={18} color="#FFFFFF" />
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

        {/* Emergency 115 Modal */}
        <EmergencyCallModal
          visible={showEmergency}
          onClose={() => setShowEmergency(false)}
        />
      </SafeAreaView>
    </Modal>
  );
}
