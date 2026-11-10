import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Bot, Send, User, Sparkles, PhoneCall, RefreshCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCompanionStore } from '@/store/useCompanionStore';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

const SUGGESTIONS = [
  'Đơn thuốc này cần kiêng cữ gì không?',
  'Kháng sinh Clarithromycin có gây đắng miệng không?',
  'Nếu tôi quên uống 1 liều thì xử lý sao?',
  'Uống xong thấy hơi buồn nôn thì làm thế nào?',
];

export function DoctorChatbotScreen() {
  const { chatMessages, isAiTyping, sendChatMessage, resetDefault } = useCompanionStore();
  const [inputText, setInputText] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendChatMessage(text);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header: Clean ChatGPT / Modern AI Chatbot Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatarBox}>
            <Bot size={20} color="#0066FE" />
          </View>
          <View>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Trợ Lý AI</Text>
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.headerSub}>Hỗ trợ sức khỏe & đơn thuốc trực tuyến</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              resetDefault();
            }}
            style={styles.refreshBtn}
          >
            <RefreshCcw size={15} color="#64748B" />
          </Pressable>

          <Pressable
            onPress={() => setShowEmergency(true)}
            style={styles.sosBtn}
          >
            <PhoneCall size={12} color="#E11D48" />
            <Text style={styles.sosBtnText}>115</Text>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        style={styles.keyboardContainer}
      >
        {/* Quick Suggestion Chips */}
        <View style={styles.suggestionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {SUGGESTIONS.map((s, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleSend(s);
                }}
                style={styles.suggestionChip}
              >
                <Sparkles size={11} color="#0066FE" />
                <Text style={styles.suggestionChipText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Messages Stream */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.messagesScroll}
        >
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowAI,
                ]}
              >
                {!isUser && (
                  <View style={styles.messageAvatarAI}>
                    <Bot size={15} color="#0066FE" />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.bubbleUser : styles.bubbleAI,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser ? styles.messageTextUser : styles.messageTextAI,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.timestampText,
                      isUser ? styles.timestampUser : styles.timestampAI,
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>

                {isUser && (
                  <View style={styles.messageAvatarUser}>
                    <User size={15} color="#FFFFFF" />
                  </View>
                )}
              </View>
            );
          })}

          {isAiTyping && (
            <View style={styles.typingContainer}>
              <ActivityIndicator size="small" color="#0066FE" />
              <Text style={styles.typingText}>
                Trợ lý AI đang soạn câu trả lời...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Input Dock */}
        <View style={styles.inputDock}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhắn tin cho Trợ Lý AI..."
            placeholderTextColor="#94A3B8"
            style={styles.textInput}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? '#0066FE' : '#E2E8F0' },
            ]}
          >
            <Send
              size={18}
              color={inputText.trim() ? '#FFFFFF' : '#94A3B8'}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Emergency 115 Modal */}
      <EmergencyCallModal
        visible={showEmergency}
        onClose={() => setShowEmergency(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  sosBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
  },
  keyboardContainer: {
    flex: 1,
  },
  suggestionsContainer: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  suggestionChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0066FE',
  },
  messagesScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  messageAvatarAI: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  messageAvatarUser: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#0066FE',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  bubbleUser: {
    backgroundColor: '#0066FE',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  messageTextAI: {
    color: '#0F172A',
    fontWeight: '400',
  },
  timestampText: {
    fontSize: 9.5,
    marginTop: 4,
    textAlign: 'right',
  },
  timestampUser: {
    color: '#BFDBFE',
  },
  timestampAI: {
    color: '#94A3B8',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  typingText: {
    fontSize: 12,
    color: '#64748B',
  },
  inputDock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 13.5,
    color: '#0F172A',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
