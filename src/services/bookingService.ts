import api from './api';
import type {
  BookingInitializeRequest,
  BookingInitializeResponse,
  BookingVerifyResponse,
} from '@/types';

export const bookingService = {
  // Initialize booking and get payment link
  async initialize(bookingData: BookingInitializeRequest): Promise<BookingInitializeResponse> {
    const response = await api.post<BookingInitializeResponse>('/bookings/initialize', bookingData);
    return response.data;
  },

  // Verify payment
  async verifyPayment(transactionId: string, txRef: string): Promise<BookingVerifyResponse> {
    const response = await api.get<BookingVerifyResponse>(
      `/bookings/verify?transaction_id=${transactionId}&tx_ref=${txRef}`
    );
    return response.data;
  },
};