import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CheckCircle2, Circle, Clock, Pill } from 'lucide-react-native';
import { ScheduleItem } from '@/types';

interface ScheduleCardProps {
  item: ScheduleItem;
  onToggle: (id: string) => void;
}

const slotLabels: Record<string, { label: string; badgeBg: string; textCol: string }> = {
  morning: { label: 'Sáng', badgeBg: 'bg-amber-100', textCol: 'text-amber-800' },
  noon: { label: 'Trưa', badgeBg: 'bg-orange-100', textCol: 'text-orange-800' },
  evening: { label: 'Chiều', badgeBg: 'bg-indigo-100', textCol: 'text-indigo-800' },
  night: { label: 'Tối', badgeBg: 'bg-purple-100', textCol: 'text-purple-800' },
};

export function ScheduleCard({ item, onToggle }: ScheduleCardProps) {
  const slotInfo = slotLabels[item.timeSlot] || {
    label: 'Cữ thuốc',
    badgeBg: 'bg-slate-100',
    textCol: 'text-slate-800',
  };

  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      className={`mx-4 my-1.5 overflow-hidden rounded-3xl border p-4 shadow-sm active:scale-[0.99] active:opacity-90 transition-all ${
        item.taken
          ? 'border-emerald-200/80 bg-emerald-50/40'
          : 'border-slate-200/60 bg-white'
      }`}
    >
      <View className="flex-row items-center justify-between">
        {/* Left Info */}
        <View className="flex-row items-center gap-3.5 flex-1 pr-3">
          {/* Slot Icon Container */}
          <View
            className={`size-11 items-center justify-center rounded-2xl ${
              item.taken ? 'bg-emerald-100' : 'bg-blue-50'
            }`}
          >
            <Pill size={22} color={item.taken ? '#059669' : '#2563EB'} />
          </View>

          <View className="flex-1">
            {/* Header badges: Time + Slot */}
            <View className="flex-row items-center gap-1.5 mb-1">
              <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100">
                <Clock size={11} color="#64748B" />
                <Text className="text-[11px] font-semibold text-slate-700">{item.time}</Text>
              </View>
              <View className={`px-2 py-0.5 rounded-full ${slotInfo.badgeBg}`}>
                <Text className={`text-[11px] font-semibold ${slotInfo.textCol}`}>
                  {slotInfo.label}
                </Text>
              </View>
              {item.taken && (
                <View className="px-2 py-0.5 rounded-full bg-emerald-100">
                  <Text className="text-[11px] font-semibold text-emerald-800">
                    Đã uống {item.takenAt ? `• ${item.takenAt}` : ''}
                  </Text>
                </View>
              )}
            </View>

            {/* Medicine Name */}
            <Text
              className={`text-base font-semibold leading-snug ${
                item.taken ? 'text-zinc-500 line-through' : 'text-zinc-900'
              }`}
            >
              {item.medicationName}
            </Text>

            {/* Dosage & Instruction */}
            <Text className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
              Liều dùng: <Text className="font-semibold text-zinc-700">{item.dosage}</Text> •{' '}
              {item.instructions}
            </Text>
          </View>
        </View>

        {/* Checkbox Button */}
        <View className="pl-1">
          {item.taken ? (
            <View className="size-8 items-center justify-center rounded-full bg-emerald-600">
              <CheckCircle2 size={24} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          ) : (
            <View className="size-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
              <Circle size={20} color="#CBD5E1" strokeWidth={2} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
