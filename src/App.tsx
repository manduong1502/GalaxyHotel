import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBookings } from './context/BookingContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { BookingBar } from './components/BookingBar';
import { WelcomeSection } from './components/WelcomeSection';
import { RoomsSection } from './components/RoomsSection';
import { DiningSection } from './components/DiningSection';
import { GymFacilitySection } from './components/GymFacilitySection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LocationContactSection } from './components/LocationContactSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { RoomDetailModal } from './components/RoomDetailModal';
import { BookingModal } from './components/BookingModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { Room } from './types';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { rooms } = useBookings();
  
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  const handleOpenGeneralBooking = () => {
    setSelectedRoomForBooking(rooms[0] || null);
    setIsBookingModalOpen(true);
  };

  const handleBookSpecificRoom = (room: Room) => {
    setSelectedRoomForBooking(room);
    setIsBookingModalOpen(true);
  };

  const handleSearchRooms = (params: any) => {
    if (params.roomId) {
      const found = rooms.find(r => r.id === params.roomId);
      if (found) {
        setSelectedRoomForBooking(found);
      }
    } else {
      setSelectedRoomForBooking(rooms[0] || null);
    }
    setIsBookingModalOpen(true);
  };

  // If user navigated to Admin View
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin onBackToWebsite={() => setCurrentView('client')} />;
    }
    return <AdminLayout onBackToWebsite={() => setCurrentView('client')} />;
  }

  // Customer View
  return (
    <div className="min-h-screen flex flex-col bg-hotel-cream text-hotel-charcoal selection:bg-hotel-gold selection:text-white">
      {/* Navigation Header with Admin Portal shortcut */}
      <Header
        onOpenBooking={handleOpenGeneralBooking}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider onOpenBooking={handleOpenGeneralBooking} />

        {/* Quick Dual-Mode Booking Bar */}
        <BookingBar onSearch={handleSearchRooms} />

        {/* Welcome & Story */}
        <WelcomeSection />

        {/* Rooms & Suites Catalog */}
        <RoomsSection
          onSelectRoom={(room) => setSelectedRoomForDetail(room)}
          onBookRoom={handleBookSpecificRoom}
        />

        {/* Dining & Sky Lounge */}
        <DiningSection />

        {/* Gym, Wellness & Facilities */}
        <GymFacilitySection />

        {/* Photo Gallery & Lightbox */}
        <GallerySection />

        {/* Guest Reviews */}
        <TestimonialsSection />

        {/* Map & Contact Form */}
        <LocationContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Action Bar */}
      <MobileBottomNav onOpenBooking={handleOpenGeneralBooking} />

      {/* Modals */}
      <RoomDetailModal
        room={selectedRoomForDetail}
        onClose={() => setSelectedRoomForDetail(null)}
        onBookNow={handleBookSpecificRoom}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        selectedRoom={selectedRoomForBooking}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <MainApp />
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
