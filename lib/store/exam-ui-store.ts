import { MotionValue, useMotionValue } from 'framer-motion';
import { create } from 'zustand';

interface ExamUIState {
  expandedExams: Set<string>;
  toggleExam: (examId: string) => void;
  isExamExpanded: (examId: string) => boolean;
  useExpandable: (examId: string) => {
    isExpanded: boolean;
    toggleExpand: () => void;
    animatedHeight: MotionValue<number>;
  };
}

export const useExamUIStore = create<ExamUIState>((set, get) => ({
  expandedExams: new Set(),
  toggleExam: (examId: string) => {
    set((state) => {
      const newExpandedExams = new Set(state.expandedExams);
      if (newExpandedExams.has(examId)) {
        newExpandedExams.delete(examId);
      } else {
        newExpandedExams.add(examId);
      }
      return { expandedExams: newExpandedExams };
    });
  },
  isExamExpanded: (examId: string) => {
    return get().expandedExams.has(examId);
  },
  useExpandable: (examId: string) => {
    const isExpanded = get().isExamExpanded(examId);
    const toggleExpand = () => get().toggleExam(examId);
    const animatedHeight = useMotionValue(0);
    return { isExpanded, toggleExpand, animatedHeight };
  },
}));
