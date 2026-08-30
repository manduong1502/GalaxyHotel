import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, ChevronRight, MapPin, Award, Users, ShieldCheck, 
  Sparkles, Coffee, Clock, HeartHandshake, CheckCircle2 
} from 'lucide-react';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, onNavigate }) => {
  const { lang, t } = useLanguage();

  const attractions = [
    { name: lang === 'vi' ? 'Phố Đi Bộ Bùi Viện' : 'Bui Vien Walking Street', distance: '100m', time: '1 phút đi bộ', desc: lang === 'vi' ? 'Trung tâm vui chơi, ẩm thực đêm sôi động nhất Sài Gòn' : 'Vibrant nightlife and street food hub' },
    { name: lang === 'vi' ? 'Công Viên 23 Tháng 9' : '23/9 Central Park', distance: '150m', time: '2 phút đi bộ', desc: lang === 'vi' ? 'Mảng xanh thư giãn, trạm xe buýt trung tâm' : 'Lush green park and central bus terminal' },
    { name: lang === 'vi' ? 'Chợ Bến Thành' : 'Ben Thanh Market', distance: '600m', time: '7 phút đi bộ', desc: lang === 'vi' ? 'Biểu tượng lịch sử, mua sắm đặc sản và quà lưu niệm' : 'Iconic market for souvenirs and local specialties' },
    { name: lang === 'vi' ? 'Phố Đi Bộ Nguyễn Huệ & Bitexco' : 'Nguyen Hue Walking Street & Bitexco', distance: '1.2km', time: '4 phút đi xe', desc: lang === 'vi' ? 'Đại lộ ánh sáng hiện đại và trung tâm thương mại cao cấp' : 'Modern pedestrian boulevard and skyscrapers' },
    { name: lang === 'vi' ? 'Dinh Độc Lập & Nhà Thờ Đức Bà' : 'Independence Palace & Notre Dame', distance: '1.5km', time: '5 phút đi xe', desc: lang === 'vi' ? 'Quần thể kiến trúc lịch sử nổi tiếng của TP. HCM' : 'Historic architectural landmarks' },
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
              {lang === 'vi' ? 'Giới thiệu khách sạn' : 'About Hotel'}
            </span>
          </nav>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8DCB9] block mb-2">
            GALAXY BOUTIQUE HOTEL SAIGON
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {lang === 'vi' ? 'Không Gian Nghỉ Dưỡng Ấm Cúng Tại Trái Tim Quận 1' : 'A Cozy Boutique Oasis in the Heart of District 1'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            {lang === 'vi'
              ? 'Tọa lạc tại con hẻm yên tĩnh 269/19 Đề Thám, Galaxy Boutique Hotel kết hợp hài hòa giữa sự thanh bình riêng tư và nhịp sống sôi động bậc nhất của trung tâm Sài Gòn.'
              : 'Situated in the peaceful alley 269/19 De Tham, Galaxy Boutique Hotel offers the perfect balance of serene comfort and vibrant city life.'}
          </p>

        </div>
      </div>

      {/* Main Story & Visual Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Photos Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-200 aspect-[4/5] bg-neutral-200">
                <img
                  src="/images/welcome-1.jpg"
                  alt="Galaxy Hotel Reception & Room"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
                <span className="block text-2xl font-bold text-neutral-900 font-sans">100%</span>
                <span className="text-[11px] text-neutral-500 uppercase font-semibold">Phòng Có Máy Lạnh & Toilet Riêng</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-xl bg-neutral-900 text-white text-center">
                <span className="block text-2xl font-bold text-[#E8DCB9] font-sans">24/7</span>
                <span className="text-[11px] text-neutral-300 uppercase font-semibold">Lễ Tân Phục Vụ Suốt Ngày Đêm</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-200 aspect-[4/5] bg-neutral-200">
                <img
                  src="/images/welcome-2.jpg"
                  alt="Galaxy Hotel Interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
                CÂU CHUYỆN THƯƠNG HIỆU
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight leading-snug">
                {lang === 'vi' 
                  ? 'Trải Nghiệm Khách Sạn Boutique Thực Chất, Chu Đáo & Thân Thiện'
                  : 'Genuine Boutique Hospitality Tailored for Modern Travelers'}
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              <p>
                {lang === 'vi'
                  ? 'Galaxy Boutique Hotel được thành lập với mong muốn mang đến cho du khách trong nước và quốc tế một điểm dừng chân lý tưởng tại Quận 1. Chúng tôi hiểu rằng sau một ngày dài khám phá thành phố sôi động, điều bạn cần nhất là một giấc ngủ sâu trên chiếc giường êm ái, trong một không gian sạch sẽ, thơm mát và an toàn tuyệt đối.'
                  : 'Galaxy Boutique Hotel was founded to offer both domestic and international travelers a welcoming home in District 1. We believe that after an energetic day exploring Saigon, what you deserve most is a deep, comfortable sleep in a sparkling clean, air-conditioned room.'}
              </p>
              <p>
                {lang === 'vi'
                  ? 'Khách sạn sở hữu hệ thống 8 hạng phòng đa dạng, từ phòng đơn, phòng đôi King Bed cho các cặp đôi, đến phòng 3 người và phòng gia đình 5 khách rộng rãi. Mức giá được niêm yết minh bạch, linh hoạt theo giờ hoặc theo ngày, không phụ thu ẩn.'
                  : 'We feature 8 diverse room categories catering to solo adventurers, couples, friends, and families. Transparent pricing for both hourly and daily stays with no hidden fees.'}
              </p>
            </div>

            {/* 4 Pillars */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-[#8A6943] flex-shrink-0" />
                <span>Wi-Fi Cáp Quang Tốc Độ Cao</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-[#8A6943] flex-shrink-0" />
                <span>Hỗ Trợ Tiếng Anh Cho Khách Tây</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-[#8A6943] flex-shrink-0" />
                <span>Giữ Hành Lý Miễn Phí 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-[#8A6943] flex-shrink-0" />
                <span>Thanh Toán Đa Dạng (Tiền Mặt/Chuyển Khoản/Thẻ)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('rooms')}
                className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
              >
                {lang === 'vi' ? 'Khám Phá Các Hạng Phòng' : 'Explore Room Categories'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Walking Distance & Surrounding Attractions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A6943] block mb-1">
              VỊ TRÍ ĐẮC ĐỊA QUẬN 1
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {lang === 'vi' ? 'Khoảng Cách Tới Các Điểm Du Lịch Nổi Tiếng' : 'Walking Distance to Top Sights'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-sans">
              Từ khách sạn tại 269/19 Đề Thám, bạn có thể dễ dàng đi bộ hoặc bắt taxi tới mọi điểm tham quan chính của Sài Gòn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attractions.map((item, index) => (
              <div
                key={index}
                className="bg-[#FAF9F5] p-5 rounded-xl border border-neutral-200/80 hover:border-neutral-300 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{item.name}</span>
                  <span className="text-[11px] font-bold bg-[#E8DCB9] text-neutral-900 px-2 py-0.5 rounded">
                    {item.distance}
                  </span>
                </div>
                <div className="text-[11px] text-[#8A6943] font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
                <p className="text-xs text-neutral-600 font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
