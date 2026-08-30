<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - EMAIL TEST SCRIPT
// Kiểm tra khả năng gửi email từ hosting cPanel AZDIGI
// =========================================================================

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mailer.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$targetEmail = trim($input['email'] ?? 'galaxyboutiquehotel2022@gmail.com');

if (!filter_var($targetEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Địa chỉ email không hợp lệ']);
    exit();
}

// Giả lập 1 đơn đặt phòng mẫu để test email
$mockBooking = [
    'booking_code' => 'TEST-' . rand(1000, 9999),
    'booking_type' => 'daily',
    'room_name' => 'Phòng VIP Suite King Bed (Thử nghiệm)',
    'guest_name' => 'Nguyễn Văn A (Khách Test)',
    'guest_phone' => '0901234567',
    'guest_email' => $targetEmail,
    'check_in_date' => date('Y-m-d', strtotime('+1 day')),
    'check_in_time' => '14:00',
    'check_out_date' => date('Y-m-d', strtotime('+3 days')),
    'check_out_time' => '12:00',
    'nights_count' => 2,
    'hours_count' => null,
    'adults' => 2,
    'children' => 0,
    'total_price' => 1500000,
    'special_requests' => 'Đây là email gửi thử nghiệm kiểm tra tính năng thông báo tự động từ Admin'
];

$sent = sendReceptionNotificationEmail($mockBooking, $targetEmail);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => "Đã gửi email thử nghiệm thành công tới {$targetEmail}! Vui lòng kiểm tra Hộp thư đến (hoặc thư mục Spam/Rác)."
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => "Hàm mail() của máy chủ chưa gửi được email. Vui lòng kiểm tra cấu hình Mail Server trên cPanel AZDIGI."
    ]);
}
