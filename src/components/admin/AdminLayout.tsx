import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { DashboardOverview } from './DashboardOverview';
import { BookingsManager } from './BookingsManager';
import { RoomsManager } from './RoomsManager';
import { RoomCalendarView } from './RoomCalendarView';
import { GalleryManager } from './GalleryManager';
import { ServicesManager } from './ServicesManager';
import { AdminSettings } from './AdminSettings';
import { 
  LayoutDashboard, CalendarCheck, BedDouble, Calendar, 
  Settings, LogOut, ArrowLeft, Globe, Heart, Compass, Menu, X 
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToWebsite: () => void;
}

export type AdminTab = 'dashboard' | 'bookings' | 'rooms' | 'gallery' | 'services' | 'calendar' | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToWebsite }) => {
  const { user, logout } = useAuth();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'bookings', label: 'Đơn Đặt Phòng', icon: CalendarCheck, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'rooms', label: 'Phòng, Giá & Ảnh', icon: BedDouble },
    { id: 'gallery', label: 'Góc Nhỏ Yêu Thương', icon: Heart },
    { id: 'services', label: 'Dịch Vụ & Tour', icon: Compass },
    { id: 'calendar', label: 'Sơ Đồ Lịch Phòng', icon: Calendar },
    { id: 'settings', label: 'Cài Đặt & SMTP Mail', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col md:flex-row text-neutral-900 font-sans">
      
      {/* Sidebar (Desktop) - Strictly Fixed & Sticky */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-950 text-white p-6 border-r border-neutral-800 justify-between flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
        
        {/* Brand Header */}
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shadow-sm">
              <img
                src="/images/logo.png"
                alt="Galaxy Hotel Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="tracking-[0.15em] font-bold text-base uppercase text-white block">
                GALAXY
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#C29A64] font-semibold block -mt-0.5">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-sans">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C29A64] text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-neutral-950 text-[#E8DCB9]' : 'bg-amber-500 text-white animate-pulse'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="space-y-3 pt-6 border-t border-neutral-800">
          
          {/* Back to Client Website button */}
          <button
            onClick={onBackToWebsite}
            className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors border border-neutral-800"
          >
            <Globe className="w-4 h-4 text-[#C29A64]" />
            <span>Xem Website Khách</span>
          </button>

          {/* Logged in User */}
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C29A64] text-neutral-950 font-bold flex items-center justify-center text-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white truncate max-w-[100px]">{user?.name}</div>
                <div className="text-[10px] text-[#C29A64] uppercase tracking-wider font-semibold">{user?.role === 'admin' ? 'Quản trị' : 'Lễ tân'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-neutral-950 text-white p-4 flex items-center justify-between border-b border-neutral-800 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-sm tracking-wider uppercase">Galaxy Admin</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onBackToWebsite}
            className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white text-xs"
            title="Xem website"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 text-white p-4 space-y-2 border-b border-neutral-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as AdminTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold uppercase ${
                  isActive ? 'bg-[#C29A64] text-neutral-950 font-bold' : 'text-neutral-400 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-neutral-800">
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-red-950/40 text-red-400 text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {activeTab === 'dashboard' && <DashboardOverview onNavigateToTab={(tab: string) => setActiveTab(tab as AdminTab)} />}
        {activeTab === 'bookings' && <BookingsManager />}
        {activeTab === 'rooms' && <RoomsManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'calendar' && <RoomCalendarView />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

    </div>
  );
};
