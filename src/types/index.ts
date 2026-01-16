// Strapi base types
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ❌ Remove this - not needed in v5
// export interface StrapiEntity<T> {
//   id: number;
//   documentId: string;
//   attributes: T;
// }

// Property types - now flat, not wrapped
export interface Property {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  propertyType: "Beach House" | "Apartment" | "Villa";
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText: string | null;
    caption: string | null;
  }>;
  featuredPhoto?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText: string | null;
    caption: string | null;
  };
  icalUrl?: string;
  property_owner?: {
    id: number;
    documentId: string;
    name: string;
    email: string;
    phone: string;
    bankDetails?: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    };
    flutterwaveSubaccount?: string;
    totalEarnings: number;
  };
  flutterwaveSubaccount?: string;
  commissionRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Property Owner types
export interface PropertyOwner {
  id: number;
  documentId: string;
  name: string;
  email: string;
  phone: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  flutterwaveSubaccount?: string;
  totalEarnings: number;
}

// Booking types
export interface Booking {
  id: number;
  documentId: string;
  bookingReference: string;
  property: Property;
  property_owner?: PropertyOwner;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  checkIn: string;
  checkOut: string;
  numberOfNights: number;
  pricePerNight: number;
  totalAmount: number;
  agentCommission: number;
  propertyOwnerAmount: number;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  flutterwaveTransactionId?: string;
  flutterwaveReference?: string;
  paidAt?: string;
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// Blocked Date types
export interface BlockedDate {
  id: number;
  documentId: string;
  startDate: string;
  endDate: string;
  reason: "booked" | "maintenance" | "owner-use" | "manual-block";
}

// API Request/Response types
export interface AvailabilityResponse {
  available: boolean;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  blockedDates: BlockedDate[];
}

export interface BookingInitializeRequest {
  propertyId: string;  // Changed to string (documentId)
  checkIn: string;
  checkOut: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
    numberOfGuests: number;
    specialRequests?: string;
  };
}

export interface BookingInitializeResponse {
  success: boolean;
  bookingId: number;
  bookingReference: string;
  paymentLink: string;
}

export interface BookingVerifyResponse {
  success: boolean;
  booking: Booking;
}

// Filter types
export interface PropertyFilters {
  propertyType?: "Beach House" | "Apartment" | "Villa";
  maxPrice?: number;
  minBedrooms?: number;
}