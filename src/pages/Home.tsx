import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { propertyService } from "@/services/propertyService";
import type { Property } from "@/types";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyCardSkeleton, {
  PinnedPropertySkeletonRow,
} from "@/components/property/PropertyCardSkeleton";
import PinnedHorizontalScroll from "@/components/common/PinnedHorizontalScroll";
import PopularDestinations from "@/components/home/PopularDestinations";
import LocalExperience from "@/components/home/LocalExperience";
import AnimatedAmenities from "@/components/home/AnimatedAmenities";
import ContactSection from "@/components/home/ContactSection";

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      const properties = await propertyService.getAll();
      // Show first 6 properties as featured
      setFeaturedProperties(properties.slice(0, 6));
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="pb-12 pt-4">
        <div className="container mx-auto px-2">
          <div className="relative group rounded-[2.5rem] overflow-hidden min-h-[55vh] md:min-h-[85vh] flex items-center justify-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg')",
              // backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-md">
                Find Your Perfect Getaway in Lagos
              </h1>
              <p className="text-xl md:text-2xl text-white mb-10 leading-relaxed drop-shadow-md font-medium">
                Luxury beach houses and shortlet apartments in steps from the
                ocean. Experience the best of Lagos living.
              </p>

              {/* Search Bar */}
              {/* <Card className="max-w-4xl mx-auto shadow-2xl bg-white/95 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                    <div className="md:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">
                          Location
                        </label>
                      </div>
                      <Input placeholder="Where?" className="w-full" />
                    </div>

                    <div className="md:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">
                          Dates
                        </label>
                      </div>
                      <Input type="date" className="w-full" />
                    </div>

                    <div className="md:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">
                          Guest
                        </label>
                      </div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="2 guests" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 guest</SelectItem>
                          <SelectItem value="2">2 guests</SelectItem>
                          <SelectItem value="3">3 guests</SelectItem>
                          <SelectItem value="4">4+ guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-1 flex items-end">
                      <Link to="/properties" className="w-full">
                        <Button className="w-full bg-accent hover:bg-accent-600 text-white h-10">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <PopularDestinations />

      {/* Local Experience Section */}
      <LocalExperience />

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-top md:flex-row md:justify-between">
            <h2 className="text-3xl md:text-5xl md:max-w-2xl font-bold text-primary mb-4 font-heading">
              Our top rental vacation Properties
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              Hand-picked luxury homes for your next vacation
            </p>
          </div>

          {loading ? (
            <>
              {/* Desktop Loading Skeleton */}
              <div className="hidden lg:grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
              {/* Mobile/Tablet Loading Skeleton */}
              <PinnedPropertySkeletonRow />
            </>
          ) : (
            <>
              {/* Desktop Grid: 3 columns */}
              <div className="hidden lg:grid grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.documentId} property={property} />
                ))}
              </div>

              {/* Mobile/Tablet: pinned scroll, vertical scroll moves the cards sideways */}
              <div className="lg:hidden">
                <PinnedHorizontalScroll fallbackItemClassName="h-[420px]">
                  {featuredProperties.map((property) => (
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

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Link to="/properties">
              <Button className="bg-accent hover:bg-accent-600">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Amenities Section */}
      <AnimatedAmenities />

      <ContactSection />
    </div>
  );
};

export default Home;
