import { create } from 'zustand';
import { Exam } from '../interfaces/exam';

interface ExamStore {
  exams: Exam[];
  setExams: (exams: Exam[]) => void;
  addExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
}

export const useExamStore = create<ExamStore>((set) => ({
  exams: [],
  setExams: (exams: Exam[]) => set({ exams }),
  addExam: (exam: Exam) => set((state) => ({ exams: [...state.exams, exam] })),
  deleteExam: (examId: string) =>
    set((state) => ({
      exams: state.exams.filter((exam) => exam.id !== examId),
    })),
}));
