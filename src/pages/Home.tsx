import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { propertyService } from "@/services/propertyService";
import type { Property } from "@/types";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import PopularDestinations from "@/components/home/PopularDestinations";
import LocalExperience from "@/components/home/LocalExperience";

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
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 font-heading">
              Featured Properties
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              Hand-picked luxury homes for your next vacation
            </p>
          </div>

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
                  <Card key={i} className="snap-center shrink-0 w-[85vw] md:w-[70vw] overflow-hidden">
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
          ) : (
            <>
              {/* Desktop Grid: 3 columns */}
              <div className="hidden lg:grid grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.documentId} property={property} />
                ))}
              </div>

              {/* Mobile/Tablet Carousel: Horizontal scroll with center focus */}
              <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-8 snap-x snap-mandatory flex gap-4 scrollbar-hide">
                {featuredProperties.map((property) => (
                  <div
                    key={property.documentId}
                    className="snap-center shrink-0 w-[85vw] md:w-[70vw] transition-all duration-300"
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Mobile View All Button */}
          {/* <div className="mt-8 text-center md:hidden">
            <Link to="/properties">
              <Button className="bg-accent hover:bg-accent-600">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Book Your Stay in 3 Easy Steps
            </h2>
            <p className="text-gray-600 text-lg">
              Experience a hassle-free booking journey from search to stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
         
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-accent" />
              </div>
              <div className="mb-4">
                <span className="text-5xl font-bold text-accent">1</span>
                <span className="text-lg font-semibold text-gray-700 ml-2">
                  Search
                </span>
              </div>
              <p className="text-gray-600">
                Browse our curated collection of luxury beach houses and
                apartments in Lagos
              </p>
            </div>

           
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-accent" />
              </div>
              <div className="mb-4">
                <span className="text-5xl font-bold text-accent">2</span>
                <span className="text-lg font-semibold text-gray-700 ml-2">
                  Select
                </span>
              </div>
              <p className="text-gray-600">
                Choose your perfect property and book securely with instant
                confirmation
              </p>
            </div>

            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HomeIcon className="h-10 w-10 text-accent" />
              </div>
              <div className="mb-4">
                <span className="text-5xl font-bold text-accent">3</span>
                <span className="text-lg font-semibold text-gray-700 ml-2">
                  Enjoy
                </span>
              </div>
              <p className="text-gray-600">
                Arrive and enjoy a premium experience at your chosen property
              </p>
            </div>
          </div>
        </div>
      </section> */}

     
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Lagos Beach Rentals?
            </h2>
            <p className="text-gray-600 text-lg">
              Your trusted partner for premium beachfront accommodations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Verified Properties
                </h3>
                <p className="text-gray-600 text-sm">
                  Every listing is thoroughly vetted for quality and
                  authenticity
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600 text-sm">
                  Safe transactions powered by Flutterwave payment gateway
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Instant Booking</h3>
                <p className="text-gray-600 text-sm">
                  Get immediate confirmation and start planning your getaway
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-warning" />
                </div>
                <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                <p className="text-gray-600 text-sm">
                  Our dedicated team is always here to assist you
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

     
      <section className="py-20 bg-gradient-to-r from-accent via-accent-600 to-accent-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Own a beach house or shortlet property?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            partner with us to maximize your rental income while we handle the
            details. let's turn your property to a top-earning gateway!
          </p>
          <Link to="/properties">
            <Button
              size="lg"
              className="bg-white text-accent hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
            >
              Host Your Property
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
