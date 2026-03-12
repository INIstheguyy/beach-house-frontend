import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Success Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Confirmation details sent to{' '}
                <span className="font-semibold text-gray-900">{guestEmail}</span>
              </p>
            </div>
          </div>
          <div className="bg-accent/5 px-6 py-4 rounded-xl flex border border-accent/10 min-w-[200px] flex-col items-center md:items-start">
            <p className="text-xs text-accent uppercase font-semibold mb-1">
              Booking Ref
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">
                {bookingReference}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(bookingReference)}
                className="text-accent hover:text-accent-600 transition-colors"
                title="Copy Reference"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column (Property & Next Steps) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <Card className="border-0 shadow-sm overflow-hidden rounded-2xl">
              <div className="p-0">
                <div className="p-6 md:p-8 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="h-5 w-5 text-accent" />
                    Property Details
                  </h2>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg md:text-xl text-gray-900">
                      {propertyTitle}
                    </p>
                    <p className="text-gray-500 flex items-center gap-1 text-sm md:text-base">
                      {propertyLocation}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50/50">
                  <div className="p-6 md:p-8">
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" /> Check-in
                    </p>
                    <p className="font-bold text-gray-900 text-lg">
                      {formatDate(checkIn)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">From 2:00 PM</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" /> Check-out
                    </p>
                    <p className="font-bold text-gray-900 text-lg">
                      {formatDate(checkOut)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">By 11:00 AM</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">What's Next?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">Check Your Email</p>
                      <p className="text-sm text-gray-600 mt-1">
                        You'll receive a confirmation email with all booking details.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">Property Owner Contact</p>
                      <p className="text-sm text-gray-600 mt-1">
                        The property owner will contact you 24 hours before check-in with directions and access details.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">Enjoy Your Stay!</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Arrive on your check-in date and enjoy your beach getaway.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Summary, Guest Info & Actions) */}
          <div className="space-y-6 lg:space-y-8">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" /> Payment Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {numberOfNights} night{numberOfNights !== 1 ? 's' : ''} × {formatPrice(pricePerNight)}
                    </span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-lg pt-4 border-t border-gray-100">
                    <span>Total Paid</span>
                    <span className="text-green-600">{formatPrice(totalAmount)}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-4 pt-4 border-t border-gray-100 break-all">
                    TX: {flutterwaveTransactionId}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" /> Guest Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Name</p>
                    <p className="font-medium text-gray-900 text-sm md:text-base">{guestName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Contact</p>
                    <div className="space-y-2 mt-1">
                      <p className="font-medium text-gray-900 flex items-center gap-2 text-sm md:text-base">
                        <Mail className="h-4 w-4 text-gray-400 shrink-0" /> <span className="truncate">{guestEmail}</span>
                      </p>
                      <p className="font-medium text-gray-900 flex items-center gap-2 text-sm md:text-base">
                        <Phone className="h-4 w-4 text-gray-400 shrink-0" /> <span>{guestPhone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4 mr-2" />
                Print Confirmation
              </Button>
              <Link to="/contact" className="block w-full">
                <Button variant="outline" className="w-full bg-white text-gray-700 hover:bg-gray-50 border-gray-200">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link to="/properties" className="block w-full pt-4">
                <Button className="w-full bg-accent hover:bg-accent-600 text-white">
                  Browse More Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
