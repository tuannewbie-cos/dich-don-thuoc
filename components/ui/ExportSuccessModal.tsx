import React from 'react';
import { View, Text, Pressable, Modal, Share } from 'react-native';
import { FileDown, CheckCircle2, Share2, FileText, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ExportSuccessModalProps {
  visible: boolean;
  format: 'PDF' | 'DOCX';
  fileName: string;
  onClose: () => void;
}

export function ExportSuccessModal({
  visible,
  format,
  fileName,
  onClose,
}: ExportSuccessModalProps) {
  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        title: `Bản Dịch Đơn Thuốc Bác Sĩ - ${fileName}`,
        message: `Bản Dịch Đơn Thuốc Bác Sĩ (${format}): ${fileName}\nĐã được số hóa và kiểm tra an toàn bởi MediScan AI.`,
      });
    } catch (err) {
      console.warn('Share error', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 items-center justify-center px-5">
        <View className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl border border-slate-100">
          {/* Header Icon */}
          <View className="items-center mb-4">
            <View className="size-16 items-center justify-center rounded-3xl bg-blue-50 border border-blue-100 mb-3">
              <FileDown size={32} color="#2563EB" />
            </View>
            <View className="flex-row items-center gap-1.5 mb-1">
              <CheckCircle2 size={16} color="#059669" />
              <Text className="text-sm font-bold text-emerald-700">Xuất Thành Công!</Text>
            </View>
            <Text className="text-xl font-bold text-zinc-900 text-center">
              Bản Dịch Định Dạng {format}
            </Text>
          </View>

          {/* File Card Preview */}
          <View className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 mb-5">
            <View className="flex-row items-center gap-3">
              <View className="size-11 items-center justify-center rounded-xl bg-blue-600">
                <Text className="text-xs font-black text-white">{format}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-zinc-900" numberOfLines={1}>
                  {fileName}
                </Text>
                <Text className="text-xs text-zinc-400 mt-0.5">
                  Dung lượng: 1.4 MB • Bản in chuẩn Bộ Y Tế
                </Text>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View className="gap-2.5">
            <Pressable
              onPress={handleShare}
              className="flex-row items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 px-4 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              <Share2 size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text className="text-base font-bold text-white">Chia Sẻ & In Ấn Ngay</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              className="items-center justify-center py-3 rounded-2xl bg-slate-100 active:bg-slate-200"
            >
              <Text className="text-sm font-semibold text-zinc-700">Đã Hiểu</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
