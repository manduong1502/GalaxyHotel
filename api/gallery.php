<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - GALLERY REST API (PURE JSON ENGINE)
// Lưu trữ độc lập 100% bằng JSON, không phụ thuộc MySQL
// =========================================================================

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

// Multi-location persistence paths
function getPossibleGalleryFiles() {
    $webRoot = dirname(__DIR__);
    return [
        __DIR__ . '/data/gallery.json',
        $webRoot . '/uploads/gallery.json',
        __DIR__ . '/gallery.json'
    ];
}

function safeFilePutContents($filePath, $content) {
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    $res = @file_put_contents($filePath, $content, LOCK_EX);
    if ($res === false) {
        $res = @file_put_contents($filePath, $content);
    }
    if ($res !== false) {
        @chmod($filePath, 0666);
    }
    return $res !== false;
}

function saveGalleryJson($photos) {
    $encoded = json_encode(array_values($photos), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    foreach (getPossibleGalleryFiles() as $path) {
        safeFilePutContents($path, $encoded);
    }
}

function loadGalleryJson() {
    foreach (getPossibleGalleryFiles() as $path) {
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

// Default initial gallery photos
$defaultPhotos = [
    [
        'id' => 'gal-1',
        'url' => '/images/checkin-1.jpg',
        'title' => 'Check-in nụ cười du khách tại sảnh',
        'category' => 'checkin',
        'date' => '2026-08-30'
    ],
    [
        'id' => 'gal-2',
        'url' => '/images/welcome-1.jpg',
        'title' => 'Phòng Hạng Sang Máy Chiếu ấm cúng',
        'category' => 'checkin',
        'date' => '2026-08-28'
    ],
    [
        'id' => 'gal-3',
        'url' => '/images/hero-1.jpg',
        'title' => 'Sảnh đón tiếp & Quầy thông tin Tour',
        'category' => 'facilities',
        'date' => '2026-08-25'
    ],
    [
        'id' => 'gal-4',
        'url' => '/images/facility-1.jpg',
        'title' => 'Khu vực tiếp khách & thư giãn',
        'category' => 'facilities',
        'date' => '2026-08-20'
    ],
    [
        'id' => 'gal-5',
        'url' => '/images/welcome-2.jpg',
        'title' => 'Góc phòng xinh xắn đón nắng sáng',
        'category' => 'checkin',
        'date' => '2026-08-15'
    ],
    [
        'id' => 'gal-6',
        'url' => '/images/hero-2.jpg',
        'title' => 'Không gian ấm cúng Galaxy Boutique',
        'category' => 'facilities',
        'date' => '2026-08-10'
    ]
];

function getStoredPhotos($defaultPhotos) {
    $backup = loadGalleryJson();
    if ($backup && count($backup) > 0) {
        return $backup;
    }
    saveGalleryJson($defaultPhotos);
    return $defaultPhotos;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $photos = getStoredPhotos($defaultPhotos);
        echo json_encode(['success' => true, 'data' => $photos]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
            exit;
        }

        $photos = getStoredPhotos($defaultPhotos);

        if (isset($input['action']) && $input['action'] === 'save_all' && isset($input['photos']) && is_array($input['photos'])) {
            $photos = $input['photos'];
            saveGalleryJson($photos);
            echo json_encode(['success' => true, 'data' => $photos, 'message' => 'Đã lưu danh sách ảnh thành công']);
            exit;
        } else if (!empty($input['url'])) {
            $newId = $input['id'] ?? ('gal-' . time() . '-' . rand(100, 999));
            $newPhoto = [
                'id' => $newId,
                'url' => $input['url'],
                'title' => $input['title'] ?? 'Khoảnh khắc khách hàng',
                'category' => $input['category'] ?? 'checkin',
                'date' => $input['date'] ?? date('Y-m-d')
            ];
            array_unshift($photos, $newPhoto);
            saveGalleryJson($photos);
            echo json_encode(['success' => true, 'data' => $photos, 'message' => 'Đã lưu hình ảnh vào Thư viện thành công']);
            exit;
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu hình ảnh hoặc đường dẫn']);
            exit;
        }

    case 'DELETE':
        $id = $_GET['id'] ?? '';
        if (!$id) {
            $raw = file_get_contents('php://input');
            $input = json_decode($raw, true);
            $id = $input['id'] ?? '';
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID ảnh cần xóa']);
            exit;
        }

        $photos = getStoredPhotos($defaultPhotos);
        $filtered = array_values(array_filter($photos, function($p) use ($id) {
            return ($p['id'] ?? '') != $id;
        }));

        saveGalleryJson($filtered);
        echo json_encode(['success' => true, 'data' => $filtered, 'message' => 'Đã xóa ảnh thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
