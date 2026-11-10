import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Sparkles, CheckCircle2, Cpu, Eye, FileSearch, ShieldCheck } from 'lucide-react-native';

interface AnalysisProgressProps {
  currentStep: number;
}

const OCR_STEPS = [
  {
    title: 'Khử nhiễu & căn góc nghiêng phiếu khám',
    detail: 'Bilateral Filter & Dewarping Matrix',
    icon: Eye,
  },
  {
    title: 'Đọc nét mực viết tay bác sĩ',
    detail: 'Medical Handwriting Vision OCR v3.2',
    icon: FileSearch,
  },
  {
    title: 'Bóc tách tên thuốc, hàm lượng & liều dùng',
    detail: 'Clinical BioBERT Named Entity Recognition',
    icon: Cpu,
  },
  {
    title: 'Đối soát dược thư & cảnh báo tương tác thuốc',
    detail: 'National Drug Bank & Allergy Interaction Check',
    icon: ShieldCheck,
  },
];

export function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  return (
    <View className="mx-4 my-2 overflow-hidden rounded-3xl border border-blue-200/70 bg-white p-5 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
        <View className="flex-row items-center gap-2">
          <View className="size-8 items-center justify-center rounded-xl bg-blue-50">
            <Sparkles size={18} color="#2563EB" />
          </View>
          <View>
            <Text className="text-sm font-bold text-zinc-900">AI Medical OCR Engine</Text>
            <Text className="text-xs text-zinc-500">Đang dịch giải chữ viết tay bác sĩ...</Text>
          </View>
        </View>
        <ActivityIndicator size="small" color="#2563EB" />
      </View>

      {/* Progress Steps */}
      <View className="mt-4 gap-3">
        {OCR_STEPS.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          const Icon = step.icon;

          return (
            <View
              key={idx}
              className={`flex-row items-center gap-3 rounded-2xl p-2.5 transition-all ${
                isCurrent
                  ? 'bg-blue-50/80 border border-blue-200'
                  : isDone
                  ? 'bg-slate-50/70 border border-slate-100'
                  : 'opacity-40'
              }`}
            >
              <View
                className={`size-7 items-center justify-center rounded-xl ${
                  isDone
                    ? 'bg-emerald-100'
                    : isCurrent
                    ? 'bg-blue-600'
                    : 'bg-slate-200'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={15} color="#059669" />
                ) : (
                  <Icon size={14} color={isCurrent ? '#FFFFFF' : '#64748B'} />
                )}
              </View>

              <View className="flex-1">
                <Text
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-blue-900'
                      : isDone
                      ? 'text-zinc-800'
                      : 'text-zinc-500'
                  }`}
                >
                  {step.title}
                </Text>
                <Text className="text-[10px] text-zinc-400">{step.detail}</Text>
              </View>

              {isCurrent && <ActivityIndicator size="small" color="#2563EB" />}
            </View>
          );
        })}
      </View>
    </View>
  );
}
