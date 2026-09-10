<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - BANNERS & HOMEPAGE VISUALS REST API
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
function getPossibleBannersFiles() {
    $webRoot = dirname(__DIR__);
    return [
        $webRoot . '/uploads/banners.json',
        __DIR__ . '/data/banners.json',
        __DIR__ . '/banners.json'
    ];
}

function saveBannersJson($data) {
    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    foreach (getPossibleBannersFiles() as $path) {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($path, $encoded);
    }
}

function loadBannersJson() {
    foreach (getPossibleBannersFiles() as $path) {
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

// Auto create banners table in MySQL if connected
if (isset($pdo) && $pdo) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `homepage_banners` (
            `id` VARCHAR(50) PRIMARY KEY,
            `type` VARCHAR(50) NOT NULL DEFAULT 'hero_slide',
            `image` MEDIUMTEXT NOT NULL,
            `title` VARCHAR(255),
            `subtitle` TEXT,
            `highlight` VARCHAR(100),
            `sort_order` INT DEFAULT 0,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    } catch (Exception $e) {}
}

$defaultData = [
    'heroSlides' => [
        [
            'id' => 'hero-1',
            'image' => '/images/hero-1.jpg',
            'title' => 'Không Gian Ấm Cúng, Tiện Nghi & Riêng Tư',
            'subtitle' => 'Khách sạn boutique chuẩn mực tại trung tâm Quận 1 Sài Gòn, chỉ cách Phố đi bộ Bùi Viện vài bước chân.',
            'highlight' => 'SẠCH SẼ & ẤM CÚNG'
        ],
        [
            'id' => 'hero-2',
            'image' => '/images/hero-2.jpg',
            'title' => 'Phòng Nghỉ Tiêu Chuẩn & Phòng Gia Đình Rộng Rãi',
            'subtitle' => 'Trang bị đầy đủ Smart TV, máy lạnh êm ái, wifi tốc độ cao và phòng tắm riêng hiện đại.',
            'highlight' => 'TIỆN NGHI HOÀN HẢO'
        ],
        [
            'id' => 'hero-3',
            'image' => '/images/facility-1.jpg',
            'title' => 'Trải Nghiệm Du Lịch & Ẩm Thực Sài Gòn',
            'subtitle' => 'Hỗ trợ đặt tour miền Tây, Củ Chi, đặt vé máy bay và xe đưa đón sân bay 24/7.',
            'highlight' => 'TÂM ĐIỂM QUẬN 1'
        ]
    ],
    'welcomeImages' => [
        'mainImage' => '/images/welcome-1.jpg',
        'secondaryImage' => '/images/welcome-2.jpg'
    ]
];

// Handle POST: Update Banners
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
        exit;
    }

    saveBannersJson($data);

    // Save to MySQL if connected
    if (isset($pdo) && $pdo && isset($data['heroSlides']) && is_array($data['heroSlides'])) {
        try {
            $stmt = $pdo->prepare("INSERT INTO `homepage_banners` (`id`, `type`, `image`, `title`, `subtitle`, `highlight`, `sort_order`) 
                VALUES (:id, :type, :image, :title, :subtitle, :highlight, :sort_order)
                ON DUPLICATE KEY UPDATE 
                `type` = VALUES(`type`), 
                `image` = VALUES(`image`), 
                `title` = VALUES(`title`), 
                `subtitle` = VALUES(`subtitle`), 
                `highlight` = VALUES(`highlight`), 
                `sort_order` = VALUES(`sort_order`)");

            foreach ($data['heroSlides'] as $idx => $s) {
                $stmt->execute([
                    ':id' => $s['id'] ?? ('hero-' . ($idx + 1)),
                    ':type' => 'hero_slide',
                    ':image' => $s['image'] ?? '',
                    ':title' => $s['title'] ?? '',
                    ':subtitle' => $s['subtitle'] ?? '',
                    ':highlight' => $s['highlight'] ?? '',
                    ':sort_order' => $idx
                ]);
            }
        } catch (Exception $e) {
            error_log('MySQL Banner save error: ' . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Đã lưu cấu hình banner & hình ảnh trang chủ thành công',
        'data' => $data
    ]);
    exit;
}

// Handle GET
$data = loadBannersJson();
if (!$data || !isset($data['heroSlides'])) {
    $data = $defaultData;
    saveBannersJson($data);
}

echo json_encode([
    'success' => true,
    'data' => $data
]);
