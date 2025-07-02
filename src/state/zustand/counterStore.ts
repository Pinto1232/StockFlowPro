import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  isLoading: boolean;
  error: string | null;
  lastSaved: string | null;
}

interface CounterActions {
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
  reset: () => void;
  saveCounter: () => Promise<void>;
  clearError: () => void;
}

type CounterStore = CounterState & CounterActions;

const initialState: CounterState = {
  count: 0,
  isLoading: false,
  error: null,
  lastSaved: null,
};

export const useCounterStore = create<CounterStore>()(
  devtools(
    (set, _get) => ({
      ...initialState,
      
      increment: () => set((state) => ({ 
        count: state.count + 1, 
        error: null 
      })),
      
      decrement: () => set((state) => ({ 
        count: state.count - 1, 
        error: null 
      })),
      
      incrementByAmount: (amount: number) => set((state) => ({ 
        count: state.count + amount, 
        error: null 
      })),
      
      reset: () => set({ count: 0, error: null }),
      
      saveCounter: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            isLoading: false,
            lastSaved: new Date().toISOString(),
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Failed to save counter',
          });
          throw error;
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    { name: 'counter-store' }
  )
);