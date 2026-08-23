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
    'nav.rooms': 'Phòng & Bảng giá',
    'nav.dining': 'Dịch vụ',
    'nav.facilities': 'Tiện ích',
    'nav.gallery': 'Hình ảnh thực tế',
    'nav.contact': 'Liên hệ',
    'nav.book_now': 'Đặt phòng ngay',
    'nav.hotline': 'Hotline đặt phòng',

    // Hero
    'hero.badge': 'GALAXY BOUTIQUE HOTEL • TÂM ĐIỂM QUẬN 1',
    'hero.slide1.title': 'GALAXY BOUTIQUE HOTEL',
    'hero.slide1.subtitle': 'Không gian ấm cúng như ở nhà - Nghỉ ngơi thoải mái ngay tâm điểm Quận 1',
    'hero.slide2.title': 'TIỆN NGHI & ẤM CÚNG',
    'hero.slide2.subtitle': 'Phòng sạch sẽ, điều hòa mát sâu, Wifi riêng từng phòng và giá phòng vô cùng hợp lý',
    'hero.slide3.title': 'VỊ TRÍ ĐẮC ĐỊA QUẬN 1',
    'hero.slide3.subtitle': 'Vài bước chân đến Phố đi bộ Bùi Viện, Chợ Bến Thành, Dinh Độc Lập & Phố đi bộ Nguyễn Huệ',
    'hero.view_rooms': 'Khám phá phòng',
    'hero.book_room': 'Đặt phòng trực tuyến',

    // Booking Bar
    'booking.tab_daily': 'Đặt theo Ngày (Đêm)',
    'booking.tab_hourly': 'Đặt theo Giờ (Linh hoạt)',
    'booking.checkin': 'Ngày nhận phòng',
    'booking.checkout': 'Ngày trả phòng',
    'booking.date': 'Ngày sử dụng',
    'booking.checkin_time': 'Giờ nhận phòng',
    'booking.duration': 'Thời lượng',
    'booking.hours_2': '2 Giờ đầu (Từ 120k)',
    'booking.hours_3': '3 Giờ',
    'booking.hours_4': '4 Giờ',
    'booking.hours_6': '6 Giờ',
    'booking.guests': 'Số lượng khách',
    'booking.adults': 'Người lớn',
    'booking.children': 'Trẻ em',
    'booking.room_type': 'Hạng phòng mong muốn',
    'booking.all_rooms': 'Tất cả hạng phòng',
    'booking.search_btn': 'Tìm phòng trống',
    'booking.standard_times': 'Check-in: 14:00 | Check-out: 12:00 (Hỗ trợ nhận sớm/trả trễ)',

    // Welcome Section
    'about.eyebrow': 'VỀ CHÚNG TÔI',
    'about.title': 'Chào Mừng Đến Với Galaxy Boutique Hotel',
    'about.desc1': 'Chào mừng bạn đến với Khách sạn Galaxy – điểm dừng chân lý tưởng tọa lạc ngay trung tâm Quận 1 sầm uất. Tại đây, chúng tôi mang đến cho bạn không gian lưu trú sạch sẽ, tiện nghi và ấm cúng với mức giá vô cùng hợp lý, giúp bạn tối ưu chi phí cho chuyến đi của mình.',
    'about.desc2': 'Galaxy Hotel sở hữu 30 phòng nghỉ hiện đại, sạch sẽ và đầy đủ tiện nghi, phù hợp cho cả khách du lịch cá nhân, cặp đôi, gia đình và khách đi công tác. Với vị trí đắc địa ngay hẻm 269 Đề Thám cùng đội ngũ lễ tân phục vụ 24/7, chúng tôi luôn sẵn sàng mang đến cho bạn một kỳ nghỉ thoải mái và đáng nhớ nhất.',
    'about.badge_title': 'GALAXY BOUTIQUE HOTEL',
    'about.badge_sub': 'Không Gian Ấm Cúng Như Ở Nhà Ngay Trung Tâm Sài Gòn',
    'about.hl1': 'Vị trí đắc địa 269/19 Đề Thám, Quận 1 (vài bước đến Phố Tây Bùi Viện & Chợ Bến Thành)',
    'about.hl2': 'Phòng ốc sạch sẽ thơm tho, máy lạnh Inverter mát sâu, Smart TV & Wifi riêng từng phòng',
    'about.hl3': 'Miễn phí giữ hành lý an toàn tuyệt đối trước giờ check-in & sau giờ check-out',
    'about.hl4': 'Đội ngũ lễ tân thân thiện phục vụ 24/7, hỗ trợ tư vấn ẩm thực & đặt xe nhanh',
    'about.stat1_num': '30',
    'about.stat1_label': 'Phòng Nghỉ Tiện Nghi',
    'about.stat2_num': '4.7⭐',
    'about.stat2_label': 'Đánh Giá Khách Hàng',
    'about.stat3_num': '24/7',
    'about.stat3_label': 'Lễ Tân Phục Vụ 24/24',
    'about.stat4_num': '100%',
    'about.stat4_label': 'Sạch Sẽ & Thơm Tho',

    // Rooms Section
    'rooms.eyebrow': 'HỆ THỐNG PHÒNG NGHỈ THỰC TẾ',
    'rooms.title': 'Các Hạng Phòng & Bảng Giá Ưu Đãi',
    'rooms.subtitle': 'Tất cả các phòng đều được trang bị máy lạnh, Smart TV, Wifi tốc độ cao, nước nóng 24/7, khăn tắm 100% cotton và dọn phòng hàng ngày.',
    'rooms.tab_all': 'Tất Cả Hạng Phòng',
    'rooms.tab_deluxe': 'Phòng Đôi & Ba (A, AD, B, E)',
    'rooms.tab_suite': 'Phòng Gia Đình (C, D - 5 Khách)',
    'rooms.popular_badge': '★ Được Đặt Nhiều Nhất',
    'rooms.view_photos': 'Xem {count} ảnh thực tế',
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

    // Dining & Services
    'dining.eyebrow': 'DỊCH VỤ NỔI BẬT',
    'dining.title': 'Trải Nghiệm Dịch Vụ Chu Đáo 24/7',
    'dining.desc': 'Chúng tôi chú trọng vào từng trải nghiệm nhỏ nhất của quý khách: từ thủ tục nhận phòng nhanh gọn, hỗ trợ tư vấn du lịch đến không gian nghỉ ngơi thư thái.',
    'dining.hours': 'Thời gian phục vụ: 24/7 Cả ngày & đêm',
    'dining.location': '269/19 Đề Thám, Phường Bến Thành, Quận 1',
    'dining.dish1_title': 'Lễ Tân & Check-in Nhanh 24/7',
    'dining.dish1_desc': 'Đội ngũ lễ tân luôn túc trực ngày đêm, hỗ trợ nhận/trả phòng nhanh chóng trong vòng 2 phút.',
    'dining.dish2_title': 'Giữ Hành Lý Miễn Phí',
    'dining.dish2_desc': 'Khu vực gửi đồ có camera an ninh, thẻ gửi hành lý rõ ràng, hoàn toàn miễn phí cho khách lưu trú.',
    'dining.dish3_title': 'Dọn Phòng & Khử Khuẩn Hàng Ngày',
    'dining.dish3_desc': 'Khăn tắm và ga trải giường thay mới định kỳ, đảm bảo không gian luôn thơm tho và tinh tươm.',
    'dining.daily_served': 'Phục vụ liên tục',
    'dining.book_table': 'Liên hệ lễ tân →',

    // Gym & Facilities
    'facilities.eyebrow': 'TIỆN ÍCH KHÁCH SẠN',
    'facilities.title': 'Nghỉ Ngơi Thoải Mái Ngay Tâm Điểm Quận 1',
    'facilities.sub': 'Tận hưởng kỳ nghỉ ấm cúng, riêng tư với mức giá vô cùng hợp lý tại Galaxy Boutique Hotel.',
    'facilities.gym_title': 'Phòng Ốc Tiện Nghi & Hiện Đại',
    'facilities.gym_desc': 'Đầy đủ Smart TV kết nối Youtube, máy lạnh Inverter mát sâu, tủ lạnh minibar và máy sấy tóc.',
    'facilities.gym_tag': '30 PHÒNG • TIỆN NGHI',
    'facilities.gym_hl1': 'Nước nóng năng lượng & điện 24/24',
    'facilities.gym_hl2': 'Khăn tắm 100% Cotton & Đồ vệ sinh miễn phí',
    'facilities.gym_hl3': 'Wifi cáp quang tốc độ cao cho từng phòng',
    
    'facilities.spa_title': 'Lễ Tân & An Ninh 24/7',
    'facilities.spa_desc': 'Bảo vệ và lễ tân túc trực 24/24, đảm bảo an ninh tuyệt đối và hỗ trợ quý khách mọi lúc.',
    'facilities.spa_tag': '24/7 • AN NINH TUYỆT ĐỐI',
    'facilities.spa_hl1': 'Hệ thống camera giám sát an ninh 24/24',
    'facilities.spa_hl2': 'Hỗ trợ gọi taxi, xe đưa đón sân bay Tân Sơn Nhất',
    'facilities.spa_hl3': 'Tư vấn tour tham quan Sài Gòn & địa điểm ăn uống',

    'facilities.pool_title': 'Vị Trí Vàng Trung Tâm Sài Gòn',
    'facilities.pool_desc': 'Nằm trong hẻm 269 Đề Thám yên tĩnh nhưng chỉ cách phố đi bộ Bùi Viện và chợ Bến Thành vài bước chân.',
    'facilities.pool_tag': 'TRUNG TÂM QUẬN 1',
    'facilities.pool_hl1': 'Đi bộ 2 phút ra Phố Tây Bùi Viện',
    'facilities.pool_hl2': 'Đi bộ 5 phút đến Chợ Bến Thành & Công viên 23/9',
    'facilities.pool_hl3': 'Gần Dinh Độc Lập, Nhà thờ Đức Bà & Bến Bạch Đằng',
    'facilities.contact_btn': 'Đặt phòng ngay',

    // Gallery
    'gallery.eyebrow': 'BỘ SƯU TẬP ẢNH THỰC TẾ',
    'gallery.title': 'Hình Ảnh Khách Sạn & Phòng Nghỉ',
    'gallery.tab_all': 'Tất cả ảnh',
    'gallery.tab_rooms': 'Phòng thực tế',
    'gallery.tab_dining': 'Dịch vụ',
    'gallery.tab_facilities': 'Không gian chung',

    // Testimonials
    'reviews.eyebrow': 'ĐÁNH GIÁ TỪ KHÁCH HÀNG',
    'reviews.title': 'Cảm Nhận Của Du Khách Về Galaxy Hotel',

    // Location & Contact
    'contact.eyebrow': 'KẾT NỐI VỚI CHÚNG TÔI',
    'contact.title': 'Vị Trí & Thông Tin Liên Hệ',
    'contact.address_title': 'Địa Chỉ Khách Sạn',
    'contact.address': '269/19 Đề Thám, P. Bến Thành, Quận 1, TP. Hồ Chí Minh',
    'contact.phone_title': 'Điện Thoại / Hotline',
    'contact.phone': '028 2248 7782 • Zalo/WhatsApp: 079 329 5664',
    'contact.email_title': 'Email Khách Sạn',
    'contact.email': 'galaxyboutiquehotel2022@gmail.com',
    'contact.hours_title': 'Giờ Nhận & Trả Phòng',
    'contact.hours_desc': 'Check-in: 14:00 | Check-out: 12:00 (Hỗ trợ linh hoạt)',
    'contact.inquiry_title': 'Gửi Yêu Cầu / Tư Vấn Đặt Phòng',
    'contact.inquiry_sub': 'Vui lòng để lại thông tin, đội ngũ lễ tân Galaxy Boutique Hotel sẽ liên hệ phản hồi quý khách trong vòng 5-10 phút.',
    'contact.form_name': 'Họ và tên quý khách',
    'contact.form_phone': 'Số điện thoại liên hệ',
    'contact.form_email': 'Địa chỉ Email',
    'contact.form_message': 'Nội dung tin nhắn / Yêu cầu đặt phòng...',
    'contact.form_send': 'Gửi tin nhắn ngay',

    // Footer
    'footer.about_text': 'Galaxy Boutique Hotel - Không gian ấm cúng như ở nhà. Điểm dừng chân lý tưởng tọa lạc ngay trung tâm Quận 1 sầm uất với chi phí vô cùng hợp lý.',
    'footer.quick_links': 'Liên Kết Nhanh',
    'footer.room_types': 'Hạng Phòng',
    'footer.policies': 'Chính Sách & Tiện Ích',
    'footer.policy_checkin': 'Giờ check-in: 14:00 | Check-out: 12:00 (Hỗ trợ theo giờ)',
    'footer.policy_cancel': 'Hủy phòng linh hoạt, hỗ trợ đổi ngày miễn phí',
    'footer.policy_breakfast': 'Wifi cáp quang tốc độ cao & nước nóng 24/7',
    'footer.policy_hourly': 'Cho thuê theo giờ linh hoạt: Chỉ từ 120k / 2h đầu',
    'footer.newsletter_title': 'Nhận Mã Ưu Đãi Đặt Phòng',
    'footer.newsletter_sub': 'Nhận thông báo các chương trình giảm giá và ưu đãi phòng trực tiếp.',
    'footer.newsletter_btn': 'Đăng ký nhận tin',
    'footer.terms': 'Điều khoản sử dụng',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.sitemap': 'Sơ đồ website',
    'footer.copyright': '© 2026 GALAXY BOUTIQUE HOTEL. Tất cả quyền được bảo lưu.',

    // Modals
    'modal.booking_title': 'Đặt Phòng Galaxy Boutique Hotel',
    'modal.room_detail_title': 'Chi Tiết Phòng & Lịch Trống',
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
    'modal.phone_placeholder': 'Số điện thoại nhận xác nhận phòng *',
    'modal.email_placeholder': 'Địa chỉ Email (để nhận xác nhận)',
    'modal.note_placeholder': 'Yêu cầu đặc biệt (tầng cao, check-in sớm, xe đón sân bay...)',
    'modal.duration_summary': 'Thời lượng:',
    'modal.total_summary': 'Tổng tiền dự kiến (VNĐ):',
    'modal.confirm_btn': 'Xác Nhận Gửi Yêu Cầu Đặt Phòng',
    'modal.success_title': 'Đặt Phòng Thành Công!',
    'modal.success_msg': 'Cảm ơn quý khách! Đơn đặt phòng của quý khách đã được lưu và gửi tới bộ phận Lễ tân Galaxy Boutique Hotel. Chúng tôi sẽ liên hệ lại xác nhận qua số điện thoại trong vòng 5-10 phút.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.rooms': 'Rooms & Rates',
    'nav.dining': 'Services',
    'nav.facilities': 'Amenities',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.book_now': 'Book Now',
    'nav.hotline': 'Reservation Hotline',

    // Hero
    'hero.badge': 'GALAXY BOUTIQUE HOTEL • DISTRICT 1 CENTER',
    'hero.slide1.title': 'GALAXY BOUTIQUE HOTEL',
    'hero.slide1.subtitle': 'Cozy Like Home - Restful Stay in the Vibrant Center of District 1',
    'hero.slide2.title': 'CLEAN & COZY SANCTUARY',
    'hero.slide2.subtitle': 'Impeccable cleanliness, cooling AC, private Wi-Fi and budget-friendly rates',
    'hero.slide3.title': 'PRIME DISTRICT 1 LOCATION',
    'hero.slide3.subtitle': 'A few steps to Bui Vien Walking Street, Ben Thanh Market & Nguyen Hue Boulevard',
    'hero.view_rooms': 'Explore Rooms',
    'hero.book_room': 'Online Reservation',

    // Booking Bar
    'booking.tab_daily': 'Daily (Overnight)',
    'booking.tab_hourly': 'Hourly (Flexible)',
    'booking.checkin': 'Check-in Date',
    'booking.checkout': 'Check-out Date',
    'booking.date': 'Stay Date',
    'booking.checkin_time': 'Check-in Time',
    'booking.duration': 'Duration',
    'booking.hours_2': 'First 2 Hours (From 120k)',
    'booking.hours_3': '3 Hours',
    'booking.hours_4': '4 Hours',
    'booking.hours_6': '6 Hours',
    'booking.guests': 'Guests',
    'booking.adults': 'Adults',
    'booking.children': 'Children',
    'booking.room_type': 'Preferred Room',
    'booking.all_rooms': 'All Room Types',
    'booking.search_btn': 'Check Availability',
    'booking.standard_times': 'Check-in: 14:00 | Check-out: 12:00 (Early check-in support)',

    // Welcome Section
    'about.eyebrow': 'ABOUT US',
    'about.title': 'Welcome To Galaxy Boutique Hotel',
    'about.desc1': 'Welcome to Galaxy Boutique Hotel – an ideal haven located right in the vibrant center of District 1, Ho Chi Minh City. We offer a clean, convenient, and cozy accommodation at extremely reasonable rates, helping you optimize travel costs without compromising comfort.',
    'about.desc2': 'Galaxy Hotel features 30 modern, sparkling-clean guest rooms suited for solo travelers, couples, families, and business trips. Situated conveniently in Alley 269 De Tham with 24/7 front desk hospitality, we are always ready to make your stay pleasant and memorable.',
    'about.badge_title': 'GALAXY BOUTIQUE HOTEL',
    'about.badge_sub': 'Cozy Like Home Right in Central Saigon',
    'about.hl1': 'Prime location at 269/19 De Tham, District 1 (close to Bui Vien & Ben Thanh Market)',
    'about.hl2': 'Sparkling clean rooms, Inverter AC, Smart TV & dedicated high-speed Wi-Fi',
    'about.hl3': 'Complimentary secure luggage storage before check-in and after check-out',
    'about.hl4': 'Friendly 24/7 front desk staff providing tour advice & taxi assistance',
    'about.stat1_num': '30',
    'about.stat1_label': 'Cozy Guest Rooms',
    'about.stat2_num': '4.7⭐',
    'about.stat2_label': 'Guest Rating',
    'about.stat3_num': '24/7',
    'about.stat3_label': 'Front Desk Service',
    'about.stat4_num': '100%',
    'about.stat4_label': 'Clean & Fresh Linen',

    // Rooms Section
    'rooms.eyebrow': 'AUTHENTIC ROOMS',
    'rooms.title': 'Rooms & Promotional Rates',
    'rooms.subtitle': 'All rooms include air conditioning, Smart TV, high-speed Wi-Fi, 24/7 hot water, 100% cotton towels, and daily housekeeping.',
    'rooms.tab_all': 'All Room Types',
    'rooms.tab_deluxe': 'Double & Triple (A, AD, B, E)',
    'rooms.tab_suite': 'Family Rooms (C, D - 5 Guests)',
    'rooms.popular_badge': '★ Most Popular Choice',
    'rooms.view_photos': 'View {count} real photos',
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

    // Dining & Services
    'dining.eyebrow': 'CORE SERVICES',
    'dining.title': 'Dedicated 24/7 Guest Hospitality',
    'dining.desc': 'We care for every detail of your stay: from swift check-in, local recommendations to clean, peaceful living spaces.',
    'dining.hours': 'Service Hours: 24/7 Day & Night',
    'dining.location': '269/19 De Tham, District 1, HCMC',
    'dining.dish1_title': '24/7 Express Check-in & Concierge',
    'dining.dish1_desc': 'Our round-the-clock front desk team assists you with express check-in within 2 minutes.',
    'dining.dish2_title': 'Free Luggage Storage',
    'dining.dish2_desc': 'CCTV-monitored secure luggage storage with numbered tag system, 100% free for guests.',
    'dining.dish3_title': 'Daily Housekeeping & Sanitization',
    'dining.dish3_desc': 'Fresh cotton linens and sanitized bathrooms guarantee a crisp, fragrant ambience every day.',
    'dining.daily_served': 'Available 24/7',
    'dining.book_table': 'Contact Front Desk →',

    // Gym & Facilities
    'facilities.eyebrow': 'HOTEL AMENITIES',
    'facilities.title': 'Comfortable Stay in Central District 1',
    'facilities.sub': 'Enjoy a warm, private, and budget-smart stay in Ho Chi Minh City.',
    'facilities.gym_title': 'Full Room Amenities',
    'facilities.gym_desc': 'Equipped with Smart TV (Youtube/Netflix), cooling Inverter AC, minibar fridge, and hair dryer.',
    'facilities.gym_tag': '30 ROOMS • COMPLETE AMENITIES',
    'facilities.gym_hl1': '24/7 Hot shower water system',
    'facilities.gym_hl2': '100% Cotton towels & free toiletries',
    'facilities.gym_hl3': 'Dedicated high-speed fiber Wi-Fi for each room',
    
    'facilities.spa_title': '24/7 Security & Hospitality',
    'facilities.spa_desc': 'Round-the-clock security and reception ensuring complete safety and support at any time.',
    'facilities.spa_tag': '24/7 • TOTAL SECURITY',
    'facilities.spa_hl1': '24/7 CCTV surveillance monitoring',
    'facilities.spa_hl2': 'Airport transfer & taxi booking assistance',
    'facilities.spa_hl3': 'Local street food & city tour recommendations',

    'facilities.pool_title': 'Prime Heart of Saigon',
    'facilities.pool_desc': 'Situated in quiet alley 269 De Tham, just a few minutes walk to Bui Vien Walking Street & Ben Thanh Market.',
    'facilities.pool_tag': 'DISTRICT 1 CENTER',
    'facilities.pool_hl1': '2 minutes walk to Bui Vien Walking Street',
    'facilities.pool_hl2': '5 minutes walk to Ben Thanh Market & 23/9 Park',
    'facilities.pool_hl3': 'Close to Independence Palace & Notre-Dame Cathedral',
    'facilities.contact_btn': 'Book A Room',

    // Gallery
    'gallery.eyebrow': 'PHOTO GALLERY',
    'gallery.title': 'Actual Hotel & Room Photos',
    'gallery.tab_all': 'All Photos',
    'gallery.tab_rooms': 'Real Rooms',
    'gallery.tab_dining': 'Services',
    'gallery.tab_facilities': 'Common Spaces',

    // Testimonials
    'reviews.eyebrow': 'GUEST REVIEWS',
    'reviews.title': 'What Guests Say About Galaxy Hotel',

    // Location & Contact
    'contact.eyebrow': 'GET IN TOUCH',
    'contact.title': 'Location & Contact Details',
    'contact.address_title': 'Hotel Address',
    'contact.address': '269/19 De Tham Street, Pham Ngu Lao (near Ben Thanh), District 1, Ho Chi Minh City',
    'contact.phone_title': 'Phone & Hotline',
    'contact.phone': '028 2248 7782 • Zalo/WhatsApp: +84 79 329 5664',
    'contact.email_title': 'Email Address',
    'contact.email': 'galaxyboutiquehotel2022@gmail.com',
    'contact.hours_title': 'Check-in / Out Times',
    'contact.hours_desc': 'Check-in: 14:00 | Check-out: 12:00 (Hourly flexibility)',
    'contact.inquiry_title': 'Reservation & Assistance Inquiry',
    'contact.inquiry_sub': 'Please leave your details and our Front Desk team will reply within 5-10 minutes.',
    'contact.form_name': 'Your Full Name',
    'contact.form_phone': 'Phone Number',
    'contact.form_email': 'Email Address',
    'contact.form_message': 'Your Message / Booking Request...',
    'contact.form_send': 'Send Message',

    // Footer
    'footer.about_text': 'Galaxy Boutique Hotel - Cozy Like Home. An ideal stay in the bustling heart of District 1 offering clean, convenient, and budget-friendly comfort.',
    'footer.quick_links': 'Quick Links',
    'footer.room_types': 'Room Categories',
    'footer.policies': 'Policies & Information',
    'footer.policy_checkin': 'Check-in: 14:00 | Check-out: 12:00 (Hourly day-use available)',
    'footer.policy_cancel': 'Flexible cancellation & free date change assistance',
    'footer.policy_breakfast': 'High-speed fiber Wi-Fi & 24/7 hot shower',
    'footer.policy_hourly': 'Flexible hourly rentals from only 120k / first 2h',
    'footer.newsletter_title': 'Get Special Rates',
    'footer.newsletter_sub': 'Subscribe for direct booking discounts and seasonal offers.',
    'footer.newsletter_btn': 'Subscribe',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.sitemap': 'Sitemap',
    'footer.copyright': '© 2026 GALAXY BOUTIQUE HOTEL. All Rights Reserved.',

    // Modals
    'modal.booking_title': 'Galaxy Boutique Hotel Reservation',
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
    'modal.note_placeholder': 'Special requests (high floor, early check-in, airport shuttle...)',
    'modal.duration_summary': 'Duration:',
    'modal.total_summary': 'Estimated Total (VND):',
    'modal.confirm_btn': 'Submit Reservation Request',
    'modal.success_title': 'Booking Received!',
    'modal.success_msg': 'Thank you! Your booking request has been recorded and sent to the Galaxy Boutique Hotel Front Desk. We will call you within 5-10 minutes to confirm.',
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
