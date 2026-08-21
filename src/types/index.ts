export type Language = 'vi' | 'en';

export interface Room {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  slug: string;
  subtitle: {
    vi: string;
    en: string;
  };
  pricePerNight: number;
  priceHourlyFirst2h: number;
  priceHourlyExtra: number;
  maxAdults: number;
  maxChildren: number;
  areaSqm: number;
  bedType: {
    vi: string;
    en: string;
  };
  view: {
    vi: string;
    en: string;
  };
  amenities: {
    vi: string[];
    en: string[];
  };
  images: string[];
  description: {
    vi: string;
    en: string;
  };
  features: {
    vi: string[];
    en: string[];
  };
  isPopular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  image: string;
  hours: string;
  location: {
    vi: string;
    en: string;
  };
  highlights: {
    vi: string[];
    en: string[];
  };
}

export interface BookingFormData {
  bookingType: 'daily' | 'hourly';
  roomId: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  hoursCount: number;
  adults: number;
  children: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  specialRequests: string;
}
