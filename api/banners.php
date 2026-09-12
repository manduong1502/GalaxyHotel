<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - BANNERS & HOMEPAGE VISUALS REST API (PURE JSON ENGINE)
// Lưu trữ độc lập 100% bằng JSON, không phụ thuộc MySQL
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

// Multi-location persistence paths
function getPossibleBannersFiles() {
    $webRoot = dirname(__DIR__);
    return [
        __DIR__ . '/data/banners.json',
        $webRoot . '/uploads/banners.json',
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
        @file_put_contents($path, $encoded, LOCK_EX);
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
