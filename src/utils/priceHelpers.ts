export const formatPrice = (price: number): string => {
  if (!price) return '₦0';
  return `₦${price.toLocaleString('en-NG')}`;
};

export const calculateTotal = (pricePerNight: number, nights: number): number => {
  return pricePerNight * nights;
};