import React, { useCallback } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Home, PhoneCall, ScanLine } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';

export interface CustomBottomTabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
  descriptors?: Record<string, any>;
  navigation: {
    navigate: (name: string) => void;
  };
  onOpenEmergency?: () => void;
}

export function CustomBottomTabBar({
  state,
  navigation,
  onOpenEmergency,
}: CustomBottomTabBarProps) {
  const { openScanner } = usePrescriptionStore();
  const currentRouteName = state.routes[state.index]?.name;

  const handleScanPress = useCallback(() => {
    triggerHaptic('medium');
    openScanner();
  }, [openScanner]);

  const handleHomePress = useCallback(() => {
    triggerHaptic('light');
    if (currentRouteName !== 'index') {
      navigation.navigate('index');
    }
  }, [currentRouteName, navigation]);

  const handleEmergencyPress = useCallback(() => {
    triggerHaptic('warning');
    if (onOpenEmergency) {
      onOpenEmergency();
    }
  }, [onOpenEmergency]);

  const isHomeActive = currentRouteName === 'index';

  return (
    <View style={styles.container}>
      <View style={styles.innerBar}>
        {/* Tab 1: Trang Chủ */}
        <Pressable
          onPress={handleHomePress}
          style={styles.tabButton}
          hitSlop={8}
        >
          <Home
            size={22}
            color={isHomeActive ? '#0066FE' : '#94A3B8'}
            strokeWidth={isHomeActive ? 2.4 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color: isHomeActive ? '#0066FE' : '#94A3B8',
                fontWeight: isHomeActive ? '700' : '600',
              },
            ]}
          >
            Trang Chủ
          </Text>
        </Pressable>

        {/* Center: FLOATING ELEVATED SCAN BUTTON */}
        <View style={styles.centerContainer}>
          <Pressable
            onPress={handleScanPress}
            style={styles.scanButton}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <ScanLine size={26} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.scanLabel}>Quét Đơn</Text>
        </View>

        {/* Tab 3: 115 Cấp Cứu */}
        <Pressable
          onPress={handleEmergencyPress}
          style={styles.tabButton}
          hitSlop={8}
        >
          <PhoneCall size={22} color="#E11D48" strokeWidth={2.2} />
          <Text style={[styles.tabLabel, { color: '#E11D48', fontWeight: '700' }]}>
            115 SOS
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'visible',
  },
  innerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 20,
    overflow: 'visible',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066FE',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  scanLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0066FE',
    marginTop: 3,
  },
});
