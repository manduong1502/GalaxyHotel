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
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        // Safe auto-migration for existing tables
        $pdo->exec("ALTER TABLE `rooms` ADD COLUMN IF NOT EXISTS `bed_type_vi` VARCHAR(150) DEFAULT '1 Giường Đôi'");
        $pdo->exec("ALTER TABLE `rooms` ADD COLUMN IF NOT EXISTS `bed_type_en` VARCHAR(150) DEFAULT '1 Double Bed'");
        $pdo->exec("ALTER TABLE `rooms` ADD COLUMN IF NOT EXISTS `view_vi` VARCHAR(150) DEFAULT ''");
        $pdo->exec("ALTER TABLE `rooms` ADD COLUMN IF NOT EXISTS `view_en` VARCHAR(150) DEFAULT ''");
        $pdo->exec("ALTER TABLE `rooms` ADD COLUMN IF NOT EXISTS `amenities_json` MEDIUMTEXT");
        $pdo->exec("ALTER TABLE `rooms` ADD COLUMN IF NOT EXISTS `images_json` MEDIUMTEXT");
        $pdo->exec("ALTER TABLE `rooms` MODIFY COLUMN `images_json` MEDIUMTEXT");
        $pdo->exec("ALTER TABLE `rooms` MODIFY COLUMN `amenities_json` MEDIUMTEXT");
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
        'isPopular' => !empty($row['is_popular'])
    ];
}

// Default initial seed rooms
$defaultRoomsSeed = [
    [
        'id' => 'phong-a',
        'slug' => 'phong-a',
        'name' => ['vi' => 'Phòng A (Standard Deluxe)', 'en' => 'Room A (Standard Deluxe)'],
        'subtitle' => ['vi' => 'Không gian ấm cúng, thiết kế hiện đại và tiện nghi hoàn hảo cho 2 người', 'en' => 'Cozy atmosphere, modern design and perfect comfort for 2 guests'],
        'description' => ['vi' => 'Phòng A tại Galaxy Boutique Hotel là sự lựa chọn hoàn hảo cho các cặp đôi hoặc du khách cá nhân. Đầy đủ tiện nghi hiện đại.', 'en' => 'Room A at Galaxy Boutique Hotel is the perfect choice for couples or solo travelers.'],
        'pricePerNight' => 650000,
        'priceHourlyFirst2h' => 150000,
        'priceHourlyExtra' => 50000,
        'maxAdults' => 2,
        'maxChildren' => 1,
        'areaSqm' => 15,
        'bedType' => ['vi' => '1 Giường Đôi Queen (1.6m x 2.0m)', 'en' => '1 Queen Double Bed (1.6m x 2.0m)'],
        'view' => ['vi' => 'Cửa sổ đón gió tự nhiên', 'en' => 'Natural Breeze Window'],
        'amenities' => [
            'vi' => ['Máy lạnh Inverter', 'Smart TV kết nối Youtube', 'Wifi tốc độ cao miễn phí', 'Tủ lạnh minibar', 'Phòng tắm nước nóng 24/7', 'Máy sấy tóc & Khăn tắm cao cấp'],
            'en' => ['Inverter AC', 'Smart TV with Youtube', 'Free High-Speed Wi-Fi', 'Minibar Fridge', '24/7 Hot Water', 'Hair Dryer & Towels']
        ],
        'features' => [
            'vi' => ['Nước suối miễn phí hàng ngày', 'Lễ tân phục vụ 24/7', 'Dọn phòng hàng ngày'],
            'en' => ['Complimentary bottled water', '24/7 Front desk support', 'Daily housekeeping']
        ],
        'images' => ['/images/rooms/phong-a.jpg', '/images/rooms/phong-ad.jpg', '/images/hero-1.jpg'],
        'status' => 'available',
        'isPopular' => true
    ],
    [
        'id' => 'phong-ad',
        'slug' => 'phong-ad',
        'name' => ['vi' => 'Phòng AD (Deluxe Triple)', 'en' => 'Room AD (Deluxe Triple)'],
        'subtitle' => ['vi' => 'Không gian rộng rãi, thoáng mát dành cho nhóm 3 khách hoặc gia đình nhỏ', 'en' => 'Spacious and airy room for 3 guests or small families'],
        'description' => ['vi' => 'Phòng AD với diện tích 18m² được bố trí hài hòa giữa 1 giường đôi và 1 giường đơn êm ái.', 'en' => 'Room AD features an 18sqm layout with 1 comfortable double bed and 1 single bed.'],
        'pricePerNight' => 650000,
        'priceHourlyFirst2h' => 180000,
        'priceHourlyExtra' => 60000,
        'maxAdults' => 3,
        'maxChildren' => 1,
        'areaSqm' => 18,
        'bedType' => ['vi' => '1 Giường Đôi King + 1 Giường Đơn', 'en' => '1 King Bed + 1 Single Bed'],
        'view' => ['vi' => 'Cửa sổ đón ánh sáng tự nhiên', 'en' => 'Daylight Window'],
        'amenities' => [
            'vi' => ['Máy lạnh Inverter', 'Smart TV 43"', 'Wifi cáp quang riêng', 'Tủ quần áo gỗ cao cấp', 'Tủ lạnh minibar', 'Phòng tắm đứng riêng biệt'],
            'en' => ['Inverter AC', '43" Smart TV', 'Dedicated Fiber Wi-Fi', 'Wooden Wardrobe', 'Minibar Fridge', 'Private Walk-in Shower']
        ],
        'features' => [
            'vi' => ['Dọn phòng sạch sẽ mỗi ngày', 'Hỗ trợ đặt tour du lịch', 'Giữ hành lý miễn phí'],
            'en' => ['Daily housekeeping', 'Tour assistance', 'Free luggage storage']
        ],
        'images' => ['/images/rooms/phong-ad.jpg', '/images/rooms/phong-a.jpg', '/images/rooms/phong-b.jpg'],
        'status' => 'available',
        'isPopular' => false
    ],
    [
        'id' => 'phong-b',
        'slug' => 'phong-b',
        'name' => ['vi' => 'Phòng B (Superior Triple)', 'en' => 'Room B (Superior Triple)'],
        'subtitle' => ['vi' => 'Thiết kế tinh tế, không gian yên tĩnh và tiện nghi hoàn hảo cho kỳ nghỉ trọn vẹn', 'en' => 'Refined design, quiet space and full amenities for a complete holiday'],
        'description' => ['vi' => 'Phòng B mang đến không gian rộng 20m² với đệm lò xo êm ái chuẩn khách sạn.', 'en' => 'Room B offers a 20sqm retreat with premium pocket spring mattress.'],
        'pricePerNight' => 650000,
        'priceHourlyFirst2h' => 180000,
        'priceHourlyExtra' => 60000,
        'maxAdults' => 3,
        'maxChildren' => 1,
        'areaSqm' => 20,
        'bedType' => ['vi' => '1 Giường Đôi lớn (1.8m x 2.0m) + 1 Giường Đơn', 'en' => '1 Large King Bed + 1 Single Bed'],
        'view' => ['vi' => 'Hướng phố Quận 1 thoáng đãng', 'en' => 'Open District 1 City Scenery'],
        'amenities' => [
            'vi' => ['Máy lạnh mát sâu', 'Smart TV thế hệ mới', 'Wifi tốc độ cao', 'Ấm đun nước siêu tốc', 'Tủ lạnh minibar', 'Bàn làm việc & ghế thư giãn'],
            'en' => ['Powerful AC', 'Latest Smart TV', 'High-Speed Wi-Fi', 'Electric Kettle', 'Minibar Fridge', 'Work Desk & Chair']
        ],
        'features' => [
            'vi' => ['Dịch vụ giặt ủi lấy nhanh', 'Bản đồ du lịch miễn phí', 'Hỗ trợ đổi ngoại tệ'],
            'en' => ['Express laundry', 'Free tourist map', 'Currency exchange']
        ],
        'images' => ['/images/rooms/phong-b.jpg', '/images/hero-1.jpg', '/images/rooms/phong-c.jpg'],
        'status' => 'available',
        'isPopular' => false
    ],
    [
        'id' => 'phong-c',
        'slug' => 'phong-c',
        'name' => ['vi' => 'Phòng C (Family Suite 5 Khách)', 'en' => 'Room C (Family Suite 5 Guests)'],
        'subtitle' => ['vi' => 'Không gian gia đình rộng 25m², 2 giường đôi lớn + 1 giường đơn cho 5 khách', 'en' => 'Spacious 25sqm family room with 2 large double beds + 1 single bed for 5 guests'],
        'description' => ['vi' => 'Phòng C là lựa chọn số 1 cho đại gia đình hoặc nhóm bạn đi du lịch TP.HCM.', 'en' => 'Room C is the top choice for families or large friend groups.'],
        'pricePerNight' => 650000,
        'priceHourlyFirst2h' => 200000,
        'priceHourlyExtra' => 70000,
        'maxAdults' => 5,
        'maxChildren' => 2,
        'areaSqm' => 25,
        'bedType' => ['vi' => '2 Giường Đôi (1.6m) + 1 Giường Đơn', 'en' => '2 Double Beds (1.6m) + 1 Single Bed'],
        'view' => ['vi' => 'Cửa sổ ban công thoáng mát', 'en' => 'Balcony Window View'],
        'amenities' => [
            'vi' => ['Máy lạnh công suất lớn', 'Smart TV 50 inch', 'Wifi riêng biệt', '2 Tủ quần áo rộng', 'Tủ lạnh minibar dung tích lớn', 'Phòng tắm rộng có vòi sen đứng'],
            'en' => ['High Capacity AC', '50 inch Smart TV', 'Dedicated Wi-Fi', '2 Wardrobes', 'Large Minibar', 'Spacious Bathroom']
        ],
        'features' => [
            'vi' => ['Phù hợp cho gia đình có trẻ em', 'Bổ sung nôi em bé nếu yêu cầu', 'Nước suối miễn phí 5 chai/ngày'],
            'en' => ['Ideal for families with kids', 'Baby cot on request', '5 Complimentary water bottles daily']
        ],
        'images' => ['/images/rooms/phong-c.jpg', '/images/hero-2.jpg', '/images/rooms/phong-b.jpg'],
        'status' => 'available',
        'isPopular' => true
    ],
    [
        'id' => 'phong-d',
        'slug' => 'phong-d',
        'name' => ['vi' => 'Phòng D (Quadruple Room 4 Khách)', 'en' => 'Room D (Quadruple Room 4 Guests)'],
        'subtitle' => ['vi' => '2 giường đôi rộng rãi, bố trí tiện nghi khoa học cho nhóm 4 người', 'en' => '2 spacious double beds, thoughtfully arranged for 4 guests'],
        'description' => ['vi' => 'Phòng D được thiết kế tối ưu công năng với 2 giường đôi cao cấp.', 'en' => 'Room D is optimized with 2 premium double beds.'],
        'pricePerNight' => 650000,
        'priceHourlyFirst2h' => 180000,
        'priceHourlyExtra' => 60000,
        'maxAdults' => 4,
        'maxChildren' => 1,
        'areaSqm' => 22,
        'bedType' => ['vi' => '2 Giường Đôi Tiêu Chuẩn (1.6m x 2.0m)', 'en' => '2 Standard Double Beds (1.6m x 2.0m)'],
        'view' => ['vi' => 'Cửa sổ thông gió mát mẻ', 'en' => 'Breeze Ventilation Window'],
        'amenities' => [
            'vi' => ['Máy lạnh làm lạnh êm', 'Smart TV truyền hình số', 'Wifi cáp quang', 'Tủ lạnh minibar', 'Bàn trà & 4 ghế ngồi', 'Máy sấy tóc & Đồ dùng vệ sinh miễn phí'],
            'en' => ['Quiet Inverter AC', 'Digital Smart TV', 'Fiber Wi-Fi', 'Minibar Fridge', 'Tea Table & 4 Chairs', 'Hair Dryer & Toiletries']
        ],
        'features' => [
            'vi' => ['Tối ưu chi phí cho nhóm du lịch', 'Lễ tân hỗ trợ 24/7', 'Bảo quản tư trang an toàn'],
            'en' => ['Cost-effective for groups', '24/7 Front desk support', 'Secure luggage storage']
        ],
        'images' => ['/images/rooms/phong-d.jpg', '/images/rooms/phong-a.jpg', '/images/hero-1.jpg'],
        'status' => 'available',
        'isPopular' => false
    ],
    [
        'id' => 'phong-may-chieu',
        'slug' => 'phong-may-chieu',
        'name' => ['vi' => 'Phòng Máy Chiếu (Cinema Experience)', 'en' => 'Cinema Projector Room'],
        'subtitle' => ['vi' => 'Trải nghiệm rạp chiếu phim tại phòng với màn chiếu 100 inch Full HD & Netflix 4K', 'en' => 'Private cinema experience with 100-inch Full HD screen & 4K Netflix'],
        'description' => ['vi' => 'Hạng phòng độc đáo duy nhất tại Galaxy Boutique Hotel! Được trang bị máy chiếu Full HD màn hình 100 inch sắc nét, tích hợp sẵn Netflix, Youtube, hệ thống âm thanh vòm sống động.', 'en' => 'Unique cinema room with 100-inch screen and surround sound!'],
        'pricePerNight' => 650000,
        'priceHourlyFirst2h' => 180000,
        'priceHourlyExtra' => 60000,
        'maxAdults' => 2,
        'maxChildren' => 1,
        'areaSqm' => 18,
        'bedType' => ['vi' => '1 Giường Đôi King Size (1.8m x 2.0m) Siêu Êm', 'en' => '1 Super Cozy King Bed (1.8m x 2.0m)'],
        'view' => ['vi' => 'Không gian rạp chiếu phim ấm cúng', 'en' => 'Cozy Private Cinema Space'],
        'amenities' => [
            'vi' => ['Máy chiếu Full HD 100 inch', 'Tài khoản Netflix Premium 4K miễn phí', 'Hệ thống loa vòm sống động', 'Máy lạnh Inverter siêu êm', 'Tủ lạnh minibar', 'Đèn ngủ ambient light chill thư giãn'],
            'en' => ['100" Full HD Projector', 'Free Netflix 4K Account', 'Surround Sound System', 'Ultra-Quiet Inverter AC', 'Minibar Fridge', 'Ambient Mood Lighting']
        ],
        'features' => [
            'vi' => ['Trải nghiệm giải trí đỉnh cao', 'Miễn phí bắp rang hoặc snack (khi đặt trước)', 'Check-in riêng tư, yên tĩnh'],
            'en' => ['Ultimate entertainment experience', 'Complimentary popcorn/snack upon booking', 'Quiet private check-in']
        ],
        'images' => ['/images/rooms/phong-may-chieu.jpg', '/images/welcome-1.jpg', '/images/hero-2.jpg'],
        'status' => 'available',
        'isPopular' => true
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
                if ($dbRows && count($dbRows) > 0) {
                    foreach ($dbRows as $row) {
                        $rooms[] = formatRoomRow($row);
                    }
                    saveRoomsBackup($rooms);
                } else {
                    // Seed initial rooms into MySQL
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

                        $insStmt = $pdo->prepare("INSERT INTO rooms (
                            id, name_vi, name_en, slug, subtitle_vi, subtitle_en,
                            price_per_night, price_hourly_first2h, price_hourly_extra,
                            max_adults, max_children, area_sqm, bed_type_vi, bed_type_en,
                            view_vi, view_en, amenities_json, description_vi, description_en, images_json, status, is_popular
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                        $insStmt->execute([
                            $sId, $sNameVi, $sNameEn, $sSlug, $sSubVi, $sSubEn,
                            $sPriceNight, $sPriceFirst2h, $sPriceExtra,
                            $sMaxAdults, $sMaxChildren, $sArea, $sBedVi, $sBedEn,
                            $sViewVi, $sViewEn, $sAmJson, $sDescVi, $sDescEn, $sImJson, $sStatus, $sPop
                        ]);
                    }
                    $rooms = $defaultRoomsSeed;
                    saveRoomsBackup($rooms);
                }
            } catch (Exception $e) {
                // fallback to backup
            }
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

        if (isset($pdo) && $pdo) {
            try {
                $sql = "INSERT INTO rooms (
                    id, name_vi, name_en, slug, subtitle_vi, subtitle_en,
                    price_per_night, price_hourly_first2h, price_hourly_extra,
                    max_adults, max_children, area_sqm, bed_type_vi, bed_type_en,
                    view_vi, view_en, amenities_json, description_vi, description_en, images_json, status, is_popular
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?
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
                    is_popular = VALUES(is_popular)";

                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $id, $nameVi, $nameEn, $slug, $subtitleVi, $subtitleEn,
                    $priceNight, $priceFirst2h, $priceExtra,
                    $maxAdults, $maxChildren, $areaSqm, $bedTypeVi, $bedTypeEn,
                    $viewVi, $viewEn, $amenitiesJson, $descVi, $descEn, $imagesJson, $status, $isPopular
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
