import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

interface TimeSlotFilterProps {
  currentFilter: 'all' | 'morning' | 'noon' | 'evening' | 'night';
  onSelectFilter: (filter: 'all' | 'morning' | 'noon' | 'evening' | 'night') => void;
  counts: Record<string, number>;
}

export function TimeSlotFilter({ currentFilter, onSelectFilter, counts }: TimeSlotFilterProps) {
  const filters: { key: 'all' | 'morning' | 'noon' | 'evening' | 'night'; label: string; time: string }[] = [
    { key: 'all', label: 'Tất cả', time: 'Cả ngày' },
    { key: 'morning', label: 'Sáng', time: '08:00' },
    { key: 'noon', label: 'Trưa', time: '12:30' },
    { key: 'evening', label: 'Chiều', time: '18:30' },
    { key: 'night', label: 'Tối', time: '21:30' },
  ];

  return (
    <View className="mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {filters.map((f) => {
          const isSelected = currentFilter === f.key;
          const count = counts[f.key] || 0;

          return (
            <Pressable
              key={f.key}
              onPress={() => onSelectFilter(f.key)}
              className={`flex-row items-center gap-2 rounded-2xl px-4 py-2.5 border active:scale-[0.98] ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-white border-slate-200/70'
              }`}
            >
              <View>
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-zinc-800'
                  }`}
                >
                  {f.label}
                </Text>
                <Text
                  className={`text-[10px] ${
                    isSelected ? 'text-blue-100' : 'text-zinc-400'
                  }`}
                >
                  {f.time}
                </Text>
              </View>

              {count > 0 && (
                <View
                  className={`rounded-full px-2 py-0.5 ${
                    isSelected ? 'bg-blue-700/80' : 'bg-slate-100'
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      isSelected ? 'text-white' : 'text-zinc-600'
                    }`}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
