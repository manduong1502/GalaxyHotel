import React from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { BookingBar } from '../components/BookingBar';
import { WelcomeSection } from '../components/WelcomeSection';
import { RoomsSection } from '../components/RoomsSection';
import { DiningSection } from '../components/DiningSection';
import { GymFacilitySection } from '../components/GymFacilitySection';
import { GallerySection } from '../components/GallerySection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { LocationContactSection } from '../components/LocationContactSection';
import { Room } from '../types';

interface HomePageProps {
  onOpenBooking: () => void;
  onSelectRoomForDetail: (room: Room) => void;
  onBookRoom: (room: Room) => void;
  onSearchRooms: (params: any) => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBooking,
  onSelectRoomForDetail,
  onBookRoom,
  onSearchRooms,
  onNavigate,
}) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Slideshow */}
      <HeroSlider onOpenBooking={onOpenBooking} />

      {/* Quick Booking Search Bar */}
      <BookingBar onSearch={onSearchRooms} />

      {/* Welcome & Story Teaser */}
      <WelcomeSection />

      {/* Featured Rooms Showcase */}
      <RoomsSection
        onSelectRoom={onSelectRoomForDetail}
        onBookRoom={onBookRoom}
      />

      {/* Dining & Sky Lounge Highlight */}
      <DiningSection />

      {/* Fitness & Facilities Highlight */}
      <GymFacilitySection />

      {/* Gallery Highlight */}
      <GallerySection />

      {/* Real Guest Testimonials */}
      <TestimonialsSection />

      {/* Location & Contact Section */}
      <LocationContactSection />
    </div>
  );
};
