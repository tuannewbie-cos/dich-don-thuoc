import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Activity, Plus, CheckCircle2, AlertTriangle, Smile, Meh, Frown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCompanionStore } from '@/store/useCompanionStore';

const COMMON_SYMPTOMS = [
  'Đắng miệng',
  'Buồn nôn',
  'Chóng mặt',
  'Phát ban ngứa',
  'Khó ngủ',
  'Đau dạ dày',
  'Mệt mỏi',
];

export function SymptomLogger() {
  const { logs, addSymptomLog } = useCompanionStore();
  const [selectedFeeling, setSelectedFeeling] = useState<'well' | 'moderate' | 'unwell'>('moderate');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Đắng miệng']);
  const [justLogged, setJustLogged] = useState(false);

  const toggleSymptom = (sym: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSaveLog = () => {
    addSymptomLog(
      selectedFeeling,
      selectedSymptoms,
      selectedSymptoms.length > 0
        ? `Ghi nhận triệu chứng sau cữ thuốc: ${selectedSymptoms.join(', ')}`
        : 'Cảm giác bình thường sau uống thuốc'
    );
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2500);
  };

  return (
    <View className="mx-4 my-2 overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <View className="flex-row items-center gap-2.5">
          <View className="size-9 items-center justify-center rounded-xl bg-rose-50">
            <Activity size={20} color="#E11D48" />
          </View>
          <View>
            <Text className="text-base font-bold text-zinc-900">Nhật Ký Triệu Chứng</Text>
            <Text className="text-xs text-zinc-400">Ghi nhận phản ứng thuốc sau 30-60 phút</Text>
          </View>
        </View>
        <View className="rounded-full bg-rose-50 px-2.5 py-0.5">
          <Text className="text-[11px] font-semibold text-rose-700">Theo dõi 24h</Text>
        </View>
      </View>

      {/* Feeling Select */}
      <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
        Bạn cảm thấy thế nào lúc này?
      </Text>
      <View className="flex-row gap-2 mb-4">
        {[
          { key: 'well', label: 'Khỏe', icon: Smile, color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-300' },
          { key: 'moderate', label: 'Hơi mệt', icon: Meh, color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-300' },
          { key: 'unwell', label: 'Khó chịu', icon: Frown, color: '#DC2626', bg: 'bg-rose-50', border: 'border-rose-300' },
        ].map((f) => {
          const isSelected = selectedFeeling === f.key;
          const IconComp = f.icon;
          return (
            <Pressable
              key={f.key}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedFeeling(f.key as any);
              }}
              className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-2xl border active:scale-[0.98] ${
                isSelected
                  ? `${f.bg} ${f.border} shadow-sm`
                  : 'bg-slate-50 border-slate-200/60'
              }`}
            >
              <IconComp size={16} color={f.color} />
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-zinc-900' : 'text-zinc-600'
                }`}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Symptom Multi-Select Chips */}
      <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
        Triệu chứng xuất hiện (chọn nếu có):
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {COMMON_SYMPTOMS.map((sym) => {
          const isChecked = selectedSymptoms.includes(sym);
          return (
            <Pressable
              key={sym}
              onPress={() => toggleSymptom(sym)}
              className={`px-3 py-1.5 rounded-full border active:scale-[0.97] ${
                isChecked
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-slate-50 border-slate-200/80 text-zinc-600'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isChecked ? 'text-rose-800 font-bold' : 'text-zinc-600'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {sym}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleSaveLog}
        className={`flex-row items-center justify-center gap-2 rounded-2xl py-3 px-4 active:scale-[0.98] shadow-sm ${
          justLogged ? 'bg-emerald-600' : 'bg-blue-600 shadow-blue-500/25'
        }`}
      >
        {justLogged ? (
          <>
            <CheckCircle2 size={18} color="#FFFFFF" />
            <Text className="text-sm font-bold text-white">Đã lưu vào hồ sơ bác sĩ!</Text>
          </>
        ) : (
          <>
            <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text className="text-sm font-bold text-white">Ghi Nhận Triệu Chứng Này</Text>
          </>
        )}
      </Pressable>

      {/* Recent History Preview */}
      {logs.length > 0 && (
        <View className="mt-4 pt-3 border-t border-slate-100">
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Lịch sử phản ứng gần nhất ({logs.length})
          </Text>
          <View className="p-3 rounded-2xl bg-slate-50 border border-slate-200/50">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-1.5">
                <AlertTriangle size={13} color="#D97706" />
                <Text className="text-xs font-bold text-zinc-800">
                  {logs[0].symptoms.join(', ') || 'Không có triệu chứng phụ'}
                </Text>
              </View>
              <Text className="text-[10px] text-zinc-400">
                {new Date(logs[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Text className="text-xs text-zinc-500">
              {logs[0].notes || 'Tình trạng ổn định.'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
