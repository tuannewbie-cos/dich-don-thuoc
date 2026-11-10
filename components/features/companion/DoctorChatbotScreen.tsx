import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Send, User, Sparkles, PhoneCall, RefreshCcw, Key, X, Check } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useCompanionStore } from '@/store/useCompanionStore';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

const SUGGESTIONS = [
  'Đơn thuốc này cần kiêng cữ gì không?',
  'Kháng sinh Clarithromycin có gây đắng miệng không?',
  'Nếu tôi quên uống 1 liều thì xử lý sao?',
  'Uống xong thấy hơi buồn nôn thì làm thế nào?',
];

export function DoctorChatbotScreen() {
  const {
    chatMessages,
    isAiTyping,
    geminiApiKey,
    setGeminiApiKey,
    sendChatMessage,
    resetDefault,
  } = useCompanionStore();

  const [inputText, setInputText] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(geminiApiKey);

  const handleSend = useCallback(
    (textToSend?: string) => {
      const text = textToSend || inputText;
      if (!text.trim()) return;
      sendChatMessage(text);
      setInputText('');
    },
    [inputText, sendChatMessage]
  );

  const handleSaveKey = useCallback(() => {
    triggerHaptic('success');
    setGeminiApiKey(keyInput.trim());
    setShowKeyModal(false);
  }, [keyInput, setGeminiApiKey]);

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
            <Text style={styles.headerSub}>Google Gemini • Tư vấn sức khỏe 24/7</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Key Button */}
          <Pressable
            onPress={() => {
              triggerHaptic('light');
              setKeyInput(geminiApiKey);
              setShowKeyModal(true);
            }}
            style={styles.keyBtn}
          >
            <Key size={15} color={geminiApiKey ? '#059669' : '#64748B'} />
          </Pressable>

          {/* Reset Chat Button */}
          <Pressable
            onPress={() => {
              triggerHaptic('light');
              resetDefault();
            }}
            style={styles.refreshBtn}
          >
            <RefreshCcw size={15} color="#64748B" />
          </Pressable>

          {/* 115 SOS */}
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
                  triggerHaptic('light');
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
                Trợ lý AI đang phân tích dữ liệu y khoa...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Input Dock */}
        <View style={styles.inputDock}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Hỏi về đơn thuốc, cách uống, kiêng cữ..."
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

      {/* Google AI Studio API Key Modal (Zero-crash Overlay) */}
      {showKeyModal && (
        <View style={styles.modalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowKeyModal(false)}
          />
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View style={styles.keyIconCircle}>
                <Key size={20} color="#0066FE" />
              </View>
              <Text style={styles.modalTitle}>Cài Đặt Google AI Studio API</Text>
              <Text style={styles.modalSub}>
                Nhập Gemini API Key để trò chuyện trực tiếp với mô hình AI thời gian thực.
              </Text>
            </View>

            <TextInput
              value={keyInput}
              onChangeText={setKeyInput}
              placeholder="Dán AI Studio Key (AIzaSy...)"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              style={styles.keyInput}
            />

            <View style={styles.modalActions}>
              <Pressable onPress={handleSaveKey} style={styles.saveKeyBtn}>
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveKeyBtnText}>Lưu API Key</Text>
              </Pressable>

              <Pressable onPress={() => setShowKeyModal(false)} style={styles.cancelKeyBtn}>
                <Text style={styles.cancelKeyBtnText}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

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
  keyBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  keyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  keyInput: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 16,
  },
  modalActions: {
    gap: 8,
  },
  saveKeyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: '#0066FE',
  },
  saveKeyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cancelKeyBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelKeyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
