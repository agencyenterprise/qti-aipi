import { create } from 'zustand';
import type { QTIAssessmentItem, QTIAssessmentTest, QTICurriculum } from '@/types/qti';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
  } | null;
  setAuth: (token: string, user: AuthState['user']) => void;
  clearAuth: () => void;
}

interface ItemBankState {
  items: QTIAssessmentItem[];
  selectedItem: QTIAssessmentItem | null;
  setItems: (items: QTIAssessmentItem[]) => void;
  setSelectedItem: (item: QTIAssessmentItem | null) => void;
}

interface AssessmentState {
  tests: QTIAssessmentTest[];
  selectedTest: QTIAssessmentTest | null;
  setTests: (tests: QTIAssessmentTest[]) => void;
  setSelectedTest: (test: QTIAssessmentTest | null) => void;
}

interface CurriculumState {
  curricula: QTICurriculum[];
  selectedCurriculum: QTICurriculum | null;
  setCurricula: (curricula: QTICurriculum[]) => void;
  setSelectedCurriculum: (curriculum: QTICurriculum | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem('auth_token', token);
    set({ token, user });
  },
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    set({ token: null, user: null });
  },
}));

export const useItemBankStore = create<ItemBankState>((set) => ({
  items: [],
  selectedItem: null,
  setItems: (items) => set({ items }),
  setSelectedItem: (selectedItem) => set({ selectedItem }),
}));

export const useAssessmentStore = create<AssessmentState>((set) => ({
  tests: [],
  selectedTest: null,
  setTests: (tests) => set({ tests }),
  setSelectedTest: (selectedTest) => set({ selectedTest }),
}));

export const useCurriculumStore = create<CurriculumState>((set) => ({
  curricula: [],
  selectedCurriculum: null,
  setCurricula: (curricula) => set({ curricula }),
  setSelectedCurriculum: (selectedCurriculum) => set({ selectedCurriculum }),
})); 