import { MockItem, Prescription, ScheduleItem, SymptomLog, UserProfile } from '@/types';

export const MOCK_ITEMS: MockItem[] = [
  {
    id: '1',
    title: 'Nhận diện chữ bác sĩ bằng AI OCR',
    description: 'Chụp ảnh đơn thuốc viết tay, tự động phân tích và cảnh báo tương tác thuốc.',
    createdAt: new Date().toISOString(),
    tag: 'OCR Vision',
  },
  {
    id: '2',
    title: 'Lịch nhắc thuốc thông minh',
    description: 'Đồng bộ đơn thuốc thành thời gian biểu uống thuốc hằng ngày theo khung giờ.',
    createdAt: new Date().toISOString(),
    tag: 'Schedule',
  },
  {
    id: '3',
    title: 'Đồng hành & Theo dõi triệu chứng',
    description: 'Bám sát tình trạng người bệnh sau khi uống thuốc, hỗ trợ hỏi đáp y tế cơ bản.',
    createdAt: new Date().toISOString(),
    tag: 'Companion',
  },
];

export const MOCK_USER: UserProfile = {
  id: 'usr_01',
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  allergies: ['Penicillin', 'Aspirin'],
};

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx_01',
    doctorName: 'BS. CKII Lê Minh Trí',
    hospital: 'Bệnh viện Bạch Mai - Khoa Tai Mũi Họng',
    diagnosis: 'Viêm họng cấp / Viêm xoang dị ứng',
    scanDate: '2026-11-10T08:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
    status: 'verified',
    safetyNotes: [
      'Không dùng chung với đồ uống có cồn hoặc nước ép bưởi.',
      'Bệnh nhân có tiền sử dị ứng Penicillin - Đơn thuốc đã được bác sĩ chỉ định thay thế an toàn bằng Clarithromycin.',
      'Paracetamol chỉ dùng khi sốt trên 38.5°C, mỗi lần cách tối thiểu 4-6 tiếng (tối đa 3g/ngày).',
    ],
    medications: [
      {
        id: 'med_01',
        name: 'Clarithromycin',
        dosage: '500mg',
        quantity: '14 viên',
        instruction: 'Uống 1 viên sau ăn sáng và 1 viên sau ăn tối',
        timeSlots: ['morning', 'evening'],
        warning: 'Có thể gây đắng miệng nhẹ trong 2 ngày đầu.',
      },
      {
        id: 'med_02',
        name: 'Paracetamol',
        dosage: '500mg',
        quantity: '10 viên',
        instruction: 'Uống 1 viên khi sốt trên 38.5°C, cách nhau ít nhất 4-6 tiếng',
        timeSlots: ['noon', 'night'],
      },
      {
        id: 'med_03',
        name: 'Cetirizine',
        dosage: '10mg',
        quantity: '7 viên',
        instruction: 'Uống 1 viên vào buổi tối trước khi đi ngủ',
        timeSlots: ['night'],
        warning: 'Gây buồn ngủ nhẹ, tránh lái xe sau khi dùng thuốc.',
      },
    ],
  },
  {
    id: 'rx_02',
    doctorName: 'PGS. TS. Trần Hoàng Nam',
    hospital: 'Viện Tim Mạch Quốc Gia - BV Bạch Mai',
    diagnosis: 'Tăng huyết áp độ 2 / Rối loạn lipid máu hỗn hợp',
    scanDate: '2026-11-10T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
    status: 'warning',
    safetyNotes: [
      'Theo dõi huyết áp định kỳ hằng ngày vào mỗi buổi sáng trước khi dùng thuốc (< 130/80 mmHg).',
      'Atorvastatin cần uống cố định vào buổi tối trước khi đi ngủ để gan ức chế tổng hợp cholesterol tối ưu.',
      'Cảnh báo: Tuyệt đối không tự ý ngừng thuốc hạ áp đột ngột để tránh cơn tăng huyết áp kịch phát.',
    ],
    medications: [
      {
        id: 'med_201',
        name: 'Amlodipine Besylate',
        dosage: '5mg',
        quantity: '30 viên',
        instruction: 'Uống 1 viên vào mỗi buổi sáng sau khi ăn',
        timeSlots: ['morning'],
        warning: 'Có thể gây đỏ bừng mặt hoặc phù nhẹ mắt cá chân thời gian đầu.',
      },
      {
        id: 'med_202',
        name: 'Losartan Potassium',
        dosage: '50mg',
        quantity: '30 viên',
        instruction: 'Uống 1 viên vào buổi sáng cùng Amlodipine',
        timeSlots: ['morning'],
      },
      {
        id: 'med_203',
        name: 'Atorvastatin',
        dosage: '20mg',
        quantity: '30 viên',
        instruction: 'Uống 1 viên vào buổi tối trước khi đi ngủ',
        timeSlots: ['night'],
        warning: 'Uống cố định giờ; báo ngay bác sĩ nếu đau cơ dữ dội hoặc nước tiểu sẫm màu.',
      },
    ],
  },
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch_01',
    medicationName: 'Clarithromycin 500mg',
    dosage: '1 viên',
    timeSlot: 'morning',
    time: '08:00',
    taken: true,
    takenAt: '08:05',
    instructions: 'Uống sau bữa ăn sáng',
  },
  {
    id: 'sch_02',
    medicationName: 'Paracetamol 500mg',
    dosage: '1 viên',
    timeSlot: 'noon',
    time: '12:30',
    taken: false,
    instructions: 'Uống sau bữa trưa (nếu còn sốt)',
  },
  {
    id: 'sch_03',
    medicationName: 'Clarithromycin 500mg',
    dosage: '1 viên',
    timeSlot: 'evening',
    time: '19:00',
    taken: false,
    instructions: 'Uống sau bữa ăn tối',
  },
  {
    id: 'sch_04',
    medicationName: 'Cetirizine 10mg',
    dosage: '1 viên',
    timeSlot: 'night',
    time: '21:30',
    taken: false,
    instructions: 'Uống trước khi đi ngủ',
  },
];

export const MOCK_SYMPTOM_LOGS: SymptomLog[] = [
  {
    id: 'sym_01',
    date: '2026-11-09T20:00:00Z',
    feeling: 'moderate',
    symptoms: ['Đắng miệng', 'Hơi mệt'],
    notes: 'Uống kháng sinh liều đầu thấy hơi đắng họng, không phát ban.',
    alertLevel: 'low',
  },
];
