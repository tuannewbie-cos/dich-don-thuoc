import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Sparkles, Send, Bot, User, HelpCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCompanionStore } from '@/store/useCompanionStore';

const QUICK_QUESTIONS = [
  'Quên liều uống thì làm thế nào?',
  'Có được uống cà phê hoặc rượu không?',
  'Uống xong thấy hơi buồn nôn thì sao?',
  'Kháng sinh này cần uống đủ bao nhiêu ngày?',
];

export function AIPharmacistChat() {
  const { chatMessages, isAiTyping, sendChatMessage } = useCompanionStore();
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendChatMessage(text);
    setInputText('');
  };

  const handleQuickQuestion = (q: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleSend(q);
  };

  return (
    <View className="mx-4 my-2 overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <View className="flex-row items-center gap-2.5">
          <View className="size-9 items-center justify-center rounded-xl bg-blue-50">
            <Bot size={20} color="#2563EB" />
          </View>
          <View>
            <Text className="text-base font-bold text-zinc-900">Dược Sĩ AI MediScan</Text>
            <Text className="text-xs text-zinc-400">Giải thích đơn thuốc bằng tiếng Việt dễ hiểu</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5">
          <View className="size-2 rounded-full bg-emerald-500" />
          <Text className="text-[11px] font-semibold text-emerald-700">Trực tuyến</Text>
        </View>
      </View>

      {/* Quick Suggestion Pills */}
      <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
        Câu hỏi thường gặp (bấm để hỏi ngay):
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6, paddingBottom: 10 }}
      >
        {QUICK_QUESTIONS.map((q, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleQuickQuestion(q)}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 active:scale-[0.98]"
          >
            <HelpCircle size={12} color="#2563EB" />
            <Text className="text-xs font-medium text-blue-800">{q}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Messages Stream */}
      <View className="gap-3 my-2 max-h-80">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              className={`flex-row gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <View className="size-7 items-center justify-center rounded-full bg-blue-100 self-end mb-1">
                  <Bot size={14} color="#2563EB" />
                </View>
              )}

              <View
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${
                  isUser
                    ? 'bg-blue-600 rounded-br-none'
                    : 'bg-slate-100 border border-slate-200/60 rounded-bl-none'
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
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-blue-200' : 'text-zinc-400'
                  }`}
                >
                  {msg.time}
                </Text>
              </View>

              {isUser && (
                <View className="size-7 items-center justify-center rounded-full bg-blue-600 self-end mb-1">
                  <User size={14} color="#FFFFFF" />
                </View>
              )}
            </View>
          );
        })}

        {isAiTyping && (
          <View className="flex-row items-center gap-2 self-start bg-slate-100 px-3.5 py-2.5 rounded-2xl border border-slate-200/60">
            <ActivityIndicator size="small" color="#2563EB" />
            <Text className="text-xs text-zinc-500 font-medium">
              Dược sĩ AI đang phân tích dữ liệu đơn thuốc...
            </Text>
          </View>
        )}
      </View>

      {/* Input Field */}
      <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập câu hỏi về đơn thuốc hoặc triệu chứng..."
          placeholderTextColor="#94A3B8"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-zinc-800"
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />
        <Pressable
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
          className={`size-10 items-center justify-center rounded-2xl active:scale-[0.95] ${
            inputText.trim() ? 'bg-blue-600' : 'bg-slate-200'
          }`}
        >
          <Send size={18} color={inputText.trim() ? '#FFFFFF' : '#94A3B8'} />
        </Pressable>
      </View>
    </View>
  );
}
