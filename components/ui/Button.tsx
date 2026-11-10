import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
}: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-200/80 active:bg-slate-300 text-zinc-900';
      case 'danger':
        return 'bg-red-500 active:bg-red-600 text-white';
      case 'primary':
      default:
        return 'bg-blue-600 active:bg-blue-700 text-white';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-zinc-900';
      default:
        return 'text-white';
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-2 rounded-2xl py-3.5 px-6 shadow-sm transition-transform active:scale-[0.98] active:opacity-90 ${getVariantStyles()} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#18181B' : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon}
          <Text className={`text-base font-semibold ${getTextStyles()}`}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
