import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
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
import { Room } from './types';
import { roomsData } from './data/mockData';

export const App: React.FC = () => {
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  const handleOpenGeneralBooking = () => {
    setSelectedRoomForBooking(roomsData[0]);
    setIsBookingModalOpen(true);
  };

  const handleBookSpecificRoom = (room: Room) => {
    setSelectedRoomForBooking(room);
    setIsBookingModalOpen(true);
  };

  const handleSearchRooms = (params: any) => {
    if (params.roomId) {
      const found = roomsData.find(r => r.id === params.roomId);
      if (found) {
        setSelectedRoomForBooking(found);
      }
    } else {
      setSelectedRoomForBooking(roomsData[0]);
    }
    setIsBookingModalOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-hotel-cream text-hotel-charcoal selection:bg-hotel-gold selection:text-white">
        {/* Navigation Header */}
        <Header onOpenBooking={handleOpenGeneralBooking} />

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

          {/* Gym, Wellness & Infinity Pool */}
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
    </LanguageProvider>
  );
};

export default App;
