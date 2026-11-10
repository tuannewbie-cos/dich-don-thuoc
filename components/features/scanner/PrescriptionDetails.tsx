import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Pill,
  Clock,
  CalendarClock,
  ArrowRight,
  Sun,
  Moon,
  Sunset,
  Info,
  Check,
  Stethoscope,
  UserCheck,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Prescription, MedicationItem } from '@/types';

interface PrescriptionDetailsProps {
  prescription: Prescription;
  isSynced: boolean;
  onSync: (prescriptionId: string) => void;
}

export function PrescriptionDetails({
  prescription,
  isSynced,
  onSync,
}: PrescriptionDetailsProps) {
  const router = useRouter();
  const [justSynced, setJustSynced] = useState(false);

  const handleSyncPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSync(prescription.id);
    setJustSynced(true);
  };

  const handleNavigateToSchedule = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/two');
  };

  // Helper for formatted date
  const formattedDate = new Date(prescription.scanDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View className="mx-4 my-2 gap-3.5">
      {/* 1. CLINICAL INFORMATION CARD */}
      <View className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
          <View className="flex-row items-center gap-2">
            <View className="size-8 items-center justify-center rounded-xl bg-blue-50">
              <Stethoscope size={18} color="#2563EB" />
            </View>
            <Text className="text-sm font-bold text-zinc-900">Thông Tin Khám Bệnh</Text>
          </View>
          <View className="flex-row items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 border border-emerald-200/60">
            <CheckCircle2 size={12} color="#059669" />
            <Text className="text-[11px] font-semibold text-emerald-700">Đã kiểm duyệt AI</Text>
          </View>
        </View>

        {/* Hospital & Doctor Details */}
        <View className="mt-3.5 gap-2.5">
          <View className="flex-row items-center gap-2.5">
            <Building2 size={16} color="#64748B" />
            <Text className="text-xs font-semibold text-zinc-800 flex-1">
              {prescription.hospital}
            </Text>
          </View>

          <View className="flex-row items-center gap-2.5">
            <UserCheck size={16} color="#64748B" />
            <Text className="text-xs font-medium text-zinc-700 flex-1">
              Bác sĩ chỉ định: <Text className="font-semibold text-zinc-900">{prescription.doctorName}</Text>
            </Text>
          </View>

          <View className="flex-row items-center gap-2.5">
            <Calendar size={16} color="#64748B" />
            <Text className="text-xs font-medium text-zinc-500">
              Thời gian khám: {formattedDate}
            </Text>
          </View>
        </View>

        {/* Diagnosis Highlight */}
        <View className="mt-4 rounded-2xl bg-blue-50/70 p-3.5 border border-blue-100">
          <Text className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Chẩn Đoán Lâm Sàng
          </Text>
          <Text className="mt-1 text-sm font-semibold text-blue-950">
            {prescription.diagnosis}
          </Text>
        </View>
      </View>

      {/* 2. SAFETY & ALLERGY ALERT (HACKATHON SHOWSTOPPER) */}
      {prescription.safetyNotes && prescription.safetyNotes.length > 0 && (
        <View className="overflow-hidden rounded-3xl border border-amber-300/80 bg-white p-5 shadow-sm">
          <View className="flex-row items-center gap-2.5 pb-3 border-b border-amber-100">
            <View className="size-8 items-center justify-center rounded-xl bg-amber-100">
              <ShieldAlert size={18} color="#D97706" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-amber-950">
                Cảnh Báo An Toàn & Tương Tác Dược Lý
              </Text>
              <Text className="text-[11px] font-medium text-amber-800/80">
                Đối soát tự động với hồ sơ bệnh nhân & Dược thư Quốc gia
              </Text>
            </View>
          </View>

          <View className="mt-3.5 gap-2.5">
            {prescription.safetyNotes.map((note, idx) => (
              <View
                key={idx}
                className="flex-row items-start gap-2.5 rounded-2xl bg-amber-50/70 p-3 border border-amber-200/60"
              >
                <AlertTriangle size={15} color="#D97706" style={{ marginTop: 2 }} />
                <Text className="text-xs leading-relaxed text-amber-950 flex-1 font-medium">
                  {note}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 3. MEDICATIONS LIST */}
      <View className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
          <View className="flex-row items-center gap-2">
            <View className="size-8 items-center justify-center rounded-xl bg-blue-50">
              <Pill size={18} color="#2563EB" />
            </View>
            <Text className="text-sm font-bold text-zinc-900">
              Danh Mục Thuốc Bóc Tách
            </Text>
          </View>
          <View className="rounded-full bg-slate-100 px-2.5 py-1">
            <Text className="text-xs font-semibold text-slate-700">
              {prescription.medications.length} loại thuốc
            </Text>
          </View>
        </View>

        {/* Medication Cards */}
        <View className="mt-3.5 gap-3">
          {prescription.medications.map((med: MedicationItem, idx: number) => (
            <View
              key={med.id || idx}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
            >
              {/* Name, Dosage & Quantity */}
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <Text className="text-base font-bold text-zinc-900">
                      {med.name}
                    </Text>
                    <View className="rounded-md bg-blue-100 px-2 py-0.5">
                      <Text className="text-[11px] font-bold text-blue-800">
                        {med.dosage}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5">
                  <Text className="text-xs font-semibold text-zinc-700">
                    {med.quantity}
                  </Text>
                </View>
              </View>

              {/* Instruction */}
              <Text className="mt-2 text-xs font-medium text-zinc-700 leading-relaxed">
                👉 {med.instruction}
              </Text>

              {/* Time Slots Pills */}
              <View className="mt-3 flex-row flex-wrap items-center gap-1.5">
                <Text className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                  Cữ uống:
                </Text>
                {/* Morning */}
                <View
                  className={`flex-row items-center gap-1 px-2.5 py-1 rounded-xl ${
                    med.timeSlots.includes('morning')
                      ? 'bg-amber-100 border border-amber-300'
                      : 'bg-white/60 border border-slate-200/40 opacity-40'
                  }`}
                >
                  <Sun size={12} color={med.timeSlots.includes('morning') ? '#B45309' : '#94A3B8'} />
                  <Text
                    className={`text-[10px] font-semibold ${
                      med.timeSlots.includes('morning') ? 'text-amber-900' : 'text-slate-400'
                    }`}
                  >
                    Sáng
                  </Text>
                </View>

                {/* Noon */}
                <View
                  className={`flex-row items-center gap-1 px-2.5 py-1 rounded-xl ${
                    med.timeSlots.includes('noon')
                      ? 'bg-orange-100 border border-orange-300'
                      : 'bg-white/60 border border-slate-200/40 opacity-40'
                  }`}
                >
                  <Sun size={12} color={med.timeSlots.includes('noon') ? '#C2410C' : '#94A3B8'} />
                  <Text
                    className={`text-[10px] font-semibold ${
                      med.timeSlots.includes('noon') ? 'text-orange-900' : 'text-slate-400'
                    }`}
                  >
                    Trưa
                  </Text>
                </View>

                {/* Evening */}
                <View
                  className={`flex-row items-center gap-1 px-2.5 py-1 rounded-xl ${
                    med.timeSlots.includes('evening')
                      ? 'bg-indigo-100 border border-indigo-300'
                      : 'bg-white/60 border border-slate-200/40 opacity-40'
                  }`}
                >
                  <Sunset size={12} color={med.timeSlots.includes('evening') ? '#4338CA' : '#94A3B8'} />
                  <Text
                    className={`text-[10px] font-semibold ${
                      med.timeSlots.includes('evening') ? 'text-indigo-900' : 'text-slate-400'
                    }`}
                  >
                    Chiều
                  </Text>
                </View>

                {/* Night */}
                <View
                  className={`flex-row items-center gap-1 px-2.5 py-1 rounded-xl ${
                    med.timeSlots.includes('night')
                      ? 'bg-blue-100 border border-blue-300'
                      : 'bg-white/60 border border-slate-200/40 opacity-40'
                  }`}
                >
                  <Moon size={12} color={med.timeSlots.includes('night') ? '#1D4ED8' : '#94A3B8'} />
                  <Text
                    className={`text-[10px] font-semibold ${
                      med.timeSlots.includes('night') ? 'text-blue-900' : 'text-slate-400'
                    }`}
                  >
                    Tối
                  </Text>
                </View>
              </View>

              {/* Medicine Specific Warning */}
              {med.warning && (
                <View className="mt-2.5 flex-row items-center gap-1.5 rounded-xl bg-slate-200/50 px-2.5 py-1.5">
                  <Info size={12} color="#475569" />
                  <Text className="text-[11px] font-medium text-slate-700 flex-1">
                    {med.warning}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 4. SYNC SUCCESS CONFIRMATION BANNER (IF SYNCED) */}
      {(isSynced || justSynced) && (
        <View className="rounded-3xl border border-emerald-300 bg-emerald-50 p-4 shadow-sm">
          <View className="flex-row items-center gap-3">
            <View className="size-9 items-center justify-center rounded-2xl bg-emerald-600">
              <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-emerald-950">
                Đã Đồng Bộ Lịch Uống Thuốc!
              </Text>
              <Text className="text-xs text-emerald-800">
                Toàn bộ cữ thuốc đã được thiết lập theo khung giờ nhắc nhở.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleNavigateToSchedule}
            className="mt-3 flex-row items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 active:bg-emerald-700"
          >
            <Text className="text-xs font-bold text-white">Chuyển Sang Màn Hình Lịch Uống</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* 5. PRIMARY CTA BUTTON */}
      {!isSynced && !justSynced && (
        <View className="mt-2">
          <Pressable
            onPress={handleSyncPress}
            className="flex-row items-center justify-center gap-2.5 rounded-2xl bg-blue-600 py-4 px-6 shadow-sm shadow-blue-500/25 active:scale-[0.98] active:bg-blue-700"
          >
            <CalendarClock size={20} color="#FFFFFF" />
            <Text className="text-base font-bold text-white">
              Đồng bộ vào Lịch uống thuốc
            </Text>
          </Pressable>
          <Text className="text-center text-[11px] text-zinc-400 mt-2 font-medium">
            Tự động chia cữ Sáng - Trưa - Tối & đồng bộ dữ liệu sang Nhánh 2
          </Text>
        </View>
      )}
    </View>
  );
}
