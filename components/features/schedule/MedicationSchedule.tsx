import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useScheduleStore } from '@/store/useScheduleStore';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { ScheduleHeader } from './ScheduleHeader';
import { TimeSlotFilter } from './TimeSlotFilter';
import { ScheduleCard } from './ScheduleCard';
import { Sparkles, RefreshCcw, Check, ArrowRight, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export function MedicationSchedule() {
  const { items, selectedFilter, setFilter, toggleTaken, syncFromPrescription, resetDefault } =
    useScheduleStore();
  const { activePrescription, syncedPrescriptionIds, syncPrescriptionToSchedule } =
    usePrescriptionStore();

  const isSynced = activePrescription
    ? syncedPrescriptionIds.includes(activePrescription.id)
    : true;

  // Counts for each slot
  const slotCounts = useMemo(() => {
    return {
      all: items.length,
      morning: items.filter((i) => i.timeSlot === 'morning').length,
      noon: items.filter((i) => i.timeSlot === 'noon').length,
      evening: items.filter((i) => i.timeSlot === 'evening').length,
      night: items.filter((i) => i.timeSlot === 'night').length,
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (selectedFilter === 'all') return items;
    return items.filter((i) => i.timeSlot === selectedFilter);
  }, [items, selectedFilter]);

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.taken).length;

  const handleSyncPrescription = () => {
    if (activePrescription) {
      syncFromPrescription(activePrescription);
      syncPrescriptionToSchedule(activePrescription.id);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F7]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header with Adherence Card */}
        <ScheduleHeader totalCount={totalCount} completedCount={completedCount} />

        {/* Sync From Scanner Banner (Connects Branch 1 to Branch 2) */}
        {activePrescription && !isSynced && (
          <View className="mx-4 mb-3 overflow-hidden rounded-3xl border border-blue-200/80 bg-blue-50/70 p-4 shadow-sm">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="size-9 items-center justify-center rounded-xl bg-blue-600">
                <Sparkles size={18} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-blue-900">
                  Có đơn thuốc mới từ Bác sĩ ({activePrescription.doctorName})
                </Text>
                <Text className="text-xs text-blue-700">
                  Chẩn đoán: {activePrescription.diagnosis} ({activePrescription.medications.length} loại thuốc)
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleSyncPrescription}
              className="mt-1 flex-row items-center justify-center gap-2 rounded-2xl bg-blue-600 py-2.5 px-4 active:scale-[0.98] shadow-sm shadow-blue-500/20"
            >
              <Text className="text-xs font-semibold text-white">
                Đồng bộ vào lịch uống hôm nay
              </Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        )}

        {/* Time Slot Horizontal Filters */}
        <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-5 mb-2 mt-1">
          Lọc Theo Khung Giờ
        </Text>
        <TimeSlotFilter
          currentFilter={selectedFilter}
          onSelectFilter={setFilter}
          counts={slotCounts}
        />

        {/* Medication Cards List */}
        <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-5 mb-2 mt-2">
          Danh Sách Cữ Thuốc ({filteredItems.length})
        </Text>

        {filteredItems.length === 0 ? (
          <View className="mx-4 my-6 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8">
            <ShieldCheck size={36} color="#94A3B8" />
            <Text className="text-base font-semibold text-zinc-700 mt-2">
              Không có cữ thuốc nào
            </Text>
            <Text className="text-xs text-zinc-400 text-center mt-1">
              Khung giờ này bạn không cần phải uống thuốc.
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <ScheduleCard key={item.id} item={item} onToggle={toggleTaken} />
          ))
        )}

        {/* Hackathon Reset Button */}
        <View className="mx-4 mt-6 items-center">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              resetDefault();
            }}
            className="flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-slate-200/70 active:bg-slate-300"
          >
            <RefreshCcw size={13} color="#475569" />
            <Text className="text-xs font-semibold text-slate-700">Khôi phục dữ liệu mẫu (Demo)</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
