<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - ROOMS REST API (PURE JSON ENGINE)
// Lưu trữ và quản lý danh sách phòng độc lập 100% bằng JSON
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

function getPossibleRoomsFiles() {
    $webRoot = dirname(__DIR__);
    return [
        $webRoot . '/uploads/rooms.json',
        __DIR__ . '/data/rooms.json',
        __DIR__ . '/rooms.json'
    ];
}

function saveRoomsBackup($roomsList) {
    $encoded = json_encode(array_values($roomsList), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    foreach (getPossibleRoomsFiles() as $path) {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($path, $encoded, LOCK_EX);
    }
}

function loadRoomsBackup() {
    foreach (getPossibleRoomsFiles() as $path) {
        if (file_exists($path)) {
            $content = @file_get_contents($path);
            if ($content) {
                $data = json_decode($content, true);
                if (is_array($data) && count($data) > 0) {
                    return $data;
                }
            }
        }
    }
    return null;
}

// 9 Hạng phòng chuẩn thực tế của Galaxy Boutique Hotel
$defaultRoomsSeed = [
    [
        'id' => 'phong-don-tiet-kiem',
        'slug' => 'phong-don-tiet-kiem',
        'name' => ['vi' => 'Phòng Đơn Tiết Kiệm', 'en' => 'Budget Single Room'],
        'subtitle' => ['vi' => 'Không gian ấm cúng, yên tĩnh và đầy đủ tiện nghi với mức giá siêu tiết kiệm cho 1 người', 'en' => 'Cozy, quiet and fully equipped space at an ultra-budget rate for 1 guest'],
        'description' => ['vi' => 'Phòng Đơn Tiết Kiệm là lựa chọn kinh tế hàng đầu cho khách du lịch một mình hoặc khách đi công tác ngắn ngày ngay trung tâm Quận 1.', 'en' => 'Budget Single Room is the best economic option for solo travelers or short business trips.'],
        'pricePerNight' => 400000,
        'priceHourlyFirst2h' => 200000,
        'priceHourlyExtra' => 50000,
        'maxAdults' => 1,
        'maxChildren' => 0,
        'areaSqm' => 12,
        'bedType' => ['vi' => '1 Giường Đơn Tiêu Chuẩn', 'en' => '1 Single Bed'],
        'view' => ['vi' => 'Không gian yên tĩnh trong nhà', 'en' => 'Quiet Indoor Ambience'],
        'amenities' => [
            'vi' => ['Máy lạnh Inverter', 'TV', 'Wifi cáp quang', 'Tủ lạnh minibar', 'Phòng tắm riêng', 'Nước nóng 24/7'],
            'en' => ['Inverter AC', 'TV', 'High-Speed Wi-Fi', 'Minibar Fridge', 'Private Bathroom', '24/7 Hot Water']
        ],
        'features' => [
            'vi' => ['Mức giá tiết kiệm nhất Quận 1', 'Yên tĩnh không tiếng ồn phố thị', 'Đầy đủ tiện nghi cơ bản'],
            'en' => ['Best budget rate in District 1', 'Quiet from street noise', 'Complete essential amenities']
        ],
        'images' => ['/images/rooms/phong-a.jpg', '/images/rooms/phong-ad.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 3
    ],
    [
        'id' => 'phong-doi-khong-cua-so',
        'slug' => 'phong-doi-khong-cua-so',
        'name' => ['vi' => 'Phòng Đôi Không Cửa Sổ', 'en' => 'Standard Double Room (No Window)'],
        'subtitle' => ['vi' => 'Thiết kế tinh tế, không gian yên tĩnh và tiện nghi hoàn hảo cho kỳ nghỉ trọn vẹn', 'en' => 'Refined design, quiet space and full amenities for a complete holiday'],
        'description' => ['vi' => 'Phòng Đôi Không Cửa Sổ mang lại trải nghiệm lưu trú ấm cúng cho 2 người với chi phí tối ưu, không gian yên tĩnh giúp bạn có giấc ngủ sâu.', 'en' => 'Standard Double Room offers a cozy stay for 2 at an optimized rate.'],
        'pricePerNight' => 450000,
        'priceHourlyFirst2h' => 200000,
        'priceHourlyExtra' => 50000,
        'maxAdults' => 2,
        'maxChildren' => 1,
        'areaSqm' => 14,
        'bedType' => ['vi' => '1 Giường Đôi Queen (1.6m x 2.0m)', 'en' => '1 Queen Double Bed (1.6m x 2.0m)'],
        'view' => ['vi' => 'Yên tĩnh tuyệt đối trong nhà', 'en' => 'Total Indoor Tranquility'],
        'amenities' => [
            'vi' => ['Máy lạnh Inverter', 'Smart TV', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Phòng tắm nóng lạnh', 'Khăn tắm cao cấp'],
            'en' => ['Inverter AC', 'Smart TV', 'High-Speed Wi-Fi', 'Minibar Fridge', 'Hot Shower', 'Premium Towels']
        ],
        'features' => [
            'vi' => ['Giá cả hợp lý cho 2 người', 'Sạch sẽ thơm tho mỗi ngày', 'Check-in nhanh chóng'],
            'en' => ['Affordable rate for 2 guests', 'Fresh & clean daily', 'Express check-in']
        ],
        'images' => ['/images/rooms/phong-a.jpg', '/images/rooms/phong-ad.jpg'],
        'status' => 'available',
        'isPopular' => false,
        'totalInventory' => 5
    ],
    [
        'id' => 'phong-doi-co-cua-so',
        'slug' => 'phong-doi-co-cua-so',
        'name' => ['vi' => 'Phòng Đôi Có Cửa Sổ', 'en' => 'Deluxe Double Room (With Window)'],
        'subtitle' => ['vi' => 'Không gian sáng thoáng, cửa sổ đón ánh sáng tự nhiên và gió trời trong lành cho 2 người', 'en' => 'Bright and airy space with natural daylight and fresh breeze window for 2 guests'],
        'description' => ['vi' => 'Phòng Đôi Có Cửa Sổ sở hữu khung cửa sổ sáng thoáng đón nắng sáng, tạo cảm giác thư thái và dễ chịu trong suốt kỳ nghỉ tại Sài Gòn.', 'en' => 'Deluxe Double Room features natural daylight window creating a refreshing atmosphere.'],
        'pricePerNight' => 600000,
        'priceHourlyFirst2h' => 250000,
        'priceHourlyExtra' => 60000,
        'maxAdults' => 2,
        'maxChildren' => 1,
        'areaSqm' => 16,
        'bedType' => ['vi' => '1 Giường Đôi Queen (1.6m x 2.0m)', 'en' => '1 Queen Double Bed (1.6m x 2.0m)'],
        'view' => ['vi' => 'Cửa sổ đón ánh sáng tự nhiên', 'en' => 'Natural Daylight Window'],
        'amenities' => [
            'vi' => ['Máy lạnh Inverter', 'Smart TV 43 inch', 'Wifi cáp quang', 'Tủ quần áo', 'Tủ lạnh minibar', 'Phòng tắm riêng biệt'],
            'en' => ['Inverter AC', '43" Smart TV', 'Fiber Wi-Fi', 'Wardrobe', 'Minibar Fridge', 'Private Bathroom']
        ],
        'features' => [
            'vi' => ['Cửa sổ thoáng mát đón nắng', 'Nước suối miễn phí hàng ngày', 'Dọn phòng sạch sẽ'],
            'en' => ['Airy daylight window', 'Complimentary bottled water', 'Daily housekeeping']
        ],
        'images' => ['/images/rooms/phong-b.jpg', '/images/rooms/phong-a.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 5
    ],
    [
        'id' => 'phong-may-chieu',
        'slug' => 'phong-may-chieu',
        'name' => ['vi' => 'Phòng Hạng Sang Có Máy Chiếu', 'en' => 'Cinema Projector Deluxe Suite'],
        'subtitle' => ['vi' => 'Không gian lãng mạn, trang bị máy chiếu 100 inch Full HD & Netflix 4K riêng tư cho 2 người', 'en' => 'Romantic ambiance with 100-inch Full HD Projector & 4K Netflix for 2 guests'],
        'description' => ['vi' => 'Hạng phòng độc đáo duy nhất tại Galaxy Boutique Hotel! Máy chiếu 100 inch và âm thanh sống động mang lại trải nghiệm xem phim rạp riêng tư tuyệt hảo.', 'en' => 'Exclusive cinema room at Galaxy Boutique Hotel with 100-inch screen and surround audio.'],
        'pricePerNight' => 700000,
        'priceHourlyFirst2h' => 300000,
        'priceHourlyExtra' => 70000,
        'maxAdults' => 2,
        'maxChildren' => 1,
        'areaSqm' => 18,
        'bedType' => ['vi' => '1 Giường Đôi King Size (1.8m x 2.0m)', 'en' => '1 King Size Double Bed (1.8m x 2.0m)'],
        'view' => ['vi' => 'Không gian rạp chiếu phim ấm cúng', 'en' => 'Cozy Cinema Space'],
        'amenities' => [
            'vi' => ['Máy chiếu Full HD 100 inch', 'Netflix Premium 4K', 'Máy lạnh Inverter', 'Loa âm thanh vòm', 'Wifi tốc độ cao', 'Tủ lạnh minibar'],
            'en' => ['100" Full HD Projector', 'Free Netflix 4K', 'Inverter AC', 'Surround Sound', 'High-Speed Wi-Fi', 'Minibar']
        ],
        'features' => [
            'vi' => ['Trải nghiệm rạp chiếu phim tại phòng', 'Tài khoản Netflix có sẵn', 'Check-in riêng tư'],
            'en' => ['In-room cinema experience', 'Complimentary Netflix 4K', 'Private check-in']
        ],
        'images' => ['/images/rooms/phong-may-chieu.jpg', '/images/welcome-1.jpg', '/images/hero-2.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 2
    ],
    [
        'id' => 'phong-giuong-tang',
        'slug' => 'phong-giuong-tang',
        'name' => ['vi' => 'Phòng Giường Tầng Tiết Kiệm', 'en' => 'Cozy Bunk Bed Room'],
        'subtitle' => ['vi' => 'Thiết kế giường tầng hiện đại, không gian trẻ trung và tiện nghi cho 2 bạn', 'en' => 'Modern bunk bed design, youthful and convenient space for 2 friends'],
        'description' => ['vi' => 'Phòng Giường Tầng Tiết Kiệm được thiết kế thông minh, tối ưu diện tích và cực kỳ phù hợp cho nhóm bạn 2 người muốn tiết kiệm chi phí.', 'en' => 'Smartly designed bunk bed room optimized for 2 friends traveling on a budget.'],
        'pricePerNight' => 450000,
        'priceHourlyFirst2h' => 200000,
        'priceHourlyExtra' => 50000,
        'maxAdults' => 2,
        'maxChildren' => 0,
        'areaSqm' => 12,
        'bedType' => ['vi' => '1 Giường Tầng (2 Giường 1.0m x 2.0m)', 'en' => '1 Bunk Bed (2 Single Beds)'],
        'view' => ['vi' => 'Yên tĩnh bên trong', 'en' => 'Quiet Indoor Ambience'],
        'amenities' => [
            'vi' => ['Máy lạnh Inverter', 'Smart TV', 'Wifi tốc độ cao', 'Tủ lạnh mini', 'Phòng tắm riêng', 'Nước nóng 24/7'],
            'en' => ['Inverter AC', 'Smart TV', 'High-Speed Wi-Fi', 'Mini Fridge', 'Private Bath', '24/7 Hot Water']
        ],
        'features' => [
            'vi' => ['Tối ưu chi phí cho đôi bạn', 'Giường nệm êm ái', 'Lễ tân 24/7'],
            'en' => ['Cost-effective for 2 friends', 'Comfortable mattresses', '24/7 Support']
        ],
        'images' => ['/images/rooms/phong-a.jpg', '/images/rooms/phong-b.jpg'],
        'status' => 'available',
        'isPopular' => false,
        'totalInventory' => 2
    ],
    [
        'id' => 'phong-3-nguoi-tiet-kiem',
        'slug' => 'phong-3-nguoi-tiet-kiem',
        'name' => ['vi' => 'Phòng 3 Người Tiết Kiệm', 'en' => 'Budget Triple Room'],
        'subtitle' => ['vi' => 'Không gian rộng rãi, trang bị 1 giường đôi + 1 giường đơn êm ái cho 3 người', 'en' => 'Spacious layout with 1 double bed + 1 single bed for 3 guests'],
        'description' => ['vi' => 'Phòng 3 Người Tiết Kiệm sở hữu không gian 18m² với 1 giường đôi và 1 giường đơn, rất phù hợp cho gia đình nhỏ hoặc nhóm 3 bạn.', 'en' => 'Budget Triple Room features 18sqm with 1 double and 1 single bed, perfect for small families or 3 friends.'],
        'pricePerNight' => 670000,
        'priceHourlyFirst2h' => 250000,
        'priceHourlyExtra' => 60000,
        'maxAdults' => 3,
        'maxChildren' => 1,
        'areaSqm' => 18,
        'bedType' => ['vi' => '1 Giường Đôi Tiêu Chuẩn + 1 Giường Đơn', 'en' => '1 Double Bed + 1 Single Bed'],
        'view' => ['vi' => 'Cửa sổ thoáng mát', 'en' => 'Airy Breeze Window'],
        'amenities' => [
            'vi' => ['Máy lạnh Inverter', 'TV', 'Wifi cáp quang', 'Tủ quần áo', 'Tủ lạnh minibar', 'Phòng tắm đứng riêng biệt', 'Két sắt'],
            'en' => ['Inverter AC', 'TV', 'Fiber Wi-Fi', 'Wardrobe', 'Minibar Fridge', 'Private Shower', 'Safe Box']
        ],
        'features' => [
            'vi' => ['Sức chứa 3 người thoải mái', 'Dọn phòng mỗi ngày', 'Giữ hành lý miễn phí'],
            'en' => ['Comfortable for 3 guests', 'Daily housekeeping', 'Free luggage storage']
        ],
        'images' => ['/images/rooms/phong-ad.jpg', '/images/rooms/phong-a.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 3
    ],
    [
        'id' => 'phong-3-nguoi-ban-cong',
        'slug' => 'phong-3-nguoi-ban-cong',
        'name' => ['vi' => 'Phòng 3 Người Có View Ban Công', 'en' => 'Triple Room with Balcony View'],
        'subtitle' => ['vi' => 'Ban công thoáng mát ngắm phố Quận 1, 1 giường đôi King + 1 giường đơn cao cấp', 'en' => 'Scenic balcony overlooking District 1 streets, 1 King bed + 1 single bed'],
        'description' => ['vi' => 'Phòng 3 Người Có View Ban Công mang đến góc ngắm phố Quận 1 tuyệt đẹp, không gian thoáng đãng và tiện nghi cao cấp.', 'en' => 'Triple Room with Balcony offers a scenic street view of District 1 with upscale amenities.'],
        'pricePerNight' => 750000,
        'priceHourlyFirst2h' => 280000,
        'priceHourlyExtra' => 60000,
        'maxAdults' => 3,
        'maxChildren' => 1,
        'areaSqm' => 20,
        'bedType' => ['vi' => '1 Giường Đôi King + 1 Giường Đơn', 'en' => '1 King Bed + 1 Single Bed'],
        'view' => ['vi' => 'Ban công ngắm phố trung tâm', 'en' => 'Balcony Street View'],
        'amenities' => [
            'vi' => ['Ban công riêng', 'Máy lạnh Inverter', 'Smart TV 43 inch', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Phòng tắm đứng', 'Bàn trà'],
            'en' => ['Private Balcony', 'Inverter AC', '43" Smart TV', 'High-Speed Wi-Fi', 'Minibar', 'Private Shower', 'Tea Table']
        ],
        'features' => [
            'vi' => ['Ban công ngắm phố chill', 'Nước suối miễn phí', 'Không gian thoáng sáng'],
            'en' => ['Chilling balcony view', 'Complimentary water', 'Bright & airy']
        ],
        'images' => ['/images/rooms/phong-b.jpg', '/images/hero-1.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 3
    ],
    [
        'id' => 'phong-gia-dinh-4-nguoi',
        'slug' => 'phong-gia-dinh-4-nguoi',
        'name' => ['vi' => 'Phòng Gia Đình 4 Người (2 Giường Lớn)', 'en' => 'Family Suite 4 Guests (2 Large Beds)'],
        'subtitle' => ['vi' => 'Không gian rộng rãi 22m², trang bị 2 giường đôi lớn êm ái cho gia đình 4 người', 'en' => 'Spacious 22sqm suite with 2 large double beds for a family of 4'],
        'description' => ['vi' => 'Phòng Gia Đình 4 Người là lựa chọn tuyệt hảo cho các gia đình có con nhỏ hoặc nhóm 4 người đi du lịch cùng nhau.', 'en' => 'Family Suite is the ideal retreat for families with kids or groups of 4 traveling together.'],
        'pricePerNight' => 850000,
        'priceHourlyFirst2h' => 300000,
        'priceHourlyExtra' => 70000,
        'maxAdults' => 4,
        'maxChildren' => 2,
        'areaSqm' => 22,
        'bedType' => ['vi' => '2 Giường Đôi Queen (1.6m x 2.0m)', 'en' => '2 Queen Double Beds (1.6m x 2.0m)'],
        'view' => ['vi' => 'Cửa sổ thoáng mát đón gió', 'en' => 'Breeze & Daylight Window'],
        'amenities' => [
            'vi' => ['2 Giường Đôi êm ái', 'Máy lạnh Inverter', 'Smart TV 50 inch', 'Wifi cáp quang', 'Tủ quần áo lớn', 'Tủ lạnh minibar', 'Phòng tắm rộng'],
            'en' => ['2 Plush Double Beds', 'Inverter AC', '50" Smart TV', 'Fiber Wi-Fi', 'Large Wardrobe', 'Minibar', 'Spacious Bath']
        ],
        'features' => [
            'vi' => ['Phòng rộng cho cả gia đình', 'Dọn phòng sạch sẽ mỗi ngày', 'Hỗ trợ nhận phòng sớm'],
            'en' => ['Spacious for whole family', 'Daily housekeeping', 'Early check-in support']
        ],
        'images' => ['/images/rooms/phong-c.jpg', '/images/rooms/phong-d.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 3
    ],
    [
        'id' => 'phong-gia-dinh-5-nguoi',
        'slug' => 'phong-gia-dinh-5-nguoi',
        'name' => ['vi' => 'Phòng Đại Gia Đình 5 Người (Cực Rộng)', 'en' => 'Grand Family Suite 5 Guests (Extra Large)'],
        'subtitle' => ['vi' => 'Phòng lớn nhất 26m² với 2 giường đôi King + sofa/giường phụ, view cửa sổ lớn ngắm phố', 'en' => 'Largest 26sqm suite with 2 King beds + sofa bed, panoramic window view'],
        'description' => ['vi' => 'Hạng phòng đại gia đình lớn nhất tại khách sạn! Sức chứa lên tới 5 người với đầy đủ tiện nghi sinh hoạt tiện lợi.', 'en' => 'The largest grand family suite at Galaxy Boutique Hotel! Comfortably accommodates 5 guests.'],
        'pricePerNight' => 950000,
        'priceHourlyFirst2h' => 350000,
        'priceHourlyExtra' => 80000,
        'maxAdults' => 5,
        'maxChildren' => 2,
        'areaSqm' => 26,
        'bedType' => ['vi' => '2 Giường King Size (1.8m x 2.0m)', 'en' => '2 King Beds (1.8m x 2.0m)'],
        'view' => ['vi' => 'Cửa sổ lớn toàn cảnh góc phố', 'en' => 'Panoramic Street Corner View'],
        'amenities' => [
            'vi' => ['2 Giường King Size', 'Smart TV 55 inch 4K', 'Máy lạnh Inverter công suất lớn', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Phòng tắm cao cấp'],
            'en' => ['2 King Size Beds', '55" 4K Smart TV', 'High-Power Inverter AC', 'High-Speed Wi-Fi', 'Minibar', 'Premium Bath']
        ],
        'features' => [
            'vi' => ['Diện tích lớn nhất khách sạn', 'Cửa sổ lớn view đẹp', 'Tiện nghi cho nhóm đông'],
            'en' => ['Largest suite in hotel', 'Panoramic window view', 'Full group amenities']
        ],
        'images' => ['/images/rooms/phong-d.jpg', '/images/rooms/phong-b.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 2
    ]
];

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $rooms = loadRoomsBackup();
        if (!$rooms || count($rooms) === 0) {
            $rooms = $defaultRoomsSeed;
            saveRoomsBackup($rooms);
        }
        echo json_encode(['success' => true, 'data' => $rooms]);
        break;

    case 'POST':
    case 'PUT':
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu ID phòng']);
            exit();
        }

        $id = trim($input['id']);
        $currentList = loadRoomsBackup();
        if (!$currentList || count($currentList) === 0) {
            $currentList = $defaultRoomsSeed;
        }

        $found = false;
        foreach ($currentList as &$r) {
            if ($r['id'] === $id) {
                $r = array_merge($r, $input);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $currentList[] = $input;
        }

        saveRoomsBackup($currentList);

        echo json_encode([
            'success' => true,
            'message' => 'Lưu thông tin hạng phòng và hình ảnh thành công!',
            'data' => $input
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            $id = $input['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID phòng cần xóa']);
            exit();
        }

        $currentList = loadRoomsBackup();
        if ($currentList) {
            $currentList = array_values(array_filter($currentList, function($r) use ($id) {
                return $r['id'] !== $id;
            }));
            saveRoomsBackup($currentList);
        }

        echo json_encode(['success' => true, 'message' => 'Đã xóa hạng phòng thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
