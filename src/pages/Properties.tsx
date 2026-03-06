import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { propertyService } from "@/services/propertyService";
import PropertyCard from "@/components/property/PropertyCard";
import FilterHero from "@/components/property/FilterHero";
import type { Property, PropertyFilters } from "@/types";

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: (searchParams.get("type") as any) || undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minBedrooms: searchParams.get("minBedrooms")
      ? Number(searchParams.get("minBedrooms"))
      : undefined,
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  // Intersection Observer for carousel center-focus effect with slower transitions
  useEffect(() => {
    if (!carouselRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
          if (entry.intersectionRatio >= 0.6) {
            // Center card - scale up and full opacity (higher threshold for slower effect)
            card.style.transform = "scale(1.08)";
            card.style.opacity = "1";
            card.style.zIndex = "10";
          } else if (entry.intersectionRatio >= 0.3) {
            // Mid-range - subtle scaling
            card.style.transform = "scale(0.95)";
            card.style.opacity = "0.75";
            card.style.zIndex = "5";
          } else {
            // Side cards - scale down and reduce opacity
            card.style.transform = "scale(0.9)";
            card.style.opacity = "0.6";
            card.style.zIndex = "0";
          }
        });
      },
      {
        root: carouselRef.current,
        threshold: [0, 0.3, 0.6, 1],
      },
    );

    const cards = carouselRef.current.querySelectorAll(".carousel-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [properties, loading]);

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
    if (newFilters.maxPrice)
      params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.minBedrooms)
      params.set("minBedrooms", newFilters.minBedrooms.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const hasActiveFilters =
    filters.propertyType || filters.maxPrice || filters.minBedrooms;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter Hero Section */}
      <FilterHero
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={loadProperties}
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
            <div className="flex items-center gap-2">
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
            </div>
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
            <div className="hidden lg:grid grid-cols-3 gap-6">
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

            {/* Mobile/Tablet Loading Skeleton */}
            <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-8 snap-x snap-mandatory flex gap-4 scrollbar-hide">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="snap-center shrink-0 w-[85vw] md:w-[45vw] overflow-hidden"
                >
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
            {/* Desktop Grid: 3 columns */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.documentId} property={property} />
              ))}
            </div>

            {/* Mobile/Tablet Carousel: Horizontal scroll with slower center focus */}
            <div
              ref={carouselRef}
              className="lg:hidden -mx-4 px-4 overflow-x-auto pb-8 snap-x snap-mandatory flex gap-6 scrollbar-hide scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {properties.map((property) => (
                <div
                  key={property.documentId}
                  className="carousel-card snap-center shrink-0 w-[85vw] md:w-[45vw] transition-all duration-700 ease-out"
                  style={{ transformOrigin: "center center" }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
