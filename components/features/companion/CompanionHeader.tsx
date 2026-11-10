import React from 'react';
import { View, Text } from 'react-native';
import { HeartHandshake, ShieldCheck } from 'lucide-react-native';

export function CompanionHeader() {
  return (
    <View className="px-5 pt-2 pb-3">
      <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 self-start mb-1.5">
        <HeartHandshake size={13} color="#E11D48" />
        <Text className="text-xs font-semibold text-rose-700">NHÁNH 3 • CHĂM SÓC NGƯỜI BỆNH</Text>
      </View>
      <Text className="text-3xl font-bold tracking-tight text-zinc-900">Trợ Lý Đồng Hành</Text>
      <Text className="text-sm text-zinc-500 mt-1">
        Bám sát phản ứng sau uống thuốc & giải đáp thắc mắc y khoa 24/7
      </Text>

      {/* Connected Doctor Badge */}
      <View className="flex-row items-center gap-2 mt-3 p-3 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
        <View className="size-8 items-center justify-center rounded-xl bg-emerald-50">
          <ShieldCheck size={18} color="#059669" />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold text-zinc-800">
            Kết nối hồ sơ: Bệnh nhân Nguyễn Văn An
          </Text>
          <Text className="text-[11px] text-zinc-500">
            Đơn thuốc hiện hành: Viêm họng cấp (BS. CKII Lê Minh Trí)
          </Text>
        </View>
      </View>
    </View>
  );
}
