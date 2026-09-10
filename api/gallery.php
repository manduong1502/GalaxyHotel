<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - GALLERY & CHECK-IN PHOTO REST API
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Helper: Multi-location persistence paths
function getPossibleGalleryFiles() {
    $webRoot = dirname(__DIR__);
    return [
        $webRoot . '/uploads/gallery.json',
        __DIR__ . '/data/gallery.json',
        __DIR__ . '/gallery.json'
    ];
}

function saveGalleryJson($photos) {
    $encoded = json_encode($photos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    foreach (getPossibleGalleryFiles() as $path) {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($path, $encoded);
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

// Auto create gallery table in MySQL if connected
if (isset($pdo) && $pdo) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `gallery` (
            `id` VARCHAR(50) PRIMARY KEY,
            `url` MEDIUMTEXT NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `category` VARCHAR(50) NOT NULL DEFAULT 'checkin',
            `date` DATE DEFAULT NULL,
            `sort_order` INT DEFAULT 0,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        $pdo->exec("ALTER TABLE `gallery` MODIFY COLUMN `url` MEDIUMTEXT NOT NULL");
    } catch (Exception $e) {}
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

function getStoredPhotos($defaultPhotos, $pdo = null) {
    // 1. Try MySQL
    if ($pdo) {
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS `gallery` (
                `id` VARCHAR(50) PRIMARY KEY,
                `url` MEDIUMTEXT NOT NULL,
                `title` VARCHAR(255) NOT NULL,
                `category` VARCHAR(50) NOT NULL DEFAULT 'checkin',
                `date` DATE DEFAULT NULL,
                `sort_order` INT DEFAULT 0,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $stmt = $pdo->query("SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC");
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $list = [];
                foreach ($rows as $row) {
                    $list[] = [
                        'id' => $row['id'],
                        'url' => $row['url'],
                        'title' => $row['title'],
                        'category' => $row['category'],
                        'date' => $row['date'] ?? date('Y-m-d')
                    ];
                }
                saveGalleryJson($list);
                return $list;
            }
        } catch (Exception $e) {}
    }

    // 2. Try JSON backup across multiple locations
    $backup = loadGalleryJson();
    if ($backup && count($backup) > 0) {
        return $backup;
    }

    // 3. Fallback to default
    saveGalleryJson($defaultPhotos);
    return $defaultPhotos;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $photos = getStoredPhotos($defaultPhotos, $pdo);
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

        $photos = getStoredPhotos($defaultPhotos, $pdo);

        if (isset($input['action']) && $input['action'] === 'save_all' && isset($input['photos']) && is_array($input['photos'])) {
            $photos = $input['photos'];
            
            // Sync to MySQL
            if ($pdo) {
                try {
                    $pdo->exec("CREATE TABLE IF NOT EXISTS `gallery` (
                        `id` VARCHAR(50) PRIMARY KEY,
                        `url` MEDIUMTEXT NOT NULL,
                        `title` VARCHAR(255) NOT NULL,
                        `category` VARCHAR(50) NOT NULL DEFAULT 'checkin',
                        `date` DATE DEFAULT NULL,
                        `sort_order` INT DEFAULT 0,
                        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

                    $pdo->exec("DELETE FROM gallery");
                    $stmt = $pdo->prepare("INSERT INTO gallery (id, url, title, category, date, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
                    foreach ($photos as $idx => $p) {
                        $stmt->execute([
                            $p['id'] ?? ('gal-' . $idx),
                            $p['url'] ?? '',
                            $p['title'] ?? 'Khoảnh khắc khách hàng',
                            $p['category'] ?? 'checkin',
                            $p['date'] ?? date('Y-m-d'),
                            $idx
                        ]);
                    }
                } catch (Exception $e) {}
            }

            // Always save JSON backup across all writeable locations
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

            if ($pdo) {
                try {
                    $pdo->exec("CREATE TABLE IF NOT EXISTS `gallery` (
                        `id` VARCHAR(50) PRIMARY KEY,
                        `url` MEDIUMTEXT NOT NULL,
                        `title` VARCHAR(255) NOT NULL,
                        `category` VARCHAR(50) NOT NULL DEFAULT 'checkin',
                        `date` DATE DEFAULT NULL,
                        `sort_order` INT DEFAULT 0,
                        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

                    $stmt = $pdo->prepare("INSERT INTO gallery (id, url, title, category, date, sort_order) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE url = VALUES(url), title = VALUES(title), category = VALUES(category), date = VALUES(date)");
                    $stmt->execute([
                        $newId,
                        $newPhoto['url'],
                        $newPhoto['title'],
                        $newPhoto['category'],
                        $newPhoto['date'],
                        0
                    ]);
                } catch (Exception $e) {}
            }

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

        $photos = getStoredPhotos($defaultPhotos, $pdo);
        $filtered = array_values(array_filter($photos, function($p) use ($id) {
            return ($p['id'] ?? '') != $id;
        }));

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
                $stmt->execute([$id]);
            } catch (Exception $e) {}
        }

        saveGalleryJson($filtered);
        echo json_encode(['success' => true, 'data' => $filtered, 'message' => 'Đã xóa ảnh']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
