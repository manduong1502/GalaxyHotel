import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingRecord, BookingFormData, BookingStatus, Room, RoomStatus } from '../types';
import { roomsData as initialRooms } from '../data/mockData';

interface BookingContextType {
  bookings: BookingRecord[];
  rooms: Room[];
  googleSheetWebhookUrl: string;
  setGoogleSheetWebhookUrl: (url: string) => void;
  addBooking: (formData: BookingFormData, totalPrice: number) => Promise<BookingRecord>;
  updateBookingStatus: (id: string, status: BookingStatus, staffNotes?: string) => void;
  deleteBooking: (id: string) => void;
  updateRoomPrice: (id: string, pricePerNight: number, priceHourlyFirst2h: number, priceHourlyExtra: number) => void;
  updateRoomStatus: (id: string, status: RoomStatus) => void;
  updateRoom: (room: Room) => void;
  addNewRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  syncBookingToGoogleSheets: (booking: BookingRecord) => Promise<boolean>;
}

const BookingContext = createContext<BookingContextType>({
  bookings: [],
  rooms: [],
  googleSheetWebhookUrl: '',
  setGoogleSheetWebhookUrl: () => {},
  addBooking: async () => ({} as BookingRecord),
  updateBookingStatus: () => {},
  deleteBooking: () => {},
  updateRoomPrice: () => {},
  updateRoomStatus: () => {},
  updateRoom: () => {},
  addNewRoom: () => {},
  deleteRoom: () => {},
  syncBookingToGoogleSheets: async () => false,
});

const BOOKINGS_STORAGE_KEY = 'galaxy_hotel_bookings_list';
const ROOMS_STORAGE_KEY = 'galaxy_hotel_rooms_custom';
const WEBHOOK_STORAGE_KEY = 'galaxy_hotel_gsheet_webhook';

// Initial realistic seed bookings for demonstration
const initialSeedBookings: BookingRecord[] = [
  {
    id: 'bk-1001',
    bookingCode: 'GBH-8492',
    bookingType: 'daily',
    roomId: 'phong-a',
    roomName: 'Phòng A (Standard Deluxe)',
    guestName: 'Nguyễn Hoàng Long',
    guestPhone: '0908123456',
    guestEmail: 'long.nguyen@gmail.com',
    checkInDate: '2026-08-23',
    checkInTime: '14:00',
    checkOutDate: '2026-08-25',
    checkOutTime: '12:00',
    nightsCount: 2,
    adults: 2,
    children: 0,
    totalPrice: 1300000,
    specialRequests: 'Khách đến từ Hà Nội, cần nhận phòng sớm nếu được',
    staffNotes: 'Đã gọi xác nhận, khách sẽ đến lúc 13:30',
    status: 'confirmed',
    createdAt: '2026-08-22T08:30:00Z',
  },
  {
    id: 'bk-1002',
    bookingCode: 'GBH-8493',
    bookingType: 'hourly',
    roomId: 'phong-ad',
    roomName: 'Phòng AD (Deluxe Triple)',
    guestName: 'Trần Thị Mai Phương',
    guestPhone: '0912345678',
    guestEmail: 'phuong.tran@gmail.com',
    checkInDate: '2026-08-23',
    checkInTime: '15:00',
    checkOutDate: '2026-08-23',
    checkOutTime: '18:00',
    hoursCount: 3,
    adults: 2,
    children: 1,
    totalPrice: 240000,
    specialRequests: 'Cần phòng yên tĩnh để em bé ngủ',
    staffNotes: '',
    status: 'checked_in',
    createdAt: '2026-08-23T07:15:00Z',
  },
  {
    id: 'bk-1003',
    bookingCode: 'GBH-8494',
    bookingType: 'daily',
    roomId: 'phong-c',
    roomName: 'Phòng C (Family Suite - 5 Khách)',
    guestName: 'Mr. Johnathan Smith',
    guestPhone: '+61412345678',
    guestEmail: 'johnathan.smith@outlook.com',
    checkInDate: '2026-08-24',
    checkInTime: '14:00',
    checkOutDate: '2026-08-27',
    checkOutTime: '12:00',
    nightsCount: 3,
    adults: 4,
    children: 1,
    totalPrice: 1950000,
    specialRequests: 'Family from Sydney, requires 2 large extra towels',
    staffNotes: 'Đã gửi email chào mừng tiếng Anh',
    status: 'pending',
    createdAt: '2026-08-23T11:45:00Z',
  },
  {
    id: 'bk-1004',
    bookingCode: 'GBH-8495',
    bookingType: 'daily',
    roomId: 'phong-don-tiet-kiem',
    roomName: 'Phòng Đơn Tiết Kiệm',
    guestName: 'Lê Văn Tuấn',
    guestPhone: '0987654321',
    guestEmail: 'tuan.le@vnn.vn',
    checkInDate: '2026-08-22',
    checkInTime: '14:00',
    checkOutDate: '2026-08-23',
    checkOutTime: '12:00',
    nightsCount: 1,
    adults: 1,
    children: 0,
    totalPrice: 390000,
    specialRequests: 'Đi công tác 1 mình',
    staffNotes: 'Đã thanh toán đủ, check-out đúng giờ',
    status: 'completed',
    createdAt: '2026-08-21T16:00:00Z',
  }
];

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return initialSeedBookings;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return initialRooms.map(r => ({ ...r, status: r.status || 'available' }));
  });

  const [googleSheetWebhookUrl, setGoogleSheetWebhookUrlState] = useState<string>(() => {
    return localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
  });

  useEffect(() => {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  const setGoogleSheetWebhookUrl = (url: string) => {
    setGoogleSheetWebhookUrlState(url);
    localStorage.setItem(WEBHOOK_STORAGE_KEY, url);
  };

  const syncBookingToGoogleSheets = async (booking: BookingRecord): Promise<boolean> => {
    if (!googleSheetWebhookUrl) return false;
    try {
      await fetch(googleSheetWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'new_booking',
          bookingCode: booking.bookingCode,
          bookingType: booking.bookingType === 'daily' ? 'Theo Ngày' : 'Theo Giờ',
          roomName: booking.roomName,
          guestName: booking.guestName,
          guestPhone: booking.guestPhone,
          guestEmail: booking.guestEmail,
          checkInDate: booking.checkInDate,
          checkInTime: booking.checkInTime,
          checkOutDate: booking.checkOutDate,
          checkOutTime: booking.checkOutTime,
          duration: booking.bookingType === 'daily' ? `${booking.nightsCount} đêm` : `${booking.hoursCount} giờ`,
          guests: `${booking.adults} Lớn, ${booking.children} Trẻ`,
          totalPrice: new Intl.NumberFormat('vi-VN').format(booking.totalPrice) + ' VNĐ',
          status: booking.status,
          specialRequests: booking.specialRequests || 'Không',
          createdAt: new Date(booking.createdAt).toLocaleString('vi-VN'),
        }),
      });
      console.log('✓ Successfully synced booking to Google Sheets');
      return true;
    } catch (e) {
      console.error('Failed to sync booking to Google Sheets:', e);
      return false;
    }
  };

  const addBooking = async (formData: BookingFormData, totalPrice: number): Promise<BookingRecord> => {
    const selectedRoom = rooms.find(r => r.id === formData.roomId) || initialRooms[0];
    const newCode = 'GBH-' + Math.floor(1000 + Math.random() * 9000);

    let nights = 1;
    if (formData.bookingType === 'daily' && formData.checkInDate && formData.checkOutDate) {
      const d1 = new Date(formData.checkInDate);
      const d2 = new Date(formData.checkOutDate);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const newRecord: BookingRecord = {
      id: 'bk-' + Date.now(),
      bookingCode: newCode,
      bookingType: formData.bookingType,
      roomId: formData.roomId,
      roomName: selectedRoom.name.vi,
      guestName: formData.guestName,
      guestPhone: formData.guestPhone,
      guestEmail: formData.guestEmail || '',
      checkInDate: formData.checkInDate,
      checkInTime: formData.checkInTime || '14:00',
      checkOutDate: formData.checkOutDate,
      checkOutTime: formData.checkOutTime || '12:00',
      hoursCount: formData.bookingType === 'hourly' ? formData.hoursCount : undefined,
      nightsCount: formData.bookingType === 'daily' ? nights : undefined,
      adults: formData.adults,
      children: formData.children,
      totalPrice: totalPrice,
      specialRequests: formData.specialRequests || '',
      staffNotes: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newRecord, ...prev]);

    // Asynchronously try syncing to Google Sheets if configured
    syncBookingToGoogleSheets(newRecord);

    return newRecord;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, staffNotes?: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status, staffNotes: staffNotes !== undefined ? staffNotes : b.staffNotes, updatedAt: new Date().toISOString() } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const updateRoomPrice = (id: string, pricePerNight: number, priceHourlyFirst2h: number, priceHourlyExtra: number) => {
    setRooms(prev =>
      prev.map(r => (r.id === id ? { ...r, pricePerNight, priceHourlyFirst2h, priceHourlyExtra } : r))
    );
  };

  const updateRoomStatus = (id: string, status: RoomStatus) => {
    setRooms(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => (r.id === updatedRoom.id ? updatedRoom : r)));
  };

  const addNewRoom = (newRoom: Room) => {
    setRooms(prev => [...prev, newRoom]);
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        rooms,
        googleSheetWebhookUrl,
        setGoogleSheetWebhookUrl,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        updateRoomPrice,
        updateRoomStatus,
        updateRoom,
        addNewRoom,
        deleteRoom,
        syncBookingToGoogleSheets,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);
