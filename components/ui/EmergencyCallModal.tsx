import React from 'react';
import { View, Text, Pressable, Modal, Alert, Linking, Platform } from 'react-native';
import { PhoneCall, ShieldAlert, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface EmergencyCallModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EmergencyCallModal({ visible, onClose }: EmergencyCallModalProps) {
  const handleCall = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const phoneNumber = 'tel:115';
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Gọi 115 Khẩn Cấp', 'Đang kết nối tới Trung tâm Cấp cứu 115...');
        }
      })
      .catch(() => {
        Alert.alert('Gọi 115 Khẩn Cấp', 'Đang kết nối tới Trung tâm Cấp cứu 115...');
      });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 items-center justify-center px-5">
        <View className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl border border-rose-100">
          {/* Header */}
          <View className="items-center mb-4">
            <View className="size-16 items-center justify-center rounded-3xl bg-rose-50 border border-rose-100 mb-3">
              <PhoneCall size={32} color="#E11D48" />
            </View>
            <Text className="text-xl font-bold text-zinc-900">Tổng Đài Cấp Cứu 115</Text>
            <Text className="text-xs text-rose-600 font-semibold mt-0.5">
              Đường dây nóng y tế khẩn cấp toàn quốc
            </Text>
          </View>

          {/* Description */}
          <View className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/60 mb-5">
            <View className="flex-row items-center gap-2 mb-1">
              <ShieldAlert size={16} color="#BE123C" />
              <Text className="text-xs font-bold text-rose-900">Khi nào cần gọi 115?</Text>
            </View>
            <Text className="text-xs text-rose-800 leading-relaxed">
              • Xuất hiện khó thở dữ dội, tím tái sau khi uống thuốc.{'\n'}
              • Sốc phản vệ, sưng phù môi/mặt hoặc phát ban toàn thân.{'\n'}
              • Co giật hoặc mất ý thức đột ngột.
            </Text>
          </View>

          {/* Action buttons */}
          <View className="gap-2.5">
            <Pressable
              onPress={handleCall}
              className="flex-row items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 px-4 shadow-lg shadow-rose-600/30 active:scale-[0.98]"
            >
              <PhoneCall size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text className="text-base font-bold text-white">Gọi 115 Ngay Bây Giờ</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              className="items-center justify-center py-3 rounded-2xl bg-slate-100 active:bg-slate-200"
            >
              <Text className="text-sm font-semibold text-zinc-700">Đóng / Hủy bỏ</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
