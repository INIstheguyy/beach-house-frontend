import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

import { propertyService } from "@/services/propertyService";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyCardSkeleton, {
  PinnedPropertySkeletonRow,
  HorizontalCarouselSkeleton,
} from "@/components/property/PropertyCardSkeleton";
import PinnedHorizontalScroll from "@/components/common/PinnedHorizontalScroll";
import HorizontalCarousel from "@/components/common/HorizontalCarousel";
import FilterHero from "@/components/property/FilterHero";
import type { Property, PropertyFilters } from "@/types";

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: (searchParams.get("type") as any) || undefined,
    location: searchParams.get("location") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minBedrooms: searchParams.get("minBedrooms")
      ? Number(searchParams.get("minBedrooms"))
      : undefined,
    maxBedrooms: searchParams.get("maxBedrooms")
      ? Number(searchParams.get("maxBedrooms"))
      : undefined,
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll(filters);
      console.log("Properties data received:", data);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.propertyType) params.set("type", newFilters.propertyType);
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.minPrice)
      params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice)
      params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.minBedrooms)
      params.set("minBedrooms", newFilters.minBedrooms.toString());
    if (newFilters.maxBedrooms)
      params.set("maxBedrooms", newFilters.maxBedrooms.toString());

    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const hasActiveFilters =
    filters.propertyType ||
    filters.location ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minBedrooms ||
    filters.maxBedrooms;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter Hero Section */}
      <FilterHero
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header - Hidden on mobile to save space */}
        <div className="mb-8 md:mb-12 hidden md:flex flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl   font-bold text-primary mb-4 font-heading">
              Recommendations for you
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">
                Sort by:
              </span>
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
            </div> */}
          </div>
        </div>

        {/* Mobile Sort - Compact */}
        {/* <div className="mb-6 flex md:hidden justify-end">
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
        </div> */}

        {/* Properties Display */}
        {loading ? (
          <>
            {/* Desktop Loading Skeleton */}
            <HorizontalCarouselSkeleton />
            {/* Mobile/Tablet Loading Skeleton */}
            <PinnedPropertySkeletonRow />
          </>
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
          <>
            {/* Desktop: horizontal drag carousel */}
            <div className="hidden lg:block">
              <HorizontalCarousel>
                {properties.map((property) => (
                  <PropertyCard
                    key={property.documentId}
                    property={property}
                    fill
                  />
                ))}
              </HorizontalCarousel>
            </div>

            {/* Mobile/Tablet: pinned scroll, vertical scroll moves the cards sideways */}
            <div className="lg:hidden">
              <PinnedHorizontalScroll fallbackItemClassName="h-[420px]">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.documentId}
                    property={property}
                    fill
                  />
                ))}
              </PinnedHorizontalScroll>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
