import { Room, ServiceItem } from '../types';

export const hotelInfo = {
  name: 'Galaxy Boutique Hotel',
  vietnameseName: 'Khách Sạn Galaxy Quận 1',
  tagline: {
    vi: 'Không Gian Ấm Cúng Như Ở Nhà - Tâm Điểm Quận 1',
    en: 'Cozy Like Home - Right in the Heart of District 1'
  },
  address: {
    vi: '269/19 Đề Thám, Phường Phạm Ngũ Lão (gần Bến Thành), Quận 1, TP. Hồ Chí Minh',
    en: '269/19 De Tham Street, Pham Ngu Lao Ward, District 1, Ho Chi Minh City'
  },
  phone: '028 2248 7782',
  zalo: '079 329 5664',
  whatsapp: '079 329 5664',
  email: 'galaxyboutiquehotel2022@gmail.com',
  facebook: 'https://www.facebook.com/hotelquan1giare',
  tiktok: 'https://www.tiktok.com/@galaxy.boutique269',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5621599203555!2d106.69309!3d10.768188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fcaf428be75%3A0x323b5d4e6f707fb0!2sGalaxy%20Boutique%20Hotel!5e0!3m2!1svi!2s!4v1784154591201!5m2!1svi!2s',
  rating: 4.7,
  totalReviews: 328,
  totalRooms: 30
};

export const roomsData: Room[] = [
  {
    id: 'phong-a',
    slug: 'phong-a',
    name: {
      vi: 'Phòng A (Standard Deluxe)',
      en: 'Room A (Standard Deluxe)'
    },
    subtitle: {
      vi: 'Không gian ấm cúng, thiết kế hiện đại và tiện nghi hoàn hảo cho 2 người',
      en: 'Cozy atmosphere, modern design and perfect comfort for 2 guests'
    },
    pricePerNight: 650000,
    priceHourlyFirst2h: 150000,
    priceHourlyExtra: 50000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 15,
    bedType: {
      vi: '1 Giường Đôi Queen (1.6m x 2.0m)',
      en: '1 Queen Double Bed (1.6m x 2.0m)'
    },
    view: {
      vi: 'Cửa sổ đón gió tự nhiên',
      en: 'Natural Breeze Window'
    },
    amenities: {
      vi: ['Máy lạnh Inverter', 'Smart TV kết nối Youtube', 'Wifi tốc độ cao miễn phí', 'Tủ lạnh minibar', 'Phòng tắm nước nóng 24/7', 'Máy sấy tóc & Khăn tắm cao cấp'],
      en: ['Inverter Air Conditioner', 'Smart TV with Youtube', 'Free High-Speed Wi-Fi', 'Minibar Refrigerator', '24/7 Hot Water Shower', 'Hair Dryer & Premium Towels']
    },
    images: [
      '/images/rooms/phong-a.jpg',
      '/images/rooms/phong-ad.jpg',
      '/images/hero-1.jpg'
    ],
    description: {
      vi: 'Phòng A tại Galaxy Boutique Hotel là sự lựa chọn hoàn hảo cho các cặp đôi hoặc du khách cá nhân. Phòng được trang bị đầy đủ tiện nghi hiện đại, không gian sạch sẽ thoáng mát với mức giá cực kỳ ưu đãi ngay trung tâm Quận 1.',
      en: 'Room A at Galaxy Boutique Hotel is the perfect choice for couples or solo travelers. Fully equipped with modern amenities, clean and airy space at an attractive rate right in District 1.'
    },
    features: {
      vi: ['Miễn phí nhận phòng sớm (tùy tình trạng phòng)', 'Nước suối miễn phí hàng ngày', 'Lễ tân phục vụ 24/7'],
      en: ['Early check-in subject to availability', 'Complimentary bottled water daily', '24/7 Front desk support']
    },
    isPopular: true
  },
  {
    id: 'phong-ad',
    slug: 'phong-ad',
    name: {
      vi: 'Phòng AD (Deluxe Triple)',
      en: 'Room AD (Deluxe Triple)'
    },
    subtitle: {
      vi: 'Không gian rộng rãi, thoáng mát dành cho nhóm 3 khách hoặc gia đình nhỏ',
      en: 'Spacious and airy room for 3 guests or small families'
    },
    pricePerNight: 650000,
    priceHourlyFirst2h: 180000,
    priceHourlyExtra: 60000,
    maxAdults: 3,
    maxChildren: 1,
    areaSqm: 18,
    bedType: {
      vi: '1 Giường Đôi King + 1 Giường Đơn',
      en: '1 King Bed + 1 Single Bed'
    },
    view: {
      vi: 'Cửa sổ đón ánh sáng tự nhiên',
      en: 'Daylight Window'
    },
    amenities: {
      vi: ['Máy lạnh Inverter', 'Smart TV 43"', 'Wifi cáp quang riêng', 'Tủ quần áo gỗ cao cấp', 'Tủ lạnh minibar', 'Phòng tắm đứng riêng biệt'],
      en: ['Inverter Air Conditioner', '43" Smart TV', 'Dedicated Fiber Wi-Fi', 'Wooden Wardrobe', 'Minibar Fridge', 'Private Walk-in Shower']
    },
    images: [
      '/images/rooms/phong-ad.jpg',
      '/images/rooms/phong-a.jpg',
      '/images/rooms/phong-b.jpg'
    ],
    description: {
      vi: 'Phòng AD với diện tích 18m² được bố trí hài hòa giữa 1 giường đôi và 1 giường đơn êm ái. Không gian nghỉ dưỡng ấm áp, yên tĩnh, tạo cảm giác thân thuộc như chính ngôi nhà của bạn.',
      en: 'Room AD features an 18sqm layout with 1 comfortable double bed and 1 single bed. A warm and tranquil sanctuary making you feel right at home.'
    },
    features: {
      vi: ['Dọn phòng sạch sẽ mỗi ngày', 'Hỗ trợ đặt xe & tour du lịch Sài Gòn', 'Giữ hành lý miễn phí'],
      en: ['Daily housekeeping service', 'Tour & taxi booking assistance', 'Free luggage storage']
    }
  },
  {
    id: 'phong-b',
    slug: 'phong-b',
    name: {
      vi: 'Phòng B (Superior Triple)',
      en: 'Room B (Superior Triple)'
    },
    subtitle: {
      vi: 'Thiết kế tinh tế, không gian yên tĩnh và tiện nghi hoàn hảo cho kỳ nghỉ trọn vẹn',
      en: 'Refined design, quiet space and full amenities for a complete holiday'
    },
    pricePerNight: 650000,
    priceHourlyFirst2h: 180000,
    priceHourlyExtra: 60000,
    maxAdults: 3,
    maxChildren: 1,
    areaSqm: 20,
    bedType: {
      vi: '1 Giường Đôi lớn (1.8m x 2.0m) + 1 Giường Đơn',
      en: '1 Large King Bed (1.8m x 2.0m) + 1 Single Bed'
    },
    view: {
      vi: 'Hướng phố Quận 1 thoáng đãng',
      en: 'Open District 1 City Scenery'
    },
    amenities: {
      vi: ['Máy lạnh mát sâu', 'Smart TV thế hệ mới', 'Wifi tốc độ cao', 'Ấm đun nước siêu tốc', 'Tủ lạnh minibar', 'Bàn làm việc & ghế thư giãn'],
      en: ['Powerful Air Conditioner', 'Latest Smart TV', 'High-Speed Wi-Fi', 'Electric Kettle', 'Minibar Fridge', 'Work Desk & Lounge Chair']
    },
    images: [
      '/images/rooms/phong-b.jpg',
      '/images/hero-1.jpg',
      '/images/rooms/phong-c.jpg'
    ],
    description: {
      vi: 'Phòng B mang đến không gian rộng 20m² với đệm lò xo êm ái chuẩn khách sạn, giúp phục hồi năng lượng tối đa sau chuyến dạo chơi phố Tây Bùi Viện và chợ Bến Thành.',
      en: 'Room B offers a 20sqm retreat with premium pocket spring mattress, perfectly rejuvenating your energy after exploring Bui Vien walking street and Ben Thanh Market.'
    },
    features: {
      vi: ['Phù hợp du lịch nhóm bạn hoặc công tác', 'Khăn tắm 100% Cotton thay mới hàng ngày', 'Check-out linh hoạt'],
      en: ['Ideal for friends or business colleagues', 'Fresh 100% cotton towels daily', 'Flexible check-out']
    },
    isPopular: true
  },
  {
    id: 'phong-c',
    slug: 'phong-c',
    name: {
      vi: 'Phòng C (Family Suite - 5 Khách)',
      en: 'Room C (Family Suite - 5 Guests)'
    },
    subtitle: {
      vi: 'Không gian gia đình rộng 25m², 2 giường đôi lớn cho tối đa 5 người lưu trú',
      en: 'Spacious 25sqm family room with 2 large double beds accommodating up to 5 guests'
    },
    pricePerNight: 650000,
    priceHourlyFirst2h: 200000,
    priceHourlyExtra: 70000,
    maxAdults: 5,
    maxChildren: 2,
    areaSqm: 25,
    bedType: {
      vi: '2 Giường Đôi King Size (1.6m x 2.0m)',
      en: '2 King Double Beds (1.6m x 2.0m)'
    },
    view: {
      vi: 'Cửa sổ đón gió & ánh sáng tự nhiên',
      en: 'Breeze & Natural Daylight Window'
    },
    amenities: {
      vi: ['2 Giường đôi nệm êm ái', 'Smart TV 50 inch 4K', 'Wifi cáp quang băng thông rộng', 'Tủ lạnh lớn', 'Ấm siêu tốc & Trà/Cafe', 'Phòng tắm rộng có vòi sen đứng'],
      en: ['2 Plush King Beds', '50" 4K Smart TV', 'High-bandwidth Wi-Fi', 'Large Refrigerator', 'Kettle & Complimentary Tea/Coffee', 'Spacious Shower Bathroom']
    },
    images: [
      '/images/rooms/phong-c.jpg',
      '/images/rooms/phong-d.jpg',
      '/images/rooms/phong-a.jpg'
    ],
    description: {
      vi: 'Phòng C là lựa chọn hàng đầu cho các gia đình đông thành viên hoặc nhóm bạn thân đi du lịch cùng nhau. Sở hữu 2 giường đôi rộng rãi, phòng mang lại sự gắn kết ấm cúng và tiết kiệm chi phí tối đa.',
      en: 'Room C is the top recommendation for families and group vacations. Featuring 2 large double beds, it offers cozy togetherness and maximum cost-efficiency in central Saigon.'
    },
    features: {
      vi: ['Sức chứa đến 5 người thoải mái', 'Trang bị nhiều ổ cắm sạc tiện dụng', 'Hỗ trợ check-in sớm linh hoạt'],
      en: ['Accommodates up to 5 guests comfortably', 'Multiple charging outlets', 'Flexible early check-in assistance']
    },
    isPopular: true
  },
  {
    id: 'phong-d',
    slug: 'phong-d',
    name: {
      vi: 'Phòng D (Grand Family - 5 Khách)',
      en: 'Room D (Grand Family - 5 Guests)'
    },
    subtitle: {
      vi: 'Phòng lớn nhất 28m² với 2 giường đôi Queen, cửa sổ lớn view phố thoáng mát',
      en: 'Largest 28sqm suite with 2 Queen beds and large panoramic windows'
    },
    pricePerNight: 650000,
    priceHourlyFirst2h: 200000,
    priceHourlyExtra: 70000,
    maxAdults: 5,
    maxChildren: 2,
    areaSqm: 28,
    bedType: {
      vi: '2 Giường Queen Size (1.8m x 2.0m)',
      en: '2 Queen Beds (1.8m x 2.0m)'
    },
    view: {
      vi: 'Cửa sổ lớn toàn cảnh góc phố',
      en: 'Large Window with Street Corner View'
    },
    amenities: {
      vi: ['2 Giường lớn cao cấp', 'Smart TV 55" giải trí đa phương tiện', 'Wifi siêu tốc', 'Tủ lạnh minibar', 'Két an toàn', 'Máy sấy tóc & Đồ vệ sinh cá nhân miễn phí'],
      en: ['2 Large Luxury Beds', '55" Smart TV Entertainment', 'Ultra-fast Wi-Fi', 'Minibar Fridge', 'Safety Box', 'Hair Dryer & Free Toiletries']
    },
    images: [
      '/images/rooms/phong-d.jpg',
      '/images/rooms/phong-b.jpg',
      '/images/rooms/phong-ad.jpg'
    ],
    description: {
      vi: 'Phòng D sở hữu không gian rộng rãi 28m² với thiết kế tràn ngập ánh sáng tự nhiên từ khung cửa sổ lớn. Rất thích hợp cho các kỳ nghỉ gia đình dài ngày cần sự thoải mái và tự do như tại nhà.',
      en: 'Room D boasts an expansive 28sqm space flooded with natural daylight through large windows. Perfect for extended family stays seeking home-like comfort and freedom.'
    },
    features: {
      vi: ['Không gian rộng rãi nhất khách sạn', 'Cửa sổ kính lớn đón gió tự nhiên', 'Dịch vụ dọn phòng 24/7'],
      en: ['Most spacious layout in the hotel', 'Large scenic window', '24/7 Housekeeping support']
    }
  },
  {
    id: 'phong-e',
    slug: 'phong-e',
    name: {
      vi: 'Phòng E (Executive King)',
      en: 'Room E (Executive King)'
    },
    subtitle: {
      vi: 'Không gian ấm cúng, sang trọng và yên tĩnh dành riêng cho giấc ngủ sâu',
      en: 'Cozy, elegant and peaceful space dedicated to restful deep sleep'
    },
    pricePerNight: 650000,
    priceHourlyFirst2h: 160000,
    priceHourlyExtra: 50000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 18,
    bedType: {
      vi: '1 Giường King Size êm ái (1.8m x 2.0m)',
      en: '1 Plush King Bed (1.8m x 2.0m)'
    },
    view: {
      vi: 'Không gian yên tĩnh, cách âm tốt',
      en: 'Quiet & Soundproofed Ambience'
    },
    amenities: {
      vi: ['Giường King nệm cao cấp', 'Máy lạnh Inverter', 'Smart TV 43"', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Trà & Cà phê miễn phí'],
      en: ['Luxury King Mattress', 'Inverter Air Conditioner', '43" Smart TV', 'High-Speed Wi-Fi', 'Minibar Fridge', 'Complimentary Tea & Coffee']
    },
    images: [
      '/images/rooms/phong-a.jpg',
      '/images/hero-2.jpg',
      '/images/hero-1.jpg'
    ],
    description: {
      vi: 'Phòng E được thiết kế tối ưu cho sự riêng tư và yên tĩnh tuyệt đối. Nệm King size cao cấp cùng ánh đèn vàng ấm áp mang lại cảm giác thư thái dễ chịu sau một ngày dài năng động.',
      en: 'Room E is crafted for supreme privacy and quiet tranquility. The luxury King mattress and warm ambient lighting create an instant sense of peace.'
    },
    features: {
      vi: ['Cách âm tiêu chuẩn cao', 'Không gian ấm cúng lãng mạn', 'Lễ tân phục vụ 24/24'],
      en: ['High-standard soundproofing', 'Romantic cozy ambiance', '24/7 Front desk assistance']
    }
  },
  {
    id: 'phong-don-tiet-kiem',
    slug: 'phong-don-tiet-kiem',
    name: {
      vi: 'Phòng Đơn Tiết Kiệm (Không Cửa Sổ)',
      en: 'Budget Single Room (No Window)'
    },
    subtitle: {
      vi: 'Góc nghỉ yên tĩnh, gọn gàng và đầy đủ tiện nghi với mức giá siêu tiết kiệm',
      en: 'Quiet, compact and fully equipped retreat at an ultra-budget rate'
    },
    pricePerNight: 390000,
    priceHourlyFirst2h: 120000,
    priceHourlyExtra: 40000,
    maxAdults: 1,
    maxChildren: 1,
    areaSqm: 14,
    bedType: {
      vi: '1 Giường Đôi (1.4m x 2.0m)',
      en: '1 Double Bed (1.4m x 2.0m)'
    },
    view: {
      vi: 'Yên tĩnh tuyệt đối trong nhà',
      en: 'Total Indoor Tranquility'
    },
    amenities: {
      vi: ['Máy lạnh Inverter mát lạnh', 'Smart TV', 'Wifi miễn phí', 'Nước nóng 24/7', 'Tủ lạnh mini', 'Bàn làm việc gọn'],
      en: ['Inverter Air Conditioner', 'Smart TV', 'Free Wi-Fi', '24/7 Hot Water', 'Mini Fridge', 'Compact Work Desk']
    },
    images: [
      '/images/rooms/phong-a.jpg',
      '/images/rooms/phong-ad.jpg'
    ],
    description: {
      vi: 'Phòng Đơn Tiết Kiệm là lựa chọn kinh tế hàng đầu cho khách du lịch một mình hoặc khách đi công tác ngắn ngày. Dù không có cửa sổ nhưng phòng được thiết kế thông thoáng, sạch sẽ và yên tĩnh tuyệt đối.',
      en: 'Budget Single Room is the best economic option for solo travelers or short business trips. Designed for freshness, cleanliness and total quietness.'
    },
    features: {
      vi: ['Mức giá tiết kiệm nhất Quận 1', 'Yên tĩnh không tiếng ồn phố thị', 'Đầy đủ tiện nghi cơ bản'],
      en: ['Best budget rate in District 1', 'Quiet from street noise', 'Complete essential amenities']
    }
  },
  {
    id: 'phong-doi-tieu-chuan',
    slug: 'phong-doi-tieu-chuan',
    name: {
      vi: 'Phòng Đôi Tiêu Chuẩn (Không Cửa Sổ)',
      en: 'Standard Double Room (No Window)'
    },
    subtitle: {
      vi: 'Không gian ấm cúng dành cho hai người, sạch sẽ và thoải mái ngay trung tâm',
      en: 'Cozy space for two, clean and comfortable right in downtown'
    },
    pricePerNight: 420000,
    priceHourlyFirst2h: 140000,
    priceHourlyExtra: 40000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 16,
    bedType: {
      vi: '1 Giường Đôi Queen (1.6m x 2.0m)',
      en: '1 Queen Double Bed (1.6m x 2.0m)'
    },
    view: {
      vi: 'Không gian yên tĩnh',
      en: 'Quiet Indoor Ambience'
    },
    amenities: {
      vi: ['Máy lạnh làm mát nhanh', 'Smart TV', 'Wifi cáp quang', 'Tủ lạnh minibar', 'Phòng tắm đứng riêng', 'Khăn tắm & Dép đi trong phòng'],
      en: ['Fast-cooling Air Conditioner', 'Smart TV', 'Fiber Wi-Fi', 'Minibar Fridge', 'Private Shower', 'Towels & Indoor Slippers']
    },
    images: [
      '/images/rooms/phong-b.jpg',
      '/images/rooms/phong-c.jpg'
    ],
    description: {
      vi: 'Phòng Đôi Tiêu Chuẩn mang lại trải nghiệm lưu trú ấm cúng cho 2 người với chi phí tối ưu. Đầy đủ tiện ích phục vụ nhu cầu nghỉ ngơi sau một ngày vui chơi tại TP.HCM.',
      en: 'Standard Double Room offers a cozy stay for 2 at an optimized rate. Complete amenities supporting your rest after a joyful day in Ho Chi Minh City.'
    },
    features: {
      vi: ['Giá cả hợp lý cho 2 người', 'Sạch sẽ thơm tho mỗi ngày', 'Check-in nhanh chóng'],
      en: ['Affordable rate for 2 guests', 'Fresh & clean daily', 'Express check-in']
    }
  }
];

export const servicesData: ServiceItem[] = [
  {
    id: 'service-reception',
    title: {
      vi: 'Lễ Tân Phục Vụ 24/7',
      en: '24/7 Front Desk & Concierge'
    },
    description: {
      vi: 'Đội ngũ lễ tân luôn sẵn sàng hỗ trợ 24/24, từ thủ tục nhận/trả phòng nhanh chóng đến tư vấn ẩm thực, đặt xe và giải đáp mọi thắc mắc của bạn.',
      en: 'Our 24/7 front desk team is always ready to assist with express check-in/out, local dining recommendations, transportation, and inquiries.'
    },
    image: '/images/hero-1.jpg',
    hours: '24/7 (Cả ngày & đêm)',
    location: {
      vi: 'Sảnh Chính Tầng Trệt',
      en: 'Ground Floor Main Lobby'
    },
    highlights: {
      vi: ['Check-in / Check-out nhanh chóng', 'Tư vấn địa điểm du lịch Quận 1', 'Hỗ trợ gọi taxi & đặt tour'],
      en: ['Express Check-in & Check-out', 'District 1 Travel & Food Tips', 'Taxi & Tour booking assistance']
    }
  },
  {
    id: 'service-luggage',
    title: {
      vi: 'Giữ Hành Lý Miễn Phí',
      en: 'Free Luggage Storage'
    },
    description: {
      vi: 'Quý khách có thể gửi hành lý an toàn tuyệt đối tại khách sạn trước giờ nhận phòng hoặc sau khi trả phòng để thoải mái dạo chơi Sài Gòn.',
      en: 'Securely store your luggage for free before check-in or after check-out, so you can freely explore Saigon unburdened.'
    },
    image: '/images/welcome-1.jpg',
    hours: '24/7',
    location: {
      vi: 'Khu Vực Giữ Đồ Sảnh Lễ Tân',
      en: 'Lobby Luggage Area'
    },
    highlights: {
      vi: ['Camera an ninh giám sát 24/24', 'Thẻ gửi đồ phân loại rõ ràng', 'Hoàn toàn miễn phí cho khách lưu trú'],
      en: ['24/7 CCTV Security Monitoring', 'Numbered Luggage Tag System', '100% Free for Guests']
    }
  },
  {
    id: 'service-housekeeping',
    title: {
      vi: 'Dọn Phòng & Thay Khăn Hàng Ngày',
      en: 'Daily Housekeeping & Fresh Linen'
    },
    description: {
      vi: 'Quy trình vệ sinh khử khuẩn nghiêm ngặt, thay mới ga trải giường, vỏ gối và khăn tắm 100% cotton để quý khách luôn tận hưởng không gian sạch sẽ thơm tho.',
      en: 'Strict sanitization process with daily fresh bed linens, pillowcases, and 100% cotton towels ensuring a pristine living space.'
    },
    image: '/images/welcome-2.jpg',
    hours: '08:00 - 17:00',
    location: {
      vi: 'Tất cả các phòng',
      en: 'All Guest Rooms'
    },
    highlights: {
      vi: ['Khăn tắm & Ga gối giặt sấy thơm tho', 'Bổ sung nước khoáng & đồ dùng miễn phí', 'Khử khuẩn theo tiêu chuẩn an toàn'],
      en: ['Fragrant clean towels & sheets', 'Replenished bottled water & toiletries', 'Safe hygiene standards']
    }
  },
  {
    id: 'service-booking-flexible',
    title: {
      vi: 'Đặt Phòng Theo Giờ & Theo Ngày',
      en: 'Hourly & Daily Flexible Booking'
    },
    description: {
      vi: 'Linh hoạt lựa chọn thuê phòng theo giờ để nghỉ ngơi ngắn hạn, chờ chuyến bay hoặc thuê theo ngày với mức giá cam kết tốt nhất khu vực trung tâm Quận 1.',
      en: 'Flexible booking options by the hour for short rests and transit, or by the night with the best price guarantee in District 1.'
    },
    image: '/images/facility-1.jpg',
    hours: '24/7',
    location: {
      vi: 'Trực tuyến & Tại quầy',
      en: 'Online & At Front Desk'
    },
    highlights: {
      vi: ['Thuê 2 giờ đầu chỉ từ 120.000 VNĐ', 'Thuê qua đêm chỉ từ 390.000 VNĐ', 'Xác nhận đặt phòng tức thì'],
      en: ['First 2 hours from only 120,000 VND', 'Overnight from 390,000 VND', 'Instant confirmation']
    }
  }
];

export const galleryImages = [
  { id: '1', category: 'rooms', url: '/images/rooms/phong-a.jpg', title: 'Phòng A - Standard Deluxe' },
  { id: '2', category: 'rooms', url: '/images/rooms/phong-ad.jpg', title: 'Phòng AD - Deluxe Triple' },
  { id: '3', category: 'rooms', url: '/images/rooms/phong-b.jpg', title: 'Phòng B - Superior Triple' },
  { id: '4', category: 'rooms', url: '/images/rooms/phong-c.jpg', title: 'Phòng C - Family Suite' },
  { id: '5', category: 'rooms', url: '/images/rooms/phong-d.jpg', title: 'Phòng D - Grand Family' },
  { id: '6', category: 'facilities', url: '/images/hero-1.jpg', title: 'Không gian phòng nghỉ sang trọng' },
  { id: '7', category: 'facilities', url: '/images/hero-2.jpg', title: 'Nội thất gỗ ấm cúng' },
  { id: '8', category: 'facilities', url: '/images/welcome-1.jpg', title: 'Khu vực lưu trú tiện nghi' },
  { id: '9', category: 'facilities', url: '/images/facility-1.jpg', title: 'Sảnh đón tiếp & Hành lang' }
];

export const reviewsData = [
  {
    name: 'Anh Trần Minh Quân',
    location: 'Hà Nội, Việt Nam',
    rating: 5,
    date: 'Tháng 8, 2026',
    comment: 'Khách sạn Galaxy nằm ngay trung tâm Quận 1, đi bộ vài bước là ra phố Tây Bùi Viện và chợ Bến Thành. Phòng sạch sẽ, nước nóng mạnh, lễ tân nhiệt tình 24/24. Giá cả rất hợp lý so với vị trí.',
  },
  {
    name: 'Mr. David Harrison',
    location: 'Sydney, Australia',
    rating: 5,
    date: 'August 2026',
    comment: 'Great location right in the heart of District 1! Extremely friendly staff, clean and cozy room with strong AC and hot shower. Excellent value for money in Saigon.',
  },
  {
    name: 'Chị Lê Ngọc Thảo',
    location: 'Đà Nẵng, Việt Nam',
    rating: 5,
    date: 'Tháng 8, 2026',
    comment: 'Tính năng đặt phòng theo giờ rất tiện lợi cho gia đình tôi trong thời gian chờ chuyến bay đêm. Phòng êm ái, yên tĩnh dù ở ngay khu trung tâm sầm uất.',
  },
  {
    name: 'Nguyễn Văn Hùng',
    location: 'TP. Hồ Chí Minh',
    rating: 5,
    date: 'Tháng 8, 2026',
    comment: 'Khách sạn sạch sẽ, nhân viên thân thiện, giá phòng tốt nhất khu vực Đề Thám. Đã ghé nhiều lần và luôn hài lòng!',
  }
];
