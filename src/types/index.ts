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

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

// Property types
export interface PropertyAttributes {
    id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  propertyType: 'Beach House' | 'Apartment' | 'Villa';
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos?: {
    data: Array<{
      id: number;
      attributes: {
        url: string;
        name: string;
      };
    }>;
  };
  featuredPhoto?: {
    data: {
      id: number;
      attributes: {
        url: string;
        name: string;
      };
    };
  };
  icalUrl?: string;
  property_owner?: {
    data: StrapiEntity<PropertyOwnerAttributes>;
  };
  flutterwaveSubaccount?: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Property = StrapiEntity<PropertyAttributes>;

// Property Owner types
export interface PropertyOwnerAttributes {
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

export type PropertyOwner = StrapiEntity<PropertyOwnerAttributes>;

// Booking types
export interface BookingAttributes {
  bookingReference: string;
  property: {
    data: Property;
  };
  property_owner?: {
    data: PropertyOwner;
  };
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
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  flutterwaveTransactionId?: string;
  flutterwaveReference?: string;
  paidAt?: string;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export type Booking = StrapiEntity<BookingAttributes>;

// Blocked Date types
export interface BlockedDateAttributes {
  startDate: string;
  endDate: string;
  reason: 'booked' | 'maintenance' | 'owner-use' | 'manual-block';
}

// API Request/Response types
export interface AvailabilityResponse {
  available: boolean;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  blockedDates: BlockedDateAttributes[];
}

export interface BookingInitializeRequest {
  propertyId: number;
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
  propertyType?: 'Beach House' | 'Apartment' | 'Villa';
  maxPrice?: number;
  minBedrooms?: number;
}