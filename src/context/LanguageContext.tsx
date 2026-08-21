import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.rooms': 'Hạng phòng',
    'nav.dining': 'Nhà hàng',
    'nav.facilities': 'Tiện ích & Gym',
    'nav.gallery': 'Hình ảnh',
    'nav.contact': 'Liên hệ',
    'nav.book_now': 'Đặt phòng ngay',
    'nav.hotline': 'Hotline đặt phòng',

    // Hero
    'hero.badge': 'KHÁCH SẠN ĐẲNG CẤP 5 SAO QUỐC TẾ',
    'hero.slide1.title': 'GALAXY HOTEL',
    'hero.slide1.subtitle': 'Tuyệt tác nghỉ dưỡng sang trọng giữa lòng đô thị phồn hoa',
    'hero.slide2.title': 'KHÔNG GIAN THƯ THÁI',
    'hero.slide2.subtitle': 'Trải nghiệm đỉnh cao với tiện nghi hoàn hảo và dịch vụ tinh tế',
    'hero.slide3.title': 'ẨM THỰC THƯỢNG HẠNG',
    'hero.slide3.subtitle': 'Thăng hoa vị giác cùng các món ăn đặc sắc từ đầu bếp 5 sao',
    'hero.view_rooms': 'Khám phá phòng',
    'hero.book_room': 'Đặt phòng trực tuyến',

    // Booking Bar
    'booking.tab_daily': 'Đặt theo Ngày (Đêm)',
    'booking.tab_hourly': 'Đặt theo Giờ',
    'booking.checkin': 'Ngày nhận phòng',
    'booking.checkout': 'Ngày trả phòng',
    'booking.date': 'Ngày sử dụng',
    'booking.checkin_time': 'Giờ nhận phòng',
    'booking.duration': 'Thời lượng',
    'booking.hours_2': '2 Giờ đầu',
    'booking.hours_3': '3 Giờ',
    'booking.hours_4': '4 Giờ',
    'booking.hours_6': '6 Giờ',
    'booking.guests': 'Số lượng khách',
    'booking.adults': 'Người lớn',
    'booking.children': 'Trẻ em',
    'booking.room_type': 'Hạng phòng mong muốn',
    'booking.all_rooms': 'Tất cả hạng phòng',
    'booking.search_btn': 'Tìm phòng trống',
    'booking.standard_times': 'Check-in: 14:00 | Check-out: 12:00',

    // Welcome Section
    'about.eyebrow': 'VỀ CHÚNG TÔI',
    'about.title': 'Chào Mừng Đến Với Galaxy Hotel',
    'about.desc1': 'Tọa lạc tại vị trí kim cương ngay trung tâm sôi động của thành phố, Galaxy Hotel & Suites tự hào mang đến cho quý khách không gian nghỉ dưỡng sang trọng, kết hợp hoàn hảo giữa kiến trúc nghệ thuật đương đại và sự hiếu khách nồng hậu.',
    'about.desc2': 'Với hệ thống phòng nghỉ cao cấp, nhà hàng phong vị Á - Âu tinh tế, trung tâm thể hình hiện đại cùng đội ngũ nhân viên tận tâm 24/7, chúng tôi cam kết mang lại kỳ nghỉ trọn vẹn và đáng nhớ nhất.',
    'about.badge_title': 'GALAXY HOTEL & SUITES',
    'about.badge_sub': 'Đẳng Cấp Nghỉ Dưỡng Thượng Lưu Giữa Lòng Sài Gòn',
    'about.hl1': 'Vị trí đắc địa số 125-127 Lê Thánh Tôn, Quận 1 (gần chợ Bến Thành)',
    'about.hl2': 'Nhà hàng ẩm thực Sky Dining & Buffet sáng tiêu chuẩn 5 sao',
    'about.hl3': 'Bể bơi tràn bờ & Trung tâm thể hình Technogym mở cửa miễn phí',
    'about.hl4': 'Dịch vụ lễ tân, bảo vệ và quản gia túc trực chuyên nghiệp 24/7',
    'about.stat1_num': '85+',
    'about.stat1_label': 'Phòng & Suite Đẳng Cấp',
    'about.stat2_num': '99.8%',
    'about.stat2_label': 'Khách Hài Lòng',
    'about.stat3_num': '24/7',
    'about.stat3_label': 'Lễ Tân & Phục Vụ Chu Đáo',
    'about.stat4_num': '5⭐',
    'about.stat4_label': 'Dịch Vụ Tiêu Chuẩn',

    // Rooms Section
    'rooms.eyebrow': 'HỆ THỐNG PHÒNG NGHỈ',
    'rooms.title': 'Các Hạng Phòng & Bảng Giá',
    'rooms.subtitle': 'Tất cả các phòng đều bao gồm bữa sáng buffet hảo hạng, nước khoáng hàng ngày, Wifi tốc độ cao và miễn phí sử dụng Gym & Bể bơi.',
    'rooms.tab_all': 'Tất Cả Hạng Phòng',
    'rooms.tab_deluxe': 'Deluxe & Premier',
    'rooms.tab_suite': 'Luxury Suites',
    'rooms.popular_badge': '★ Được Yêu Thích Nhất',
    'rooms.view_photos': 'Xem {count} ảnh',
    'rooms.adults_short': 'Lớn',
    'rooms.children_short': 'Trẻ',
    'rooms.price_night_label': 'Giá theo Đêm:',
    'rooms.price_hour_label': 'Đặt theo Giờ:',
    'rooms.per_night': '/đêm',
    'rooms.per_hour': '/2h đầu',
    'rooms.extra_hour': 'thêm mỗi giờ',
    'rooms.details_btn': 'Xem chi tiết',
    'rooms.book_btn': 'Đặt phòng này',
    'rooms.area': 'Diện tích',
    'rooms.guests_max': 'Khách tối đa',
    'rooms.bed': 'Giường',
    'rooms.view': 'Tầm nhìn',

    // Dining
    'dining.eyebrow': 'ẨM THỰC ĐẶC SẮC',
    'dining.title': 'Nhà Hàng Galaxy Sky Dining',
    'dining.desc': 'Không gian ẩm thực đỉnh cao với buffet sáng đa dạng hơn 60 món ăn Á - Âu và thực đơn gọi món À la carte thượng hạng phục vụ cả ngày.',
    'dining.hours': 'Thời gian mở cửa: 06:00 - 22:30 hàng ngày',
    'dining.location': 'Tầng 12 (Rooftop) - Galaxy Sky Lounge',
    'dining.dish1_title': 'Buffet Sáng Quốc Tế 5 Sao',
    'dining.dish1_desc': 'Hơn 60 món ăn đa dạng từ Phở truyền thống, bánh mỳ Pháp, dimsum đến salad hữu cơ tươi ngon.',
    'dining.dish2_title': 'Bò Wagyu Nướng Sốt Nấm Truffle',
    'dining.dish2_desc': 'Thịt bò vân mỡ thượng hạng nướng than hoa mềm tan, kết hợp sốt nấm Truffle đen quý hiếm.',
    'dining.dish3_title': 'Hải Sản Tươi Sống & Cocktail Galaxy',
    'dining.dish3_desc': 'Tôm hùm nướng bơ tỏi, cua Cà Mau cùng các ly cocktail pha chế thủ công tại quầy bar.',
    'dining.daily_served': 'Phục vụ hàng ngày',
    'dining.book_table': 'Đặt bàn trước →',

    // Gym & Facilities
    'facilities.eyebrow': 'DỊCH VỤ & TIỆN ÍCH',
    'facilities.title': 'Thư Giãn & Tái Tạo Năng Lượng',
    'facilities.sub': 'Tận hưởng trọn vẹn những phút giây chăm sóc sức khỏe và thư giãn đẳng cấp trong kỳ nghỉ của bạn.',
    'facilities.gym_title': 'Phòng Gym Hiện Đại',
    'facilities.gym_desc': 'Trang bị dàn máy tập cardio, tạ đa năng thương hiệu Technogym cao cấp, hoàn toàn miễn phí cho khách lưu trú.',
    'facilities.gym_tag': 'TẦNG 3 • MIỄN PHÍ',
    'facilities.gym_hl1': 'Thiết bị Technogym nhập khẩu Ý',
    'facilities.gym_hl2': 'Khăn lạnh & nước suối miễn phí',
    'facilities.gym_hl3': 'Không gian thoáng mát view thành phố',
    
    'facilities.spa_title': 'Galaxy Spa & Massage',
    'facilities.spa_desc': 'Liệu trình xông hơi đá muối Himalaya, massage tinh dầu thảo dược giúp phục hồi tinh thần và thể chất.',
    'facilities.spa_tag': 'TẦNG 4 • WELLNESS',
    'facilities.spa_hl1': 'Xông hơi đá muối Himalaya',
    'facilities.spa_hl2': 'Massage tinh dầu thảo dược hữu cơ',
    'facilities.spa_hl3': 'Liệu trình thư giãn body chuyên sâu',

    'facilities.pool_title': 'Bể Bơi Vô Cực Trên Cao',
    'facilities.pool_desc': 'Thả mình trong làn nước trong vắt và ngắm nhìn toàn cảnh thành phố lung linh về đêm.',
    'facilities.pool_tag': 'ROOFTOP • VIEW TOÀN CẢNH',
    'facilities.pool_hl1': 'Nước điện phân khoáng ấm',
    'facilities.pool_hl2': 'Poolside Cocktail Bar',
    'facilities.pool_hl3': 'View ngắm hoàng hôn triệu đô',
    'facilities.contact_btn': 'Liên hệ trải nghiệm',

    // Gallery
    'gallery.eyebrow': 'BỘ SƯU TẬP HÌNH ẢNH',
    'gallery.title': 'Khoảnh Khắc Tại Galaxy Hotel',
    'gallery.tab_all': 'Tất cả',
    'gallery.tab_rooms': 'Phòng nghỉ',
    'gallery.tab_dining': 'Nhà hàng',
    'gallery.tab_facilities': 'Tiện ích & Gym',

    // Testimonials
    'reviews.eyebrow': 'ĐÁNH GIÁ TỪ KHÁCH HÀNG',
    'reviews.title': 'Trải Nghiệm Của Khách Lưu Trú',

    // Location & Contact
    'contact.eyebrow': 'KẾT NỐI VỚI CHÚNG TÔI',
    'contact.title': 'Vị Trí Đắc Địa & Liên Hệ',
    'contact.address_title': 'Địa Chỉ Khách Sạn',
    'contact.address': '125 - 127 Lê Thánh Tôn, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    'contact.phone_title': 'Hotline Đặt Phòng',
    'contact.phone': '028 3620 0182 - Hotline: 0908 123 456',
    'contact.email_title': 'Hòm Thư Điện Tử',
    'contact.email': 'booking@galaxyhotel.vn',
    'contact.hours_title': 'Giờ Check-in / Out',
    'contact.hours_desc': 'Check-in: Từ 14:00 | Check-out: Trước 12:00',
    'contact.inquiry_title': 'Gửi Yêu Cầu / Tư Vấn',
    'contact.inquiry_sub': 'Vui lòng để lại thông tin, đội ngũ lễ tân Galaxy Hotel sẽ phản hồi quý khách trong thời gian sớm nhất.',
    'contact.form_name': 'Họ và tên quý khách',
    'contact.form_phone': 'Số điện thoại',
    'contact.form_email': 'Địa chỉ Email',
    'contact.form_message': 'Nội dung tin nhắn / Yêu cầu...',
    'contact.form_send': 'Gửi tin nhắn',

    // Footer
    'footer.about_text': 'Galaxy Hotel & Suites - Điểm dừng chân lý tưởng mang đến trải nghiệm nghỉ dưỡng 5 sao sang trọng, ấm cúng và đầy cảm hứng tại trung tâm Sài Gòn.',
    'footer.quick_links': 'Liên Kết Nhanh',
    'footer.room_types': 'Hạng Phòng',
    'footer.policies': 'Chính Sách & Quy Định',
    'footer.policy_checkin': 'Quy định nhận/trả phòng: Check-in 14:00, Check-out 12:00',
    'footer.policy_cancel': 'Chính sách hủy phòng linh hoạt miễn phí trước 24h',
    'footer.policy_breakfast': 'Bao gồm buffet sáng cao cấp hàng ngày',
    'footer.policy_hourly': 'Hỗ trợ đặt phòng theo giờ linh hoạt 24/7',
    'footer.newsletter_title': 'Đăng Ký Nhận Ưu Đãi',
    'footer.newsletter_sub': 'Nhận ngay mã giảm giá 10% cho lần đặt phòng trực tiếp tiếp theo.',
    'footer.newsletter_btn': 'Đăng ký',
    'footer.terms': 'Điều khoản sử dụng',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.sitemap': 'Sơ đồ website',
    'footer.copyright': '© 2026 GALAXY HOTEL & SUITES. Tất cả quyền được bảo lưu.',

    // Modals
    'modal.booking_title': 'Đặt Phòng Khách Sạn Galaxy',
    'modal.room_detail_title': 'Chi Tiết Hạng Phòng',
    'modal.close': 'Đóng',
    'modal.cancel': 'Hủy',
    'modal.select_room': 'Chọn Hạng Phòng *',
    'modal.checkin_daily': 'Ngày Nhận Phòng (Check-in) *',
    'modal.checkout_daily': 'Ngày Trả Phòng (Check-out) *',
    'modal.stay_date': 'Ngày Sử Dụng *',
    'modal.checkin_time': 'Giờ Nhận Phòng *',
    'modal.duration_hourly': 'Thời Lượng Thuê *',
    'modal.adults_label': 'Người Lớn',
    'modal.children_label': 'Trẻ Em (< 12 tuổi)',
    'modal.customer_info': 'Thông Tin Khách Hàng',
    'modal.name_placeholder': 'Họ và tên của quý khách *',
    'modal.phone_placeholder': 'Số điện thoại nhận xác nhận *',
    'modal.email_placeholder': 'Địa chỉ Email (để nhận xác nhận)',
    'modal.note_placeholder': 'Yêu cầu đặc biệt (tầng cao, chuẩn bị hoa/rượu mừng, xe đón sân bay...)',
    'modal.duration_summary': 'Thời lượng:',
    'modal.total_summary': 'Tổng tiền dự kiến (đã gồm VAT):',
    'modal.confirm_btn': 'Xác Nhận Gửi Yêu Cầu Đặt Phòng',
    'modal.success_title': 'Đặt Phòng Thành Công!',
    'modal.success_msg': 'Cảm ơn quý khách! Đơn đặt phòng của quý khách đã được lưu và gửi tới bộ phận Lễ tân. Chúng tôi sẽ liên hệ lại xác nhận qua số điện thoại trong vòng 10 phút.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.rooms': 'Rooms & Suites',
    'nav.dining': 'Dining',
    'nav.facilities': 'Facilities & Gym',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.book_now': 'Book Now',
    'nav.hotline': 'Reservation Hotline',

    // Hero
    'hero.badge': 'LUXURY 5-STAR BOUTIQUE HOTEL',
    'hero.slide1.title': 'GALAXY HOTEL',
    'hero.slide1.subtitle': 'A luxury oasis in the vibrant heart of the city',
    'hero.slide2.title': 'SERENE COMFORT',
    'hero.slide2.subtitle': 'Experience superior relaxation with premier amenities and bespoke hospitality',
    'hero.slide3.title': 'EXQUISITE CUISINE',
    'hero.slide3.subtitle': 'Delight your senses with gourmet Asian & International dining creations',
    'hero.view_rooms': 'Explore Rooms',
    'hero.book_room': 'Online Reservation',

    // Booking Bar
    'booking.tab_daily': 'Daily (Overnight)',
    'booking.tab_hourly': 'Hourly Booking',
    'booking.checkin': 'Check-in Date',
    'booking.checkout': 'Check-out Date',
    'booking.date': 'Stay Date',
    'booking.checkin_time': 'Check-in Time',
    'booking.duration': 'Duration',
    'booking.hours_2': 'First 2 Hours',
    'booking.hours_3': '3 Hours',
    'booking.hours_4': '4 Hours',
    'booking.hours_6': '6 Hours',
    'booking.guests': 'Guests',
    'booking.adults': 'Adults',
    'booking.children': 'Children',
    'booking.room_type': 'Preferred Room',
    'booking.all_rooms': 'All Room Types',
    'booking.search_btn': 'Check Availability',
    'booking.standard_times': 'Check-in: 14:00 | Check-out: 12:00',

    // Welcome Section
    'about.eyebrow': 'ABOUT US',
    'about.title': 'Welcome To Galaxy Hotel',
    'about.desc1': 'Nestled in a prime location in the vibrant urban center, Galaxy Hotel & Suites offers a sanctuary of refined elegance, seamlessly blending modern luxury with warm Vietnamese hospitality.',
    'about.desc2': 'With our sophisticated guest rooms, exquisite dining options, state-of-the-art fitness center, and attentive 24/7 staff, we ensure an unforgettable stay for both business and leisure travelers.',
    'about.badge_title': 'GALAXY HOTEL & SUITES',
    'about.badge_sub': 'The Pinnacle of Luxury Hospitality in Central Saigon',
    'about.hl1': 'Prime location at 125-127 Le Thanh Ton, District 1 (near Ben Thanh Market)',
    'about.hl2': 'Sky Dining gourmet restaurant & 5-star international buffet breakfast',
    'about.hl3': 'Complimentary rooftop infinity pool & Technogym fitness center',
    'about.hl4': '24/7 dedicated concierge, butler and security service',
    'about.stat1_num': '85+',
    'about.stat1_label': 'Rooms & Luxury Suites',
    'about.stat2_num': '99.8%',
    'about.stat2_label': 'Guest Satisfaction',
    'about.stat3_num': '24/7',
    'about.stat3_label': 'Dedicated Concierge',
    'about.stat4_num': '5⭐',
    'about.stat4_label': 'Star Standards',

    // Rooms Section
    'rooms.eyebrow': 'ACCOMMODATION',
    'rooms.title': 'Rooms & Suites',
    'rooms.subtitle': 'All bookings include daily international breakfast buffet, complimentary bottled water, high-speed Wi-Fi, and access to the Fitness Center & Pool.',
    'rooms.tab_all': 'All Room Types',
    'rooms.tab_deluxe': 'Deluxe & Premier',
    'rooms.tab_suite': 'Luxury Suites',
    'rooms.popular_badge': '★ Most Popular Choice',
    'rooms.view_photos': 'View {count} photos',
    'rooms.adults_short': 'Adults',
    'rooms.children_short': 'Child',
    'rooms.price_night_label': 'Nightly Rate:',
    'rooms.price_hour_label': 'Hourly Rate:',
    'rooms.per_night': '/night',
    'rooms.per_hour': '/first 2h',
    'rooms.extra_hour': 'extra per hour',
    'rooms.details_btn': 'View Details',
    'rooms.book_btn': 'Book This Room',
    'rooms.area': 'Area',
    'rooms.guests_max': 'Max Guests',
    'rooms.bed': 'Bed',
    'rooms.view': 'View',

    // Dining
    'dining.eyebrow': 'FINE DINING',
    'dining.title': 'Galaxy Sky Dining Restaurant',
    'dining.desc': 'Indulge in a memorable gastronomic journey with our daily 60+ item breakfast buffet and all-day curated À la carte specialties.',
    'dining.hours': 'Opening hours: 06:00 AM - 10:30 PM Daily',
    'dining.location': '12th Floor (Rooftop) - Galaxy Sky Lounge',
    'dining.dish1_title': '5-Star International Breakfast Buffet',
    'dining.dish1_desc': 'Over 60 signature dishes ranging from traditional Vietnamese Pho, French pastries to organic fresh salads.',
    'dining.dish2_title': 'Grilled Wagyu Beef with Truffle Sauce',
    'dining.dish2_desc': 'Tender charcoal-grilled marble Wagyu beef complemented by rare black Truffle reduction.',
    'dining.dish3_title': 'Fresh Seafood Platter & Galaxy Cocktails',
    'dining.dish3_desc': 'Garlic butter roasted lobster, sweet mud crab and handcrafted artisanal cocktails at the bar.',
    'dining.daily_served': 'Served Daily',
    'dining.book_table': 'Reserve a Table →',

    // Gym & Facilities
    'facilities.eyebrow': 'SERVICES & AMENITIES',
    'facilities.title': 'Relax & Rejuvenate',
    'facilities.sub': 'Experience the finest wellness, fitness and relaxation during your luxury getaway.',
    'facilities.gym_title': 'Modern Fitness Center',
    'facilities.gym_desc': 'Equipped with top-of-the-line Technogym cardio machines and free weights, complimentary for all in-house guests.',
    'facilities.gym_tag': '3RD FLOOR • COMPLIMENTARY',
    'facilities.gym_hl1': 'Italian Technogym Equipment',
    'facilities.gym_hl2': 'Complimentary Chilled Towels & Water',
    'facilities.gym_hl3': 'Spacious airy studio with city views',
    
    'facilities.spa_title': 'Galaxy Spa & Wellness',
    'facilities.spa_desc': 'Himalayan salt sauna and herbal aromatherapy treatments designed to refresh both body and soul.',
    'facilities.spa_tag': '4TH FLOOR • WELLNESS',
    'facilities.spa_hl1': 'Himalayan Pink Salt Sauna',
    'facilities.spa_hl2': 'Organic Herbal Essential Oil Massage',
    'facilities.spa_hl3': 'Intensive Deep Tissue & Body Therapy',

    'facilities.pool_title': 'Rooftop Infinity Pool',
    'facilities.pool_desc': 'Immerse yourself in crystal-clear waters while admiring panoramic skyline vistas.',
    'facilities.pool_tag': 'ROOFTOP • PANORAMIC VIEW',
    'facilities.pool_hl1': 'Heated Salt-Electrolyzed Water',
    'facilities.pool_hl2': 'Poolside Signature Cocktail Bar',
    'facilities.pool_hl3': 'Breathtaking Sunset Vistas',
    'facilities.contact_btn': 'Book Experience',

    // Gallery
    'gallery.eyebrow': 'PHOTO GALLERY',
    'gallery.title': 'Moments At Galaxy Hotel',
    'gallery.tab_all': 'All',
    'gallery.tab_rooms': 'Rooms',
    'gallery.tab_dining': 'Dining',
    'gallery.tab_facilities': 'Facilities',

    // Testimonials
    'reviews.eyebrow': 'GUEST REVIEWS',
    'reviews.title': 'What Our Guests Say',

    // Location & Contact
    'contact.eyebrow': 'GET IN TOUCH',
    'contact.title': 'Prime Location & Contact',
    'contact.address_title': 'Hotel Address',
    'contact.address': '125 - 127 Le Thanh Ton Street, Ben Nghe Ward, District 1, Ho Chi Minh City',
    'contact.phone_title': 'Reservation Hotline',
    'contact.phone': '+84 28 3620 0182 - Hotline: +84 908 123 456',
    'contact.email_title': 'Email Address',
    'contact.email': 'booking@galaxyhotel.vn',
    'contact.hours_title': 'Check-in / Out Hours',
    'contact.hours_desc': 'Check-in: From 14:00 | Check-out: By 12:00',
    'contact.inquiry_title': 'Inquiry & Assistance',
    'contact.inquiry_sub': 'Please leave your contact information and our Front Desk will get back to you shortly.',
    'contact.form_name': 'Your Full Name',
    'contact.form_phone': 'Phone Number',
    'contact.form_email': 'Email Address',
    'contact.form_message': 'Your Message / Inquiry...',
    'contact.form_send': 'Send Message',

    // Footer
    'footer.about_text': 'Galaxy Hotel & Suites - An exceptional 5-star haven combining contemporary luxury, warm ambiance, and world-class service in central Saigon.',
    'footer.quick_links': 'Quick Links',
    'footer.room_types': 'Room Categories',
    'footer.policies': 'Policies & Terms',
    'footer.policy_checkin': 'Check-in from 14:00, Check-out by 12:00',
    'footer.policy_cancel': 'Free cancellation up to 24 hours before arrival',
    'footer.policy_breakfast': 'Includes complimentary daily 5-star breakfast buffet',
    'footer.policy_hourly': '24/7 Flexible hourly day-use booking available',
    'footer.newsletter_title': 'Exclusive Offers',
    'footer.newsletter_sub': 'Subscribe to receive 10% off your next direct booking.',
    'footer.newsletter_btn': 'Subscribe',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.sitemap': 'Sitemap',
    'footer.copyright': '© 2026 GALAXY HOTEL & SUITES. All Rights Reserved.',

    // Modals
    'modal.booking_title': 'Galaxy Hotel Reservation',
    'modal.room_detail_title': 'Room Details & Availability',
    'modal.close': 'Close',
    'modal.cancel': 'Cancel',
    'modal.select_room': 'Select Room Type *',
    'modal.checkin_daily': 'Check-in Date *',
    'modal.checkout_daily': 'Check-out Date *',
    'modal.stay_date': 'Stay Date *',
    'modal.checkin_time': 'Check-in Time *',
    'modal.duration_hourly': 'Rental Duration *',
    'modal.adults_label': 'Adults',
    'modal.children_label': 'Children (< 12 yrs)',
    'modal.customer_info': 'Guest Information',
    'modal.name_placeholder': 'Your Full Name *',
    'modal.phone_placeholder': 'Phone number for confirmation *',
    'modal.email_placeholder': 'Email address (for booking receipt)',
    'modal.note_placeholder': 'Special requests (high floor, honeymoon setup, airport shuttle...)',
    'modal.duration_summary': 'Duration:',
    'modal.total_summary': 'Estimated Total (VAT included):',
    'modal.confirm_btn': 'Submit Reservation Request',
    'modal.success_title': 'Booking Received!',
    'modal.success_msg': 'Thank you! Your booking request has been successfully recorded and sent to our Front Desk. We will contact you via phone within 10 minutes to confirm.',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  t: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('galaxy_hotel_lang') as Language;
    if (saved === 'vi' || saved === 'en') {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('galaxy_hotel_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
