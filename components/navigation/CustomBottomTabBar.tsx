import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Home, FileText, Bot, PhoneCall, ScanLine } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
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

export function CustomBottomTabBar({ state, descriptors, navigation, onOpenEmergency }: CustomBottomTabBarProps) {
  const { openScanner } = usePrescriptionStore();
  const currentRouteName = state.routes[state.index]?.name;

  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    openScanner();
  };

  const tabs = [
    {
      name: 'index',
      label: 'Trang Chủ',
      icon: Home,
    },
    {
      name: 'two',
      label: 'Bản Dịch',
      icon: FileText,
    },
    // Center is Scan Button
    {
      name: 'three',
      label: 'Trợ Lý',
      icon: Bot,
    },
    {
      name: 'emergency',
      label: '115 SOS',
      icon: PhoneCall,
      isAction: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerBar}>
        {/* Tab 1: Home */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('index');
          }}
          style={styles.tabButton}
        >
          <Home
            size={22}
            color={currentRouteName === 'index' ? '#0066FE' : '#94A3B8'}
            strokeWidth={currentRouteName === 'index' ? 2.4 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentRouteName === 'index' ? '#0066FE' : '#94A3B8', fontWeight: currentRouteName === 'index' ? '700' : '500' },
            ]}
          >
            Trang Chủ
          </Text>
        </Pressable>

        {/* Tab 2: Records (Bản Dịch) */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('two');
          }}
          style={styles.tabButton}
        >
          <FileText
            size={22}
            color={currentRouteName === 'two' ? '#0066FE' : '#94A3B8'}
            strokeWidth={currentRouteName === 'two' ? 2.4 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentRouteName === 'two' ? '#0066FE' : '#94A3B8', fontWeight: currentRouteName === 'two' ? '700' : '500' },
            ]}
          >
            Bản Dịch
          </Text>
        </Pressable>

        {/* Center: FLOATING ELEVATED SCAN BUTTON */}
        <View style={styles.centerContainer}>
          <Pressable onPress={handleScanPress} style={styles.scanButton}>
            <ScanLine size={26} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.scanLabel}>Scan</Text>
        </View>

        {/* Tab 3: Trợ Lý (AI Assistant) */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('three');
          }}
          style={styles.tabButton}
        >
          <Bot
            size={22}
            color={currentRouteName === 'three' ? '#0066FE' : '#94A3B8'}
            strokeWidth={currentRouteName === 'three' ? 2.4 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentRouteName === 'three' ? '#0066FE' : '#94A3B8', fontWeight: currentRouteName === 'three' ? '700' : '500' },
            ]}
          >
            Trợ Lý
          </Text>
        </Pressable>

        {/* Tab 4: 115 SOS Hotline */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (onOpenEmergency) {
              onOpenEmergency();
            }
          }}
          style={styles.tabButton}
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
