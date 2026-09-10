<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - SERVICES & TOURS REST API
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Multi-location persistence paths
function getPossibleServicesFiles() {
    $webRoot = dirname(__DIR__);
    return [
        $webRoot . '/uploads/services.json',
        __DIR__ . '/data/services.json',
        __DIR__ . '/services.json'
    ];
}

function saveServicesJson($boxes) {
    $encoded = json_encode($boxes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    foreach (getPossibleServicesFiles() as $path) {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($path, $encoded);
    }
}

function loadServicesJson() {
    foreach (getPossibleServicesFiles() as $path) {
        if (file_exists($path)) {
            $content = @file_get_contents($path);
            if ($content) {
                $json = json_decode($content, true);
                if (is_array($json) && count($json) > 0) {
                    return $json;
                }
            }
        }
    }
    return null;
}

// Auto create services table in MySQL if connected
if (isset($pdo) && $pdo) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `services_boxes` (
            `id` VARCHAR(50) PRIMARY KEY,
            `tag` VARCHAR(100) NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `desc` TEXT,
            `image` MEDIUMTEXT,
            `hours` VARCHAR(100),
            `items` TEXT,
            `sort_order` INT DEFAULT 0,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    } catch (Exception $e) {}
}

$defaultBoxes = [
    [
        'id' => 'box-1',
        'tag' => 'TOUR TRẢI NGHIỆM',
        'title' => 'Tour Trải Nghiệm & Khám Phá',
        'desc' => 'Hỗ trợ đặt tour chất lượng cao khám phá vẻ đẹp Nam Bộ và lịch sử Sài Gòn hào hùng.',
        'image' => '/images/tour-mekong.jpg',
        'hours' => '24/7 Hỗ trợ',
        'items' => [
            'Hành Trình Miền Tây (Mekong delta)',
            'Khám phá Địa đạo Củ Chi (Cu Chi Tunnels)',
            'Một vòng Sài Gòn (City Tour)'
        ]
    ],
    [
        'id' => 'box-2',
        'tag' => 'GIẶT ỦI LẤY NHANH',
        'title' => 'Dịch Vụ Giặt Sấy',
        'desc' => 'Dịch vụ giặt sấy thơm tho sạch sẽ trong ngày, giao nhận tận phòng nhanh chóng và chu đáo.',
        'image' => '/images/towels.png',
        'hours' => 'Lấy trong ngày',
        'items' => [
            'Giặt sấy khô thơm tho lấy ngay trong ngày',
            'Ủi và chăm sóc trang phục theo yêu cầu',
            'Giá cả bình dân, hỗ trợ giao nhận tại phòng'
        ]
    ],
    [
        'id' => 'box-3',
        'tag' => 'TRUNG TÂM QUẬN 1',
        'title' => 'Vị Trí Vàng Trung Tâm Sài Gòn',
        'desc' => 'Nằm trong hẻm 269 Đề Thám yên tĩnh nhưng chỉ cách phố đi bộ Bùi Viện và chợ Bến Thành vài bước chân.',
        'image' => '/images/bui-vien-night.jpg',
        'hours' => 'Vị trí đắc địa',
        'items' => [
            'Đi bộ 2 phút ra Phố Tây Bùi Viện',
            'Đi bộ 5 phút đến Chợ Bến Thành & Công viên 23/9',
            'Gần Dinh Độc Lập, Nhà thờ Đức Bà & Bến Bạch Đằng'
        ]
    ]
];

// Handle POST: Update Services Boxes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
        exit;
    }

    $boxes = $data;

    // 1. Save to JSON files (Multi-location)
    saveServicesJson($boxes);

    // 2. Save to MySQL if connected
    if (isset($pdo) && $pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO `services_boxes` (`id`, `tag`, `title`, `desc`, `image`, `hours`, `items`, `sort_order`) 
                VALUES (:id, :tag, :title, :desc, :image, :hours, :items, :sort_order)
                ON DUPLICATE KEY UPDATE 
                `tag` = VALUES(`tag`), 
                `title` = VALUES(`title`), 
                `desc` = VALUES(`desc`), 
                `image` = VALUES(`image`), 
                `hours` = VALUES(`hours`), 
                `items` = VALUES(`items`), 
                `sort_order` = VALUES(`sort_order`)");
            
            foreach ($boxes as $idx => $b) {
                $stmt->execute([
                    ':id' => $b['id'] ?? ('box-' . ($idx + 1)),
                    ':tag' => $b['tag'] ?? '',
                    ':title' => $b['title'] ?? '',
                    ':desc' => $b['desc'] ?? '',
                    ':image' => $b['image'] ?? '',
                    ':hours' => $b['hours'] ?? '',
                    ':items' => is_array($b['items'] ?? null) ? json_encode($b['items'], JSON_UNESCAPED_UNICODE) : '[]',
                    ':sort_order' => $idx
                ]);
            }
        } catch (Exception $e) {
            error_log('MySQL Services save error: ' . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Đã lưu cấu hình dịch vụ & tour thành công',
        'data' => $boxes
    ]);
    exit;
}

// Handle GET: Retrieve Services Boxes
$boxes = null;

// 1. Try MySQL
if (isset($pdo) && $pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM `services_boxes` ORDER BY `sort_order` ASC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($rows && count($rows) > 0) {
            $boxes = [];
            foreach ($rows as $r) {
                $items = json_decode($r['items'] ?? '[]', true);
                $boxes[] = [
                    'id' => $r['id'],
                    'tag' => $r['tag'],
                    'title' => $r['title'],
                    'desc' => $r['desc'],
                    'image' => $r['image'],
                    'hours' => $r['hours'],
                    'items' => is_array($items) ? $items : []
                ];
            }
        }
    } catch (Exception $e) {}
}

// 2. Fallback to JSON file
if (!$boxes) {
    $boxes = loadServicesJson();
}

// 3. Fallback to default
if (!$boxes || count($boxes) === 0) {
    $boxes = $defaultBoxes;
    saveServicesJson($boxes);
}

echo json_encode([
    'success' => true,
    'total' => count($boxes),
    'data' => $boxes
]);
