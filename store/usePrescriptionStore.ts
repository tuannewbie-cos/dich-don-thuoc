import { create } from 'zustand';
import { Prescription } from '@/types';
import { MOCK_PRESCRIPTIONS } from '@/mocks/mockData';

interface PrescriptionState {
  prescriptions: Prescription[];
  activePrescription: Prescription | null;
  isAnalyzing: boolean;
  analysisStep: number;
  syncedPrescriptionIds: string[];
  setActivePrescription: (prescription: Prescription | null) => void;
  setAnalyzing: (status: boolean) => void;
  setAnalysisStep: (step: number) => void;
  syncPrescriptionToSchedule: (id: string) => boolean;
  addPrescription: (prescription: Prescription) => void;
}

export const usePrescriptionStore = create<PrescriptionState>((set, get) => ({
  prescriptions: MOCK_PRESCRIPTIONS,
  activePrescription: MOCK_PRESCRIPTIONS[0],
  isAnalyzing: false,
  analysisStep: 0,
  syncedPrescriptionIds: [],

  setActivePrescription: (prescription) => {
    set({ activePrescription: prescription });
  },

  setAnalyzing: (status) => {
    set({ isAnalyzing: status });
  },

  setAnalysisStep: (step) => {
    set({ analysisStep: step });
  },

  syncPrescriptionToSchedule: (id) => {
    const { syncedPrescriptionIds } = get();
    if (!syncedPrescriptionIds.includes(id)) {
      set({ syncedPrescriptionIds: [...syncedPrescriptionIds, id] });
    }
    return true;
  },

  addPrescription: (prescription) => {
    set((state) => ({
      prescriptions: [prescription, ...state.prescriptions],
      activePrescription: prescription,
    }));
  },
}));
