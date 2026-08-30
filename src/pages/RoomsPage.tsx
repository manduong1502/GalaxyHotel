import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../context/BookingContext';
import { Room } from '../types';
import { 
  Bed, Users, Maximize2, Check, ArrowRight, Calendar, 
  Clock, ShieldCheck, Sparkles, ChevronRight, Home, Filter 
} from 'lucide-react';

interface RoomsPageProps {
  onSelectRoomForDetail: (room: Room) => void;
  onBookRoom: (room: Room) => void;
  onNavigate: (page: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({
  onSelectRoomForDetail,
  onBookRoom,
  onNavigate,
}) => {
  const { lang, t } = useLanguage();
  const { rooms } = useBookings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pricingMode, setPricingMode] = useState<'nightly' | 'hourly'>('nightly');

  const categories = [
    { id: 'all', label: lang === 'vi' ? 'Tất Cả Phòng (8)' : 'All Rooms (8)' },
    { id: 'double', label: lang === 'vi' ? 'Phòng Đôi 2 Khách' : 'Double / Queen' },
    { id: 'triple', label: lang === 'vi' ? 'Phòng 3 Khách' : 'Triple Rooms' },
    { id: 'family', label: lang === 'vi' ? 'Phòng Gia Đình 4-5 Khách' : 'Family Suites' },
    { id: 'vip', label: lang === 'vi' ? 'VIP Có Ban Công' : 'VIP Balcony' },
  ];

  const filteredRooms = rooms.filter((room) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'double') return room.maxAdults === 2 && room.id !== 'phong-vip';
    if (selectedCategory === 'triple') return room.maxAdults === 3;
    if (selectedCategory === 'family') return room.maxAdults >= 4;
    if (selectedCategory === 'vip') return room.id === 'phong-vip' || room.id === 'phong-e';
    return true;
  });

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAF9F5] min-h-screen animate-fade-in font-sans">
      
      {/* Page Hero & Breadcrumb */}
      <div className="bg-neutral-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E8DCB9_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-sans">
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Trang chủ' : 'Home'}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[#E8DCB9] font-medium">
              {lang === 'vi' ? 'Danh mục phòng nghỉ' : 'Rooms & Suites'}
            </span>
          </nav>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8DCB9] block mb-2">
            GALAXY BOUTIQUE HOTEL SAIGON
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {lang === 'vi' ? 'Danh Sách Phòng & Bảng Giá Chi Tiết' : 'Rooms & Accommodation Rates'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            {lang === 'vi' 
              ? 'Tất cả 8 hạng phòng thực tế tại Galaxy Boutique Hotel đều được trang bị đầy đủ máy lạnh, nệm cao cấp, TV màn hình phẳng, phòng tắm riêng và Wi-Fi tốc độ cao.'
              : 'Explore all 8 authentic boutique room types at Galaxy Hotel with transparent rates for daily and flexible hourly stays in the heart of District 1.'}
          </p>

        </div>
      </div>

      {/* Control Bar: Categories & Pricing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-[#FAF9F5] text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Pricing Mode Switcher */}
          <div className="flex items-center gap-2 bg-[#FAF9F5] p-1 rounded-xl border border-neutral-200 w-full md:w-auto justify-center">
            <button
              onClick={() => setPricingMode('nightly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                pricingMode === 'nightly'
                  ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Giá theo đêm' : 'Nightly rates'}</span>
            </button>

            <button
              onClick={() => setPricingMode('hourly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                pricingMode === 'hourly'
                  ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Giá theo giờ' : 'Hourly rates'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Rooms Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo Image */}
                <div 
                  className="relative aspect-[16/10] overflow-hidden bg-neutral-100 cursor-pointer"
                  onClick={() => onSelectRoomForDetail(room)}
                >
                  <img
                    src={room.images[0]}
                    alt={room.name[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge */}
                  {room.isPopular && (
                    <div className="absolute top-3 left-3 bg-neutral-900 text-[#E8DCB9] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                      {lang === 'vi' ? 'Phổ Biến Nhất' : 'Most Popular'}
                    </div>
                  )}

                  {/* Quick specs pill on photo */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">{room.areaSqm} m² • {room.maxAdults} {lang === 'vi' ? 'Khách' : 'Guests'}</span>
                    <span className="text-[11px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded font-medium">
                      {room.images.length} {lang === 'vi' ? 'ảnh' : 'photos'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 
                        onClick={() => onSelectRoomForDetail(room)}
                        className="font-serif font-bold text-xl text-neutral-900 hover:text-[#8A6943] transition-colors cursor-pointer"
                      >
                        {room.name[lang]}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                        {room.subtitle[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Bed & Capacity Spec */}
                  <div className="flex items-center gap-4 py-3 border-y border-neutral-100 text-xs text-neutral-600 my-4">
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-[#8A6943]" />
                      <span className="truncate max-w-[130px]">{room.bedType[lang].split('(')[0]}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#8A6943]" />
                      <span>{room.maxAdults} {lang === 'vi' ? 'người lớn' : 'adults'}</span>
                    </span>
                  </div>

                  {/* Amenities Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {room.amenities[lang].slice(0, 4).map((item, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-[#FAF9F5] text-neutral-700 px-2.5 py-1 rounded border border-neutral-200/70 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-[#8A6943]" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Bottom */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-neutral-100 flex items-end justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      {pricingMode === 'nightly' 
                        ? (lang === 'vi' ? 'Giá theo đêm' : 'Nightly rate')
                        : (lang === 'vi' ? 'Giá 2 giờ đầu' : 'First 2 hours')}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-neutral-900 tracking-tight font-sans">
                        {pricingMode === 'nightly' ? formatCurrency(room.pricePerNight) : formatCurrency(room.priceHourlyFirst2h)}
                      </span>
                      <span className="text-xs text-neutral-500 font-normal">
                        {pricingMode === 'nightly' ? '/ đêm' : '/ 2h'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectRoomForDetail(room)}
                    className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold hover:underline flex items-center gap-1 pb-1"
                  >
                    <span>{lang === 'vi' ? 'Chi tiết' : 'Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectRoomForDetail(room)}
                    className="py-2.5 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors text-center"
                  >
                    {lang === 'vi' ? 'Xem Lịch Phòng' : 'View Calendar'}
                  </button>
                  <button
                    onClick={() => onBookRoom(room)}
                    className="py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{lang === 'vi' ? 'Đặt Phòng' : 'Book Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Hotel Stay Policies Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                {lang === 'vi' ? 'Thời Gian Nhận / Trả Phòng' : 'Check-in / Check-out'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                {lang === 'vi'
                  ? 'Nhận phòng từ 14:00 • Trả phòng trước 12:00. Hỗ trợ gửi hành lý miễn phí 24/7 tại sảnh.'
                  : 'Standard Check-in 14:00 • Check-out 12:00. Free 24/7 luggage storage available.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                {lang === 'vi' ? 'Thủ Tục Đơn Giản & Nhanh Chóng' : 'Seamless Registration'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                {lang === 'vi'
                  ? 'Chỉ cần xuất trình CCCD / Hộ chiếu bản gốc tại quầy lễ tân để nhận thẻ phòng trong 2 phút.'
                  : 'Fast check-in in 2 minutes with original ID or Passport at front desk.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                {lang === 'vi' ? 'Cam Kết Vệ Sinh & Tiện Nghi' : 'Hygiene & Cleanliness Guarantee'}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                {lang === 'vi'
                  ? '100% phòng được khử khuẩn, thay drap giường mới và trang bị đầy đủ đồ dùng cá nhân mỗi lượt khách.'
                  : '100% sanitized rooms, fresh premium beddings and full toiletries provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
