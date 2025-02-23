import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  name: string | null;
  email: string | null;
  role: string | null;
  phoneNumber: string | null;
  id: string | null;
  isAdmin: boolean;
  profileComplete: boolean;
  setUser: (
    user: Partial<Omit<UserState, 'setUser' | 'reset' | 'getUser'>>
  ) => void;
  reset: () => void;
  getUser: () => Omit<UserState, 'setUser' | 'reset' | 'getUser'>;
}

const initialState = {
  name: null,
  email: null,
  role: null,
  phoneNumber: null,
  id: null,
  isAdmin: false,
  profileComplete: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set((state) => ({ ...state, ...user })),
      reset: () => set(initialState),
      getUser: () => {
        const state = get();
        return {
          name: state.name,
          email: state.email,
          role: state.role,
          phoneNumber: state.phoneNumber,
          id: state.id,
          isAdmin: state.isAdmin,
          profileComplete: state.profileComplete,
        };
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
