<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - ROOM LOCKS REST API (MYSQL PRODUCTION + JSON BACKUP)
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
$locksFile = $dataDir . '/room_locks.json';

// Auto create room_locks table in MySQL if connected
if (isset($pdo) && $pdo) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `room_locks` (
            `id` VARCHAR(50) PRIMARY KEY,
            `room_id` VARCHAR(50) NOT NULL,
            `start_date` DATE NOT NULL,
            `end_date` DATE NOT NULL,
            `reason` VARCHAR(255) DEFAULT '',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    } catch (Exception $e) {}
}

function loadLocksBackup($filePath) {
    if (file_exists($filePath)) {
        $content = @file_get_contents($filePath);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    return [];
}

function saveLocksBackup($filePath, $locks) {
    @file_put_contents($filePath, json_encode(array_values($locks), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $locks = [];
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM room_locks ORDER BY start_date ASC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($rows as $row) {
                    $locks[] = [
                        'id' => $row['id'],
                        'roomId' => $row['room_id'],
                        'startDate' => $row['start_date'],
                        'endDate' => $row['end_date'],
                        'reason' => $row['reason'] ?? '',
                        'createdAt' => $row['created_at'] ?? ''
                    ];
                }
                saveLocksBackup($locksFile, $locks);
            } catch (Exception $e) {
                $locks = loadLocksBackup($locksFile);
            }
        } else {
            $locks = loadLocksBackup($locksFile);
        }

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
        $reason = trim($input['reason'] ?? 'Bảo trì / Khóa phòng');
        $createdAt = date('Y-m-d H:i:s');

        $lockItem = [
            'id' => $id,
            'roomId' => $roomId,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'reason' => $reason,
            'createdAt' => $createdAt
        ];

        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO room_locks (id, room_id, start_date, end_date, reason, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE start_date = VALUES(start_date), end_date = VALUES(end_date), reason = VALUES(reason)");
                $stmt->execute([$id, $roomId, $startDate, $endDate, $reason, $createdAt]);
            } catch (Exception $e) {}
        }

        $backup = loadLocksBackup($locksFile);
        $found = false;
        foreach ($backup as &$item) {
            if ($item['id'] === $id) {
                $item = $lockItem;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $backup[] = $lockItem;
        }
        saveLocksBackup($locksFile, $backup);

        echo json_encode(['success' => true, 'data' => $lockItem, 'message' => 'Khóa phòng thành công']);
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
            echo json_encode(['success' => false, 'message' => 'Thiếu ID khóa phòng cần xóa']);
            exit();
        }

        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM room_locks WHERE id = ?");
                $stmt->execute([$id]);
            } catch (Exception $e) {}
        }

        $backup = loadLocksBackup($locksFile);
        $backup = array_values(array_filter($backup, function($item) use ($id) {
            return $item['id'] !== $id;
        }));
        saveLocksBackup($locksFile, $backup);

        echo json_encode(['success' => true, 'message' => 'Mở khóa phòng thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
