<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - BOOKINGS REST API
// Hỗ trợ CRUD đơn đặt phòng + Tự động trigger Google Sheets Webhook
// =========================================================================

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mailer.php';

$method = $_SERVER['REQUEST_METHOD'];

// Function to trigger dual-sync to Google Sheets in background
function triggerGoogleSheetsWebhook($booking, $pdo) {
    try {
        if (!$pdo) return;
        $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'gsheet_webhook_url'");
        $stmt->execute();
        $webhookUrl = $stmt->fetchColumn();

        if (!empty($webhookUrl)) {
            $payload = json_encode([
                'action' => 'new_booking',
                'bookingCode' => $booking['booking_code'],
                'bookingType' => $booking['booking_type'] === 'daily' ? 'Theo Ngày' : 'Theo Giờ',
                'roomName' => $booking['room_name'],
                'guestName' => $booking['guest_name'],
                'guestPhone' => $booking['guest_phone'],
                'guestEmail' => $booking['guest_email'],
                'checkInDate' => $booking['check_in_date'],
                'checkInTime' => $booking['check_in_time'],
                'checkOutDate' => $booking['check_out_date'],
                'checkOutTime' => $booking['check_out_time'],
                'duration' => $booking['booking_type'] === 'daily' ? ($booking['nights_count'] . ' đêm') : ($booking['hours_count'] . ' giờ'),
                'guests' => $booking['adults'] . ' Lớn, ' . $booking['children'] . ' Trẻ',
                'totalPrice' => number_format($booking['total_price'], 0, ',', '.') . ' VNĐ',
                'status' => $booking['status'],
                'specialRequests' => $booking['special_requests'] ?: 'Không',
                'createdAt' => date('d/m/Y H:i:s')
            ]);

            $ch = curl_init($webhookUrl);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 3);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_exec($ch);
            curl_close($ch);
        }
    } catch (Exception $e) {
        // Silently fail webhook so main booking is not blocked
    }
}

switch ($method) {
    case 'GET':
        // Lấy danh sách đơn đặt phòng
        if (!$pdo) {
            echo json_encode(['success' => true, 'data' => []]);
            exit();
        }
        $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC");
        $bookings = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $bookings]);
        break;

    case 'POST':
        // Tạo đơn đặt phòng mới
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['guestName']) || empty($input['guestPhone'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin khách hàng']);
            exit();
        }

        $bookingCode = 'GBH-' . rand(1000, 9999);
        $bookingType = $input['bookingType'] ?? 'daily';
        $roomId = $input['roomId'] ?? '';
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

        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO bookings (booking_code, booking_type, room_id, room_name, guest_name, guest_phone, guest_email, check_in_date, check_in_time, check_out_date, check_out_time, hours_count, nights_count, adults, children, total_price, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
            $stmt->execute([$bookingCode, $bookingType, $roomId, $roomName, $guestName, $guestPhone, $guestEmail, $checkInDate, $checkInTime, $checkOutDate, $checkOutTime, $hoursCount, $nightsCount, $adults, $children, $totalPrice, $specialRequests]);
            
            $bookingData = [
                'booking_code' => $bookingCode,
                'booking_type' => $bookingType,
                'room_name' => $roomName,
                'guest_name' => $guestName,
                'guest_phone' => $guestPhone,
                'guest_email' => $guestEmail,
                'check_in_date' => $checkInDate,
                'check_in_time' => $checkInTime,
                'check_out_date' => $checkOutDate,
                'check_out_time' => $checkOutTime,
                'hours_count' => $hoursCount,
                'nights_count' => $nightsCount,
                'adults' => $adults,
                'children' => $children,
                'total_price' => $totalPrice,
                'special_requests' => $specialRequests,
                'status' => 'pending'
            ];

            // 1. Tự động gửi Email thông báo cho Lễ tân & Khách hàng
            sendBookingEmails($bookingData);

            // 2. Trigger Google Sheets Webhook for automatic parallel backup
            triggerGoogleSheetsWebhook($bookingData, $pdo);
        } else {
            // Trường hợp Local fallback không có DB PDO, vẫn cố gắng gửi email
            $bookingData = [
                'booking_code' => $bookingCode,
                'booking_type' => $bookingType,
                'room_name' => $roomName,
                'guest_name' => $guestName,
                'guest_phone' => $guestPhone,
                'guest_email' => $guestEmail,
                'check_in_date' => $checkInDate,
                'check_in_time' => $checkInTime,
                'check_out_date' => $checkOutDate,
                'check_out_time' => $checkOutTime,
                'hours_count' => $hoursCount,
                'nights_count' => $nightsCount,
                'adults' => $adults,
                'children' => $children,
                'total_price' => $totalPrice,
                'special_requests' => $specialRequests,
                'status' => 'pending'
            ];
            sendBookingEmails($bookingData);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Đặt phòng thành công! Đã gửi thông báo đến bộ phận lễ tân.',
            'bookingCode' => $bookingCode
        ]);
        break;

    case 'PUT':
        // Cập nhật trạng thái đơn đặt phòng
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['id']) || empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dữ liệu cập nhật không hợp lệ']);
            exit();
        }

        if ($pdo) {
            $stmt = $pdo->prepare("UPDATE bookings SET status = ?, staff_notes = ? WHERE id = ?");
            $stmt->execute([$input['status'], $input['staffNotes'] ?? '', $input['id']]);
        }

        echo json_encode(['success' => true, 'message' => 'Cập nhật đơn đặt phòng thành công']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if ($id && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = ?");
            $stmt->execute([$id]);
        }
        echo json_encode(['success' => true, 'message' => 'Xóa đơn thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
