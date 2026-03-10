import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingService } from "@/services/bookingService";
import { formatPrice } from "@/utils/priceHelpers";
import { formatDate, calculateNights } from "@/utils/dateHelpers";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  CreditCard,
  Shield,
  MapPin,
  CheckCircle,
} from "lucide-react";

interface LocationState {
  property: any;
  propertyId: string;
  checkIn: string;
  checkOut: string;
}

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
    specialRequests: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // If no booking data, redirect back
  if (!state || !state.property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">
              No booking data found. Please start from property page.
            </p>
            <Button onClick={() => navigate("/properties")}>
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { property, propertyId, checkIn, checkOut } = state;
  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = nights * property.pricePerNight;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        propertyId,
        checkIn,
        checkOut,
        guestDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          numberOfGuests: formData.numberOfGuests,
          specialRequests: formData.specialRequests,
        },
      };

      const response = await bookingService.initialize(bookingData);

      // Redirect to Flutterwave payment page
      if (response.paymentLink) {
        window.location.href = response.paymentLink;
      } else {
        alert("Failed to initialize payment. Please try again.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        "Booking failed. Please try again.";
      console.log(errorMessage);
      alert(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="text-gray-700 hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-xl font-bold text-gray-900 hidden md:block">
                  Lagos Beach Rentals
                </h1>
              </div>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="text-sm font-medium text-accent">
                    Details
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Payment
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Confirm
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Step 1 of 3: Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form - Left Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="+234 801 234 5678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Number of Guests */}
                    <div>
                      <Label htmlFor="numberOfGuests">
                        Number of Guests <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="numberOfGuests"
                          name="numberOfGuests"
                          type="number"
                          min="1"
                          max={property.maxGuests}
                          value={formData.numberOfGuests}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Maximum {property.maxGuests} guests
                      </p>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="specialRequests">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="mt-2"
                        rows={4}
                        placeholder="Any special requirements or requests..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-600 text-white"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Proceed to Payment
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-gray-500 text-center mt-3">
                        By proceeding, you agree to our Terms & Conditions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Booking Summary - Right Column */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg border-0">
                <CardContent className="p-6 space-y-5">
                  {/* Property Image */}
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={
                        property.featuredPhoto?.url
                          ? property.featuredPhoto.url.startsWith("http")
                            ? property.featuredPhoto.url
                            : `${import.meta.env.VITE_STRAPI_URL || ""}${property.featuredPhoto.url}`
                          : "https://picsum.photos/400/300"
                      }
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Property Info */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {property.location}
                    </p>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">4.96</span>
                      <span className="text-xs text-gray-500">
                        (124 reviews)
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    {/* Dates */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold">Check-in</p>
                        <p className="text-gray-600">{formatDate(checkIn)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold">Check-out</p>
                        <p className="text-gray-600">{formatDate(checkOut)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold">Nights</p>
                        <p className="text-gray-600">
                          {nights} night{nights !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatPrice(property.pricePerNight)} × {nights} night
                        {nights !== 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span>Secure payment by Flutterwave</span>
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

export default BookingForm;
