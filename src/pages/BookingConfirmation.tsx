import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bookingService } from '@/services/bookingService';
import { formatPrice } from '@/utils/priceHelpers';
import { formatDate } from '@/utils/dateHelpers';
import type { Booking } from '@/types';
import {
  CheckCircle,
  XCircle,
  Home,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  Download,
  MessageSquare,
} from 'lucide-react';

const VerifyingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardContent className="p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verifying Your Payment
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your booking...
        </p>
      </CardContent>
    </Card>
  </div>
);

const FailedState = ({ message, onBrowse, onContact }: { message: string; onBrowse: () => void; onContact: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="space-y-3">
          <Button
            onClick={onBrowse}
            className="w-full"
            variant="outline"
          >
            Browse Properties
          </Button>
          <Button
            onClick={onContact}
            className="w-full bg-primary hover:bg-primary-600"
          >
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = searchParams.get('transaction_id');
      const txRef = searchParams.get('tx_ref');
      const paymentStatus = searchParams.get('status');

      // Check if payment was cancelled
      if (paymentStatus === 'cancelled') {
        setStatus('failed');
        setErrorMessage('Payment was cancelled. Please try again.');
        return;
      }

      if (!transactionId || !txRef) {
        setStatus('failed');
        setErrorMessage('Invalid payment details. Please try again.');
        return;
      }

      try {
        const result = await bookingService.verifyPayment(transactionId, txRef);
        console.log(result);
        if (result.success && result.booking) {
          setBooking(result.booking);
          setStatus('success');
        } else {
          setStatus('failed');
          setErrorMessage('Payment verification failed. Please contact support.');
        }
      } catch (error: any) {
        console.error('Verification failed:', error);
        setStatus('failed');
        setErrorMessage(
          error.response?.data?.error?.message || 
          'Payment verification failed. Please contact support with your transaction reference.'
        );
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Verifying state
  if (status === 'verifying') {
    return <VerifyingState />;
  }

  // Failed state
  if (status === 'failed') {
    return (
      <FailedState 
        message={errorMessage} 
        onBrowse={() => navigate('/properties')} 
        onContact={() => navigate('/contact')} 
      />
    );
  }

  // Success state
  if (!booking) {
    return null;
  }

  const {
    property,
    guestEmail,
    bookingReference,
    checkIn,
    checkOut,
    guestName,
    guestPhone,
    numberOfNights,
    pricePerNight,
    totalAmount,
    flutterwaveTransactionId
  } = booking;

  const propertyTitle = property?.title || 'Property';
  const propertyLocation = property?.location || '';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Your payment was successful. We've sent a confirmation email to{' '}
              <span className="font-semibold">{guestEmail}</span>
            </p>
          </div>

          {/* Booking Reference */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Your Booking Reference</p>
                <div className="inline-block bg-primary/10 px-6 py-3 rounded-lg">
                  <p className="text-2xl font-bold text-primary font-mono">
                    {bookingReference}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Save this for your records
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property Info */}
              <div className="flex items-start gap-3 pb-4 border-b">
                <Home className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-lg">{propertyTitle}</p>
                  <p className="text-gray-600">{propertyLocation}</p>
                </div>
              </div>

              {/* Check-in/out */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold">{formatDate(checkIn)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">{formatDate(checkOut)}</p>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Guest Name</p>
                    <p className="font-semibold">{guestName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{guestEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{guestPhone}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t">
                <div className="flex items-start gap-3 mb-4">
                  <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Payment Details</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {numberOfNights} night{numberOfNights !== 1 ? 's' : ''} × {formatPrice(pricePerNight)}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total Paid</span>
                        <span className="text-green-600">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Transaction ID: {flutterwaveTransactionId}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Check Your Email</p>
                    <p className="text-sm text-gray-600">
                      You'll receive a confirmation email with all booking details and property contact information.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Property Owner Contact</p>
                    <p className="text-sm text-gray-600">
                      The property owner will contact you 24 hours before check-in with directions and access details.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Enjoy Your Stay!</p>
                    <p className="text-sm text-gray-600">
                      Arrive on your check-in date and enjoy your beach getaway.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4 mr-2" />
              Print Confirmation
            </Button>
            <Link to="/contact" className="w-full">
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Browse More */}
          <div className="mt-8 text-center">
            <Link to="/properties">
              <Button className="bg-accent hover:bg-accent-600">
                Browse More Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
