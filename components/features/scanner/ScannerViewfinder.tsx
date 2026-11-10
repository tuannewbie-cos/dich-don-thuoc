import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import { Camera, Image as ImageIcon, Sparkles, RefreshCw, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ScannerViewfinderProps {
  imageUrl?: string;
  isAnalyzing: boolean;
  onCapture: () => void;
  onUpload: () => void;
}

export function ScannerViewfinder({
  imageUrl,
  isAnalyzing,
  onCapture,
  onUpload,
}: ScannerViewfinderProps) {
  // Laser scan line animation
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animationLoop: Animated.CompositeAnimation | null = null;
    if (isAnalyzing) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      );
      animationLoop.start();
    } else {
      scanLineAnim.setValue(0);
    }

    return () => {
      animationLoop?.stop();
    };
  }, [isAnalyzing, scanLineAnim]);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 200],
  });

  return (
    <View className="mx-4 my-2 overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-4 shadow-sm">
      {/* Viewfinder Header */}
      <View className="flex-row items-center justify-between pb-3">
        <View className="flex-row items-center gap-2">
          <View className="size-7 items-center justify-center rounded-lg bg-blue-50">
            <Camera size={16} color="#2563EB" />
          </View>
          <Text className="text-sm font-semibold text-zinc-900">Khung Quét AI Vision</Text>
        </View>
        <View className="flex-row items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
          <View className={`size-2 rounded-full ${isAnalyzing ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <Text className="text-xs font-medium text-slate-600">
            {isAnalyzing ? 'Đang đọc chữ bác sĩ' : 'Sẵn sàng quét'}
          </Text>
        </View>
      </View>

      {/* Camera / Image Viewfinder Frame */}
      <View className="relative h-56 w-full overflow-hidden rounded-2xl bg-zinc-900 justify-center items-center">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full opacity-80"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center justify-center px-4">
            <Camera size={40} color="#64748B" />
            <Text className="mt-2 text-center text-xs font-medium text-zinc-400">
              Căn chỉnh đơn thuốc nằm trọn trong khung ngắm
            </Text>
          </View>
        )}

        {/* Viewfinder Corner Overlays */}
        <View className="absolute inset-3 pointer-events-none">
          {/* Top-Left */}
          <View className="absolute top-0 left-0 size-6 border-t-2 border-l-2 border-white rounded-tl-md" />
          {/* Top-Right */}
          <View className="absolute top-0 right-0 size-6 border-t-2 border-r-2 border-white rounded-tr-md" />
          {/* Bottom-Left */}
          <View className="absolute bottom-0 left-0 size-6 border-b-2 border-l-2 border-white rounded-bl-md" />
          {/* Bottom-Right */}
          <View className="absolute bottom-0 right-0 size-6 border-b-2 border-r-2 border-white rounded-br-md" />
        </View>

        {/* Laser Scan Line Overlay (Active during analysis) */}
        {isAnalyzing && (
          <Animated.View
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              height: 2,
              backgroundColor: '#38BDF8',
              shadowColor: '#38BDF8',
              shadowOpacity: 0.9,
              shadowRadius: 8,
              transform: [{ translateY }],
            }}
          />
        )}

        {/* Bottom overlay badge */}
        <View className="absolute bottom-2.5 flex-row items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 backdrop-blur-md">
          <Eye size={12} color="#FFFFFF" />
          <Text className="text-[11px] font-medium text-white">
            Tự động nhận diện chữ bác sĩ viết tay & phiếu in
          </Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View className="mt-3 flex-row gap-3">
        {/* Capture Button */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onCapture();
          }}
          disabled={isAnalyzing}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 px-4 shadow-sm shadow-blue-500/20 active:scale-[0.98] active:opacity-90"
        >
          <Camera size={18} color="#FFFFFF" />
          <Text className="text-sm font-semibold text-white">Chụp đơn thuốc</Text>
        </Pressable>

        {/* Upload Button */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onUpload();
          }}
          disabled={isAnalyzing}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 active:scale-[0.98] active:bg-slate-100"
        >
          <ImageIcon size={18} color="#2563EB" />
          <Text className="text-sm font-semibold text-zinc-800">Tải ảnh từ máy</Text>
        </Pressable>
      </View>
    </View>
  );
}
