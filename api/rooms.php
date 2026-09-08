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

// Helper: Save rooms to JSON backup file
function saveRoomsBackup($roomsList) {
    global $jsonBackupFile;
    @file_put_contents($jsonBackupFile, json_encode($roomsList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Helper: Load rooms from JSON backup file
function loadRoomsBackup() {
    global $jsonBackupFile;
    if (file_exists($jsonBackupFile)) {
        $content = @file_get_contents($jsonBackupFile);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data) && count($data) > 0) {
                return $data;
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
                }
            } catch (Exception $e) {
                // fallback to backup
            }
        }

        // If DB had no rows or failed, try backup file
        if (empty($rooms)) {
            $backup = loadRoomsBackup();
            if ($backup) {
                $rooms = $backup;
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
