import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, ChevronRight, Coffee, Dumbbell, Bike, 
  Car, Shirt, Luggage, ShieldCheck, Clock, Phone, Sparkles 
} from 'lucide-react';

interface ServicesPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBooking, onNavigate }) => {
  const { lang } = useLanguage();

  const servicesList = [
    {
      icon: Coffee,
      title: lang === 'vi' ? 'Sky Lounge & Cà Phê Thư Giãn' : 'Sky Lounge & Coffee Garden',
      desc: lang === 'vi' 
        ? 'Không gian tầng thượng thoáng đãng, phục vụ cà phê pha phin truyền thống Việt Nam, trà thảo mộc và nước ép trái cây tươi mát mỗi sáng.'
        : 'Rooftop relaxing space serving authentic Vietnamese coffee, herbal teas and fresh juices daily.',
      badge: lang === 'vi' ? 'Miễn phí chỗ ngồi' : 'Free access',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      icon: Dumbbell,
      title: lang === 'vi' ? 'Phòng Gym & Thể Thao Cơ Bản' : 'Fitness & Wellness Corner',
      desc: lang === 'vi'
        ? 'Khu vực tập luyện với máy chạy bộ, tạ tay và thảm yoga giúp bạn duy trì thói quen rèn luyện sức khỏe ngay trong chuyến du lịch.'
        : 'Equipped with treadmills, free weights and yoga mats to maintain your workout routine.',
      badge: lang === 'vi' ? 'Mở cửa 6h - 22h' : '6AM - 10PM',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      icon: Bike,
      title: lang === 'vi' ? 'Cho Thuê Xe Máy Khám Phá Sài Gòn' : 'Motorbike Rental Service',
      desc: lang === 'vi'
        ? 'Hỗ trợ thuê xe máy tay ga / xe số đời mới với giá hợp lý (120k - 180k/ngày), trang bị sẵn nón bảo hiểm và áo mưa.'
        : 'Quality scooters and automatic motorbikes for easy city discovery with helmets provided.',
      badge: lang === 'vi' ? 'Nhận xe tại sảnh' : 'Hotel lobby pickup',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      icon: Car,
      title: lang === 'vi' ? 'Đưa Đón Sân Bay Tân Sơn Nhất' : 'Airport Transfer Assistance',
      desc: lang === 'vi'
        ? 'Hỗ trợ đặt xe 4 chỗ, 7 chỗ đón tiễn sân bay Tân Sơn Nhất đúng giờ, không lo chặt chém hay chờ đợi lâu.'
        : 'Reliable private car booking to/from Tan Son Nhat Airport at fixed transparent rates.',
      badge: '24/7',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      icon: Shirt,
      title: lang === 'vi' ? 'Giặt Ủi Lấy Nhanh Trong Ngày' : 'Same-day Laundry Service',
      desc: lang === 'vi'
        ? 'Dịch vụ giặt sấy thơm tho, ủi phẳng phiu và giao tận phòng trong vòng 6-8 tiếng cho khách lưu trú.'
        : 'Express wash, dry and fold service delivered directly to your room within hours.',
      badge: lang === 'vi' ? 'Giao tận phòng' : 'Room delivery',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    {
      icon: Luggage,
      title: lang === 'vi' ? 'Giữ Hành Lý Miễn Phí 24/7' : 'Free 24/7 Luggage Storage',
      desc: lang === 'vi'
        ? 'Nếu bạn đến sớm trước giờ nhận phòng hoặc muốn đi chơi sau khi trả phòng, lễ tân luôn sẵn sàng giữ hành lý an toàn tuyệt đối.'
        : 'Safely store your suitcases before check-in or after check-out at zero cost.',
      badge: lang === 'vi' ? 'Miễn phí 100%' : '100% Free',
      badgeColor: 'bg-emerald-100 text-emerald-800'
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
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {lang === 'vi' ? 'Dịch Vụ & Tiện Ích Đầy Đủ Cho Kỳ Nghỉ Hoàn Hảo' : 'Complete Amenities & Guest Services'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            {lang === 'vi'
              ? 'Tận hưởng trọn vẹn sự tiện nghi từ sảnh đón tiếp 24/7, không gian cà phê Sky Lounge, dịch vụ thuê xe và chăm sóc chu đáo từ đội ngũ khách sạn.'
              : 'Experience seamless comfort with 24/7 front desk, rooftop lounge, rental services and heartfelt hospitality in Saigon.'}
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

                  <h3 className="font-serif font-bold text-xl text-neutral-900 mb-2.5">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Hỗ trợ tại quầy lễ tân</span>
                  <a
                    href="tel:02822487782"
                    className="text-neutral-900 font-bold hover:text-[#8A6943] flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>028 2248 7782</span>
                  </a>
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
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {lang === 'vi' ? 'Sẵn Sàng Cho Chuyến Đi Sài Gòn Của Bạn?' : 'Ready to Experience Saigon?'}
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1 max-w-xl font-sans">
              Đặt phòng trực tiếp trên website để nhận ngay xác nhận tức thì và hỗ trợ chọn phòng đẹp nhất.
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
