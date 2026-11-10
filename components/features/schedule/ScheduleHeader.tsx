import React from 'react';
import { View, Text } from 'react-native';
import { CalendarClock, Flame, CheckCircle2, AlertCircle } from 'lucide-react-native';

interface ScheduleHeaderProps {
  totalCount: number;
  completedCount: number;
}

export function ScheduleHeader({ totalCount, completedCount }: ScheduleHeaderProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <View className="pt-2 pb-3">
      {/* Title block */}
      <View className="px-5 pb-3">
        <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 self-start mb-1.5">
          <CalendarClock size={13} color="#2563EB" />
          <Text className="text-xs font-semibold text-blue-700">NHÁNH 2 • PHÁC ĐỒ ĐIỀU TRỊ</Text>
        </View>
        <Text className="text-3xl font-bold tracking-tight text-zinc-900">Lịch Uống Thuốc</Text>
        <Text className="text-sm text-zinc-500 mt-1">
          Theo dõi tuân thủ liều dùng hàng ngày & tự động nhắc giờ
        </Text>
      </View>

      {/* Adherence Streak Card */}
      <View className="mx-4 my-2 overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="size-9 items-center justify-center rounded-xl bg-orange-50">
              <Flame size={20} color="#EA580C" />
            </View>
            <View>
              <Text className="text-sm font-bold text-zinc-900">Tiến Độ Uống Thuốc Hôm Nay</Text>
              <Text className="text-xs text-zinc-400">Chuỗi tuân thủ: 5 ngày liên tiếp 🔥</Text>
            </View>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${
              isAllDone ? 'bg-emerald-100' : 'bg-blue-100'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                isAllDone ? 'text-emerald-800' : 'text-blue-700'
              }`}
            >
              {percentage}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
          <View
            className={`h-full rounded-full ${
              isAllDone ? 'bg-emerald-500' : 'bg-blue-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </View>

        {/* Status text */}
        <View className="flex-row items-center justify-between pt-1">
          <Text className="text-xs text-zinc-500">
            Đã uống <Text className="font-bold text-zinc-800">{completedCount}</Text> / {totalCount} cữ
          </Text>
          <Text className="text-xs font-medium text-zinc-400">
            {isAllDone ? 'Đã hoàn thành xuất sắc!' : `Còn ${totalCount - completedCount} cữ cần uống`}
          </Text>
        </View>
      </View>
    </View>
  );
}
