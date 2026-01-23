import { useEffect, useState, type SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { propertyService } from '@/services/propertyService';
import { formatPrice } from '@/utils/priceHelpers';
import { formatDateForAPI, calculateNights } from '@/utils/dateHelpers';
import type { Property, AvailabilityResponse } from '@/types';
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  Shield,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PropertyDetail = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

   useEffect(() => {
    if (documentId) {
      loadProperty(documentId);
    }
  }, [documentId]);

  const loadProperty = async (propertyDocId: string) => {
    try {
      setLoading(true);
      const data = await propertyService.getById(propertyDocId);
      console.log('Property data received:', data);
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut || !documentId) return;

    try {
      setCheckingAvailability(true);
      const result = await propertyService.checkAvailability(
        documentId,
        formatDateForAPI(checkIn),
        formatDateForAPI(checkOut)
      );
      console.log('Availability result:', result);
      setAvailability(result);
    } catch (error) {
      console.error('Failed to check availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut]);

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (!availability?.available) {
      alert('Property not available for selected dates');
      return;
    }

    if (!property) return;

    // Navigate to booking page with state
    navigate('/booking', {
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
            <Button onClick={() => navigate('/properties')}>
              Back to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const attr = property;
  const imageUrl = attr.featuredPhoto?.url ||
                   attr.photos?.[1]?.url;
  const fullImageUrl = imageUrl 
    ? `${import.meta.env.VITE_STRAPI_URL}${imageUrl}`
    : 'https://via.placeholder.com/800x600?text=No+Image';

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalAmount = nights * attr.pricePerNight;

  // Icon mapping for amenities
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Wifi': Wifi,
    'Pool': Users,
    'Parking': Car,
    'Kitchen': Utensils,
    'Security': Shield,
    'Generator': Shield,
    'AC': Shield,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-primary hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <img
                src={fullImageUrl}
                alt={attr.title}
                className="w-full h-96 object-cover"
              />
            </Card>

            {/* Property Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {attr.propertyType}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {attr.title}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{attr.location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-gray-700">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-semibold">{attr.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-semibold">{attr.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-semibold">Max {attr.maxGuests} Guests</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: attr.description }}
                />
              </CardContent>
            </Card>

            {/* Amenities */}
            {attr.amenities && attr.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {attr.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || CheckCircle;
                      return (
                        <div key={index} className="flex items-center text-gray-700">
                          <Icon className="h-5 w-5 mr-2 text-accent" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Widget - Right Column (Sticky) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(attr.pricePerNight)}
                    </span>
                    <span className="text-gray-600">/night</span>
                  </div>
                </div>

                {/* Date Pickers */}
                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="mb-2 block">Check-in</Label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date: SetStateAction<Date | null>) => setCheckIn(date)}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={new Date()}
                      placeholderText="Select check-in date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Check-out</Label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date: SetStateAction<Date | null>) => setCheckOut(date)}
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={checkIn || new Date()}
                      placeholderText="Select check-out date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                        <p className="text-sm text-gray-600 mt-2">Checking availability...</p>
                      </div>
                    ) : availability ? (
                      <div className={`p-4 rounded-lg ${availability.available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-center">
                          {availability.available ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-green-800 font-semibold">Available!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-600 mr-2" />
                              <span className="text-red-800 font-semibold">Not available</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="mb-6 space-y-3 pt-6 border-t">
                    <div className="flex justify-between text-gray-700">
                      <span>{formatPrice(attr.pricePerNight)} × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span>{formatPrice(attr.pricePerNight * nights)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  className="w-full bg-accent hover:bg-accent-600 text-white"
                  size="lg"
                  onClick={handleBookNow}
                  disabled={!availability?.available || !checkIn || !checkOut}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Now
                </Button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;