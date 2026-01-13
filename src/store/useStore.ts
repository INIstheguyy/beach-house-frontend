import { create } from 'zustand';
import type  { Property, BookingInitializeRequest } from '@/types';

interface StoreState {
  // Properties
  properties: Property[];
  selectedProperty: Property | null;
  setProperties: (properties: Property[]) => void;
  setSelectedProperty: (property: Property | null) => void;

  // Booking
  bookingData: BookingInitializeRequest | null;
  setBookingData: (data: BookingInitializeRequest | null) => void;
  clearBookingData: () => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  // Properties
  properties: [],
  selectedProperty: null,
  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),

  // Booking
  bookingData: null,
  setBookingData: (data) => set({ bookingData: data }),
  clearBookingData: () => set({ bookingData: null }),

  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export default useStore;