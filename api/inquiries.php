<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - INQUIRIES REST API (PURE JSON ENGINE)
// Lưu trữ độc lập 100% bằng JSON, không phụ thuộc MySQL
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/mailer.php';

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
$inquiriesFile = $dataDir . '/inquiries.json';

function loadInquiries($filePath) {
    if (file_exists($filePath)) {
        $content = @file_get_contents($filePath);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    return [];
}

function saveInquiries($filePath, $items) {
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    return @file_put_contents($filePath, json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $inquiries = loadInquiries($inquiriesFile);
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
        $checkInDate = !empty($input['checkInDate']) ? trim($input['checkInDate']) : '';
        $checkOutDate = !empty($input['checkOutDate']) ? trim($input['checkOutDate']) : '';
        $roomType = trim($input['roomType'] ?? $input['roomName'] ?? '');
        $guestsCount = (int)($input['guestsCount'] ?? $input['adults'] ?? 1);
        $message = trim($input['message'] ?? $input['specialRequests'] ?? 'Yêu cầu tư vấn qua website');
        $status = $input['status'] ?? 'new';
        $notes = trim($input['notes'] ?? '');
        $createdAt = !empty($input['createdAt']) ? $input['createdAt'] : date('Y-m-d H:i:s');

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

        $inquiries = loadInquiries($inquiriesFile);
        array_unshift($inquiries, $inquiryItem);
        saveInquiries($inquiriesFile, $inquiries);

        // Gửi email thông báo cho Lễ tân / Admin
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
        $notes = isset($input['notes']) ? trim($input['notes']) : null;

        $inquiries = loadInquiries($inquiriesFile);
        $found = false;
        foreach ($inquiries as &$item) {
            if ($item['id'] === $id) {
                $item['status'] = $status;
                if ($notes !== null) {
                    $item['notes'] = $notes;
                }
                $found = true;
                break;
            }
        }

        if ($found) {
            saveInquiries($inquiriesFile, $inquiries);
            echo json_encode(['success' => true, 'message' => 'Đã cập nhật trạng thái yêu cầu']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Không tìm thấy yêu cầu']);
        }
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

        $inquiries = loadInquiries($inquiriesFile);
        $filtered = array_filter($inquiries, function($i) use ($id) {
            return $i['id'] !== $id;
        });

        saveInquiries($inquiriesFile, $filtered);
        echo json_encode(['success' => true, 'message' => 'Đã xóa yêu cầu thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
