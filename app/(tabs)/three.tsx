import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartHandshake, MessageSquareHeart, Sparkles, Activity, ShieldCheck, Stethoscope } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function TabThreeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F7]" edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Large Title Header */}
        <View className="px-5 pt-3 pb-4">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100">
              <Sparkles size={13} color="#2563EB" />
              <Text className="text-xs font-semibold text-blue-700">Trợ Lý Sức Khỏe AI</Text>
            </View>
          </View>
          <Text className="text-3xl font-bold tracking-tight text-zinc-900">Đồng Hành</Text>
          <Text className="text-sm text-zinc-500 mt-1">
            Theo dõi phản ứng sau uống thuốc & trò chuyện cùng trợ lý y tế
          </Text>
        </View>

        {/* Placeholder Feature Card for Branch 3 */}
        <View className="mx-4 my-2 rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="size-12 items-center justify-center rounded-2xl bg-rose-50">
              <HeartHandshake size={24} color="#E11D48" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-zinc-900">Báo Cáo Triệu Chứng</Text>
              <Text className="text-xs text-zinc-400">Ghi nhận phản ứng thuốc sau 30 phút</Text>
            </View>
            <View className="px-2.5 py-1 rounded-full bg-slate-100">
              <Text className="text-xs font-medium text-slate-600">Nhánh 3</Text>
            </View>
          </View>

          <View className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <View className="flex-row items-center gap-2 mb-2">
              <Activity size={16} color="#2563EB" />
              <Text className="text-sm font-semibold text-zinc-800">Cảm giác hiện tại của bạn?</Text>
            </View>
            <Text className="text-xs text-zinc-500 leading-relaxed mb-3">
              Sau khi uống Clarithromycin lúc 08:00 sáng, hệ thống ghi nhận bạn chưa có phản ứng phụ nghiêm trọng nào.
            </Text>
            <View className="flex-row gap-2">
              {['Khỏe mạnh 😃', 'Hơi mệt 😐', 'Đắng miệng 🍋'].map((label, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 active:bg-blue-50"
                >
                  <Text className="text-xs font-medium text-zinc-700">{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* AI Health Companion Card */}
        <View className="mx-4 my-2 rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="size-10 items-center justify-center rounded-2xl bg-blue-50">
              <MessageSquareHeart size={20} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-zinc-900">Hỏi Đáp Thuốc & Tương Tác</Text>
              <Text className="text-xs text-zinc-400">Chatbot AI được huấn luyện theo dược thư Bộ Y Tế</Text>
            </View>
          </View>

          <View className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100">
            <Text className="text-xs text-blue-900 leading-relaxed">
              💬 "Uống thuốc Clarithromycin có cần ăn no không bác sĩ?" - Đã trả lời: Nên uống sau khi ăn no từ 15-30 phút để giảm kích ứng dạ dày.
            </Text>
          </View>
        </View>

        <View className="mx-4 mt-3 flex-row items-center justify-center gap-1.5">
          <ShieldCheck size={14} color="#94A3B8" />
          <Text className="text-xs text-zinc-400">Sẵn sàng tích hợp logic Nhánh 3 (Đồng Hành)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
