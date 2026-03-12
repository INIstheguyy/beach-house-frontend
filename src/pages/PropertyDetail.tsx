import { useEffect, useState, type SetStateAction } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { propertyService } from "@/services/propertyService";
import { formatPrice } from "@/utils/priceHelpers";
import { formatDateForAPI, calculateNights } from "@/utils/dateHelpers";
import type { Property, AvailabilityResponse } from "@/types";
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StackedPhotoGallery from "@/components/property/StackedPhotoGallery";

const PropertyDetail = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null,
  );
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");

  useEffect(() => {
    if (documentId) {
      loadProperty(documentId);
    }
  }, [documentId]);

  const loadProperty = async (propertyDocId: string) => {
    try {
      setLoading(true);
      const data = await propertyService.getById(propertyDocId);
      console.log("Property data received:", data);
      setProperty(data);
    } catch (error) {
      console.error("Failed to load property:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut || !property) return;

    try {
      setCheckingAvailability(true);
      console.log(property.id);
      console.log(formatDateForAPI(checkIn));
      console.log(formatDateForAPI(checkOut));
      const result = await propertyService.checkAvailability(
        property.id,
        formatDateForAPI(checkIn),
        formatDateForAPI(checkOut),
      );
      console.log("Availability result:", result);
      setAvailability(result);
    } catch (error) {
      console.error("Failed to check availability:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut && property) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, property]);

  // Sync featured image URL when property loads
  useEffect(() => {
    if (!property) return;
    const imgUrl = property.featuredPhoto?.url || property.photos?.[0]?.url;
    const resolved = imgUrl
      ? imgUrl.startsWith("http")
        ? imgUrl
        : `${import.meta.env.VITE_STRAPI_URL || ""}${imgUrl}`
      : "https://via.placeholder.com/800x600?text=No+Image";
    setFeaturedImageUrl(resolved);
  }, [property]);

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (!availability?.available) {
      alert("Property not available for selected dates");
      return;
    }

    if (!property) return;
    console.log("Booking property:", property.id);

    // Navigate to booking page with state
    navigate("/booking", {
      state: {
        property: property,
        propertyId: property.id,
        checkIn: formatDateForAPI(checkIn),
        checkOut: formatDateForAPI(checkOut),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">Property not found</p>
            <Button onClick={() => navigate("/properties")}>
              Back to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const attr = property;

  // Prepare all photos for stacked gallery
  const allPhotos = attr.photos && attr.photos.length > 0 ? attr.photos : [];

  const handlePhotoSelect = (url: string) => {
    setFeaturedImageUrl(url);
  };

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalAmount = nights * attr.pricePerNight;

  // Icon mapping for amenities
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    Wifi: Wifi,
    Pool: Users,
    Parking: Car,
    Kitchen: Utensils,
    Security: Shield,
    Generator: Shield,
    AC: Shield,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-12">
      {/* Isolated Back Button */}
      <div className="max-w-[1400px] mx-auto px-4 xl:px-8 relative z-30">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 mb-4 xl:absolute xl:left-8 xl:top-0 bg-white border border-gray-200 text-gray-700 hover:bg-accent hover:text-white hover:border-accent rounded-full shadow-sm transition-all"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Photo Gallery Section */}
      <div className="w-full px-4 mb-6 md:mb-8 lg:mb-10">
        <div className="mx-auto max-w-7xl">
          {/* Desktop Layout (lg+): Featured + Stacked side-by-side */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {/* Featured Photo - Left (2/3 width) */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden aspect-[3/2]">
                <img
                  src={featuredImageUrl}
                  alt={attr.title}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                />
              </Card>
            </div>

            {/* Stacked Gallery - Right (1/3 width) */}
            <div className="lg:col-span-1">
              <StackedPhotoGallery
                photos={allPhotos}
                baseUrl={import.meta.env.VITE_STRAPI_URL || ""}
                onPhotoSelect={handlePhotoSelect}
                className="h-full"
              />
            </div>
          </div>

          {/* Tablet Layout (md-lg): Stacked vertically */}
          <div className="hidden md:grid lg:hidden grid-cols-1 gap-6">
            {/* Featured Photo */}
            <div className="w-full">
              <Card className="overflow-hidden aspect-[3/2]">
                <img
                  src={featuredImageUrl}
                  alt={attr.title}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                />
              </Card>
            </div>

            {/* Stacked Gallery */}
            <div className="w-full md:max-w-md mx-auto">
              <StackedPhotoGallery
                photos={allPhotos}
                baseUrl={import.meta.env.VITE_STRAPI_URL || ""}
                onPhotoSelect={handlePhotoSelect}
              />
            </div>
          </div>

          {/* Mobile Layout (sm): Only Stacked Gallery */}
          <div className="md:hidden">
            <StackedPhotoGallery
              photos={allPhotos}
              baseUrl={import.meta.env.VITE_STRAPI_URL || ""}
              onPhotoSelect={handlePhotoSelect}
            />
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="w-full bg-gray-50 px-4 py-8 md:py-10 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content Column (lg: 2/3) */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              
              {/* Core Information Card */}
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {attr.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
                    <span>{attr.location}</span>
                  </div>
                </div>
                
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
                  <div className="p-5 md:p-8 text-center flex flex-col items-center justify-center gap-2">
                    <Bed className="h-6 w-6 text-primary" />
                    <div>
                      <span className="font-bold text-gray-900 text-lg md:text-xl block leading-tight">
                        {attr.bedrooms}
                      </span>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bedrooms</p>
                    </div>
                  </div>
                  <div className="p-5 md:p-8 text-center flex flex-col items-center justify-center gap-2">
                    <Bath className="h-6 w-6 text-primary" />
                    <div>
                      <span className="font-bold text-gray-900 text-lg md:text-xl block leading-tight">
                        {attr.bathrooms}
                      </span>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bathrooms</p>
                    </div>
                  </div>
                  <div className="p-5 md:p-8 text-center flex flex-col items-center justify-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <span className="font-bold text-gray-900 text-lg md:text-xl block leading-tight">
                        {attr.maxGuests}
                      </span>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Guests</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    About this property
                  </h2>
                  <div
                    className="prose prose-sm md:prose-base max-w-none text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: attr.description }}
                  />
                </CardContent>
              </Card>

              {/* Amenities */}
              {attr.amenities && attr.amenities.length > 0 && (
                <Card className="border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Amenities
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                      {attr.amenities.map((amenity, index) => {
                        const Icon = amenityIcons[amenity] || CheckCircle;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm md:text-base text-gray-700"
                          >
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                              <Icon className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                            </div>
                            <span className="font-medium">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Widget Column (lg: 1/3, sticky on desktop) */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg rounded-2xl lg:sticky lg:top-24">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(attr.pricePerNight)}
                      </span>
                      <span className="text-gray-500 text-sm font-medium">/night</span>
                    </div>
                  </div>

                  {/* Date Pickers */}
                  <div className="space-y-6 mb-8">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-2 block">Check-in</Label>
                      <DatePicker
                        selected={checkIn}
                        onChange={(date: SetStateAction<Date | null>) =>
                          setCheckIn(date)
                        }
                        selectsStart
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={new Date()}
                        placeholderText="Select check-in date"
                        className="w-full pb-2 border-0 border-b-2 border-gray-100 rounded-none focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors bg-transparent placeholder:font-normal placeholder:text-gray-400"
                        dateFormat="MMM dd, yyyy"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-2 block">Check-out</Label>
                      <DatePicker
                        selected={checkOut}
                        onChange={(date: SetStateAction<Date | null>) =>
                          setCheckOut(date)
                        }
                        selectsEnd
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={checkIn || new Date()}
                        placeholderText="Select check-out date"
                        className="w-full pb-2 border-0 border-b-2 border-gray-100 rounded-none focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors bg-transparent placeholder:font-normal placeholder:text-gray-400"
                        dateFormat="MMM dd, yyyy"
                      />
                    </div>
                  </div>

                  {/* Availability Status */}
                  {checkIn && checkOut && (
                    <div className="mb-6">
                      {checkingAvailability ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-gray-600 mt-2">
                            Checking availability...
                          </p>
                        </div>
                      ) : availability ? (
                        <div
                          className={`p-4 rounded-xl flex items-center gap-3 ${
                            availability.available
                              ? "bg-green-50 text-green-800"
                              : "bg-red-50 text-red-800"
                          }`}
                        >
                          {availability.available ? (
                            <>
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                              <span className="font-semibold text-sm">
                                Available!
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <XCircle className="h-5 w-5 text-red-600" />
                              </div>
                              <span className="font-semibold text-sm">
                                Not available for selected dates
                              </span>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Price Breakdown */}
                  {nights > 0 && (
                    <div className="mb-8 space-y-4 pt-6 border-t border-gray-100">
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>
                          {formatPrice(attr.pricePerNight)} × {nights} night
                          {nights !== 1 ? "s" : ""}
                        </span>
                        <span className="font-medium text-gray-900">{formatPrice(attr.pricePerNight * nights)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                        <span className="text-gray-900">Total</span>
                        <span className="text-primary">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    className="w-full bg-accent hover:bg-accent-600 text-white rounded-xl shadow-md disabled:shadow-none"
                    size="lg"
                    onClick={handleBookNow}
                    disabled={!availability?.available || !checkIn || !checkOut}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Reserve Now
                  </Button>

                  <p className="text-xs text-gray-500 font-medium text-center mt-4 tracking-wide uppercase">
                    You won't be charged yet
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">Secure<br/>payment</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">Instant<br/>confirm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
