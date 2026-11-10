import React from 'react';
import { View, Text, Pressable, Alert, Linking, StyleSheet, Modal } from 'react-native';
import { PhoneCall, ShieldAlert } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';

interface EmergencyCallModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EmergencyCallModal({ visible, onClose }: EmergencyCallModalProps) {
  const handleCall = () => {
    triggerHaptic('warning');
    const phoneNumber = 'tel:115';
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Gọi 115 Cấp Cứu', 'Đang kết nối tới Trung tâm Cấp cứu 115...');
        }
      })
      .catch(() => {
        Alert.alert('Gọi 115 Cấp Cứu', 'Đang kết nối tới Trung tâm Cấp cứu 115...');
      });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlayContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.dialogCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <PhoneCall size={30} color="#E11D48" />
            </View>
            <Text style={styles.title}>Tổng Đài Cấp Cứu 115</Text>
            <Text style={styles.subTitle}>
              Đường dây nóng y tế khẩn cấp toàn quốc 24/7
            </Text>
          </View>

          {/* Cảnh báo khi nào cần gọi */}
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <ShieldAlert size={16} color="#BE123C" />
              <Text style={styles.warningTitle}>Khi nào cần gọi 115 khẩn cấp?</Text>
            </View>
            <Text style={styles.warningText}>
              • Khó thở dữ dội, tím tái sau khi dùng thuốc.{'\n'}
              • Sốc phản vệ, sưng phù môi/mặt hoặc phát ban.{'\n'}
              • Co giật hoặc mất ý thức đột ngột.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <Pressable onPress={handleCall} style={styles.callBtn}>
              <PhoneCall size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.callBtnText}>Gọi 115 Ngay Bây Giờ</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic('light');
                onClose();
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Đóng / Hủy Bỏ</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  dialogCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E11D48',
    marginTop: 4,
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECDD3',
    padding: 14,
    marginBottom: 18,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9F1239',
  },
  warningText: {
    fontSize: 12,
    color: '#881337',
    lineHeight: 18,
  },
  buttonGroup: {
    gap: 10,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  callBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
