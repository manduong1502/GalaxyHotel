export type Language = 'vi' | 'en';

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

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
  status?: RoomStatus;
  isPopular?: boolean;
  totalInventory?: number; // Total physical rooms of this type (default 1)
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

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

export interface BookingRecord {
  id: string;
  bookingCode: string;
  bookingType: 'daily' | 'hourly';
  roomId: string;
  roomName: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  hoursCount?: number;
  nightsCount?: number;
  adults: number;
  children: number;
  totalPrice: number;
  specialRequests?: string;
  staffNotes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface RoomLock {
  id: string;
  roomId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  isLocked?: boolean; // true = locked, false = custom inventory override
  customInventory?: number; // custom number of units available for these dates
  reason?: string;
  createdAt?: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  checkInDate?: string;
  checkOutDate?: string;
  roomType?: string;
  guestsCount?: number;
  message: string;
  status: 'new' | 'contacted' | 'resolved' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'receptionist';
  token?: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingCount: number;
  confirmedCount: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  estimatedRevenue: number;
  occupancyRate: number;
}

