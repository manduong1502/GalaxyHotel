import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, ChevronRight, MapPin, Phone, Mail, 
  Clock, Navigation, Send, CheckCircle2, MessageSquare 
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 4000);
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
              {lang === 'vi' ? 'Liên hệ & Chỉ đường' : 'Contact & Location'}
            </span>
          </nav>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8DCB9] block mb-2">
            GALAXY BOUTIQUE HOTEL SAIGON
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {lang === 'vi' ? 'Vị Trí Trung Tâm & Kênh Liên Hệ 24/7' : 'Central Location & 24/7 Contact'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            {lang === 'vi'
              ? 'Tọa lạc tại 269/19 Đề Thám, Phường Phạm Ngũ Lão, Quận 1. Đội ngũ lễ tân luôn sẵn sàng hỗ trợ chỉ đường, đặt phòng và giải đáp mọi thắc mắc của bạn.'
              : 'Located at 269/19 De Tham, Pham Ngu Lao Ward, District 1. Our reception team is ready 24/7 to assist with directions, bookings, and inquiries.'}
          </p>

        </div>
      </div>

      {/* Main Grid: Contact Cards + Interactive Map + Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cards & Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-[#E8DCB9] flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {lang === 'vi' ? 'Địa Chỉ Khách Sạn' : 'Hotel Address'}
                </h4>
                <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                  269/19 Đề Thám, P. Bến Thành, Quận 1, TP. Hồ Chí Minh
                </p>
                <a
                  href="https://maps.app.goo.gl/nRiJu2PQHPtAZEt16"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{lang === 'vi' ? 'Mở chỉ đường Google Maps' : 'Open Google Maps'}</span>
                </a>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-[#E8DCB9] flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {lang === 'vi' ? 'Hotline & Zalo' : 'Hotline & Zalo'}
                </h4>
                <div className="text-xs text-neutral-700 font-semibold space-y-1">
                  <div>Hotline: <a href="tel:02822487782" className="text-neutral-900 font-bold hover:underline">028 2248 7782</a></div>
                  <div>Zalo 24/7: <a href="https://zalo.me/0793295664" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">079 329 5664</a></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-[#E8DCB9] flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Email
                </h4>
                <p className="text-xs text-neutral-600 font-sans">
                  galaxyboutiquehotel2022@gmail.com
                </p>
                <span className="text-[11px] text-neutral-400 block pt-1">
                  {lang === 'vi' ? 'Phản hồi trong 1-2 tiếng' : 'Response within 1-2 hours'}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-[#E8DCB9] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {lang === 'vi' ? 'Giờ Hoạt Động' : 'Front Desk Hours'}
                </h4>
                <p className="text-xs text-neutral-600 font-sans font-semibold text-emerald-700">
                  {lang === 'vi' ? 'Mở cửa 24/7 (Cả ngày & đêm)' : 'Open 24/7 around the clock'}
                </p>
                <span className="text-[11px] text-neutral-400 block pt-1">
                  {lang === 'vi' ? 'Check-in: 14:00 | Check-out: 12:00' : 'Check-in: 14:00 | Check-out: 12:00'}
                </span>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm h-80 w-full relative">
              <iframe
                title="Galaxy Boutique Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5621599203555!2d106.69309!3d10.768188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fcaf428be75%3A0x323b5d4e6f707fb0!2sGalaxy%20Boutique%20Hotel!5e0!3m2!1svi!2s!4v1784154591201!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-5 bg-white p-7 sm:p-9 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="font-serif font-bold text-2xl text-neutral-900 mb-1 tracking-tight">
              {lang === 'vi' ? 'Gửi Yêu Cầu Tư Vấn' : 'Send Inquiry'}
            </h3>
            <p className="text-neutral-500 text-xs sm:text-sm mb-6 font-sans">
              {lang === 'vi'
                ? 'Để lại thông tin và nhu cầu của bạn, chúng tôi sẽ liên hệ lại ngay qua điện thoại hoặc Zalo.'
                : 'Leave your contact details and message, we will reply promptly.'}
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fade-in font-sans">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">
                  {lang === 'vi' ? 'Đã Gửi Thành Công!' : 'Message Sent Successfully!'}
                </h4>
                <p className="text-xs text-emerald-700">
                  {lang === 'vi' 
                    ? 'Cảm ơn bạn! Lễ tân sẽ liên hệ lại với bạn trong thời gian sớm nhất.'
                    : 'Thank you! Front desk team will contact you shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {lang === 'vi' ? 'Họ và tên của bạn *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      {lang === 'vi' ? 'Số điện thoại / Zalo *' : 'Phone / Zalo *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0901234567"
                      className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@gmail.com"
                      className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {lang === 'vi' ? 'Nội dung tin nhắn / Yêu cầu phòng *' : 'Your Message / Booking Request *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'vi' ? 'Tôi cần hỏi giá phòng ngày mai...' : 'I would like to inquire about room availability...'}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-[#E8DCB9]" />
                  <span>{lang === 'vi' ? 'Gửi Yêu Cầu Liên Hệ' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
