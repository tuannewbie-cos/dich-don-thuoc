import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sparkles, Stethoscope, HeartPulse, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Prescription } from '@/types';

interface QuickPresetsProps {
  prescriptions: Prescription[];
  activePrescriptionId?: string;
  onSelectPreset: (prescription: Prescription) => void;
  disabled?: boolean;
}

export function QuickPresets({
  prescriptions,
  activePrescriptionId,
  onSelectPreset,
  disabled = false,
}: QuickPresetsProps) {
  const throatRx = prescriptions.find((p) => p.id === 'rx_01') || prescriptions[0];
  const heartRx = prescriptions.find((p) => p.id === 'rx_02') || prescriptions[1];

  const presets = [
    {
      rx: throatRx,
      title: 'Đơn Viêm Họng Cấp',
      hospitalTag: 'Bạch Mai • Tai Mũi Họng',
      summary: 'Kháng sinh Clarithromycin, Hạ sốt, Kháng histamine',
      icon: Stethoscope,
      accentColor: '#2563EB',
      bgColor: 'bg-blue-50',
    },
    {
      rx: heartRx,
      title: 'Đơn Tim Mạch & Huyết Áp',
      hospitalTag: 'Viện Tim Mạch • Tăng Huyết Áp',
      summary: 'Amlodipine, Losartan, Hạ mỡ máu Atorvastatin',
      icon: HeartPulse,
      accentColor: '#DC2626',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <View className="mx-4 my-2">
      {/* Section Header */}
      <View className="flex-row items-center justify-between px-1 mb-2">
        <View className="flex-row items-center gap-1.5">
          <Sparkles size={14} color="#2563EB" />
          <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Demo Nhanh Ban Giám Khảo (Presets)
          </Text>
        </View>
        <Text className="text-[11px] font-medium text-blue-600">Chọn để test ngay</Text>
      </View>

      {/* Preset Cards */}
      <View className="gap-2.5">
        {presets.map((item, index) => {
          if (!item.rx) return null;
          const isSelected = activePrescriptionId === item.rx.id;
          const Icon = item.icon;

          return (
            <Pressable
              key={item.rx.id || index}
              disabled={disabled}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelectPreset(item.rx);
              }}
              className={`rounded-2xl border p-3.5 transition-all active:scale-[0.98] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200/80 bg-white shadow-sm'
              }`}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className={`size-10 items-center justify-center rounded-xl ${item.bgColor}`}
                >
                  <Icon size={20} color={item.accentColor} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-zinc-900">{item.title}</Text>
                    {isSelected && (
                      <View className="flex-row items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5">
                        <CheckCircle2 size={11} color="#FFFFFF" />
                        <Text className="text-[10px] font-semibold text-white">Đang chọn</Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {item.hospitalTag}
                  </Text>
                  <Text className="text-xs text-zinc-600 mt-1 leading-snug">
                    {item.summary}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
