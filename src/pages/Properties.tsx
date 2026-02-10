import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { propertyService } from '@/services/propertyService';
import PropertyCard from '@/components/property/PropertyCard';
import type { Property, PropertyFilters } from '@/types';
import { SlidersHorizontal, X } from 'lucide-react';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: searchParams.get('type') as any || undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll(filters);
      console.log('Properties data received:', data);
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.propertyType) params.set('type', newFilters.propertyType);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.minBedrooms) params.set('minBedrooms', newFilters.minBedrooms.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const hasActiveFilters = filters.propertyType || filters.maxPrice || filters.minBedrooms;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            All Properties
          </h1>
          <p className="text-gray-600 text-lg">
            Find your perfect beach getaway in Lagos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-accent hover:text-accent-600"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Property Type Filter */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Property Type
                    </Label>
                    <Select
                      value={filters.propertyType || ''}
                      onValueChange={(value) => handleFilterChange('propertyType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Beach House">Beach House</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Max Price Per Night
                    </Label>
                    <Select
                      value={filters.maxPrice?.toString() || ''}
                      onValueChange={(value) => handleFilterChange('maxPrice', value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Price</SelectItem>
                        <SelectItem value="30000">₦30,000</SelectItem>
                        <SelectItem value="50000">₦50,000</SelectItem>
                        <SelectItem value="75000">₦75,000</SelectItem>
                        <SelectItem value="100000">₦100,000</SelectItem>
                        <SelectItem value="150000">₦150,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bedrooms Filter */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Minimum Bedrooms
                    </Label>
                    <Select
                      value={filters.minBedrooms?.toString() || ''}
                      onValueChange={(value) => handleFilterChange('minBedrooms', value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1+ Bedroom</SelectItem>
                        <SelectItem value="2">2+ Bedrooms</SelectItem>
                        <SelectItem value="3">3+ Bedrooms</SelectItem>
                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-accent text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Filters Modal */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
                <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Same filters as desktop */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Property Type
                      </Label>
                      <Select
                        value={filters.propertyType || ''}
                        onValueChange={(value) => handleFilterChange('propertyType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Beach House">Beach House</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Max Price Per Night
                      </Label>
                      <Select
                        value={filters.maxPrice?.toString() || ''}
                        onValueChange={(value) => handleFilterChange('maxPrice', value ? Number(value) : undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any Price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Price</SelectItem>
                          <SelectItem value="30000">₦30,000</SelectItem>
                          <SelectItem value="50000">₦50,000</SelectItem>
                          <SelectItem value="75000">₦75,000</SelectItem>
                          <SelectItem value="100000">₦100,000</SelectItem>
                          <SelectItem value="150000">₦150,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Minimum Bedrooms
                      </Label>
                      <Select
                        value={filters.minBedrooms?.toString() || ''}
                        onValueChange={(value) => handleFilterChange('minBedrooms', value ? Number(value) : undefined)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any</SelectItem>
                          <SelectItem value="1">1+ Bedroom</SelectItem>
                          <SelectItem value="2">2+ Bedrooms</SelectItem>
                          <SelectItem value="3">3+ Bedrooms</SelectItem>
                          <SelectItem value="4">4+ Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button
                      className="w-full bg-accent hover:bg-accent-600"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Showing {properties.length} properties
                </h2>
                {hasActiveFilters && (
                  <p className="text-sm text-gray-600 mt-1">
                    Filtered results
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                <Select defaultValue="recommended">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-64 bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    No properties found matching your filters.
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.documentId} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;