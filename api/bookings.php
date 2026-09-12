<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - BOOKINGS REST API (PURE JSON ENGINE)
// Lưu trữ và quản lý đơn đặt phòng độc lập 100% bằng JSON
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

function getPossibleBookingsFiles() {
    $webRoot = dirname(__DIR__);
    return [
        __DIR__ . '/data/bookings.json',
        $webRoot . '/uploads/bookings.json',
        __DIR__ . '/bookings.json'
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

function loadBookings() {
    foreach (getPossibleBookingsFiles() as $filePath) {
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

function saveBookings($items) {
    $encoded = json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $saved = false;
    foreach (getPossibleBookingsFiles() as $filePath) {
        if (safeFilePutContents($filePath, $encoded)) {
            $saved = true;
        }
    }
    return $saved;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $bookings = loadBookings();
        echo json_encode(['success' => true, 'data' => $bookings]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['guestName']) || empty($input['guestPhone']) || empty($input['roomId'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Vui lòng cung cấp đủ thông tin khách hàng và phòng đặt']);
            exit();
        }

        $id = !empty($input['id']) ? trim($input['id']) : ('bk-' . time() . '-' . rand(100, 999));
        $bookingCode = !empty($input['bookingCode']) ? trim($input['bookingCode']) : ('GBH-' . rand(1000, 9999));
        $bookingType = $input['bookingType'] ?? 'daily';
        $roomId = trim($input['roomId']);
        $roomName = trim($input['roomName'] ?? 'Phòng Khách Sạn Galaxy');
        $guestName = trim($input['guestName']);
        $guestPhone = trim($input['guestPhone']);
        $guestEmail = trim($input['guestEmail'] ?? '');
        $checkInDate = trim($input['checkInDate'] ?? date('Y-m-d'));
        $checkInTime = trim($input['checkInTime'] ?? '14:00');
        $checkOutDate = trim($input['checkOutDate'] ?? date('Y-m-d'));
        $checkOutTime = trim($input['checkOutTime'] ?? '12:00');
        $hoursCount = isset($input['hoursCount']) ? (int)$input['hoursCount'] : null;
        $nightsCount = isset($input['nightsCount']) ? (int)$input['nightsCount'] : 1;
        $adults = (int)($input['adults'] ?? 2);
        $children = (int)($input['children'] ?? 0);
        $totalPrice = (float)($input['totalPrice'] ?? 0);
        $specialRequests = trim($input['specialRequests'] ?? '');
        $staffNotes = trim($input['staffNotes'] ?? '');
        $status = $input['status'] ?? 'pending';
        $createdAt = !empty($input['createdAt']) ? $input['createdAt'] : date('Y-m-d H:i:s');
        $updatedAt = date('Y-m-d H:i:s');

        $bookingRecord = [
            'id' => $id,
            'bookingCode' => $bookingCode,
            'bookingType' => $bookingType,
            'roomId' => $roomId,
            'roomName' => $roomName,
            'guestName' => $guestName,
            'guestPhone' => $guestPhone,
            'guestEmail' => $guestEmail,
            'checkInDate' => $checkInDate,
            'checkInTime' => $checkInTime,
            'checkOutDate' => $checkOutDate,
            'checkOutTime' => $checkOutTime,
            'hoursCount' => $hoursCount,
            'nightsCount' => $nightsCount,
            'adults' => $adults,
            'children' => $children,
            'totalPrice' => $totalPrice,
            'specialRequests' => $specialRequests,
            'staffNotes' => $staffNotes,
            'status' => $status,
            'createdAt' => $createdAt,
            'updatedAt' => $updatedAt
        ];

        $bookings = loadBookings();
        array_unshift($bookings, $bookingRecord);
        saveBookings($bookings);

        // Gửi email xác nhận đặt phòng
        try {
            sendBookingNotificationEmail($bookingRecord);
        } catch (Exception $e) {}

        echo json_encode([
            'success' => true,
            'data' => $bookingRecord,
            'message' => 'Đặt phòng thành công!'
        ]);
        break;

    case 'PUT':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID đơn đặt phòng']);
            exit();
        }

        $id = trim($input['id']);
        $bookings = loadBookings();
        $found = false;

        foreach ($bookings as &$item) {
            if ($item['id'] === $id || (isset($item['bookingCode']) && $item['bookingCode'] === $id)) {
                if (isset($input['status'])) $item['status'] = $input['status'];
                if (isset($input['staffNotes'])) $item['staffNotes'] = $input['staffNotes'];
                if (isset($input['specialRequests'])) $item['specialRequests'] = $input['specialRequests'];
                $item['updatedAt'] = date('Y-m-d H:i:s');
                $found = true;
                break;
            }
        }

        if ($found) {
            saveBookings($bookings);
            echo json_encode(['success' => true, 'message' => 'Đã cập nhật trạng thái đơn đặt phòng']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Không tìm thấy đơn đặt phòng']);
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
            echo json_encode(['success' => false, 'message' => 'Thiếu ID đơn đặt phòng cần xóa']);
            exit();
        }

        $bookings = loadBookings();
        $filtered = array_values(array_filter($bookings, function($b) use ($id) {
            return $b['id'] !== $id && (!isset($b['bookingCode']) || $b['bookingCode'] !== $id);
        }));

        saveBookings($filtered);
        echo json_encode(['success' => true, 'message' => 'Đã xóa đơn đặt phòng thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
