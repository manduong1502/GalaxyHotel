import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { DashboardOverview } from './DashboardOverview';
import { BookingsManager } from './BookingsManager';
import { RoomsManager } from './RoomsManager';
import { RoomCalendarView } from './RoomCalendarView';
import { AdminSettings } from './AdminSettings';
import { 
  LayoutDashboard, CalendarCheck, BedDouble, Calendar, 
  Settings, LogOut, ArrowLeft, Globe, Bell, User, Sparkles, Menu, X 
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToWebsite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToWebsite }) => {
  const { user, logout } = useAuth();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'rooms' | 'calendar' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'bookings', label: 'Đơn Đặt Phòng', icon: CalendarCheck, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'rooms', label: 'Hạng Phòng & Giá', icon: BedDouble },
    { id: 'calendar', label: 'Sơ Đồ Lịch Phòng', icon: Calendar },
    { id: 'settings', label: 'Cài Đặt & Webhook', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-hotel-charcoal font-sans">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-hotel-navy text-white p-6 border-r border-hotel-gold/30 justify-between flex-shrink-0">
        
        {/* Brand Header */}
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-hotel-gold via-hotel-goldDark to-hotel-navy flex items-center justify-center text-white font-brand font-bold text-xl shadow-gold-glow">
              G
            </div>
            <div>
              <span className="font-brand tracking-[0.2em] font-bold text-lg uppercase text-white block">
                GALAXY
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-hotel-gold font-medium block -mt-1">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`btn-magnetic w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-hotel-gold text-hotel-navy shadow-md'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-hotel-navy text-hotel-gold' : 'bg-amber-500 text-white animate-pulse'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          
          {/* Back to Client Website button */}
          <button
            onClick={onBackToWebsite}
            className="btn-magnetic w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Globe className="w-4 h-4 text-hotel-gold" />
            <span>Xem Website Khách</span>
          </button>

          {/* Logged in User */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-hotel-gold text-hotel-navy font-bold flex items-center justify-center text-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white truncate max-w-[100px]">{user?.name}</div>
                <div className="text-[10px] text-hotel-gold uppercase tracking-wider">{user?.role === 'admin' ? 'Quản trị' : 'Lễ tân'}</div>
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
      <header className="md:hidden bg-hotel-navy text-white p-4 flex items-center justify-between border-b border-hotel-gold/30 sticky top-0 z-30">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-hotel-gold text-hotel-navy font-brand font-bold text-base flex items-center justify-center">
            G
          </div>
          <span className="font-brand tracking-widest font-bold text-sm text-white">GALAXY ADMIN</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToWebsite}
            className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-hotel-gold"
          >
            Web
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-hotel-navy text-white p-4 space-y-2 border-b border-white/10 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                activeTab === item.id ? 'bg-hotel-gold text-hotel-navy' : 'text-gray-300'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px]">{item.badge}</span>}
            </button>
          ))}
          <button
            onClick={logout}
            className="w-full py-2.5 text-center text-red-400 font-bold text-xs uppercase"
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 hidden md:flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              GALAXY BOUTIQUE HOTEL • 269/19 ĐỀ THÁM, Q1
            </span>
            <h1 className="font-serif font-bold text-xl text-hotel-navy">
              {activeTab === 'dashboard' && 'Bảng Điều Khiển Tổng Quan'}
              {activeTab === 'bookings' && 'Quản Lý Đơn Đặt Phòng'}
              {activeTab === 'rooms' && 'Danh Mục Phòng & Bảng Giá'}
              {activeTab === 'calendar' && 'Sơ Đồ Lịch Phòng Trực Quan'}
              {activeTab === 'settings' && 'Cài Đặt & Kết Nối Dữ Liệu'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="btn-magnetic px-4 py-2 rounded-xl bg-hotel-sand/80 hover:bg-hotel-sand text-hotel-navy font-bold text-xs flex items-center gap-2 border border-hotel-gold/30"
            >
              <Globe className="w-3.5 h-3.5 text-hotel-goldDark" />
              <span>Xem Website Khách Hàng</span>
            </button>

            <div className="text-right text-xs text-gray-500 pl-3 border-l border-gray-200">
              <div className="font-bold text-gray-800">{new Date().toLocaleDateString('vi-VN')}</div>
              <div className="text-[10px] text-green-600 font-semibold">● Hệ thống sẵn sàng</div>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="p-4 sm:p-8 flex-1">
          {activeTab === 'dashboard' && <DashboardOverview onNavigateToTab={(t: any) => setActiveTab(t)} />}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'rooms' && <RoomsManager />}
          {activeTab === 'calendar' && <RoomCalendarView />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>

      </main>

    </div>
  );
};
