export interface MedicationItem {
  id: string;
  name: string; // Tên thuốc (VD: Amoxicillin, Paracetamol)
  dosage: string; // Hàm lượng (VD: 500mg)
  quantity: string; // Số lượng (VD: 20 viên)
  instruction: string; // Hướng dẫn (VD: Uống sau ăn sáng và tối)
  timeSlots: ('morning' | 'noon' | 'evening' | 'night')[];
  warning?: string; // Cảnh báo tương tác/tác dụng phụ
}

export interface Prescription {
  id: string;
  doctorName: string;
  hospital: string;
  diagnosis: string; // Chẩn đoán (VD: Viêm họng cấp)
  scanDate: string;
  imageUrl?: string;
  rawText?: string;
  status: 'verified' | 'warning' | 'pending';
  medications: MedicationItem[];
  safetyNotes?: string[];
}

export interface ScheduleItem {
  id: string;
  medicationName: string;
  dosage: string;
  timeSlot: 'morning' | 'noon' | 'evening' | 'night';
  time: string; // "08:00"
  taken: boolean;
  takenAt?: string;
  instructions: string;
}

export interface SymptomLog {
  id: string;
  date: string;
  feeling: 'well' | 'moderate' | 'unwell';
  symptoms: string[];
  notes?: string;
  alertLevel: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  allergies?: string[];
}
