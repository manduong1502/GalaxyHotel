<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - ROOM LOCKS REST API (PURE JSON ENGINE)
// Quản lý khóa phòng & cài đặt tồn ngày độc lập 100% bằng JSON
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

function getPossibleLocksFiles() {
    $webRoot = dirname(__DIR__);
    return [
        __DIR__ . '/data/room_locks.json',
        $webRoot . '/uploads/room_locks.json',
        __DIR__ . '/room_locks.json'
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

function loadLocks() {
    foreach (getPossibleLocksFiles() as $filePath) {
        if (file_exists($filePath)) {
            $content = @file_get_contents($filePath);
            if ($content) {
                $data = json_decode($content, true);
                if (is_array($data)) return $data;
            }
        }
    }
    return [];
}

function saveLocks($locks) {
    $encoded = json_encode(array_values($locks), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $saved = false;
    foreach (getPossibleLocksFiles() as $filePath) {
        if (safeFilePutContents($filePath, $encoded)) {
            $saved = true;
        }
    }
    return $saved;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $locks = loadLocks();
        echo json_encode(['success' => true, 'data' => $locks]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['roomId']) || empty($input['startDate']) || empty($input['endDate'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Vui lòng cung cấp đủ thông tin: phòng, ngày bắt đầu, ngày kết thúc']);
            exit();
        }

        $id = !empty($input['id']) ? trim($input['id']) : ('lock_' . time() . '_' . rand(100, 999));
        $roomId = trim($input['roomId']);
        $startDate = trim($input['startDate']);
        $endDate = trim($input['endDate']);
        $isLocked = isset($input['isLocked']) ? (bool)$input['isLocked'] : true;
        $customInventory = isset($input['customInventory']) ? (int)$input['customInventory'] : 0;
        $reason = trim($input['reason'] ?? ($isLocked ? 'Bảo trì / Khóa phòng' : 'Cài đặt tồn phòng'));
        $createdAt = !empty($input['createdAt']) ? $input['createdAt'] : date('Y-m-d H:i:s');

        $lockItem = [
            'id' => $id,
            'roomId' => $roomId,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'isLocked' => $isLocked,
            'customInventory' => $customInventory,
            'reason' => $reason,
            'createdAt' => $createdAt
        ];

        $locks = loadLocks();
        $found = false;
        foreach ($locks as &$item) {
            if ($item['id'] === $id) {
                $item = $lockItem;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $locks[] = $lockItem;
        }

        saveLocks($locks);

        echo json_encode([
            'success' => true,
            'data' => $lockItem,
            'message' => $isLocked ? 'Đã khóa phòng thành công' : 'Đã cài đặt tồn phòng theo ngày thành công'
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $raw = file_get_contents('php://input');
            $input = json_decode($raw, true);
            $id = $input['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID khóa phòng']);
            exit();
        }

        $locks = loadLocks();
        $filtered = array_values(array_filter($locks, function($l) use ($id) {
            return $l['id'] !== $id;
        }));

        saveLocks($filtered);
        echo json_encode(['success' => true, 'message' => 'Đã mở khóa / xóa cài đặt phòng thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
