import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Bot, Send, User, X, PhoneCall, HelpCircle, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCompanionStore } from '@/store/useCompanionStore';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

interface DoctorChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  'Đơn thuốc này có kiêng rượu bia hay cà phê không?',
  'Kháng sinh Clarithromycin có gây đắng miệng không?',
  'Nếu tôi quên uống 1 liều thì làm thế nào?',
  'Tôi cảm thấy hơi buồn nôn sau khi uống thuốc?',
];

export function DoctorChatbotModal({ visible, onClose }: DoctorChatbotModalProps) {
  const { chatMessages, isAiTyping, sendChatMessage } = useCompanionStore();
  const [inputText, setInputText] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendChatMessage(text);
    setInputText('');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-[#F5F7FB]">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100">
          <View className="flex-row items-center gap-2.5">
            <View className="size-9 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
              <Bot size={20} color="#2563EB" />
            </View>
            <View>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-base font-bold text-zinc-900">Bác Sĩ Trực Tuyến AI</Text>
                <View className="size-2 rounded-full bg-emerald-500" />
              </View>
              <Text className="text-[11px] text-zinc-400">Tư vấn đơn thuốc & sức khỏe 24/7</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => setShowEmergency(true)}
              className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 active:scale-[0.95]"
            >
              <PhoneCall size={13} color="#E11D48" />
              <Text className="text-[11px] font-bold text-rose-700">115</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              className="size-8 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
            >
              <X size={18} color="#64748B" />
            </Pressable>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          {/* Quick Suggestion Pills */}
          <View className="py-2.5 px-4 bg-white/70 border-b border-slate-100">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {SUGGESTIONS.map((s, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleSend(s);
                  }}
                  className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 active:scale-[0.97]"
                >
                  <Sparkles size={11} color="#2563EB" />
                  <Text className="text-xs font-semibold text-blue-800">{s}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Messages list */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 12 }}
          >
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  className={`flex-row gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <View className="size-8 items-center justify-center rounded-full bg-blue-100 self-end mb-1">
                      <Bot size={16} color="#2563EB" />
                    </View>
                  )}

                  <View
                    className={`max-w-[82%] rounded-[22px] p-4 shadow-sm ${
                      isUser
                        ? 'bg-blue-600 rounded-br-sm'
                        : 'bg-white border border-slate-100 rounded-bl-sm'
                    }`}
                  >
                    <Text
                      className={`text-sm leading-relaxed ${
                        isUser ? 'text-white' : 'text-zinc-800'
                      }`}
                    >
                      {msg.text}
                    </Text>
                    <Text
                      className={`text-[10px] mt-1.5 text-right ${
                        isUser ? 'text-blue-200' : 'text-zinc-400'
                      }`}
                    >
                      {msg.time}
                    </Text>
                  </View>

                  {isUser && (
                    <View className="size-8 items-center justify-center rounded-full bg-blue-600 self-end mb-1">
                      <User size={16} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              );
            })}

            {isAiTyping && (
              <View className="flex-row items-center gap-2 self-start bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <ActivityIndicator size="small" color="#2563EB" />
                <Text className="text-xs text-zinc-500 font-medium">
                  Bác sĩ AI đang xem lại phác đồ điều trị...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View className="p-3 bg-white border-t border-slate-100 flex-row items-center gap-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Hỏi bác sĩ về liều dùng, tác dụng phụ..."
              placeholderTextColor="#94A3B8"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-zinc-800"
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <Pressable
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
              className={`size-11 items-center justify-center rounded-2xl active:scale-[0.95] ${
                inputText.trim() ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <Send size={18} color={inputText.trim() ? '#FFFFFF' : '#94A3B8'} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>

        {/* Emergency 115 Modal */}
        <EmergencyCallModal
          visible={showEmergency}
          onClose={() => setShowEmergency(false)}
        />
      </SafeAreaView>
    </Modal>
  );
}
