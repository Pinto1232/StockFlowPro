import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
}

interface AccountState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AccountActions {
  loginStart: () => void;
  loginSuccess: (user: User) => void;
  loginFailure: (error: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

type AccountStore = AccountState & AccountActions;

const initialState: AccountState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAccountStore = create<AccountStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      loginStart: () => set({ isLoading: true, error: null }),
      
      loginSuccess: (user: User) => set({
        isLoading: false,
        isAuthenticated: true,
        user,
        error: null,
      }),
      
      loginFailure: (error: string) => set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error,
      }),
      
      logout: () => set({
        isAuthenticated: false,
        user: null,
        error: null,
      }),
      
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    { name: 'account-store' }
  )
);