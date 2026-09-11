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
    id: 'phong-don-tiet-kiem',
    slug: 'phong-don-tiet-kiem',
    name: {
      vi: 'Phòng Đơn Tiết Kiệm',
      en: 'Budget Single Room'
    },
    subtitle: {
      vi: 'Không gian ấm cúng, yên tĩnh và đầy đủ tiện nghi với mức giá siêu tiết kiệm cho 1 người',
      en: 'Cozy, quiet and fully equipped space at an ultra-budget rate for 1 guest'
    },
    pricePerNight: 400000,
    priceHourlyFirst2h: 200000,
    priceHourlyExtra: 50000,
    maxAdults: 1,
    maxChildren: 0,
    areaSqm: 12,
    bedType: {
      vi: '1 Giường Đơn Tiêu Chuẩn',
      en: '1 Single Bed'
    },
    view: {
      vi: 'Không gian yên tĩnh trong nhà',
      en: 'Quiet Indoor Ambience'
    },
    amenities: {
      vi: ['Máy lạnh Inverter', 'TV', 'Wifi cáp quang', 'Tủ lạnh minibar', 'Phòng tắm riêng', 'Nước nóng 24/7'],
      en: ['Inverter AC', 'TV', 'High-Speed Wi-Fi', 'Minibar Fridge', 'Private Bathroom', '24/7 Hot Water']
    },
    images: [
      '/images/rooms/phong-a.jpg',
      '/images/rooms/phong-ad.jpg'
    ],
    description: {
      vi: 'Phòng Đơn Tiết Kiệm là lựa chọn kinh tế hàng đầu cho khách du lịch một mình hoặc khách đi công tác ngắn ngày ngay trung tâm Quận 1.',
      en: 'Budget Single Room is the best economic option for solo travelers or short business trips right in central District 1.'
    },
    features: {
      vi: ['Mức giá tiết kiệm nhất Quận 1', 'Yên tĩnh không tiếng ồn phố thị', 'Đầy đủ tiện nghi cơ bản'],
      en: ['Best budget rate in District 1', 'Quiet from street noise', 'Complete essential amenities']
    },
    isPopular: true
  },
  {
    id: 'phong-doi-khong-cua-so',
    slug: 'phong-doi-khong-cua-so',
    name: {
      vi: 'Phòng Đôi Không Cửa Sổ',
      en: 'Standard Double Room (No Window)'
    },
    subtitle: {
      vi: 'Thiết kế tinh tế, không gian yên tĩnh và tiện nghi hoàn hảo cho kỳ nghỉ trọn vẹn',
      en: 'Refined design, quiet space and full amenities for a complete holiday'
    },
    pricePerNight: 450000,
    priceHourlyFirst2h: 200000,
    priceHourlyExtra: 50000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 14,
    bedType: {
      vi: '1 Giường Đôi Queen (1.6m x 2.0m)',
      en: '1 Queen Double Bed (1.6m x 2.0m)'
    },
    view: {
      vi: 'Yên tĩnh tuyệt đối trong nhà',
      en: 'Total Indoor Tranquility'
    },
    amenities: {
      vi: ['Máy lạnh Inverter', 'Smart TV', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Phòng tắm nóng lạnh', 'Khăn tắm cao cấp'],
      en: ['Inverter AC', 'Smart TV', 'High-Speed Wi-Fi', 'Minibar Fridge', 'Hot Shower', 'Premium Towels']
    },
    images: [
      '/images/rooms/phong-a.jpg',
      '/images/rooms/phong-ad.jpg'
    ],
    description: {
      vi: 'Phòng Đôi Không Cửa Sổ mang lại trải nghiệm lưu trú ấm cúng cho 2 người với chi phí tối ưu, không gian yên tĩnh giúp bạn có giấc ngủ sâu.',
      en: 'Standard Double Room offers a cozy stay for 2 at an optimized rate, ensuring deep restful sleep.'
    },
    features: {
      vi: ['Giá cả hợp lý cho 2 người', 'Sạch sẽ thơm tho mỗi ngày', 'Check-in nhanh chóng'],
      en: ['Affordable rate for 2 guests', 'Fresh & clean daily', 'Express check-in']
    }
  },
  {
    id: 'phong-doi-co-cua-so',
    slug: 'phong-doi-co-cua-so',
    name: {
      vi: 'Phòng Đôi Có Cửa Sổ',
      en: 'Deluxe Double Room (With Window)'
    },
    subtitle: {
      vi: 'Không gian sáng thoáng, cửa sổ đón ánh sáng tự nhiên và gió trời trong lành cho 2 người',
      en: 'Bright and airy space with natural daylight and fresh breeze window for 2 guests'
    },
    pricePerNight: 600000,
    priceHourlyFirst2h: 250000,
    priceHourlyExtra: 60000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 16,
    bedType: {
      vi: '1 Giường Đôi Queen (1.6m x 2.0m)',
      en: '1 Queen Double Bed (1.6m x 2.0m)'
    },
    view: {
      vi: 'Cửa sổ đón ánh sáng tự nhiên',
      en: 'Natural Daylight Window'
    },
    amenities: {
      vi: ['Máy lạnh Inverter', 'Smart TV 43 inch', 'Wifi cáp quang', 'Tủ quần áo', 'Tủ lạnh minibar', 'Phòng tắm riêng biệt'],
      en: ['Inverter AC', '43" Smart TV', 'Fiber Wi-Fi', 'Wardrobe', 'Minibar Fridge', 'Private Bathroom']
    },
    images: [
      '/images/rooms/phong-b.jpg',
      '/images/rooms/phong-a.jpg'
    ],
    description: {
      vi: 'Phòng Đôi Có Cửa Sổ sở hữu khung cửa sổ sáng thoáng đón nắng sáng, tạo cảm giác thư thái và dễ chịu trong suốt kỳ nghỉ tại Sài Gòn.',
      en: 'Deluxe Double Room features natural daylight window creating a refreshing atmosphere throughout your stay.'
    },
    features: {
      vi: ['Cửa sổ thoáng mát đón nắng', 'Nước suối miễn phí hàng ngày', 'Dọn phòng sạch sẽ'],
      en: ['Airy daylight window', 'Complimentary bottled water', 'Daily housekeeping']
    },
    isPopular: true
  },
  {
    id: 'phong-may-chieu',
    slug: 'phong-may-chieu',
    name: {
      vi: 'Phòng Hạng Sang Có Máy Chiếu',
      en: 'Cinema Projector Deluxe Suite'
    },
    subtitle: {
      vi: 'Không gian lãng mạn, trang bị máy chiếu 100 inch Full HD & Netflix 4K riêng tư cho 2 người',
      en: 'Romantic ambiance with 100-inch Full HD Projector & 4K Netflix for 2 guests'
    },
    pricePerNight: 700000,
    priceHourlyFirst2h: 300000,
    priceHourlyExtra: 70000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 18,
    bedType: {
      vi: '1 Giường Đôi King Size (1.8m x 2.0m)',
      en: '1 King Size Double Bed (1.8m x 2.0m)'
    },
    view: {
      vi: 'Không gian rạp chiếu phim ấm cúng',
      en: 'Cozy Cinema Space'
    },
    amenities: {
      vi: ['Máy chiếu Full HD 100 inch', 'Netflix Premium 4K', 'Máy lạnh Inverter', 'Loa âm thanh vòm', 'Wifi tốc độ cao', 'Tủ lạnh minibar'],
      en: ['100" Full HD Projector', 'Free Netflix 4K', 'Inverter AC', 'Surround Sound', 'High-Speed Wi-Fi', 'Minibar']
    },
    images: [
      '/images/rooms/phong-may-chieu.jpg',
      '/images/welcome-1.jpg',
      '/images/hero-2.jpg'
    ],
    description: {
      vi: 'Hạng phòng độc đáo duy nhất tại Galaxy Boutique Hotel! Máy chiếu 100 inch và âm thanh sống động mang lại trải nghiệm xem phim rạp riêng tư tuyệt hảo.',
      en: 'Exclusive cinema room at Galaxy Boutique Hotel with 100-inch screen and surround audio for the ultimate movie night.'
    },
    features: {
      vi: ['Trải nghiệm rạp chiếu phim tại phòng', 'Tài khoản Netflix có sẵn', 'Check-in riêng tư'],
      en: ['In-room cinema experience', 'Complimentary Netflix 4K', 'Private check-in']
    },
    isPopular: true
  },
  {
    id: 'phong-giuong-tang',
    slug: 'phong-giuong-tang',
    name: {
      vi: 'Phòng Giường Tầng Tiết Kiệm',
      en: 'Cozy Bunk Bed Room'
    },
    subtitle: {
      vi: 'Thiết kế giường tầng hiện đại, không gian trẻ trung và tiện nghi cho 2 bạn',
      en: 'Modern bunk bed design, youthful and convenient space for 2 friends'
    },
    pricePerNight: 450000,
    priceHourlyFirst2h: 200000,
    priceHourlyExtra: 50000,
    maxAdults: 2,
    maxChildren: 0,
    areaSqm: 12,
    bedType: {
      vi: '1 Giường Tầng (2 Giường 1.0m x 2.0m)',
      en: '1 Bunk Bed (2 Single Beds)'
    },
    view: {
      vi: 'Yên tĩnh bên trong',
      en: 'Quiet Indoor Ambience'
    },
    amenities: {
      vi: ['Máy lạnh Inverter', 'Smart TV', 'Wifi tốc độ cao', 'Tủ lạnh mini', 'Phòng tắm riêng', 'Nước nóng 24/7'],
      en: ['Inverter AC', 'Smart TV', 'High-Speed Wi-Fi', 'Mini Fridge', 'Private Bath', '24/7 Hot Water']
    },
    images: [
      '/images/rooms/phong-a.jpg',
      '/images/rooms/phong-b.jpg'
    ],
    description: {
      vi: 'Phòng Giường Tầng Tiết Kiệm được thiết kế thông minh, tối ưu diện tích và cực kỳ phù hợp cho nhóm bạn 2 người muốn tiết kiệm chi phí.',
      en: 'Smartly designed bunk bed room optimized for 2 friends traveling on a budget.'
    },
    features: {
      vi: ['Tối ưu chi phí cho đôi bạn', 'Giường nệm êm ái', 'Lễ tân 24/7'],
      en: ['Cost-effective for 2 friends', 'Comfortable mattresses', '24/7 Support']
    }
  },
  {
    id: 'phong-3-nguoi-tiet-kiem',
    slug: 'phong-3-nguoi-tiet-kiem',
    name: {
      vi: 'Phòng 3 Người Tiết Kiệm',
      en: 'Budget Triple Room'
    },
    subtitle: {
      vi: 'Không gian rộng rãi, trang bị 1 giường đôi + 1 giường đơn êm ái cho 3 người',
      en: 'Spacious layout with 1 double bed + 1 single bed for 3 guests'
    },
    pricePerNight: 670000,
    priceHourlyFirst2h: 250000,
    priceHourlyExtra: 60000,
    maxAdults: 3,
    maxChildren: 1,
    areaSqm: 18,
    bedType: {
      vi: '1 Giường Đôi Tiêu Chuẩn + 1 Giường Đơn',
      en: '1 Double Bed + 1 Single Bed'
    },
    view: {
      vi: 'Cửa sổ thoáng mát',
      en: 'Airy Breeze Window'
    },
    amenities: {
      vi: ['Máy lạnh Inverter', 'TV', 'Wifi cáp quang', 'Tủ quần áo', 'Tủ lạnh minibar', 'Phòng tắm đứng riêng biệt', 'Két sắt'],
      en: ['Inverter AC', 'TV', 'Fiber Wi-Fi', 'Wardrobe', 'Minibar Fridge', 'Private Shower', 'Safe Box']
    },
    images: [
      '/images/rooms/phong-ad.jpg',
      '/images/rooms/phong-a.jpg'
    ],
    description: {
      vi: 'Phòng 3 Người Tiết Kiệm sở hữu không gian 18m² với 1 giường đôi và 1 giường đơn, rất phù hợp cho gia đình nhỏ hoặc nhóm 3 bạn.',
      en: 'Budget Triple Room features 18sqm with 1 double and 1 single bed, perfect for small families or 3 friends.'
    },
    features: {
      vi: ['Sức chứa 3 người thoải mái', 'Dọn phòng mỗi ngày', 'Giữ hành lý miễn phí'],
      en: ['Comfortable for 3 guests', 'Daily housekeeping', 'Free luggage storage']
    },
    isPopular: true
  },
  {
    id: 'phong-3-nguoi-ban-cong',
    slug: 'phong-3-nguoi-ban-cong',
    name: {
      vi: 'Phòng 3 Người Có View Ban Công',
      en: 'Triple Room with Balcony View'
    },
    subtitle: {
      vi: 'Ban công thoáng mát ngắm phố Quận 1, 1 giường đôi King + 1 giường đơn cao cấp',
      en: 'Scenic balcony overlooking District 1 streets, 1 King bed + 1 single bed'
    },
    pricePerNight: 750000,
    priceHourlyFirst2h: 280000,
    priceHourlyExtra: 60000,
    maxAdults: 3,
    maxChildren: 1,
    areaSqm: 20,
    bedType: {
      vi: '1 Giường Đôi King + 1 Giường Đơn',
      en: '1 King Bed + 1 Single Bed'
    },
    view: {
      vi: 'Ban công ngắm phố Quận 1',
      en: 'District 1 Street View Balcony'
    },
    amenities: {
      vi: ['Ban công riêng ngắm phố', 'Máy lạnh Inverter', 'Smart TV', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Bàn ghế ban công'],
      en: ['Private Balcony', 'Inverter AC', 'Smart TV', 'High-Speed Wi-Fi', 'Minibar Fridge', 'Balcony Chairs']
    },
    images: [
      '/images/rooms/phong-b.jpg',
      '/images/rooms/phong-ad.jpg'
    ],
    description: {
      vi: 'Phòng 3 Người Có View Ban Công mang đến góc ngắm phố Quận 1 tuyệt đẹp, không gian thoáng đãng và tiện nghi cao cấp.',
      en: 'Triple Room with Balcony offers a scenic street view of District 1 with upscale amenities.'
    },
    features: {
      vi: ['Ban công thoáng mát ngắm phố', 'Nước suối miễn phí', 'Check-in linh hoạt'],
      en: ['Scenic private balcony', 'Complimentary bottled water', 'Flexible check-in']
    },
    isPopular: true
  },
  {
    id: 'phong-gia-dinh-4-nguoi',
    slug: 'phong-gia-dinh-4-nguoi',
    name: {
      vi: 'Phòng Gia Đình 4 Người',
      en: 'Family Room for 4'
    },
    subtitle: {
      vi: '2 giường đôi tiêu chuẩn rộng rãi, bố trí tiện nghi khoa học cho gia đình 4 người',
      en: '2 spacious double beds thoughtfully arranged for a family of 4'
    },
    pricePerNight: 900000,
    priceHourlyFirst2h: 350000,
    priceHourlyExtra: 70000,
    maxAdults: 4,
    maxChildren: 1,
    areaSqm: 22,
    bedType: {
      vi: '2 Giường Đôi Queen (1.6m x 2.0m)',
      en: '2 Queen Beds (1.6m x 2.0m)'
    },
    view: {
      vi: 'Cửa sổ thông gió mát mẻ',
      en: 'Fresh Breeze Window'
    },
    amenities: {
      vi: ['2 Giường đôi êm ái', 'Máy lạnh làm lạnh nhanh', 'Smart TV', 'Wifi riêng biệt', 'Tủ lạnh minibar', 'Phòng tắm đứng'],
      en: ['2 Double Beds', 'Fast Cooling AC', 'Smart TV', 'Dedicated Wi-Fi', 'Minibar Fridge', 'Private Shower']
    },
    images: [
      '/images/rooms/phong-d.jpg',
      '/images/rooms/phong-c.jpg'
    ],
    description: {
      vi: 'Phòng Gia Đình 4 Người là lựa chọn lý tưởng cho các gia đình có con nhỏ hoặc nhóm 4 bạn du lịch cùng nhau.',
      en: 'Family Room for 4 is the ideal choice for families with children or a group of 4 friends.'
    },
    features: {
      vi: ['Phù hợp gia đình 4 người', 'Nước suối miễn phí', 'Lễ tân 24/7'],
      en: ['Ideal for family of 4', 'Free bottled water', '24/7 Front desk']
    },
    isPopular: true
  },
  {
    id: 'phong-nhom-6-nguoi',
    slug: 'phong-nhom-6-nguoi',
    name: {
      vi: 'Phòng Nhóm 6 Người',
      en: 'Grand Group Suite for 6'
    },
    subtitle: {
      vi: 'Không gian gia đình rộng 28m², 3 giường đôi lớn cho tối đa 6 người lưu trú',
      en: 'Expansive 28sqm suite with 3 large double beds accommodating up to 6 guests'
    },
    pricePerNight: 1200000,
    priceHourlyFirst2h: 450000,
    priceHourlyExtra: 80000,
    maxAdults: 6,
    maxChildren: 2,
    areaSqm: 28,
    bedType: {
      vi: '3 Giường Đôi Tiêu Chuẩn (1.6m x 2.0m)',
      en: '3 Standard Double Beds (1.6m x 2.0m)'
    },
    view: {
      vi: 'Cửa sổ lớn toàn cảnh thoáng đãng',
      en: 'Large Scenic Panoramic Window'
    },
    amenities: {
      vi: ['3 Giường đôi lớn cao cấp', 'Smart TV 55 inch 4K', 'Wifi cáp quang tốc độ cao', 'Tủ lạnh lớn', 'Ấm siêu tốc', 'Phòng tắm rộng rãi'],
      en: ['3 Large Luxury Beds', '55" 4K Smart TV', 'Ultra-fast Wi-Fi', 'Large Refrigerator', 'Kettle', 'Spacious Bathroom']
    },
    images: [
      '/images/rooms/phong-c.jpg',
      '/images/rooms/phong-d.jpg'
    ],
    description: {
      vi: 'Phòng Nhóm 6 Người sở hữu diện tích rộng 28m² với 3 giường đôi lớn, mang lại không gian quây quần ấm cúng và tiết kiệm chi phí tối đa cho đoàn đông người.',
      en: 'Grand Group Suite features 28sqm with 3 large double beds offering cozy togetherness and maximum cost-efficiency.'
    },
    features: {
      vi: ['Sức chứa lên tới 6 người lớn', 'Không gian rộng rãi nhất khách sạn', 'Hỗ trợ check-in sớm linh hoạt'],
      en: ['Accommodates up to 6 adults', 'Most spacious layout in the hotel', 'Flexible early check-in']
    },
    isPopular: true
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
      vi: 'Dịch vụ giữ hành lý an toàn, tiện lợi trước giờ nhận phòng hoặc sau khi trả phòng, giúp bạn thoải mái dạo chơi Sài Gòn mà không phải mang vác nặng.',
      en: 'Secure, complimentary luggage storage before check-in or after check-out, letting you explore the city hands-free.'
    },
    image: '/images/welcome-1.jpg',
    hours: '24/7 Miễn Phí',
    location: {
      vi: 'Khu Vực Giữ Đồ Tại Sảnh',
      en: 'Lobby Luggage Area'
    },
    highlights: {
      vi: ['Miễn phí 100% cho mọi khách lưu trú', 'Camera an ninh giám sát 24/24', 'Thẻ gửi đồ có mã số riêng biệt'],
      en: ['100% Free for all staying guests', '24/7 CCTV surveillance', 'Numbered luggage tags']
    }
  },
  {
    id: 'service-cleaning',
    title: {
      vi: 'Dọn Phòng & Khử Khuẩn Chuẩn',
      en: 'Daily Housekeeping & Sanitization'
    },
    description: {
      vi: 'Phòng nghỉ luôn được dọn dẹp sạch sẽ, thay mới ga trải giường, vỏ gối và khăn tắm 100% cotton mỗi ngày, đảm bảo vệ sinh tuyệt đối.',
      en: 'Rooms are thoroughly cleaned daily with fresh linens, pillowcases, and 100% cotton towels replaced, ensuring pristine hygiene.'
    },
    image: '/images/welcome-2.jpg',
    hours: '08:00 - 17:00 Hàng Ngày',
    location: {
      vi: 'Tất Cả Các Tầng Phòng',
      en: 'All Guest Floors'
    },
    highlights: {
      vi: ['Thay mới khăn tắm & drap giường', 'Khử khuẩn phòng tắm sạch bóng', 'Bổ sung nước suối & đồ amenities'],
      en: ['Fresh towels & bedsheets daily', 'Deep sanitized bathrooms', 'Complimentary water & amenities refill']
    }
  }
];
