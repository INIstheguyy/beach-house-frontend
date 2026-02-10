import api from './api';
import type  { Property, PropertyFilters, AvailabilityResponse, StrapiResponse } from '@/types';

export const propertyService = {
  // Get all properties
  async getAll(filters: PropertyFilters = {}): Promise<Property[]> {
    const params = new URLSearchParams();
    
    if (filters.propertyType) {
      params.append('filters[propertyType][$eq]', filters.propertyType);
    }
    if (filters.maxPrice) {
      params.append('filters[pricePerNight][$lte]', filters.maxPrice.toString());
    }
    if (filters.minBedrooms) {
      params.append('filters[bedrooms][$gte]', filters.minBedrooms.toString());
    }
    
    params.append('populate', '*');
    
    const response = await api.get<StrapiResponse<Property[]>>(`/properties?${params.toString()}`);
    return response.data.data;
  },

  // Get single property
async getById(id: string): Promise<Property> {
  const response = await api.get<StrapiResponse<Property>>(`/properties/${id}?populate=*`);
  return response.data.data;
},
  // Check availability
  async checkAvailability(
    propertyDocumentId: number,
    checkIn: string,
    checkOut: string
  ): Promise<AvailabilityResponse> {
    const response = await api.get<AvailabilityResponse>(
      `/properties/${propertyDocumentId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`
    );
    return response.data;
  },
};