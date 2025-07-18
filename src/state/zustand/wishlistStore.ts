import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  auctionId: string;
  title: string;
  description: string;
  imageUrl: string;
  currentBid: number;
  endDate: string;
  addedDate: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

interface WishlistActions {
  fetchWishlist: () => Promise<void>;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (auctionId: string) => void;
  updateWishlistItem: (auctionId: string, updates: Partial<WishlistItem>) => void;
  clearWishlist: () => void;
  clearError: () => void;
}

type WishlistStore = WishlistState & WishlistActions;

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const useWishlistStore = create<WishlistStore>()(
  devtools(
    (set, _get) => ({
      ...initialState,
      
      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        
        try {
          
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockItems: WishlistItem[] = [
            {
              id: '1',
              auctionId: 'auction-1',
              title: 'Vintage Camera',
              description: 'Classic 35mm film camera in excellent condition',
              imageUrl: 'https://via.placeholder.com/300x200',
              currentBid: 250,
              endDate: new Date(Date.now() + 86400000).toISOString(),
              addedDate: new Date().toISOString(),
            },
            {
              id: '2',
              auctionId: 'auction-2',
              title: 'Antique Watch',
              description: 'Rare pocket watch from the 1920s',
              imageUrl: 'https://via.placeholder.com/300x200',
              currentBid: 450,
              endDate: new Date(Date.now() + 172800000).toISOString(),
              addedDate: new Date(Date.now() - 3600000).toISOString(),
            },
          ];
          
          set({
            isLoading: false,
            items: mockItems,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'Failed to fetch wishlist',
          });
        }
      },
      
      addToWishlist: (item: WishlistItem) => set((state) => {
        const existingItem = state.items.find(i => i.auctionId === item.auctionId);
        if (existingItem) {
          return state; 
        }
        return { items: [...state.items, item] };
      }),
      
      removeFromWishlist: (auctionId: string) => set((state) => ({
        items: state.items.filter(item => item.auctionId !== auctionId),
      })),
      
      updateWishlistItem: (auctionId: string, updates: Partial<WishlistItem>) => set((state) => ({
        items: state.items.map(item =>
          item.auctionId === auctionId ? { ...item, ...updates } : item
        ),
      })),
      
      clearWishlist: () => set({ items: [] }),
      
      clearError: () => set({ error: null }),
    }),
    { name: 'wishlist-store' }
  )
);