import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { propertyService } from "@/services/propertyService";
import { formatPrice } from "@/utils/priceHelpers";
import type { Property } from "@/types";
import {
  MapPin,
  Users,
  Bed,
  Bath,
  ArrowRight,
  Search,
  Calendar,
  CheckCircle,
} from "lucide-react";

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
      <section className="relative bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Beach Getaway in Lagos
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              Luxury beach houses and shortlet apartments steps from the ocean
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/properties">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent-600 text-white w-full sm:w-auto"
                >
                  Explore Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Book Your Stay in 3 Easy Steps
            </h2>
            <p className="text-gray-600 text-lg">
              Simple, secure, and hassle-free booking process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Browse Properties
                </h3>
                <p className="text-gray-600">
                  Explore our curated collection of luxury beach houses and
                  apartments
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Select Dates & Book
                </h3>
                <p className="text-gray-600">
                  Choose your dates and complete instant booking with secure
                  payment
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enjoy Your Stay</h3>
                <p className="text-gray-600">
                  Arrive and enjoy your beach getaway with instant confirmation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked luxury stays for your perfect vacation
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden md:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => {
                const imageUrl =
                  property.featuredPhoto?.url;
                const fullImageUrl = imageUrl
                  ? `${import.meta.env.VITE_STRAPI_URL}${imageUrl}`
                  : "https://via.placeholder.com/400x300?text=No+Image";

                return (
                  <Link key={property.id} to={`/properties/${property.documentId}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={fullImageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {property.propertyType}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>

                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {property.location}
                          </span>
                        </div>

                        {/* Property Details */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms} beds</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms} baths</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Max {property.maxGuests}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(property.pricePerNight)}
                            </span>
                            <span className="text-gray-600 text-sm ml-1">
                              /night
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
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

      {/* Why Choose Us Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Lagos Beach Rentals?
            </h2>
            <p className="text-gray-200 text-lg">
              Your trusted partner for beach house rentals in Lagos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Verified Properties
              </h3>
              <p className="text-gray-200 text-sm">
                All properties are verified and meet our quality standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-200 text-sm">
                Safe and secure payment processing with Flutterwave
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Instant Confirmation
              </h3>
              <p className="text-gray-200 text-sm">
                Get instant booking confirmation via email and SMS
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-200 text-sm">
                Our team is always ready to assist you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-accent to-accent-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Lagos Beach Experience?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Book your dream beach house today and create unforgettable memories
          </p>
          <Link to="/properties">
            <Button
              size="lg"
              className="bg-white text-accent hover:bg-gray-100"
            >
              Start Browsing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
