import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Home, FileText, Bot, PhoneCall, ScanLine } from 'lucide-react-native';
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
    emit?: (event: any) => { defaultPrevented: boolean };
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

  const handleScanPress = () => {
    triggerHaptic('medium');
    openScanner();
  };

  const handleTabPress = (routeName: string, targetKey?: string) => {
    triggerHaptic('light');
    if (currentRouteName === routeName) {
      return; // Already on this tab, avoid re-rendering
    }

    if (navigation.emit && targetKey) {
      const event = navigation.emit({
        type: 'tabPress',
        target: targetKey,
        canPreventDefault: true,
      });
      if (!event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    } else {
      navigation.navigate(routeName);
    }
  };

  const homeRoute = state.routes.find((r) => r.name === 'index');
  const recordsRoute = state.routes.find((r) => r.name === 'two');
  const botRoute = state.routes.find((r) => r.name === 'three');

  const isHomeActive = currentRouteName === 'index';
  const isRecordsActive = currentRouteName === 'two';
  const isBotActive = currentRouteName === 'three';

  return (
    <View style={styles.container}>
      <View style={styles.innerBar}>
        {/* Tab 1: Home (Trang Chủ) */}
        <Pressable
          onPress={() => handleTabPress('index', homeRoute?.key)}
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
                fontWeight: isHomeActive ? '700' : '500',
              },
            ]}
          >
            Trang Chủ
          </Text>
        </Pressable>

        {/* Tab 2: Records (Bản Dịch) */}
        <Pressable
          onPress={() => handleTabPress('two', recordsRoute?.key)}
          style={styles.tabButton}
          hitSlop={8}
        >
          <FileText
            size={22}
            color={isRecordsActive ? '#0066FE' : '#94A3B8'}
            strokeWidth={isRecordsActive ? 2.4 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color: isRecordsActive ? '#0066FE' : '#94A3B8',
                fontWeight: isRecordsActive ? '700' : '500',
              },
            ]}
          >
            Bản Dịch
          </Text>
        </Pressable>

        {/* Center: FLOATING ELEVATED SCAN BUTTON */}
        <View style={styles.centerContainer}>
          <Pressable
            onPress={handleScanPress}
            style={styles.scanButton}
            hitSlop={10}
          >
            <ScanLine size={26} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.scanLabel}>Scan</Text>
        </View>

        {/* Tab 3: Trợ Lý (AI Assistant) */}
        <Pressable
          onPress={() => handleTabPress('three', botRoute?.key)}
          style={styles.tabButton}
          hitSlop={8}
        >
          <Bot
            size={22}
            color={isBotActive ? '#0066FE' : '#94A3B8'}
            strokeWidth={isBotActive ? 2.4 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color: isBotActive ? '#0066FE' : '#94A3B8',
                fontWeight: isBotActive ? '700' : '500',
              },
            ]}
          >
            Trợ Lý
          </Text>
        </Pressable>

        {/* Tab 4: 115 SOS Hotline */}
        <Pressable
          onPress={() => {
            triggerHaptic('warning');
            if (onOpenEmergency) {
              onOpenEmergency();
            }
          }}
          style={styles.tabButton}
          hitSlop={8}
        >
          <PhoneCall size={22} color="#E11D48" strokeWidth={2} />
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
  },
  innerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 3,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  scanButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
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
    marginTop: 2,
  },
});
