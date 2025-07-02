import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AuctionRegistration {
  auctionId: string;
  userId: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  bidLimit?: number;
}

interface AuctionRegistrationState {
  registrations: AuctionRegistration[];
  isLoading: boolean;
  error: string | null;
  currentRegistration: AuctionRegistration | null;
}

interface AuctionRegistrationActions {
  registerForAuction: (auctionId: string, userId: string, bidLimit?: number) => Promise<void>;
  updateRegistrationStatus: (auctionId: string, status: AuctionRegistration['status']) => void;
  loadRegistrations: (registrations: AuctionRegistration[]) => void;
  clearCurrentRegistration: () => void;
  clearError: () => void;
}

type AuctionRegistrationStore = AuctionRegistrationState & AuctionRegistrationActions;

const initialState: AuctionRegistrationState = {
  registrations: [],
  isLoading: false,
  error: null,
  currentRegistration: null,
};

export const useAuctionRegistrationStore = create<AuctionRegistrationStore>()(
  devtools(
    (set, _get) => ({
      ...initialState,
      
      registerForAuction: async (auctionId: string, userId: string, bidLimit?: number) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newRegistration: AuctionRegistration = {
            auctionId,
            userId,
            registrationDate: new Date().toISOString(),
            status: 'pending',
            bidLimit,
          };
          
          set((state) => ({
            isLoading: false,
            registrations: [...state.registrations, newRegistration],
            currentRegistration: newRegistration,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: 'Failed to register for auction',
          });
          throw error;
        }
      },
      
      updateRegistrationStatus: (auctionId: string, status: AuctionRegistration['status']) => set((state) => ({
        registrations: state.registrations.map(registration =>
          registration.auctionId === auctionId
            ? { ...registration, status }
            : registration
        ),
      })),
      
      loadRegistrations: (registrations: AuctionRegistration[]) => set({
        registrations,
      }),
      
      clearCurrentRegistration: () => set({
        currentRegistration: null,
      }),
      
      clearError: () => set({ error: null }),
    }),
    { name: 'auction-registration-store' }
  )
);