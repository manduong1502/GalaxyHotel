<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - INQUIRIES & CONTACTS REST API (MYSQL + JSON)
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mailer.php';

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
$inquiriesFile = $dataDir . '/inquiries.json';

// Auto create inquiries table in MySQL if connected
if (isset($pdo) && $pdo) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `inquiries` (
            `id` VARCHAR(50) PRIMARY KEY,
            `full_name` VARCHAR(150) NOT NULL,
            `phone` VARCHAR(50) NOT NULL,
            `email` VARCHAR(150) DEFAULT '',
            `check_in_date` DATE DEFAULT NULL,
            `check_out_date` DATE DEFAULT NULL,
            `room_type` VARCHAR(150) DEFAULT '',
            `guests_count` INT DEFAULT 1,
            `message` TEXT NOT NULL,
            `status` ENUM('new', 'contacted', 'resolved', 'cancelled') NOT NULL DEFAULT 'new',
            `notes` TEXT DEFAULT '',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    } catch (Exception $e) {}
}

function loadInquiriesBackup($filePath) {
    if (file_exists($filePath)) {
        $content = @file_get_contents($filePath);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    return [];
}

function saveInquiriesBackup($filePath, $items) {
    @file_put_contents($filePath, json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $inquiries = [];
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM inquiries ORDER BY created_at DESC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($rows as $row) {
                    $inquiries[] = [
                        'id' => $row['id'],
                        'fullName' => $row['full_name'],
                        'phone' => $row['phone'],
                        'email' => $row['email'] ?? '',
                        'checkInDate' => $row['check_in_date'] ?? '',
                        'checkOutDate' => $row['check_out_date'] ?? '',
                        'roomType' => $row['room_type'] ?? '',
                        'guestsCount' => (int)($row['guests_count'] ?? 1),
                        'message' => $row['message'] ?? '',
                        'status' => $row['status'] ?? 'new',
                        'notes' => $row['notes'] ?? '',
                        'createdAt' => $row['created_at'] ?? ''
                    ];
                }
                saveInquiriesBackup($inquiriesFile, $inquiries);
            } catch (Exception $e) {
                $inquiries = loadInquiriesBackup($inquiriesFile);
            }
        } else {
            $inquiries = loadInquiriesBackup($inquiriesFile);
        }

        echo json_encode(['success' => true, 'data' => $inquiries]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || (empty($input['fullName']) && empty($input['name'])) || (empty($input['phone']) && empty($input['guestPhone']))) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Vui lòng cung cấp họ tên và số điện thoại liên hệ']);
            exit();
        }

        $id = !empty($input['id']) ? trim($input['id']) : ('inq_' . time() . '_' . rand(100, 999));
        $fullName = trim($input['fullName'] ?? $input['name'] ?? 'Khách hàng');
        $phone = trim($input['phone'] ?? $input['guestPhone'] ?? '');
        $email = trim($input['email'] ?? $input['guestEmail'] ?? '');
        $checkInDate = !empty($input['checkInDate']) ? trim($input['checkInDate']) : null;
        $checkOutDate = !empty($input['checkOutDate']) ? trim($input['checkOutDate']) : null;
        $roomType = trim($input['roomType'] ?? $input['roomName'] ?? '');
        $guestsCount = (int)($input['guestsCount'] ?? $input['adults'] ?? 1);
        $message = trim($input['message'] ?? $input['specialRequests'] ?? 'Yêu cầu tư vấn đặt phòng');
        $status = $input['status'] ?? 'new';
        $notes = trim($input['notes'] ?? '');
        $createdAt = date('Y-m-d H:i:s');

        $inquiryItem = [
            'id' => $id,
            'fullName' => $fullName,
            'phone' => $phone,
            'email' => $email,
            'checkInDate' => $checkInDate,
            'checkOutDate' => $checkOutDate,
            'roomType' => $roomType,
            'guestsCount' => $guestsCount,
            'message' => $message,
            'status' => $status,
            'notes' => $notes,
            'createdAt' => $createdAt
        ];

        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO inquiries 
                    (id, full_name, phone, email, check_in_date, check_out_date, room_type, guests_count, message, status, notes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $id, $fullName, $phone, $email, 
                    $checkInDate, $checkOutDate, $roomType, $guestsCount, 
                    $message, $status, $notes, $createdAt
                ]);
            } catch (Exception $e) {}
        }

        $backup = loadInquiriesBackup($inquiriesFile);
        array_unshift($backup, $inquiryItem);
        saveInquiriesBackup($inquiriesFile, $backup);

        // Send email notification to hotel admin/reception
        try {
            sendInquiryNotificationEmail($inquiryItem);
        } catch (Exception $e) {}

        echo json_encode([
            'success' => true,
            'data' => $inquiryItem,
            'message' => 'Yêu cầu tư vấn đã được gửi thành công! Khách sạn sẽ liên hệ với quý khách sớm nhất.'
        ]);
        break;

    case 'PUT':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID yêu cầu']);
            exit();
        }

        $id = trim($input['id']);
        $status = $input['status'] ?? 'new';
        $notes = trim($input['notes'] ?? '');

        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("UPDATE inquiries SET status = ?, notes = ? WHERE id = ?");
                $stmt->execute([$status, $notes, $id]);
            } catch (Exception $e) {}
        }

        $backup = loadInquiriesBackup($inquiriesFile);
        foreach ($backup as &$item) {
            if ($item['id'] === $id) {
                $item['status'] = $status;
                $item['notes'] = $notes;
                break;
            }
        }
        saveInquiriesBackup($inquiriesFile, $backup);

        echo json_encode(['success' => true, 'message' => 'Cập nhật trạng thái yêu cầu thành công']);
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
            echo json_encode(['success' => false, 'message' => 'Thiếu ID yêu cầu cần xóa']);
            exit();
        }

        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM inquiries WHERE id = ?");
                $stmt->execute([$id]);
            } catch (Exception $e) {}
        }

        $backup = loadInquiriesBackup($inquiriesFile);
        $backup = array_values(array_filter($backup, function($item) use ($id) {
            return $item['id'] !== $id;
        }));
        saveInquiriesBackup($inquiriesFile, $backup);

        echo json_encode(['success' => true, 'message' => 'Xóa yêu cầu thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
