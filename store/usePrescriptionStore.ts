import { create } from 'zustand';
import { Prescription } from '@/types';
import { MOCK_PRESCRIPTIONS } from '@/mocks/mockData';

interface PrescriptionState {
  prescriptions: Prescription[];
  scannedHistory: Prescription[];
  activePrescription: Prescription | null;
  isAnalyzing: boolean;
  analysisStep: number;
  syncedPrescriptionIds: string[];
  isScannerOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;
  setActivePrescription: (prescription: Prescription | null) => void;
  setAnalyzing: (status: boolean) => void;
  setAnalysisStep: (step: number) => void;
  syncPrescriptionToSchedule: (id: string) => boolean;
  addScannedPrescription: (prescription: Prescription) => void;
  clearScannedHistory: () => void;
}

export const usePrescriptionStore = create<PrescriptionState>((set, get) => ({
  prescriptions: MOCK_PRESCRIPTIONS,
  scannedHistory: [], // Ban đầu chưa có đơn nào được quét
  activePrescription: null, // Ban đầu null
  isAnalyzing: false,
  analysisStep: 0,
  syncedPrescriptionIds: [],
  isScannerOpen: false,

  openScanner: () => set({ isScannerOpen: true }),
  closeScanner: () => set({ isScannerOpen: false }),

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

  addScannedPrescription: (prescription) => {
    set((state) => ({
      scannedHistory: [prescription, ...state.scannedHistory.filter((p) => p.id !== prescription.id)],
      activePrescription: prescription,
    }));
  },

  clearScannedHistory: () => {
    set({ scannedHistory: [], activePrescription: null });
  },
}));
