import { Room, ServiceItem } from '../types';

export const roomsData: Room[] = [
  {
    id: 'room-deluxe-double',
    slug: 'deluxe-double',
    name: {
      vi: 'Phòng Hạng Deluxe Double',
      en: 'Deluxe Double Room'
    },
    subtitle: {
      vi: 'Không gian ấm cúng với nội thất gỗ cao cấp và tầm nhìn thoáng đãng',
      en: 'Cozy ambiance with premium wooden furnishings and open city views'
    },
    pricePerNight: 2000000,
    priceHourlyFirst2h: 450000,
    priceHourlyExtra: 120000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 32,
    bedType: {
      vi: '1 Giường Đôi King Size (1.8m x 2.0m)',
      en: '1 King Size Bed (1.8m x 2.0m)'
    },
    view: {
      vi: 'Hướng Phố Sôi Động (City View)',
      en: 'Vibrant City View'
    },
    amenities: {
      vi: ['Bồn tắm nằm cao cấp', 'Smart TV 55" 4K', 'Minibar & Két an toàn', 'Bữa sáng Buffet miễn phí', 'Wifi tốc độ cao', 'Máy pha cafe cao cấp'],
      en: ['Luxury Bathtub', '55" 4K Smart TV', 'Minibar & Safety Box', 'Complimentary Buffet Breakfast', 'High-Speed Wi-Fi', 'Espresso Coffee Machine']
    },
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: {
      vi: 'Phòng Deluxe Double tại Galaxy Hotel là sự kết hợp hoàn hảo giữa thiết kế thanh lịch và tiện nghi hiện đại. Phòng được trang bị bồn tắm riêng biệt, giường nệm cao cấp chuẩn khách sạn 5 sao mang lại giấc ngủ trọn vẹn nhất cho quý khách.',
      en: 'Deluxe Double Room at Galaxy Hotel offers the perfect blend of graceful design and modern comfort. Equipped with a soaking bathtub and a luxury 5-star mattress ensuring your deepest night of sleep.'
    },
    features: {
      vi: ['Miễn phí nhận phòng sớm (tùy tình trạng phòng)', 'Nước uống chào mừng & hoa quả tươi', 'Miễn phí sử dụng Hồ bơi & Gym'],
      en: ['Early check-in subject to availability', 'Welcome drink & fresh fruits', 'Complimentary Gym & Pool access']
    },
    isPopular: true
  },
  {
    id: 'room-superior',
    slug: 'superior-room',
    name: {
      vi: 'Phòng Hạng Superior',
      en: 'Superior Queen Room'
    },
    subtitle: {
      vi: 'Lựa chọn lý tưởng cho các chuyến công tác và kỳ nghỉ ngắn hạn',
      en: 'An ideal choice for business trips and convenient short stays'
    },
    pricePerNight: 1800000,
    priceHourlyFirst2h: 400000,
    priceHourlyExtra: 100000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 28,
    bedType: {
      vi: '1 Giường Đôi Queen Size (1.6m x 2.0m)',
      en: '1 Queen Size Bed (1.6m x 2.0m)'
    },
    view: {
      vi: 'Hướng Giếng Trời Yên Tĩnh (Atrium View)',
      en: 'Quiet Atrium View'
    },
    amenities: {
      vi: ['Phòng tắm đứng vòi sen kính', 'Smart TV 50"', 'Bàn làm việc doanh nhân', 'Bữa sáng Buffet miễn phí', 'Wifi tốc độ cao', 'Ấm đun nước & Trà/Cafe'],
      en: ['Glass Walk-in Rain Shower', '50" Smart TV', 'Executive Work Desk', 'Complimentary Buffet Breakfast', 'High-Speed Wi-Fi', 'Electric Kettle & Tea/Coffee']
    },
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: {
      vi: 'Phòng Superior mang đến không gian tĩnh lặng, tách biệt khỏi sự náo nhiệt của phố thị. Rất thích hợp cho khách hàng cần một không gian nghỉ ngơi thư thái hoặc tập trung làm việc.',
      en: 'Superior Room offers a quiet sanctuary secluded from the bustling city. Highly recommended for business travelers seeking focus and deep restful moments.'
    },
    features: {
      vi: ['Bàn làm việc trang bị ổ cắm đa năng', 'Cách âm tiêu chuẩn cao', 'Miễn phí sử dụng Gym'],
      en: ['Executive desk with universal sockets', 'High-grade soundproofing', 'Complimentary Gym access']
    }
  },
  {
    id: 'room-senior-deluxe',
    slug: 'senior-deluxe',
    name: {
      vi: 'Phòng Hạng Senior Deluxe',
      en: 'Senior Deluxe Room'
    },
    subtitle: {
      vi: 'Tầm nhìn toàn cảnh với cửa sổ kính panorama chạm trần',
      en: 'Panoramic skyline scenery through floor-to-ceiling glass windows'
    },
    pricePerNight: 2200000,
    priceHourlyFirst2h: 500000,
    priceHourlyExtra: 130000,
    maxAdults: 2,
    maxChildren: 1,
    areaSqm: 36,
    bedType: {
      vi: '1 Giường Đôi King Size hoặc 2 Giường Đơn',
      en: '1 King Size Bed or 2 Twin Beds'
    },
    view: {
      vi: 'Tầm Nhìn Đẹp Trên Cao (High Floor View)',
      en: 'High Floor Panoramic View'
    },
    amenities: {
      vi: ['Bồn tắm ngâm thư giãn view phố', 'Smart TV 55" 4K', 'Sofa bọc nỉ thư giãn', 'Bữa sáng Buffet miễn phí', 'Wifi tốc độ cao', 'Áo choàng tắm lụa cao cấp'],
      en: ['Relaxing Soaking Bathtub with View', '55" 4K Smart TV', 'Luxury Chaise Lounge Sofa', 'Complimentary Buffet Breakfast', 'High-Speed Wi-Fi', 'Silk Bathrobes']
    },
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    description: {
      vi: 'Senior Deluxe là hạng phòng cao cấp tại các tầng cao của khách sạn, sở hữu tầm nhìn đắt giá bao quát vẻ đẹp lung linh của thành phố. Thiết kế không gian mở tràn ngập ánh sáng tự nhiên.',
      en: 'Located on the upper floors, Senior Deluxe rooms boast breath-taking vistas of the sparkling city skyline, featuring an open layout bathed in natural daylight.'
    },
    features: {
      vi: ['Tầng cao view đẹp', 'Bồn tắm view kính lãng mạn', 'Miễn phí giặt ủi 02 món/ngày'],
      en: ['Upper floor prestige view', 'Scenic bathtub experience', 'Complimentary laundry for 2 items/day']
    }
  },
  {
    id: 'room-premier-twin',
    slug: 'premier-twin',
    name: {
      vi: 'Phòng Hạng Premier Twin',
      en: 'Premier Twin Room'
    },
    subtitle: {
      vi: 'Hai giường đơn êm ái rộng rãi, lựa chọn hoàn hảo cho đồng nghiệp hoặc bạn bè',
      en: 'Spacious twin bedding configuration, ideal for business colleagues & friends'
    },
    pricePerNight: 3000000,
    priceHourlyFirst2h: 600000,
    priceHourlyExtra: 150000,
    maxAdults: 2,
    maxChildren: 2,
    areaSqm: 40,
    bedType: {
      vi: '2 Giường Đơn Rộng Rãi (1.2m x 2.0m mỗi giường)',
      en: '2 Large Single Beds (1.2m x 2.0m each)'
    },
    view: {
      vi: 'Hướng Thành Phố Góc Rộng (Corner View)',
      en: 'Corner View City Skyline'
    },
    amenities: {
      vi: ['Phòng tắm đứng + Bồn tắm riêng', 'Smart TV 65" 4K', 'Khu vực tiếp khách riêng', 'Bữa sáng Buffet cho 2 người', 'Wifi tốc độ cao', 'Minibar miễn phí đồ uống'],
      en: ['Walk-in Shower + Soaking Tub', '65" 4K Smart TV', 'Dedicated Living Seating', 'Buffet Breakfast for 2', 'High-Speed Wi-Fi', 'Complimentary Minibar Drinks']
    },
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: {
      vi: 'Premier Twin được thiết kế riêng cho những chuyến công tác chung hoặc kỳ nghỉ cùng bạn bè. Hai chiếc giường đơn kích thước lớn với đệm lò xo độc lập mang đến sự thoải mái và riêng tư tối đa.',
      en: 'Premier Twin is crafted for travelers sharing a room without compromising on comfort. Two spacious twin beds with independent pocket springs ensure total relaxation.'
    },
    features: {
      vi: ['2 giường đơn rộng rãi chuẩn xuất khẩu', 'Trang bị 2 bộ bàn ghế thư giãn', 'Ưu đãi dịch vụ Spa 15%'],
      en: ['2 large export-grade beds', 'Dual lounge seating sets', '15% discount on Spa services']
    }
  },
  {
    id: 'room-galaxy-luxury-suite',
    slug: 'galaxy-luxury-suite',
    name: {
      vi: 'Phòng Hạng Galaxy Luxury Suite',
      en: 'Galaxy Luxury Suite'
    },
    subtitle: {
      vi: 'Đỉnh cao xa hoa với phòng khách riêng biệt, ban công view 180 độ',
      en: 'The pinnacle of luxury with a separate living lounge & 180-degree balcony'
    },
    pricePerNight: 3800000,
    priceHourlyFirst2h: 800000,
    priceHourlyExtra: 200000,
    maxAdults: 2,
    maxChildren: 2,
    areaSqm: 58,
    bedType: {
      vi: '1 Giường Super King Size (2.0m x 2.2m)',
      en: '1 Super King Size Bed (2.0m x 2.2m)'
    },
    view: {
      vi: 'Toàn Cảnh Hoàng Hôn & Thành Phố (180° Panoramic View)',
      en: '180° Panoramic Sunset & Skyline'
    },
    amenities: {
      vi: ['Phòng khách và phòng ngủ riêng biệt', 'Bồn sục Jacuzzi đôi massage', 'Hệ thống âm thanh Harman Kardon', 'Bữa sáng phục vụ tại phòng', 'Dịch vụ quản gia riêng', 'Xe đưa đón sân bay miễn phí'],
      en: ['Separate Living Lounge & Bedroom', 'Double Jacuzzi Hydrotherapy Tub', 'Harman Kardon Sound System', 'In-room Champagne Breakfast', 'Private Butler Service', 'Complimentary Airport Transfer']
    },
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    description: {
      vi: 'Galaxy Luxury Suite là biểu tượng xa hoa bậc nhất của khách sạn Galaxy. Với diện tích rộng 58m2, bao gồm phòng khách thượng lưu, phòng tắm lát đá cẩm thạch với bồn sục Jacuzzi và ban công riêng biệt.',
      en: 'Galaxy Luxury Suite is the hallmark of luxury at Galaxy Hotel. Spanning 58sqm, it features an executive private living room, Italian marble bathroom with Jacuzzi tub, and a private skyline terrace.'
    },
    features: {
      vi: ['Đưa đón sân bay 2 chiều bằng xe sang', 'Bữa sáng tại phòng hoặc nhà hàng tùy chọn', 'Đặc quyền check-out muộn tới 15:00'],
      en: ['Roundtrip luxury airport transfer', 'Flexible breakfast in-room or restaurant', 'Complimentary late check-out till 15:00']
    },
    isPopular: true
  }
];

export const servicesData: ServiceItem[] = [
  {
    id: 'service-dining',
    title: {
      vi: 'Nhà Hàng Galaxy Sky Dining',
      en: 'Galaxy Sky Dining Restaurant'
    },
    description: {
      vi: 'Trải nghiệm ẩm thực phong phú với bữa sáng tự chọn thịnh soạn và thực đơn À la carte đặc sắc quy tụ tinh hoa ẩm thực Việt Nam và quốc tế.',
      en: 'Indulge in a rich culinary adventure with an extravagant buffet breakfast and curated À la carte delicacies celebrating Vietnamese and international flavors.'
    },
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    hours: '06:00 - 22:30',
    location: {
      vi: 'Tầng 12 - Rooftop Galaxy',
      en: '12th Floor - Galaxy Rooftop'
    },
    highlights: {
      vi: ['Buffet sáng hơn 60 món', 'Tầm nhìn 360 độ ngắm toàn cảnh thành phố', 'Rượu vang & Cocktail thượng hạng'],
      en: ['60+ Item Breakfast Buffet', '360° Panoramic Skyline Views', 'Curated Wine & Signature Cocktails']
    }
  },
  {
    id: 'service-gym',
    title: {
      vi: 'Galaxy Fitness & Gym Center',
      en: 'Galaxy Fitness & Gym Center'
    },
    description: {
      vi: 'Phòng gym hiện đại trang bị đầy đủ máy chạy bộ, xe đạp cardio, dàn tạ đa năng thương hiệu Technogym, mở cửa miễn phí cho khách lưu trú.',
      en: 'Contemporary gym fully equipped with Technogym cardio treadmills, elliptical trainers, and multi-functional weight stations, free for in-house guests.'
    },
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    hours: '06:00 - 22:00',
    location: {
      vi: 'Tầng 3',
      en: '3rd Floor'
    },
    highlights: {
      vi: ['Máy tập Technogym nhập khẩu Ý', 'Khăn lạnh & nước khoáng miễn phí', 'Huấn luyện viên hỗ trợ theo yêu cầu'],
      en: ['Italian Technogym Equipment', 'Complimentary Chilled Towels & Water', 'Personal Trainer on request']
    }
  },
  {
    id: 'service-spa',
    title: {
      vi: 'Galaxy Wellness & Spa',
      en: 'Galaxy Wellness & Spa'
    },
    description: {
      vi: 'Thả lỏng cơ thể trong không gian thoảng hương trầm ấm, trải nghiệm các liệu pháp massage đá nóng, xông hơi đá muối thải độc chuyên sâu.',
      en: 'Surrender your senses to soothing herbal aromas, enjoying therapeutic hot stone body treatments and Himalayan salt steam detox.'
    },
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    hours: '09:00 - 23:00',
    location: {
      vi: 'Tầng 4',
      en: '4th Floor'
    },
    highlights: {
      vi: ['Tinh dầu organic nhập khẩu Pháp', 'Phòng xông đá muối riêng biệt', 'Kỹ thuật viên tay nghề 10+ năm kinh nghiệm'],
      en: ['Organic French Essential Oils', 'Private Himalayan Salt Sauna', 'Certified therapists with 10+ yrs experience']
    }
  },
  {
    id: 'service-pool',
    title: {
      vi: 'Bể Bơi Vô Cực Trên Cao',
      en: 'Rooftop Infinity Pool'
    },
    description: {
      vi: 'Bể bơi tràn bờ trên tầng thượng với làn nước ấm trong vắt, quầy bar phục vụ mocktail tươi mát và giường nằm tắm nắng thư thái.',
      en: 'Rooftop infinity swimming pool with temperature-regulated crystal waters, poolside sun loungers, and refreshing artisanal cocktails.'
    },
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    hours: '06:00 - 21:00',
    location: {
      vi: 'Tầng Thượng (Rooftop)',
      en: 'Rooftop Skydeck'
    },
    highlights: {
      vi: ['Nước điện phân muối an toàn cho da', 'Check-in hoàng hôn tuyệt đẹp', 'Pool Bar phục vụ đồ uống tươi'],
      en: ['Salt-electrolyzed skin-friendly water', 'Stunning sunset photo spots', 'Pool Bar with fresh refreshments']
    }
  }
];

export const galleryImages = [
  { id: '1', category: 'rooms', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', title: 'Deluxe Room' },
  { id: '2', category: 'rooms', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', title: 'Luxury Suite' },
  { id: '3', category: 'dining', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', title: 'Sky Dining' },
  { id: '4', category: 'dining', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', title: 'Gourmet Cuisine' },
  { id: '5', category: 'facilities', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', title: 'Gym Center' },
  { id: '6', category: 'facilities', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80', title: 'Infinity Pool' },
  { id: '7', category: 'facilities', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', title: 'Wellness Spa' },
  { id: '8', category: 'rooms', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', title: 'Premier Twin' },
];

export const reviewsData = [
  {
    name: 'Anh Trần Minh Quân',
    location: 'Hà Nội, Việt Nam',
    rating: 5,
    date: 'Tháng 8, 2026',
    comment: 'Khách sạn Galaxy thực sự làm tôi bất ngờ về độ sang trọng và chất lượng dịch vụ. Phòng sạch sẽ, view ngắm hoàng hôn rất đẹp. Nhân viên lễ tân nhiệt tình hỗ trợ check-in nhanh gọn.',
  },
  {
    name: 'Mr. David Harrison',
    location: 'Sydney, Australia',
    rating: 5,
    date: 'August 2026',
    comment: 'Fantastic stay in District 1! The breakfast buffet was exceptionally good with both authentic Vietnamese pho and Western pastries. The rooftop pool offers breathtaking skyline views.',
  },
  {
    name: 'Chị Lê Ngọc Thảo',
    location: 'Đà Nẵng, Việt Nam',
    rating: 5,
    date: 'Tháng 8, 2026',
    comment: 'Tính năng đặt phòng theo giờ rất tiện lợi cho gia đình tôi trong thời gian chờ chuyến bay đêm. Phòng êm ái, bồn tắm sục Jacuzzi giúp giải tỏa mệt mỏi tuyệt vời.',
  }
];
