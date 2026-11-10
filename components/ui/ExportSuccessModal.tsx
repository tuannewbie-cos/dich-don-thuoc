import React from 'react';
import { View, Text, Pressable, Share, StyleSheet, Modal } from 'react-native';
import { FileDown, CheckCircle2, Share2, X } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';

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
    triggerHaptic('light');
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
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlayContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.dialogCard}>
          {/* Header Icon */}
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <FileDown size={32} color="#0066FE" />
            </View>
            <View style={styles.badgeSuccess}>
              <CheckCircle2 size={15} color="#059669" />
              <Text style={styles.badgeSuccessText}>Xuất Thành Công!</Text>
            </View>
            <Text style={styles.title}>Bản Dịch Định Dạng {format}</Text>
          </View>

          {/* File Card Preview */}
          <View style={styles.fileCard}>
            <View style={styles.formatBadge}>
              <Text style={styles.formatBadgeText}>{format}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileNameText} numberOfLines={1}>
                {fileName}
              </Text>
              <Text style={styles.fileMetaText}>
                Dung lượng: 1.4 MB • Chuẩn văn bản in y tế
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonGroup}>
            <Pressable onPress={handleShare} style={styles.shareBtn}>
              <Share2 size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.shareBtnText}>Chia Sẻ & In Ấn Ngay</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic('light');
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>Đã Hiểu</Text>
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
    backgroundColor: 'rgba(0, 102, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 102, 254, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeSuccessText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 18,
  },
  formatBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0066FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  fileMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  buttonGroup: {
    gap: 10,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0066FE',
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#0066FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
