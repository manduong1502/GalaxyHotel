<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - BOOKINGS REST API (DUAL ENGINE: MYSQL + JSON DB)
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mailer.php';

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
$bookingsFile = $dataDir . '/bookings.json';

// Default initial bookings including seed and verified test bookings
$defaultBookings = [
    [
        'id' => 'bk-1001',
        'bookingCode' => 'GBH-8492',
        'bookingType' => 'daily',
        'roomId' => 'phong-a',
        'roomName' => 'Phòng A (Standard Deluxe)',
        'guestName' => 'Nguyễn Hoàng Long',
        'guestPhone' => '0908123456',
        'guestEmail' => 'long.nguyen@gmail.com',
        'checkInDate' => '2026-08-23',
        'checkInTime' => '14:00',
        'checkOutDate' => '2026-08-25',
        'checkOutTime' => '12:00',
        'nightsCount' => 2,
        'adults' => 2,
        'children' => 0,
        'totalPrice' => 1300000,
        'specialRequests' => 'Khách đến từ Hà Nội, cần nhận phòng sớm nếu được',
        'staffNotes' => 'Đã gọi xác nhận, khách sẽ đến lúc 13:30',
        'status' => 'confirmed',
        'createdAt' => '2026-08-22T08:30:00Z',
    ],
    [
        'id' => 'bk-1002',
        'bookingCode' => 'GBH-8493',
        'bookingType' => 'hourly',
        'roomId' => 'phong-ad',
        'roomName' => 'Phòng AD (Deluxe Triple)',
        'guestName' => 'Trần Thị Mai Phương',
        'guestPhone' => '0912345678',
        'guestEmail' => 'phuong.tran@gmail.com',
        'checkInDate' => '2026-08-23',
        'checkInTime' => '15:00',
        'checkOutDate' => '2026-08-23',
        'checkOutTime' => '18:00',
        'hoursCount' => 3,
        'adults' => 2,
        'children' => 1,
        'totalPrice' => 240000,
        'specialRequests' => 'Cần phòng yên tĩnh để em bé ngủ',
        'staffNotes' => '',
        'status' => 'checked_in',
        'createdAt' => '2026-08-23T07:15:00Z',
    ],
    [
        'id' => 'bk-1003',
        'bookingCode' => 'GBH-8494',
        'bookingType' => 'daily',
        'roomId' => 'phong-c',
        'roomName' => 'Phòng C (Family Suite - 5 Khách)',
        'guestName' => 'Mr. Johnathan Smith',
        'guestPhone' => '+61412345678',
        'guestEmail' => 'johnathan.smith@australia.com',
        'checkInDate' => '2026-08-24',
        'checkInTime' => '14:00',
        'checkOutDate' => '2026-08-27',
        'checkOutTime' => '12:00',
        'nightsCount' => 3,
        'adults' => 4,
        'children' => 1,
        'totalPrice' => 1950000,
        'specialRequests' => 'Needs airport pickup at Tan Son Nhat airport (Flight VN123, ETA 13:00)',
        'staffNotes' => 'Lễ tân đã đặt xe 7 chỗ đón khách tại Ga Quốc Tế',
        'status' => 'pending',
        'createdAt' => '2026-08-23T09:00:00Z',
    ],
    [
        'id' => 'bk-1004',
        'bookingCode' => 'GBH-8495',
        'bookingType' => 'daily',
        'roomId' => 'phong-b',
        'roomName' => 'Phòng Đơn Tiết Kiệm',
        'guestName' => 'Lê Văn Tuấn',
        'guestPhone' => '0987654321',
        'guestEmail' => 'tuan.le@fpt.com.vn',
        'checkInDate' => '2026-08-22',
        'checkInTime' => '14:00',
        'checkOutDate' => '2026-08-23',
        'checkOutTime' => '12:00',
        'nightsCount' => 1,
        'adults' => 1,
        'children' => 0,
        'totalPrice' => 390000,
        'specialRequests' => 'Đi công tác 1 mình',
        'staffNotes' => 'Đã thanh toán đủ, check-out đúng giờ',
        'status' => 'completed',
        'createdAt' => '2026-08-21T16:00:00Z',
    ],
    [
        'id' => 'bk-1005',
        'bookingCode' => 'GBH-8899',
        'bookingType' => 'daily',
        'roomId' => 'phong-vip',
        'roomName' => 'Phòng Hạng Sang Ban Công VIP',
        'guestName' => 'Dương Minh Mẫn',
        'guestPhone' => '0793295664',
        'guestEmail' => 'manduong1502@gmail.com',
        'checkInDate' => '2026-08-31',
        'checkInTime' => '14:00',
        'checkOutDate' => '2026-09-02',
        'checkOutTime' => '12:00',
        'nightsCount' => 2,
        'adults' => 2,
        'children' => 0,
        'totalPrice' => 1300000,
        'specialRequests' => 'Phòng view đẹp, nhận phòng sớm',
        'staffNotes' => 'Khách VIP, đã đồng bộ Google Sheets',
        'status' => 'confirmed',
        'createdAt' => '2026-08-31T23:22:00Z',
    ]
];

function getStoredBookings($bookingsFile, $defaultBookings) {
    if (file_exists($bookingsFile)) {
        $content = @file_get_contents($bookingsFile);
        if ($content) {
            $json = json_decode($content, true);
            if (is_array($json) && count($json) > 0) {
                return $json;
            }
        }
    }
    @file_put_contents($bookingsFile, json_encode($defaultBookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    return $defaultBookings;
}

function triggerGoogleSheetsWebhook($booking) {
    try {
        $webhookUrl = 'https://script.google.com/macros/s/AKfycbzUUx2Msg5NCm6W2Ngm79XnJy8KPeDfaVyC5XAO2MQl2DBjE9xdJwZfVk5PkAKXhYwWyA/exec';
        
        $payload = json_encode([
            'action' => 'new_booking',
            'bookingCode' => $booking['bookingCode'] ?? $booking['booking_code'],
            'bookingType' => ($booking['bookingType'] ?? $booking['booking_type']) === 'daily' ? 'Theo Ngày' : 'Theo Giờ',
            'roomName' => $booking['roomName'] ?? $booking['room_name'],
            'guestName' => $booking['guestName'] ?? $booking['guest_name'],
            'guestPhone' => $booking['guestPhone'] ?? $booking['guest_phone'],
            'guestEmail' => $booking['guestEmail'] ?? $booking['guest_email'],
            'checkInDate' => $booking['checkInDate'] ?? $booking['check_in_date'],
            'checkInTime' => $booking['checkInTime'] ?? $booking['check_in_time'],
            'checkOutDate' => $booking['checkOutDate'] ?? $booking['check_out_date'],
            'checkOutTime' => $booking['checkOutTime'] ?? $booking['check_out_time'],
            'duration' => ($booking['bookingType'] ?? $booking['booking_type']) === 'daily' 
                ? (($booking['nightsCount'] ?? $booking['nights_count'] ?? 1) . ' đêm') 
                : (($booking['hoursCount'] ?? $booking['hours_count'] ?? 2) . ' giờ'),
            'guests' => ($booking['adults'] ?? 1) . ' Lớn, ' . ($booking['children'] ?? 0) . ' Trẻ',
            'totalPrice' => number_format($booking['totalPrice'] ?? $booking['total_price'] ?? 0, 0, ',', '.') . ' VNĐ',
            'status' => $booking['status'] ?? 'Chờ xác nhận',
            'specialRequests' => ($booking['specialRequests'] ?? $booking['special_requests']) ?: 'Không',
            'createdAt' => date('d/m/Y H:i:s')
        ]);

        $ch = curl_init($webhookUrl);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 4);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_exec($ch);
        curl_close($ch);
    } catch (Exception $e) {}
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // If MySQL PDO is available, read from DB
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC");
                $dbBookings = $stmt->fetchAll();
                if (!empty($dbBookings)) {
                    echo json_encode(['success' => true, 'data' => $dbBookings]);
                    exit();
                }
            } catch (Exception $e) {}
        }

        // File-based JSON storage
        $bookings = getStoredBookings($bookingsFile, $defaultBookings);
        echo json_encode(['success' => true, 'data' => $bookings]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['guestName']) || empty($input['guestPhone'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin khách hàng']);
            exit();
        }

        $bookingCode = $input['bookingCode'] ?? ('GBH-' . rand(1000, 9999));
        $bookingType = $input['bookingType'] ?? 'daily';
        $roomId = $input['roomId'] ?? 'phong-a';
        $roomName = $input['roomName'] ?? 'Phòng Khách Sạn';
        $guestName = $input['guestName'];
        $guestPhone = $input['guestPhone'];
        $guestEmail = $input['guestEmail'] ?? '';
        $checkInDate = $input['checkInDate'] ?? date('Y-m-d');
        $checkInTime = $input['checkInTime'] ?? '14:00';
        $checkOutDate = $input['checkOutDate'] ?? date('Y-m-d');
        $checkOutTime = $input['checkOutTime'] ?? '12:00';
        $hoursCount = isset($input['hoursCount']) ? intval($input['hoursCount']) : null;
        $nightsCount = isset($input['nightsCount']) ? intval($input['nightsCount']) : 1;
        $adults = intval($input['adults'] ?? 1);
        $children = intval($input['children'] ?? 0);
        $totalPrice = floatval($input['totalPrice'] ?? 0);
        $specialRequests = $input['specialRequests'] ?? '';
        $status = $input['status'] ?? 'pending';
        $staffNotes = $input['staffNotes'] ?? '';
        $createdAt = date('c');

        $newRecord = [
            'id' => 'bk-' . time() . rand(100, 999),
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
            'createdAt' => $createdAt
        ];

        // 1. Save to JSON file storage
        $bookings = getStoredBookings($bookingsFile, $defaultBookings);
        array_unshift($bookings, $newRecord);
        @file_put_contents($bookingsFile, json_encode($bookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // 2. Save to MySQL if available
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO bookings (booking_code, booking_type, room_id, room_name, guest_name, guest_phone, guest_email, check_in_date, check_in_time, check_out_date, check_out_time, hours_count, nights_count, adults, children, total_price, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$bookingCode, $bookingType, $roomId, $roomName, $guestName, $guestPhone, $guestEmail, $checkInDate, $checkInTime, $checkOutDate, $checkOutTime, $hoursCount, $nightsCount, $adults, $children, $totalPrice, $specialRequests, $status]);
            } catch (Exception $e) {}
        }

        // 3. Trigger Google Sheets
        triggerGoogleSheetsWebhook($newRecord);

        // 4. Send Confirmation Email via SMTP
        try {
            sendBookingConfirmationEmail($newRecord);
        } catch (Exception $e) {}

        echo json_encode([
            'success' => true,
            'data' => $newRecord,
            'message' => 'Tạo đơn đặt phòng thành công! Mã đơn: ' . $bookingCode
        ]);
        break;

    case 'PUT':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);
        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID đơn']);
            exit();
        }

        $bookings = getStoredBookings($bookingsFile, $defaultBookings);
        foreach ($bookings as &$b) {
            if ($b['id'] == $input['id']) {
                if (isset($input['status'])) $b['status'] = $input['status'];
                if (isset($input['staffNotes'])) $b['staffNotes'] = $input['staffNotes'];
                break;
            }
        }
        @file_put_contents($bookingsFile, json_encode($bookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'message' => 'Đã cập nhật trạng thái đơn!']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID đơn']);
            exit();
        }
        $bookings = getStoredBookings($bookingsFile, $defaultBookings);
        $filtered = array_values(array_filter($bookings, function($b) use ($id) {
            return ($b['id'] ?? '') != $id;
        }));
        @file_put_contents($bookingsFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'message' => 'Đã xóa đơn đặt phòng!']);
        break;
}
