import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBookings } from './context/BookingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { RoomDetailModal } from './components/RoomDetailModal';
import { BookingModal } from './components/BookingModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';

import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { Room } from './types';

export type AppPage = 'home' | 'rooms' | 'about' | 'services' | 'gallery' | 'contact';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { rooms } = useBookings();
  
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam && ['home', 'rooms', 'about', 'services', 'gallery', 'contact'].includes(pageParam)) {
      return pageParam as AppPage;
    }
    return 'home';
  });

  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  // Sync navigation with browser URL
  const handleNavigate = (page: string) => {
    const validPage = page as AppPage;
    setCurrentPage(validPage);
    const newUrl = page === 'home' ? window.location.pathname : `${window.location.pathname}?page=${page}`;
    window.history.pushState({ page }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam && ['home', 'rooms', 'about', 'services', 'gallery', 'contact'].includes(pageParam)) {
        setCurrentPage(pageParam as AppPage);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Customer Multi-Page Website View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenGeneralBooking}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Main Content Multi-Page Views */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onOpenBooking={handleOpenGeneralBooking}
            onSelectRoomForDetail={(room) => setSelectedRoomForDetail(room)}
            onBookRoom={handleBookSpecificRoom}
            onSearchRooms={handleSearchRooms}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'rooms' && (
          <RoomsPage
            onSelectRoomForDetail={(room) => setSelectedRoomForDetail(room)}
            onBookRoom={handleBookSpecificRoom}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onOpenBooking={handleOpenGeneralBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onOpenBooking={handleOpenGeneralBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Fixed Bottom Action Bar */}
      <MobileBottomNav 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenGeneralBooking} 
      />

      {/* Floating Speed Dial Contact & Maps Widget */}
      <FloatingContactWidget />

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
