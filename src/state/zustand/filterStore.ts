import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FilterOptions {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  sortBy?: 'price' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

interface FilterState {
  activeFilters: FilterOptions;
  savedFilters: FilterOptions[];
  isFilterModalVisible: boolean;
}

interface FilterActions {
  setFilter: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  saveFilter: (filter: FilterOptions) => void;
  removeSavedFilter: (index: number) => void;
  showFilterModal: () => void;
  hideFilterModal: () => void;
  applySavedFilter: (filter: FilterOptions) => void;
}

type FilterStore = FilterState & FilterActions;

const initialState: FilterState = {
  activeFilters: {},
  savedFilters: [],
  isFilterModalVisible: false,
};

export const useFilterStore = create<FilterStore>()(
  devtools(
    (set, _get) => ({
      ...initialState,
      
      setFilter: (filters: Partial<FilterOptions>) => set((state) => ({
        activeFilters: { ...state.activeFilters, ...filters },
      })),
      
      clearFilters: () => set({ activeFilters: {} }),
      
      saveFilter: (filter: FilterOptions) => set((state) => ({
        savedFilters: [...state.savedFilters, filter],
      })),
      
      removeSavedFilter: (index: number) => set((state) => ({
        savedFilters: state.savedFilters.filter((_, i) => i !== index),
      })),
      
      showFilterModal: () => set({ isFilterModalVisible: true }),
      
      hideFilterModal: () => set({ isFilterModalVisible: false }),
      
      applySavedFilter: (filter: FilterOptions) => set({
        activeFilters: filter,
      }),
    }),
    { name: 'filter-store' }
  )
);