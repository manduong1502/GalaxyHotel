import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, ChevronRight, Compass, Plane, Bike, 
  Car, Shirt, Luggage, ShieldCheck, Clock, Phone, Sparkles, MessageCircle 
} from 'lucide-react';

interface ServicesPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBooking, onNavigate }) => {
  const { lang } = useLanguage();

  const servicesList = [
    {
      icon: Compass,
      title: lang === 'vi' ? 'Tour Trải Nghiệm Khám Phá' : 'Experience & Sightseeing Tours',
      desc: lang === 'vi' 
        ? 'Hỗ trợ đặt tour ghép đoàn và tour riêng chất lượng cao: Hành trình Miền Tây (Mekong Delta), Khám phá Địa đạo Củ Chi, City Tour một vòng Sài Gòn với xe đưa đón tận nơi.'
        : 'High-quality daily tours: Mekong Delta river journey, Cu Chi Tunnels historical discovery, and Saigon City highlights tour with convenient hotel pickup.',
      badge: lang === 'vi' ? 'Tour hàng ngày' : 'Daily Departure',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200'
    },
    {
      icon: Plane,
      title: lang === 'vi' ? 'Đặt Vé Máy Bay & Đưa Đón Sân Bay' : 'Flight Booking & Airport Transfer',
      desc: lang === 'vi'
        ? 'Hỗ trợ săn vé máy bay nội địa & quốc tế giá tốt nhất mọi chặng bay, kết hợp dịch vụ xe 4-7 chỗ đưa đón sân bay Tân Sơn Nhất đúng giờ, an toàn và chu đáo 24/7.'
        : 'Assistance with domestic & international flight ticketing at best rates, coupled with 24/7 private car airport pickup/drop-off at Tan Son Nhat Airport.',
      badge: lang === 'vi' ? 'Hỗ trợ 24/7' : '24/7 Support',
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200'
    },
    {
      icon: Shirt,
      title: lang === 'vi' ? 'Dịch Vụ Giặt Sấy Lấy Nhanh' : 'Same-day Express Laundry',
      desc: lang === 'vi'
        ? 'Dịch vụ giặt sấy thơm tho sạch sẽ trong ngày, ủi phẳng phiu trang phục theo yêu cầu và giao nhận tận phòng chu đáo với chi phí bình dân.'
        : 'Express wash, dry and fold service with optional ironing, delivered directly to your room within hours at affordable rates.',
      badge: lang === 'vi' ? 'Giao tận phòng' : 'Room Delivery',
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200'
    },
    {
      icon: Bike,
      title: lang === 'vi' ? 'Cho Thuê Xe Máy Khám Phá Sài Gòn' : 'Motorbike Rental Service',
      desc: lang === 'vi'
        ? 'Hỗ trợ thuê xe máy tay ga / xe số đời mới với giá hợp lý (120k - 180k/ngày), trang bị sẵn nón bảo hiểm và áo mưa tiện lợi, nhận xe ngay tại sảnh khách sạn.'
        : 'Quality scooters and automatic motorbikes for easy city discovery with helmets provided, ready right at the hotel lobby.',
      badge: lang === 'vi' ? 'Nhận xe tại sảnh' : 'Lobby Pickup',
      badgeColor: 'bg-purple-100 text-purple-900 border border-purple-200'
    },
    {
      icon: Luggage,
      title: lang === 'vi' ? 'Giữ Hành Lý Miễn Phí 24/7' : 'Free 24/7 Luggage Storage',
      desc: lang === 'vi'
        ? 'Nếu bạn đến sớm trước giờ nhận phòng hoặc muốn dạo phố sau khi trả phòng, lễ tân luôn sẵn sàng giữ hành lý an toàn tuyệt đối hoàn toàn miễn phí.'
        : 'Safely store your suitcases before check-in or after check-out at zero cost, monitored with 24/7 CCTV surveillance.',
      badge: lang === 'vi' ? 'Miễn phí 100%' : '100% Free',
      badgeColor: 'bg-cyan-100 text-cyan-900 border border-cyan-200'
    },
    {
      icon: ShieldCheck,
      title: lang === 'vi' ? 'Lễ Tân & Tư Vấn Du Lịch 24/7' : '24/7 Front Desk & Local Advice',
      desc: lang === 'vi'
        ? 'Đội ngũ lễ tân và bảo vệ túc trực 24/24, đảm bảo an ninh tuyệt đối, sẵn sàng tư vấn ẩm thực đường phố Bùi Viện, quán ăn ngon và điểm check-in hấp dẫn.'
        : 'Round-the-clock front desk and security ensuring total safety, ready to guide you to the best street foods and attractions around District 1.',
      badge: '24/7 Security',
      badgeColor: 'bg-neutral-100 text-neutral-800 border border-neutral-300'
    },
  ];

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
              {lang === 'vi' ? 'Dịch vụ & Tiện ích' : 'Services & Amenities'}
            </span>
          </nav>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8DCB9] block mb-2">
            GALAXY BOUTIQUE HOTEL SAIGON
          </span>
          <h1 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {lang === 'vi' ? 'Dịch Vụ & Tiện Ích Trong Suốt Kỳ Nghỉ' : 'Complete Amenities & Guest Services'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            {lang === 'vi'
              ? 'Tận hưởng trọn vẹn sự tiện nghi với các tour du lịch đặc sắc, dịch vụ đặt vé máy bay, xe đưa đón sân bay Tân Sơn Nhất, giặt sấy lấy nhanh và chăm sóc chu đáo 24/7 từ Galaxy Boutique Hotel.'
              : 'Experience seamless comfort with guided sightseeing tours, flight ticketing, airport transfers, express laundry and heartfelt 24/7 hospitality in Saigon.'}
          </p>

        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesList.map((srv, index) => {
            const Icon = srv.icon;
            return (
              <div
                key={index}
                className="bg-white p-7 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 text-[#E8DCB9] flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${srv.badgeColor}`}>
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-xl text-neutral-900 mb-2.5">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Liên hệ hỗ trợ:</span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://zalo.me/0793295664"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Zalo 079 329 5664</span>
                    </a>
                    <a
                      href="tel:02822487782"
                      className="text-neutral-900 font-bold hover:text-[#8A6943] flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>028 2248 7782</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-neutral-900 text-white p-8 sm:p-12 rounded-2xl shadow-xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8DCB9] block mb-1">
              ĐẶT PHÒNG TRỰC TIẾP GIÁ TỐT NHẤT
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight">
              {lang === 'vi' ? 'Sẵn Sàng Cho Chuyến Đi Sài Gòn Của Bạn?' : 'Ready to Experience Saigon?'}
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1 max-w-xl font-sans">
              Đặt phòng trực tiếp trên website để nhận ngay xác nhận tức thì, hỗ trợ đặt tour và đón tiễn sân bay chu đáo nhất.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('rooms')}
              className="px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors"
            >
              {lang === 'vi' ? 'Xem Danh Mục Phòng' : 'View Rooms'}
            </button>
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-[#C29A64] text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-[#b08852] transition-colors"
            >
              {lang === 'vi' ? 'Đặt Phòng Ngay' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
