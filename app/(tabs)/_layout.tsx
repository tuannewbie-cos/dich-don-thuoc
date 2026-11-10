import React, { useState, useCallback } from 'react';
import { Tabs } from 'expo-router';
import { CustomBottomTabBar } from '@/components/navigation/CustomBottomTabBar';
import { PrescriptionScannerModal } from '@/components/features/scanner/PrescriptionScannerModal';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';
import { usePrescriptionStore } from '@/store/usePrescriptionStore';

export default function TabLayout() {
  const { isScannerOpen, closeScanner } = usePrescriptionStore();
  const [showEmergency, setShowEmergency] = useState(false);

  const handleOpenEmergency = useCallback(() => {
    setShowEmergency(true);
  }, []);

  const handleCloseEmergency = useCallback(() => {
    setShowEmergency(false);
  }, []);

  const renderTabBar = useCallback(
    (props: any) => (
      <CustomBottomTabBar
        {...props}
        onOpenEmergency={handleOpenEmergency}
      />
    ),
    [handleOpenEmergency]
  );

  return (
    <>
      <Tabs
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Trang Chủ' }} />
        <Tabs.Screen name="two" options={{ title: 'Bản Dịch' }} />
        <Tabs.Screen name="three" options={{ title: 'Trợ Lý' }} />
      </Tabs>

      {/* Global Prescription Scanner Modal (Triggered by Center Scan Button) */}
      <PrescriptionScannerModal
        visible={isScannerOpen}
        onClose={closeScanner}
      />

      {/* Global 115 Emergency Modal */}
      <EmergencyCallModal
        visible={showEmergency}
        onClose={handleCloseEmergency}
      />
    </>
  );
}
