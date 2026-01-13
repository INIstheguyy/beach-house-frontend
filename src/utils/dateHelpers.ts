import { format, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'MMM dd, yyyy'): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const calculateNights = (checkIn: Date | string, checkOut: Date | string): number => {
  if (!checkIn || !checkOut) return 0;
  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  return differenceInDays(end, start);
};

export const formatDateForAPI = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};