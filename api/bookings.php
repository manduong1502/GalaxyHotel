<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - BOOKINGS REST API (MYSQL PRODUCTION + JSON BACKUP)
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
$bookingsFile = $dataDir . '/bookings.json';

// Initial seed bookings (including verified VIP test booking)
$defaultSeedBookings = [
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
    ],
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
    ]
];

// Helper to convert DB snake_case row to React camelCase record
function formatDbRowToRecord($row) {
    return [
        'id' => (string)($row['id'] ?? ('bk-' . rand(1000, 9999))),
        'bookingCode' => $row['booking_code'] ?? '',
        'bookingType' => $row['booking_type'] ?? 'daily',
        'roomId' => $row['room_id'] ?? 'phong-a',
        'roomName' => $row['room_name'] ?? 'Phòng Khách Sạn',
        'guestName' => $row['guest_name'] ?? '',
        'guestPhone' => $row['guest_phone'] ?? '',
        'guestEmail' => $row['guest_email'] ?? '',
        'checkInDate' => $row['check_in_date'] ?? date('Y-m-d'),
        'checkInTime' => $row['check_in_time'] ?? '14:00',
        'checkOutDate' => $row['check_out_date'] ?? date('Y-m-d'),
        'checkOutTime' => $row['check_out_time'] ?? '12:00',
        'hoursCount' => isset($row['hours_count']) ? intval($row['hours_count']) : null,
        'nightsCount' => isset($row['nights_count']) ? intval($row['nights_count']) : null,
        'adults' => intval($row['adults'] ?? 1),
        'children' => intval($row['children'] ?? 0),
        'totalPrice' => floatval($row['total_price'] ?? 0),
        'specialRequests' => $row['special_requests'] ?? '',
        'staffNotes' => $row['staff_notes'] ?? '',
        'status' => $row['status'] ?? 'pending',
        'createdAt' => $row['created_at'] ?? date('c'),
    ];
}

function triggerGoogleSheetsWebhook($booking) {
    try {
        $webhookUrl = 'https://script.google.com/macros/s/AKfycbzUUx2Msg5NCm6W2Ngm79XnJy8KPeDfaVyC5XAO2MQl2DBjE9xdJwZfVk5PkAKXhYwWyA/exec';
        
        $payload = json_encode([
            'action' => 'new_booking',
            'bookingCode' => $booking['bookingCode'] ?? $booking['booking_code'] ?? ('GBH-' . rand(1000, 9999)),
            'bookingType' => ($booking['bookingType'] ?? $booking['booking_type'] ?? 'daily') === 'daily' ? 'Theo Ngày' : 'Theo Giờ',
            'roomName' => $booking['roomName'] ?? $booking['room_name'] ?? 'Phòng Khách Sạn',
            'guestName' => $booking['guestName'] ?? $booking['guest_name'] ?? 'Khách Hàng',
            'guestPhone' => $booking['guestPhone'] ?? $booking['guest_phone'] ?? '',
            'guestEmail' => $booking['guestEmail'] ?? $booking['guest_email'] ?? '',
            'checkInDate' => $booking['checkInDate'] ?? $booking['check_in_date'] ?? date('Y-m-d'),
            'checkInTime' => $booking['checkInTime'] ?? $booking['check_in_time'] ?? '14:00',
            'checkOutDate' => $booking['checkOutDate'] ?? $booking['check_out_date'] ?? date('Y-m-d'),
            'checkOutTime' => $booking['checkOutTime'] ?? $booking['check_out_time'] ?? '12:00',
            'duration' => ($booking['bookingType'] ?? $booking['booking_type'] ?? 'daily') === 'daily' 
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
        $result = [];

        // 1. Read from MySQL if connected
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC");
                $rows = $stmt->fetchAll();

                // If MySQL table is empty, auto seed initial bookings including Duong Minh Man
                if (empty($rows)) {
                    $insertStmt = $pdo->prepare("INSERT INTO bookings (booking_code, booking_type, room_id, room_name, guest_name, guest_phone, guest_email, check_in_date, check_in_time, check_out_date, check_out_time, hours_count, nights_count, adults, children, total_price, special_requests, staff_notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    foreach ($defaultSeedBookings as $seed) {
                        try {
                            $insertStmt->execute([
                                $seed['bookingCode'],
                                $seed['bookingType'],
                                $seed['roomId'],
                                $seed['roomName'],
                                $seed['guestName'],
                                $seed['guestPhone'],
                                $seed['guestEmail'],
                                $seed['checkInDate'],
                                $seed['checkInTime'],
                                $seed['checkOutDate'],
                                $seed['checkOutTime'],
                                $seed['hoursCount'] ?? null,
                                $seed['nightsCount'] ?? null,
                                $seed['adults'],
                                $seed['children'],
                                $seed['totalPrice'],
                                $seed['specialRequests'],
                                $seed['staffNotes'],
                                $seed['status']
                            ]);
                        } catch (Exception $ex) {}
                    }
                    // Re-query
                    $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC");
                    $rows = $stmt->fetchAll();
                }

                if (!empty($rows)) {
                    foreach ($rows as $row) {
                        $result[] = formatDbRowToRecord($row);
                    }
                    echo json_encode(['success' => true, 'data' => $result]);
                    exit();
                }
            } catch (Exception $e) {}
        }

        // 2. Read from JSON file fallback
        if (file_exists($bookingsFile)) {
            $content = @file_get_contents($bookingsFile);
            if ($content) {
                $json = json_decode($content, true);
                if (is_array($json) && count($json) > 0) {
                    echo json_encode(['success' => true, 'data' => $json]);
                    exit();
                }
            }
        }

        // Save default seed bookings to JSON
        @file_put_contents($bookingsFile, json_encode($defaultSeedBookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'data' => $defaultSeedBookings]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['guestName']) || empty($input['guestPhone'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ họ tên và số điện thoại']);
            exit();
        }

        $bookingCode = $input['bookingCode'] ?? ('GBH-' . rand(1000, 9999));
        $bookingType = $input['bookingType'] ?? 'daily';
        $roomId = $input['roomId'] ?? 'phong-a';
        $roomName = $input['roomName'] ?? 'Phòng Khách Sạn';
        $guestName = trim($input['guestName']);
        $guestPhone = trim($input['guestPhone']);
        $guestEmail = trim($input['guestEmail'] ?? '');
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

        // 1. Lưu vào MySQL Database (Thực thi INSERT vào bảng bookings)
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO bookings (booking_code, booking_type, room_id, room_name, guest_name, guest_phone, guest_email, check_in_date, check_in_time, check_out_date, check_out_time, hours_count, nights_count, adults, children, total_price, special_requests, staff_notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $bookingCode,
                    $bookingType,
                    $roomId,
                    $roomName,
                    $guestName,
                    $guestPhone,
                    $guestEmail,
                    $checkInDate,
                    $checkInTime,
                    $checkOutDate,
                    $checkOutTime,
                    $hoursCount,
                    $nightsCount,
                    $adults,
                    $children,
                    $totalPrice,
                    $specialRequests,
                    $staffNotes,
                    $status
                ]);
                $newRecord['id'] = (string)$pdo->lastInsertId();
            } catch (Exception $e) {
                // Log MySQL error if any
                @file_put_contents($dataDir . '/mysql_error.log', date('c') . " - " . $e->getMessage() . "\n", FILE_APPEND);
            }
        }

        // 2. Lưu vào JSON Backup File
        $currentBookings = $defaultSeedBookings;
        if (file_exists($bookingsFile)) {
            $content = @file_get_contents($bookingsFile);
            if ($content) {
                $json = json_decode($content, true);
                if (is_array($json)) $currentBookings = $json;
            }
        }
        array_unshift($currentBookings, $newRecord);
        @file_put_contents($bookingsFile, json_encode($currentBookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // 3. Đồng bộ sang Google Sheets
        triggerGoogleSheetsWebhook($newRecord);

        // 4. Gửi Email thông báo qua SMTP
        try {
            sendBookingConfirmationEmail($newRecord);
        } catch (Exception $e) {}

        echo json_encode([
            'success' => true,
            'data' => $newRecord,
            'message' => 'Lưu đơn đặt phòng thành công vào Cơ sở dữ liệu! Mã: ' . $bookingCode
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

        $id = $input['id'];
        $status = $input['status'] ?? null;
        $staffNotes = $input['staffNotes'] ?? null;

        // Update in MySQL
        if (isset($pdo) && $pdo) {
            try {
                if ($status !== null && $staffNotes !== null) {
                    $stmt = $pdo->prepare("UPDATE bookings SET status = ?, staff_notes = ? WHERE id = ? OR booking_code = ?");
                    $stmt->execute([$status, $staffNotes, $id, $id]);
                } else if ($status !== null) {
                    $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ? OR booking_code = ?");
                    $stmt->execute([$status, $id, $id]);
                } else if ($staffNotes !== null) {
                    $stmt = $pdo->prepare("UPDATE bookings SET staff_notes = ? WHERE id = ? OR booking_code = ?");
                    $stmt->execute([$staffNotes, $id, $id]);
                }
            } catch (Exception $e) {}
        }

        // Update in JSON file
        if (file_exists($bookingsFile)) {
            $content = @file_get_contents($bookingsFile);
            if ($content) {
                $json = json_decode($content, true);
                if (is_array($json)) {
                    foreach ($json as &$b) {
                        if (($b['id'] ?? '') == $id || ($b['bookingCode'] ?? '') == $id) {
                            if ($status !== null) $b['status'] = $status;
                            if ($staffNotes !== null) $b['staffNotes'] = $staffNotes;
                            break;
                        }
                    }
                    @file_put_contents($bookingsFile, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                }
            }
        }

        echo json_encode(['success' => true, 'message' => 'Đã cập nhật trạng thái đơn!']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID đơn']);
            exit();
        }

        // Delete from MySQL
        if (isset($pdo) && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = ? OR booking_code = ?");
                $stmt->execute([$id, $id]);
            } catch (Exception $e) {}
        }

        // Delete from JSON
        if (file_exists($bookingsFile)) {
            $content = @file_get_contents($bookingsFile);
            if ($content) {
                $json = json_decode($content, true);
                if (is_array($json)) {
                    $filtered = array_values(array_filter($json, function($b) use ($id) {
                        return ($b['id'] ?? '') != $id && ($b['bookingCode'] ?? '') != $id;
                    }));
                    @file_put_contents($bookingsFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                }
            }
        }

        echo json_encode(['success' => true, 'message' => 'Đã xóa đơn đặt phòng khỏi Cơ sở dữ liệu!']);
        break;
}
