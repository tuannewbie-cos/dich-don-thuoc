import { create } from 'zustand';
import { ScheduleItem, Prescription } from '@/types';
import { MOCK_SCHEDULE } from '@/mocks/mockData';
import * as Haptics from 'expo-haptics';

interface ScheduleState {
  items: ScheduleItem[];
  selectedFilter: 'all' | 'morning' | 'noon' | 'evening' | 'night';
  setFilter: (filter: 'all' | 'morning' | 'noon' | 'evening' | 'night') => void;
  toggleTaken: (id: string) => void;
  syncFromPrescription: (prescription: Prescription) => void;
  resetDefault: () => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  items: MOCK_SCHEDULE,
  selectedFilter: 'all',

  setFilter: (filter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    set({ selectedFilter: filter });
  },

  toggleTaken: (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const newTaken = !item.taken;
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          return {
            ...item,
            taken: newTaken,
            takenAt: newTaken ? timeStr : undefined,
          };
        }
        return item;
      }),
    }));
  },

  syncFromPrescription: (prescription) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newItems: ScheduleItem[] = [];
    const slotTimes: Record<string, string> = {
      morning: '08:00',
      noon: '12:30',
      evening: '18:30',
      night: '21:30',
    };

    prescription.medications.forEach((med, medIdx) => {
      med.timeSlots.forEach((slot, slotIdx) => {
        newItems.push({
          id: `sch_${prescription.id}_${medIdx}_${slotIdx}`,
          medicationName: `${med.name} ${med.dosage}`,
          dosage: '1 liều theo chỉ định',
          timeSlot: slot,
          time: slotTimes[slot] || '08:00',
          taken: false,
          instructions: med.instruction,
        });
      });
    });

    set((state) => ({
      items: [...newItems, ...state.items],
    }));
  },

  resetDefault: () => {
    set({ items: MOCK_SCHEDULE, selectedFilter: 'all' });
  },
}));
