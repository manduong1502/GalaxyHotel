import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { lang, t } = useLanguage();

  const reviews = [
    {
      name: lang === 'vi' ? 'Anh Trần Minh Quân' : 'Mr. Minh Quan Tran',
      location: lang === 'vi' ? 'Hà Nội, Việt Nam' : 'Hanoi, Vietnam',
      rating: 5,
      date: lang === 'vi' ? 'Tháng 8, 2026' : 'August 2026',
      comment: lang === 'vi' 
        ? 'Khách sạn Galaxy thực sự làm tôi ấn tượng về sự sạch sẽ và chu đáo. Phòng ấm cúng, ngay hẻm 269 Đề Thám rất yên tĩnh dù chỉ cách phố Tây Bùi Viện vài bước chân. Nhân viên lễ tân nhiệt tình hỗ trợ 24/7.'
        : 'Galaxy Boutique Hotel exceeded my expectations in cleanliness and hospitality. Cozy rooms, quiet alley right off De Tham street yet just steps to Bui Vien. Helpful 24/7 staff.',
    },
    {
      name: 'Mr. David Harrison',
      location: 'Sydney, Australia',
      rating: 5,
      date: lang === 'vi' ? 'Tháng 8, 2026' : 'August 2026',
      comment: lang === 'vi'
        ? 'Vị trí tuyệt vời ngay trung tâm Quận 1! Xung quanh có rất nhiều nhà hàng ngon, quán cafe và siêu thị tiện lợi. Phòng ốc gọn gàng, máy lạnh mát rượi và nước nóng tắm rất thoải mái.'
        : 'Fantastic location in the heart of District 1! Lots of great local street food, cafes and convenience stores nearby. Clean room, strong aircon and great hot shower.',
    },
    {
      name: lang === 'vi' ? 'Chị Lê Ngọc Thảo' : 'Ms. Ngoc Thao Le',
      location: lang === 'vi' ? 'Đà Nẵng, Việt Nam' : 'Danang, Vietnam',
      rating: 5,
      date: lang === 'vi' ? 'Tháng 8, 2026' : 'August 2026',
      comment: lang === 'vi'
        ? 'Tính năng đặt phòng theo giờ rất tiện lợi cho gia đình tôi trong thời gian chờ chuyến bay đêm. Thủ tục check-in nhanh chóng, giá cả niêm yết rõ ràng minh bạch.'
        : 'The hourly booking option was super convenient for resting before our late flight. Quick check-in process and clear transparent pricing.',
    }
  ];

  return (
    <section className="py-24 bg-[#FAF9F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
            {lang === 'vi' ? 'ĐÁNH GIÁ TỪ KHÁCH HÀNG' : 'GUEST EXPERIENCES'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 tracking-tight">
            {t('reviews.title')}
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-neutral-700 text-sm leading-relaxed mb-6 font-sans">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900">
                    {review.name}
                  </h4>
                  <span className="text-xs text-neutral-400">{review.location}</span>
                </div>
                <span className="text-[11px] text-neutral-400">
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
