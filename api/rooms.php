<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - ROOMS & PRICING REST API (FULL CRUD & DUAL-ENGINE)
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
$jsonBackupFile = $dataDir . '/rooms.json';

// Auto create rooms table in MySQL if connected
if (isset($pdo) && $pdo) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `rooms` (
            `id` VARCHAR(50) PRIMARY KEY,
            `name_vi` VARCHAR(150) NOT NULL,
            `name_en` VARCHAR(150) DEFAULT '',
            `slug` VARCHAR(100) NOT NULL,
            `subtitle_vi` VARCHAR(255) DEFAULT '',
            `subtitle_en` VARCHAR(255) DEFAULT '',
            `price_per_night` DECIMAL(12,2) NOT NULL DEFAULT 650000.00,
            `price_hourly_first2h` DECIMAL(12,2) NOT NULL DEFAULT 150000.00,
            `price_hourly_extra` DECIMAL(12,2) NOT NULL DEFAULT 50000.00,
            `max_adults` INT NOT NULL DEFAULT 2,
            `max_children` INT NOT NULL DEFAULT 1,
            `area_sqm` INT NOT NULL DEFAULT 18,
            `bed_type_vi` VARCHAR(150) DEFAULT '1 Giường Đôi',
            `bed_type_en` VARCHAR(150) DEFAULT '1 Double Bed',
            `view_vi` VARCHAR(150) DEFAULT '',
            `view_en` VARCHAR(150) DEFAULT '',
            `amenities_json` MEDIUMTEXT,
            `images_json` MEDIUMTEXT,
            `description_vi` TEXT,
            `description_en` TEXT,
            `status` ENUM('available', 'occupied', 'cleaning', 'maintenance') DEFAULT 'available',
            `is_popular` TINYINT(1) DEFAULT 0,
            `total_inventory` INT NOT NULL DEFAULT 4,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        // Safe auto-migration for existing tables across all MySQL / MariaDB versions
        $safeAdd = function($col, $def) use ($pdo) {
            try {
                $check = $pdo->query("SHOW COLUMNS FROM `rooms` LIKE '$col'");
                if ($check && $check->rowCount() == 0) {
                    $pdo->exec("ALTER TABLE `rooms` ADD COLUMN `$col` $def");
                }
            } catch (Exception $e) {}
        };

        $safeAdd('bed_type_vi', "VARCHAR(150) DEFAULT '1 Giường Đôi'");
        $safeAdd('bed_type_en', "VARCHAR(150) DEFAULT '1 Double Bed'");
        $safeAdd('view_vi', "VARCHAR(150) DEFAULT ''");
        $safeAdd('view_en', "VARCHAR(150) DEFAULT ''");
        $safeAdd('amenities_json', "MEDIUMTEXT");
        $safeAdd('images_json', "MEDIUMTEXT");
        $safeAdd('total_inventory', "INT NOT NULL DEFAULT 4");

        try { $pdo->exec("ALTER TABLE `rooms` MODIFY COLUMN `images_json` MEDIUMTEXT"); } catch (Exception $e) {}
        try { $pdo->exec("ALTER TABLE `rooms` MODIFY COLUMN `amenities_json` MEDIUMTEXT"); } catch (Exception $e) {}
    } catch (Exception $e) {}
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
    $encoded = json_encode($roomsList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    foreach (getPossibleRoomsFiles() as $path) {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($path, $encoded);
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

// Helper: Format MySQL row into full Room object matching TypeScript interface
function formatRoomRow($row) {
    $images = !empty($row['images_json']) ? json_decode($row['images_json'], true) : [];
    if (!is_array($images) || count($images) === 0) {
        $images = ['/images/rooms/' . $row['id'] . '.jpg'];
    }

    $amenitiesVi = ['Máy chiếu/Smart TV', 'Máy lạnh Inverter', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Nước nóng 24/7', 'Khăn tắm cao cấp'];
    $amenitiesEn = ['Smart TV/Projector', 'Inverter AC', 'High-Speed Wi-Fi', 'Minibar Fridge', '24/7 Hot Water', 'Premium Towels'];
    if (!empty($row['amenities_json'])) {
        $am = json_decode($row['amenities_json'], true);
        if (isset($am['vi']) && is_array($am['vi'])) {
            $amenitiesVi = $am['vi'];
            $amenitiesEn = $am['en'] ?? $am['vi'];
        } else if (is_array($am)) {
            $amenitiesVi = $am;
            $amenitiesEn = $am;
        }
    }

    return [
        'id' => $row['id'],
        'slug' => $row['slug'] ?? $row['id'],
        'name' => [
            'vi' => $row['name_vi'] ?? 'Phòng Khách Sạn Galaxy',
            'en' => $row['name_en'] ?? ($row['name_vi'] ?? 'Galaxy Boutique Room')
        ],
        'subtitle' => [
            'vi' => $row['subtitle_vi'] ?? '',
            'en' => $row['subtitle_en'] ?? ($row['subtitle_vi'] ?? '')
        ],
        'description' => [
            'vi' => $row['description_vi'] ?? '',
            'en' => $row['description_en'] ?? ($row['description_vi'] ?? '')
        ],
        'pricePerNight' => (float)($row['price_per_night'] ?? 650000),
        'priceHourlyFirst2h' => (float)($row['price_hourly_first2h'] ?? 150000),
        'priceHourlyExtra' => (float)($row['price_hourly_extra'] ?? 50000),
        'maxAdults' => (int)($row['max_adults'] ?? 2),
        'maxChildren' => (int)($row['max_children'] ?? 1),
        'areaSqm' => (int)($row['area_sqm'] ?? 18),
        'bedType' => [
            'vi' => $row['bed_type_vi'] ?? '1 Giường Đôi King Size',
            'en' => $row['bed_type_en'] ?? '1 King Size Double Bed'
        ],
        'view' => [
            'vi' => $row['view_vi'] ?? 'Cửa sổ đón ánh sáng & gió tự nhiên',
            'en' => $row['view_en'] ?? 'Natural Breeze & Daylight Window'
        ],
        'amenities' => [
            'vi' => $amenitiesVi,
            'en' => $amenitiesEn
        ],
        'features' => [
            'vi' => ['Nước suối miễn phí mỗi ngày', 'Lễ tân phục vụ 24/7', 'Dọn phòng hàng ngày'],
            'en' => ['Complimentary bottled water', '24/7 Front desk support', 'Daily housekeeping']
        ],
        'images' => array_values($images),
        'status' => $row['status'] ?? 'available',
        'isPopular' => !empty($row['is_popular']),
        'totalInventory' => isset($row['total_inventory']) ? (int)$row['total_inventory'] : 4
    ];
}

// Default initial seed rooms (9 Official Hotel Room Types)
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
        'view' => ['vi' => 'Ban công ngắm phố Quận 1', 'en' => 'District 1 Street View Balcony'],
        'amenities' => [
            'vi' => ['Ban công riêng ngắm phố', 'Máy lạnh Inverter', 'Smart TV', 'Wifi tốc độ cao', 'Tủ lạnh minibar', 'Bàn ghế ban công'],
            'en' => ['Private Balcony', 'Inverter AC', 'Smart TV', 'High-Speed Wi-Fi', 'Minibar Fridge', 'Balcony Chairs']
        ],
        'features' => [
            'vi' => ['Ban công thoáng mát ngắm phố', 'Nước suối miễn phí', 'Check-in linh hoạt'],
            'en' => ['Scenic private balcony', 'Complimentary bottled water', 'Flexible check-in']
        ],
        'images' => ['/images/rooms/phong-b.jpg', '/images/rooms/phong-ad.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 3
    ],
    [
        'id' => 'phong-gia-dinh-4-nguoi',
        'slug' => 'phong-gia-dinh-4-nguoi',
        'name' => ['vi' => 'Phòng Gia Đình 4 Người', 'en' => 'Family Room for 4'],
        'subtitle' => ['vi' => '2 giường đôi tiêu chuẩn rộng rãi, bố trí tiện nghi khoa học cho gia đình 4 người', 'en' => '2 spacious double beds thoughtfully arranged for a family of 4'],
        'description' => ['vi' => 'Phòng Gia Đình 4 Người là lựa chọn lý tưởng cho các gia đình có con nhỏ hoặc nhóm 4 bạn du lịch cùng nhau.', 'en' => 'Family Room for 4 is the ideal choice for families with children or a group of 4 friends.'],
        'pricePerNight' => 900000,
        'priceHourlyFirst2h' => 350000,
        'priceHourlyExtra' => 70000,
        'maxAdults' => 4,
        'maxChildren' => 1,
        'areaSqm' => 22,
        'bedType' => ['vi' => '2 Giường Đôi Queen (1.6m x 2.0m)', 'en' => '2 Queen Beds (1.6m x 2.0m)'],
        'view' => ['vi' => 'Cửa sổ thông gió mát mẻ', 'en' => 'Fresh Breeze Window'],
        'amenities' => [
            'vi' => ['2 Giường đôi êm ái', 'Máy lạnh làm lạnh nhanh', 'Smart TV', 'Wifi riêng biệt', 'Tủ lạnh minibar', 'Phòng tắm đứng'],
            'en' => ['2 Double Beds', 'Fast Cooling AC', 'Smart TV', 'Dedicated Wi-Fi', 'Minibar Fridge', 'Private Shower']
        ],
        'features' => [
            'vi' => ['Phù hợp gia đình 4 người', 'Nước suối miễn phí', 'Lễ tân 24/7'],
            'en' => ['Ideal for family of 4', 'Free bottled water', '24/7 Front desk']
        ],
        'images' => ['/images/rooms/phong-d.jpg', '/images/rooms/phong-c.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 3
    ],
    [
        'id' => 'phong-nhom-6-nguoi',
        'slug' => 'phong-nhom-6-nguoi',
        'name' => ['vi' => 'Phòng Nhóm 6 Người', 'en' => 'Grand Group Suite for 6'],
        'subtitle' => ['vi' => 'Không gian gia đình rộng 28m², 3 giường đôi lớn cho tối đa 6 người lưu trú', 'en' => 'Expansive 28sqm suite with 3 large double beds accommodating up to 6 guests'],
        'description' => ['vi' => 'Phòng Nhóm 6 Người là không gian nghỉ dưỡng tuyệt vời cho đại gia đình hoặc nhóm bạn đi du lịch TP.HCM.', 'en' => 'Grand Group Suite for 6 is the top choice for large families or travel groups.'],
        'pricePerNight' => 1200000,
        'priceHourlyFirst2h' => 450000,
        'priceHourlyExtra' => 80000,
        'maxAdults' => 6,
        'maxChildren' => 2,
        'areaSqm' => 28,
        'bedType' => ['vi' => '3 Giường Đôi Tiêu Chuẩn (1.6m x 2.0m)', 'en' => '3 Standard Double Beds (1.6m x 2.0m)'],
        'view' => ['vi' => 'Cửa sổ lớn toàn cảnh thoáng đãng', 'en' => 'Large Scenic Panoramic Window'],
        'amenities' => [
            'vi' => ['3 Giường đôi lớn cao cấp', 'Smart TV 55 inch 4K', 'Wifi cáp quang tốc độ cao', 'Tủ lạnh lớn', 'Ấm siêu tốc', 'Phòng tắm rộng rãi'],
            'en' => ['3 Large Luxury Beds', '55" 4K Smart TV', 'Ultra-fast Wi-Fi', 'Large Refrigerator', 'Kettle', 'Spacious Bathroom']
        ],
        'features' => [
            'vi' => ['Không gian rộng rãi cho 6 người', '3 Giường đôi thoải mái', 'Lễ tân 24/7'],
            'en' => ['Spacious for 6 guests', '3 comfortable double beds', '24/7 Support']
        ],
        'images' => ['/images/rooms/phong-c.jpg', '/images/rooms/phong-d.jpg'],
        'status' => 'available',
        'isPopular' => true,
        'totalInventory' => 2
    ]
];

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $rooms = [];
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM rooms ORDER BY price_per_night DESC");
                $dbRows = $stmt->fetchAll();
                
                // Check if DB has legacy rooms (phong-a, phong-ad, etc.) or has less than 9 rooms
                $hasLegacy = false;
                if ($dbRows && count($dbRows) > 0) {
                    foreach ($dbRows as $r) {
                        if (in_array($r['id'], ['phong-a', 'phong-ad', 'phong-b', 'phong-c', 'phong-d'])) {
                            $hasLegacy = true;
                            break;
                        }
                    }
                }
                
                if (!$dbRows || count($dbRows) < 9 || $hasLegacy) {
                    // Auto-sync official 9 rooms into MySQL
                    foreach ($defaultRoomsSeed as $seed) {
                        $sId = $seed['id'];
                        $sNameVi = $seed['name']['vi'];
                        $sNameEn = $seed['name']['en'];
                        $sSlug = $seed['slug'];
                        $sSubVi = $seed['subtitle']['vi'];
                        $sSubEn = $seed['subtitle']['en'];
                        $sDescVi = $seed['description']['vi'];
                        $sDescEn = $seed['description']['en'];
                        $sPriceNight = $seed['pricePerNight'];
                        $sPriceFirst2h = $seed['priceHourlyFirst2h'];
                        $sPriceExtra = $seed['priceHourlyExtra'];
                        $sMaxAdults = $seed['maxAdults'];
                        $sMaxChildren = $seed['maxChildren'];
                        $sArea = $seed['areaSqm'];
                        $sBedVi = $seed['bedType']['vi'];
                        $sBedEn = $seed['bedType']['en'];
                        $sViewVi = $seed['view']['vi'];
                        $sViewEn = $seed['view']['en'];
                        $sAmJson = json_encode($seed['amenities'], JSON_UNESCAPED_UNICODE);
                        $sImJson = json_encode($seed['images'], JSON_UNESCAPED_UNICODE);
                        $sStatus = $seed['status'];
                        $sPop = $seed['isPopular'] ? 1 : 0;
                        $sInventory = (int)($seed['totalInventory'] ?? 4);

                        $insStmt = $pdo->prepare("INSERT INTO rooms (
                            id, name_vi, name_en, slug, subtitle_vi, subtitle_en,
                            price_per_night, price_hourly_first2h, price_hourly_extra,
                            max_adults, max_children, area_sqm, bed_type_vi, bed_type_en,
                            view_vi, view_en, amenities_json, description_vi, description_en, images_json, status, is_popular, total_inventory
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            name_vi = VALUES(name_vi),
                            name_en = VALUES(name_en),
                            slug = VALUES(slug),
                            subtitle_vi = VALUES(subtitle_vi),
                            subtitle_en = VALUES(subtitle_en),
                            price_per_night = VALUES(price_per_night),
                            price_hourly_first2h = VALUES(price_hourly_first2h),
                            price_hourly_extra = VALUES(price_hourly_extra),
                            max_adults = VALUES(max_adults),
                            max_children = VALUES(max_children),
                            area_sqm = VALUES(area_sqm),
                            bed_type_vi = VALUES(bed_type_vi),
                            bed_type_en = VALUES(bed_type_en),
                            view_vi = VALUES(view_vi),
                            view_en = VALUES(view_en),
                            description_vi = VALUES(description_vi),
                            description_en = VALUES(description_en),
                            total_inventory = VALUES(total_inventory)");
                        $insStmt->execute([
                            $sId, $sNameVi, $sNameEn, $sSlug, $sSubVi, $sSubEn,
                            $sPriceNight, $sPriceFirst2h, $sPriceExtra,
                            $sMaxAdults, $sMaxChildren, $sArea, $sBedVi, $sBedEn,
                            $sViewVi, $sViewEn, $sAmJson, $sDescVi, $sDescEn, $sImJson, $sStatus, $sPop, $sInventory
                        ]);
                    }
                    if ($hasLegacy) {
                        $pdo->exec("DELETE FROM rooms WHERE id IN ('phong-a', 'phong-ad', 'phong-b', 'phong-c', 'phong-d')");
                    }
                    $stmt = $pdo->query("SELECT * FROM rooms ORDER BY price_per_night DESC");
                    $dbRows = $stmt->fetchAll();
                }

                if ($dbRows && count($dbRows) > 0) {
                    foreach ($dbRows as $row) {
                        $rooms[] = formatRoomRow($row);
                    }
                    saveRoomsBackup($rooms);
                }
            } catch (Exception $e) {}
        }

        // If DB had no rows or failed, try backup file
        if (empty($rooms)) {
            $backup = loadRoomsBackup();
            if ($backup && count($backup) > 0) {
                $rooms = $backup;
            } else {
                $rooms = $defaultRoomsSeed;
                saveRoomsBackup($rooms);
            }
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
        $nameVi = is_array($input['name'] ?? null) ? ($input['name']['vi'] ?? '') : ($input['name'] ?? '');
        $nameEn = is_array($input['name'] ?? null) ? ($input['name']['en'] ?? $nameVi) : $nameVi;
        $slug = $input['slug'] ?? $id;
        $subtitleVi = is_array($input['subtitle'] ?? null) ? ($input['subtitle']['vi'] ?? '') : ($input['subtitle'] ?? '');
        $subtitleEn = is_array($input['subtitle'] ?? null) ? ($input['subtitle']['en'] ?? $subtitleVi) : $subtitleVi;
        $descVi = is_array($input['description'] ?? null) ? ($input['description']['vi'] ?? '') : ($input['description'] ?? '');
        $descEn = is_array($input['description'] ?? null) ? ($input['description']['en'] ?? $descVi) : $descVi;
        
        $priceNight = (float)($input['pricePerNight'] ?? 650000);
        $priceFirst2h = (float)($input['priceHourlyFirst2h'] ?? 150000);
        $priceExtra = (float)($input['priceHourlyExtra'] ?? 50000);
        $maxAdults = (int)($input['maxAdults'] ?? 2);
        $maxChildren = (int)($input['maxChildren'] ?? 1);
        $areaSqm = (int)($input['areaSqm'] ?? 18);
        $bedTypeVi = is_array($input['bedType'] ?? null) ? ($input['bedType']['vi'] ?? '') : ($input['bedType'] ?? '1 Giường Đôi');
        $bedTypeEn = is_array($input['bedType'] ?? null) ? ($input['bedType']['en'] ?? $bedTypeVi) : $bedTypeVi;
        $viewVi = is_array($input['view'] ?? null) ? ($input['view']['vi'] ?? '') : ($input['view'] ?? 'Cửa sổ đón gió tự nhiên');
        $viewEn = is_array($input['view'] ?? null) ? ($input['view']['en'] ?? $viewVi) : $viewVi;
        $imagesJson = json_encode(array_values(is_array($input['images'] ?? null) ? $input['images'] : []), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        
        // Amenities JSON formatting
        $amenitiesObj = ['vi' => [], 'en' => []];
        if (isset($input['amenities'])) {
            if (isset($input['amenities']['vi']) && is_array($input['amenities']['vi'])) {
                $amenitiesObj['vi'] = $input['amenities']['vi'];
                $amenitiesObj['en'] = $input['amenities']['en'] ?? $input['amenities']['vi'];
            } elseif (is_array($input['amenities'])) {
                $amenitiesObj['vi'] = $input['amenities'];
                $amenitiesObj['en'] = $input['amenities'];
            }
        }
        $amenitiesJson = json_encode($amenitiesObj, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        
        $status = $input['status'] ?? 'available';
        $isPopular = !empty($input['isPopular']) ? 1 : 0;
        $totalInventory = (int)($input['totalInventory'] ?? 4);

        if (isset($pdo) && $pdo) {
            try {
                $sql = "INSERT INTO rooms (
                    id, name_vi, name_en, slug, subtitle_vi, subtitle_en,
                    price_per_night, price_hourly_first2h, price_hourly_extra,
                    max_adults, max_children, area_sqm, bed_type_vi, bed_type_en,
                    view_vi, view_en, amenities_json, description_vi, description_en, images_json, status, is_popular, total_inventory
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?
                ) ON DUPLICATE KEY UPDATE
                    name_vi = VALUES(name_vi),
                    name_en = VALUES(name_en),
                    subtitle_vi = VALUES(subtitle_vi),
                    subtitle_en = VALUES(subtitle_en),
                    description_vi = VALUES(description_vi),
                    description_en = VALUES(description_en),
                    price_per_night = VALUES(price_per_night),
                    price_hourly_first2h = VALUES(price_hourly_first2h),
                    price_hourly_extra = VALUES(price_hourly_extra),
                    max_adults = VALUES(max_adults),
                    max_children = VALUES(max_children),
                    area_sqm = VALUES(area_sqm),
                    bed_type_vi = VALUES(bed_type_vi),
                    bed_type_en = VALUES(bed_type_en),
                    view_vi = VALUES(view_vi),
                    view_en = VALUES(view_en),
                    amenities_json = VALUES(amenities_json),
                    images_json = VALUES(images_json),
                    status = VALUES(status),
                    is_popular = VALUES(is_popular),
                    total_inventory = VALUES(total_inventory)";

                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $id, $nameVi, $nameEn, $slug, $subtitleVi, $subtitleEn,
                    $priceNight, $priceFirst2h, $priceExtra,
                    $maxAdults, $maxChildren, $areaSqm, $bedTypeVi, $bedTypeEn,
                    $viewVi, $viewEn, $amenitiesJson, $descVi, $descEn, $imagesJson, $status, $isPopular, $totalInventory
                ]);
            } catch (Exception $e) {
                // error logged
            }
        }

        // Also update JSON backup
        $currentList = loadRoomsBackup() ?: [];
        $found = false;
        foreach ($currentList as &$r) {
            if ($r['id'] === $id) {
                $r = $input;
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

        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM rooms WHERE id = ?");
                $stmt->execute([$id]);
            } catch (Exception $e) {}
        }

        // Update backup
        $currentList = loadRoomsBackup() ?: [];
        $currentList = array_values(array_filter($currentList, function($r) use ($id) {
            return $r['id'] !== $id;
        }));
        saveRoomsBackup($currentList);

        echo json_encode(['success' => true, 'message' => 'Đã xóa hạng phòng thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
