import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView, Image } from 'react-native';
import {
  Bell,
  Search,
  Heart,
  Pill,
  Bot,
  Sparkles,
  PhoneCall,
  ChevronRight,
  TrendingUp,
  Activity,
  FileText,
  ScanLine,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';
import { PrescriptionScannerModal } from '@/components/features/scanner/PrescriptionScannerModal';
import { PrescriptionTranslationModal } from '@/components/features/scanner/PrescriptionTranslationModal';
import { DoctorChatbotModal } from '@/components/features/companion/DoctorChatbotModal';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

export function MedexaHomeScreen() {
  const { activePrescription } = usePrescriptionStore();
  const [showScanner, setShowScanner] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [activePill, setActivePill] = useState<'overview' | 'translation' | 'appointments'>('overview');

  const handleOpenScanner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowScanner(true);
  };

  const handleOpenTranslation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTranslation(true);
  };

  const handleOpenChatbot = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowChatbot(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Top Bar (Logo + Avatar + Notification + 115 SOS) */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
          {/* Brand Logo */}
          <View className="flex-row items-center gap-2">
            <View className="size-9 items-center justify-center rounded-2xl bg-blue-600 shadow-sm shadow-blue-500/30">
              <Activity size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text className="text-xl font-black tracking-tight text-zinc-900">
              Medexa<Text className="text-blue-600">Scan</Text>
            </Text>
          </View>

          {/* Right Actions */}
          <View className="flex-row items-center gap-2.5">
            {/* Quick 115 SOS Button */}
            <Pressable
              onPress={() => setShowEmergency(true)}
              className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 active:scale-[0.95]"
            >
              <PhoneCall size={13} color="#E11D48" />
              <Text className="text-xs font-bold text-rose-700">115</Text>
            </Pressable>

            {/* Notification Bell */}
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              className="size-10 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm active:bg-slate-50 relative"
            >
              <Bell size={18} color="#1E293B" />
              <View className="absolute top-2.5 right-2.5 size-2 rounded-full bg-blue-600" />
            </Pressable>

            {/* User Avatar */}
            <View className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
                className="size-full bg-slate-200"
              />
            </View>
          </View>
        </View>

        {/* Greeting Headline (Medexa Style) */}
        <View className="px-5 pt-3 pb-3">
          <Text className="text-sm font-semibold text-zinc-400">Hi Nguyễn Văn An,</Text>
          <Text className="text-3xl font-extrabold tracking-tight text-zinc-900 mt-0.5">
            Good <Text className="text-blue-600 font-black">Morning</Text>
          </Text>
        </View>

        {/* Quick Filter Pills Row */}
        <View className="flex-row items-center gap-2 px-5 pb-4">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActivePill('overview');
            }}
            className={`px-4 py-2 rounded-full active:scale-[0.97] ${
              activePill === 'overview' ? 'bg-zinc-900' : 'bg-white border border-slate-100'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activePill === 'overview' ? 'text-white' : 'text-zinc-600'
              }`}
            >
              Tổng quan
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActivePill('translation');
              handleOpenTranslation();
            }}
            className={`px-4 py-2 rounded-full active:scale-[0.97] ${
              activePill === 'translation' ? 'bg-zinc-900' : 'bg-white border border-slate-100'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activePill === 'translation' ? 'text-white' : 'text-zinc-600'
              }`}
            >
              Bản dịch đơn
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActivePill('appointments');
            }}
            className={`px-4 py-2 rounded-full active:scale-[0.97] ${
              activePill === 'appointments' ? 'bg-zinc-900' : 'bg-white border border-slate-100'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activePill === 'appointments' ? 'text-white' : 'text-zinc-600'
              }`}
            >
              Lịch khám
            </Text>
          </Pressable>

          {/* Search Icon Circle Button */}
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            className="size-9 ml-auto items-center justify-center rounded-full bg-blue-50 active:bg-blue-100"
          >
            <Search size={16} color="#2563EB" />
          </Pressable>
        </View>

        {/* Hero Card: Health / Safety Score with Smooth Curve Graph */}
        <View className="mx-4 mb-4 rounded-[28px] bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-xs font-semibold text-zinc-400">Độ An Toàn Đơn Thuốc</Text>
              <Text className="text-2xl font-black text-zinc-900 mt-0.5">85<Text className="text-base text-zinc-400 font-semibold">/100</Text></Text>
            </View>
            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50">
              <TrendingUp size={13} color="#059669" />
              <Text className="text-xs font-bold text-emerald-700">↑ 12%</Text>
            </View>
          </View>

          {/* Simulated Smooth Blue Wave Graph */}
          <View className="h-24 justify-end pt-2 pb-1">
            <View className="flex-row items-end justify-between px-2 h-16">
              {[
                { h: 35, active: false },
                { h: 42, active: false },
                { h: 38, active: false },
                { h: 56, active: false },
                { h: 64, active: true },
                { h: 48, active: false },
                { h: 52, active: false },
              ].map((bar, i) => (
                <View key={i} className="items-center gap-1 flex-1">
                  {bar.active && (
                    <View className="size-2 rounded-full bg-blue-600 mb-1 shadow-sm shadow-blue-500" />
                  )}
                  <View
                    className={`w-2.5 rounded-full ${
                      bar.active ? 'bg-blue-600' : 'bg-blue-100'
                    }`}
                    style={{ height: bar.h }}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Days of week axis */}
          <View className="flex-row justify-between px-2 pt-2 border-t border-slate-50">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <Text
                key={d}
                className={`text-[11px] font-semibold ${
                  i === 4 ? 'text-blue-600 font-bold' : 'text-zinc-400'
                }`}
              >
                {d}
              </Text>
            ))}
          </View>
        </View>

        {/* Two Metrics Row (Heart Rate & Medication) */}
        <View className="flex-row gap-3 px-4 mb-4">
          {/* Card Left: Heart Rate */}
          <View className="flex-1 rounded-[26px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold text-zinc-400">Nhịp Tim</Text>
              <Heart size={14} color="#E11D48" />
            </View>
            <Text className="text-xl font-extrabold text-zinc-900">
              110<Text className="text-xs font-medium text-zinc-400"> bpm</Text>
            </Text>
            <Text className="text-[11px] font-bold text-emerald-600 mt-0.5">Bình thường</Text>

            {/* Heartbeat ECG waveform graphic */}
            <View className="h-8 flex-row items-center justify-between px-1 mt-2 bg-rose-50/50 rounded-xl">
              {[6, 12, 4, 20, 8, 16, 5, 24, 10, 6].map((h, i) => (
                <View
                  key={i}
                  className="w-1 bg-rose-400 rounded-full"
                  style={{ height: h }}
                />
              ))}
            </View>
          </View>

          {/* Card Right: Medication / Uống thuốc */}
          <View className="flex-1 rounded-[26px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold text-zinc-400">Đã Uống</Text>
              <Pill size={14} color="#2563EB" />
            </View>
            <Text className="text-xl font-extrabold text-zinc-900">
              3/4<Text className="text-xs font-medium text-zinc-400"> cữ</Text>
            </Text>
            <Text className="text-[11px] font-bold text-blue-600 mt-0.5">Đúng giờ</Text>

            {/* Vertical Bars Graphic */}
            <View className="h-8 flex-row items-end justify-between px-2 mt-2 bg-blue-50/50 rounded-xl pb-1">
              {[14, 22, 18, 24].map((h, i) => (
                <View
                  key={i}
                  className={`w-3 rounded-full ${i < 3 ? 'bg-blue-600' : 'bg-blue-200'}`}
                  style={{ height: h }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* AI Health Insights / Chatbot Bác Sĩ Online Window (Nổi bật trên giao diện) */}
        <View className="mx-4 mb-4 rounded-[28px] bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="size-7 items-center justify-center rounded-lg bg-blue-100">
                <Sparkles size={14} color="#2563EB" />
              </View>
              <Text className="text-sm font-bold text-zinc-900">Bác Sĩ Dược Sĩ AI Trực Tuyến</Text>
            </View>

            <Pressable onPress={handleOpenChatbot}>
              <Text className="text-xs font-bold text-blue-600">Chat ngay</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleOpenChatbot}
            className="flex-row items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 active:bg-slate-100"
          >
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              {/* Doctor Avatar */}
              <View className="size-11 items-center justify-center rounded-2xl bg-blue-600 shadow-sm shadow-blue-500/20">
                <Bot size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-zinc-800">
                  BS. Trí đã đối soát đơn thuốc của bạn!
                </Text>
                <Text className="text-[11px] text-zinc-500 mt-0.5" numberOfLines={2}>
                  "Thuốc Clarithromycin 500mg đã được dịch xong. Bấm vào đây để hỏi đáp về kiêng cữ & tác dụng phụ."
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Quick Prescription Translation Preview Card */}
        {activePrescription && (
          <View className="mx-4 mb-4 rounded-[28px] bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <FileText size={16} color="#2563EB" />
                <Text className="text-sm font-bold text-zinc-900">Bản Dịch Đơn Thuốc Gần Nhất</Text>
              </View>
              <Pressable onPress={handleOpenTranslation}>
                <Text className="text-xs font-bold text-blue-600">Xem chi tiết</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleOpenTranslation}
              className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex-row items-center justify-between"
            >
              <View className="flex-1 pr-2">
                <Text className="text-xs font-bold text-blue-950">
                  {activePrescription.diagnosis}
                </Text>
                <Text className="text-[11px] text-blue-700 mt-0.5">
                  {activePrescription.doctorName} • {activePrescription.medications.length} loại thuốc đã bóc tách
                </Text>
              </View>
              <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600">
                <Text className="text-[11px] font-bold text-white">Xem & Xuất</Text>
              </View>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Floating Center Scan Bar (Fixed at bottom dock) */}
      <View className="absolute bottom-4 left-0 right-0 items-center justify-center pointer-events-box-none">
        <Pressable
          onPress={handleOpenScanner}
          className="flex-row items-center gap-2.5 px-6 py-3.5 rounded-full bg-blue-600 shadow-xl shadow-blue-500/40 active:scale-[0.96]"
        >
          <ScanLine size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-sm font-black text-white uppercase tracking-wider">
            Quét Đơn Viết Tay
          </Text>
        </Pressable>
      </View>

      {/* Modals */}
      <PrescriptionScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onOpenChatbot={handleOpenChatbot}
      />

      <PrescriptionTranslationModal
        visible={showTranslation}
        prescription={activePrescription}
        onClose={() => setShowTranslation(false)}
        onOpenChatbot={handleOpenChatbot}
      />

      <DoctorChatbotModal
        visible={showChatbot}
        onClose={() => setShowChatbot(false)}
      />

      <EmergencyCallModal
        visible={showEmergency}
        onClose={() => setShowEmergency(false)}
      />
    </SafeAreaView>
  );
}
