<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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

$dataFile = $dataDir . '/gallery.json';

// Default initial gallery photos if file doesn't exist
$defaultPhotos = [
    [
        'id' => 'gal-1',
        'url' => '/images/hero-1.jpg',
        'title' => 'Sảnh Lễ Tân Galaxy Hotel',
        'category' => 'spaces',
        'date' => '2026-08-20'
    ],
    [
        'id' => 'gal-2',
        'url' => '/images/welcome-1.jpg',
        'title' => 'Phòng Nghỉ Chiếu Phim Netflix',
        'category' => 'spaces',
        'date' => '2026-08-21'
    ],
    [
        'id' => 'gal-3',
        'url' => '/images/checkin-1.jpg',
        'title' => 'Khoảnh khắc khách hàng nhận phòng vui vẻ',
        'category' => 'checkin',
        'date' => '2026-08-22'
    ],
    [
        'id' => 'gal-4',
        'url' => '/images/welcome-2.jpg',
        'title' => 'Nội Thất & Tiện Nghi Phòng',
        'category' => 'spaces',
        'date' => '2026-08-23'
    ],
    [
        'id' => 'gal-5',
        'url' => '/images/tour-mekong.jpg',
        'title' => 'Khách hàng trải nghiệm Tour Miền Tây',
        'category' => 'checkin',
        'date' => '2026-08-24'
    ],
    [
        'id' => 'gal-6',
        'url' => '/images/bui-vien-night.jpg',
        'title' => 'Dạo chơi Phố đi bộ Bùi Viện về đêm',
        'category' => 'checkin',
        'date' => '2026-08-25'
    ]
];

function getStoredPhotos($dataFile, $defaultPhotos) {
    if (file_exists($dataFile)) {
        $content = @file_get_contents($dataFile);
        if ($content) {
            $json = json_decode($content, true);
            if (is_array($json)) {
                return $json;
            }
        }
    }
    // Save defaults
    @file_put_contents($dataFile, json_encode($defaultPhotos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    return $defaultPhotos;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $photos = getStoredPhotos($dataFile, $defaultPhotos);
        echo json_encode(['success' => true, 'data' => $photos]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['url'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dữ liệu ảnh không hợp lệ']);
            exit;
        }

        $photos = getStoredPhotos($dataFile, $defaultPhotos);

        // Check if updating entire list or adding single photo
        if (isset($input['action']) && $input['action'] === 'save_all' && isset($input['photos'])) {
            $photos = $input['photos'];
        } else {
            $newPhoto = [
                'id' => $input['id'] ?? (string)(time() * 1000 + rand(100, 999)),
                'url' => $input['url'],
                'title' => $input['title'] ?? 'Khoảnh khắc khách hàng',
                'category' => $input['category'] ?? 'checkin',
                'date' => $input['date'] ?? date('Y-m-d')
            ];
            array_unshift($photos, $newPhoto);
        }

        @file_put_contents($dataFile, json_encode($photos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'data' => $photos, 'message' => 'Đã lưu ảnh vào danh sách thành công']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID ảnh cần xóa']);
            exit;
        }

        $photos = getStoredPhotos($dataFile, $defaultPhotos);
        $filtered = array_values(array_filter($photos, function($p) use ($id) {
            return ($p['id'] ?? '') != $id;
        }));

        @file_put_contents($dataFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'data' => $filtered, 'message' => 'Đã xóa ảnh']);
        break;
}
