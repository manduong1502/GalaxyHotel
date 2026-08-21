import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star, Sparkles, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { lang, t } = useLanguage();

  const reviews = [
    {
      name: lang === 'vi' ? 'Anh Trần Minh Quân' : 'Mr. Minh Quan Tran',
      location: lang === 'vi' ? 'Hà Nội, Việt Nam' : 'Hanoi, Vietnam',
      rating: 5,
      date: lang === 'vi' ? 'Tháng 8, 2026' : 'August 2026',
      comment: lang === 'vi' 
        ? 'Khách sạn Galaxy thực sự làm tôi bất ngờ về độ sang trọng và chất lượng dịch vụ. Phòng sạch sẽ, view ngắm hoàng hôn rất đẹp. Nhân viên lễ tân nhiệt tình hỗ trợ check-in nhanh gọn.'
        : 'Galaxy Hotel truly exceeded my expectations in luxury and service quality. Pristine rooms, stunning sunset views, and exceptionally helpful front desk staff.',
    },
    {
      name: 'Mr. David Harrison',
      location: 'Sydney, Australia',
      rating: 5,
      date: lang === 'vi' ? 'Tháng 8, 2026' : 'August 2026',
      comment: lang === 'vi'
        ? 'Kỳ nghỉ tuyệt vời ngay trung tâm Quận 1! Bữa sáng buffet rất đa dạng và ngon miệng với cả phở Việt truyền thống lẫn bánh ngọt phương Tây. Bể bơi vô cực ngắm trọn thành phố.'
        : 'Fantastic stay in District 1! The breakfast buffet was exceptionally good with both authentic Vietnamese pho and Western pastries. The rooftop pool offers breathtaking skyline views.',
    },
    {
      name: lang === 'vi' ? 'Chị Lê Ngọc Thảo' : 'Ms. Ngoc Thao Le',
      location: lang === 'vi' ? 'Đà Nẵng, Việt Nam' : 'Danang, Vietnam',
      rating: 5,
      date: lang === 'vi' ? 'Tháng 8, 2026' : 'August 2026',
      comment: lang === 'vi'
        ? 'Tính năng đặt phòng theo giờ rất tiện lợi cho gia đình tôi trong thời gian chờ chuyến bay đêm. Phòng êm ái, bồn tắm sục Jacuzzi giúp giải tỏa mệt mỏi tuyệt vời.'
        : 'The hourly booking feature was extremely convenient for my family while waiting for a late night flight. Luxurious Jacuzzi tub and deeply relaxing bed.',
    }
  ];

  return (
    <section className="py-20 bg-hotel-sand/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-hotel-gold/50 text-hotel-navy text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-hotel-goldDark" />
            <span>{t('reviews.eyebrow')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-hotel-navy">
            {t('reviews.title')}
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-luxury flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-hotel-gold/25 absolute top-6 right-6" />

              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm italic leading-relaxed mb-6 font-serif">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-hotel-navy font-serif">
                    {review.name}
                  </h4>
                  <span className="text-xs text-gray-400">{review.location}</span>
                </div>
                <span className="text-[11px] text-hotel-goldDark font-medium">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
