import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { PhoneCall, Share2, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export function EmergencySupportCard() {
  const [reportSent, setReportSent] = useState(false);

  const handleCallEmergency = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Cuộc Gọi Khẩn Cấp 115',
      'Bạn đang chuẩn bị kết nối tới tổng đài cấp cứu y tế khẩn cấp 115. Hãy giữ bình tĩnh và chuẩn bị báo rõ địa chỉ hiện tại.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Gọi ngay', style: 'destructive' },
      ]
    );
  };

  const handleSendReport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setReportSent(true);
    setTimeout(() => setReportSent(false), 3000);
  };

  return (
    <View className="mx-4 my-2 overflow-hidden rounded-3xl border border-rose-200/80 bg-rose-50/60 p-5 shadow-sm">
      <View className="flex-row items-center gap-3 mb-3">
        <View className="size-10 items-center justify-center rounded-2xl bg-rose-600">
          <ShieldAlert size={22} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-rose-950">Hỗ Trợ Khẩn Cấp & Cảnh Báo</Text>
          <Text className="text-xs text-rose-700">Khi gặp phản ứng sốc thuốc, khó thở hoặc sốt cao co giật</Text>
        </View>
      </View>

      <View className="flex-row gap-2 pt-1">
        {/* Call 115 button */}
        <Pressable
          onPress={handleCallEmergency}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 px-3 active:scale-[0.98] shadow-sm shadow-rose-600/30"
        >
          <PhoneCall size={16} color="#FFFFFF" />
          <Text className="text-xs font-bold text-white">Gọi 115 Khẩn Cấp</Text>
        </Pressable>

        {/* Share report to doctor */}
        <Pressable
          onPress={handleSendReport}
          className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl py-3 px-3 border active:scale-[0.98] ${
            reportSent
              ? 'bg-emerald-600 border-emerald-600'
              : 'bg-white border-rose-300'
          }`}
        >
          {reportSent ? (
            <>
              <CheckCircle2 size={16} color="#FFFFFF" />
              <Text className="text-xs font-bold text-white">Đã gửi Bác sĩ!</Text>
            </>
          ) : (
            <>
              <Share2 size={16} color="#BE123C" />
              <Text className="text-xs font-bold text-rose-800">Gửi Hồ Sơ Bác Sĩ</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
