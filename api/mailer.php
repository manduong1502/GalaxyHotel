<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - EMAIL NOTIFICATION SYSTEM
// Tự động gửi email thông báo cho Lễ tân và Khách hàng khi có đơn đặt phòng
// =========================================================================

/**
 * Gửi email qua giao thức SMTP Socket (Google Gmail / cPanel Webmail)
 */
function sendSmtpEmail($to, $subject, $htmlContent, $smtpConfig) {
    $host = $smtpConfig['host'] ?? 'smtp.gmail.com';
    $port = intval($smtpConfig['port'] ?? 465);
    $username = trim($smtpConfig['username'] ?? '');
    $password = str_replace(' ', '', trim($smtpConfig['password'] ?? ''));
    $fromName = $smtpConfig['from_name'] ?? 'Galaxy Boutique Hotel';

    if (empty($username) || empty($password)) {
        return false;
    }

    $socket = @fsockopen("ssl://{$host}", $port, $errno, $errstr, 15);
    if (!$socket) {
        return false;
    }

    // Đọc lời chào ban đầu từ SMTP server
    $res = fgets($socket, 515);

    // EHLO
    fputs($socket, "EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n");
    while ($line = fgets($socket, 515)) {
        if (substr($line, 3, 1) === ' ') break;
    }

    // AUTH LOGIN
    fputs($socket, "AUTH LOGIN\r\n");
    fgets($socket, 515);

    fputs($socket, base64_encode($username) . "\r\n");
    fgets($socket, 515);

    fputs($socket, base64_encode($password) . "\r\n");
    $authRes = fgets($socket, 515);
    if (substr($authRes, 0, 3) !== '235') {
        fputs($socket, "QUIT\r\n");
        fclose($socket);
        return false;
    }

    // MAIL FROM
    fputs($socket, "MAIL FROM: <{$username}>\r\n");
    fgets($socket, 515);

    // RCPT TO
    fputs($socket, "RCPT TO: <{$to}>\r\n");
    fgets($socket, 515);

    // DATA
    fputs($socket, "DATA\r\n");
    fgets($socket, 515);

    // MIME Headers
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$encodedFromName} <{$username}>\r\n";
    $headers .= "To: <{$to}>\r\n";
    $headers .= "Subject: {$encodedSubject}\r\n";
    $headers .= "Date: " . date('r') . "\r\n";
    $headers .= "X-Mailer: GalaxyHotelMailer/1.0\r\n\r\n";

    fputs($socket, $headers . $htmlContent . "\r\n.\r\n");
    $dataRes = fgets($socket, 515);

    fputs($socket, "QUIT\r\n");
    fclose($socket);

    return (substr($dataRes, 0, 3) === '250');
}

/**
 * Gửi email HTML (Ưu tiên SMTP Gmail nếu có cấu hình, nếu không dùng PHP mail)
 */
function sendHtmlEmail($to, $subject, $htmlContent, $fromName = 'Galaxy Boutique Hotel', $fromEmail = null, $replyTo = 'galaxyboutiquehotel2022@gmail.com') {
    // 1. Kiểm tra cấu hình SMTP file
    $configFile = __DIR__ . '/smtp_config.json';
    if (file_exists($configFile)) {
        $config = json_decode(file_get_contents($configFile), true);
        if (!empty($config['username']) && !empty($config['password'])) {
            $smtpResult = sendSmtpEmail($to, $subject, $htmlContent, $config);
            if ($smtpResult) {
                return true;
            }
        }
    }

    // 2. Fallback sang hàm mail() chuẩn
    if (!$fromEmail) {
        $serverHost = $_SERVER['HTTP_HOST'] ?? 'galaxyhotel269.com';
        $serverHost = explode(':', $serverHost)[0];
        $fromEmail = 'no-reply@' . $serverHost;
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

    $headers = [
        "MIME-Version: 1.0",
        "Content-type: text/html; charset=UTF-8",
        "From: {$encodedFromName} <{$fromEmail}>",
        "Reply-To: {$replyTo}",
        "X-Mailer: PHP/" . phpversion(),
        "X-Priority: 1 (Highest)",
        "X-MSMail-Priority: High",
        "Importance: High"
    ];

    return @mail($to, $encodedSubject, $htmlContent, implode("\r\n", $headers));
}

/**
 * Gửi email thông báo cho Lễ tân & Chủ khách sạn
 */
function sendReceptionNotificationEmail($booking, $recipientEmail = 'galaxyboutiquehotel2022@gmail.com') {
    $code = htmlspecialchars($booking['booking_code'] ?? 'GBH-0000');
    $guestName = htmlspecialchars($booking['guest_name'] ?? 'Khách hàng');
    $guestPhone = htmlspecialchars($booking['guest_phone'] ?? '');
    $guestEmail = htmlspecialchars($booking['guest_email'] ?? 'Không có');
    $roomName = htmlspecialchars($booking['room_name'] ?? 'Phòng Khách Sạn');
    $bookingType = ($booking['booking_type'] ?? 'daily') === 'daily' ? 'Theo Ngày / Đêm' : 'Theo Giờ Linh Hoạt';
    $duration = ($booking['booking_type'] ?? 'daily') === 'daily' 
        ? (($booking['nights_count'] ?? 1) . ' đêm') 
        : (($booking['hours_count'] ?? 2) . ' giờ');
    $checkIn = htmlspecialchars(($booking['check_in_date'] ?? '') . ' (' . ($booking['check_in_time'] ?? '14:00') . ')');
    $checkOut = htmlspecialchars(($booking['check_out_date'] ?? '') . ' (' . ($booking['check_out_time'] ?? '12:00') . ')');
    $guests = intval($booking['adults'] ?? 1) . ' Người lớn' . (intval($booking['children'] ?? 0) > 0 ? (', ' . intval($booking['children']) . ' Trẻ em') : '');
    $totalPrice = number_format(floatval($booking['total_price'] ?? 0), 0, ',', '.') . ' ₫';
    $specialRequests = htmlspecialchars($booking['special_requests'] ?? 'Không có');
    $createdAt = date('d/m/Y H:i:s');

    $subject = "🔔 [ĐƠN ĐẶT PHÒNG MỚI #{$code}] {$guestName} - {$roomName}";

    $adminUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'demo.galaxyhotel269.com');

    $html = <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #1A1A1A; padding: 28px 32px; text-align: center;">
                            <div style="color: #E8DCB9; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
                                GALAXY BOUTIQUE HOTEL
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                                THÔNG BÁO ĐƠN ĐẶT PHÒNG MỚI
                            </h1>
                            <div style="display: inline-block; background-color: #C29A64; color: #1A1A1A; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 6px; margin-top: 12px;">
                                Mã Đơn: #{$code}
                            </div>
                        </td>
                    </tr>

                    <!-- Alert Banner -->
                    <tr>
                        <td style="background-color: #FEF3C7; padding: 14px 32px; border-bottom: 1px solid #FDE68A;">
                            <p style="margin: 0; color: #92400E; font-size: 13px; font-weight: 600; text-align: center;">
                                ⚠️ Vui lòng liên hệ với khách hàng sớm nhất để xác nhận phòng!
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px;">
                            
                            <!-- Guest Info -->
                            <div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <div style="font-size: 11px; font-weight: 700; color: #8A6943; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                    👤 THÔNG TIN KHÁCH HÀNG
                                </div>
                                <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 13px;">
                                    <tr>
                                        <td width="35%" style="color: #666666;">Họ và tên:</td>
                                        <td style="font-weight: 700; color: #1A1A1A;">{$guestName}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Số điện thoại:</td>
                                        <td>
                                            <a href="tel:{$guestPhone}" style="color: #2563EB; font-weight: 700; text-decoration: none; font-size: 15px;">
                                                📞 {$guestPhone} (Bấm để gọi)
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Email:</td>
                                        <td style="color: #1A1A1A;">{$guestEmail}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Booking Details -->
                            <div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <div style="font-size: 11px; font-weight: 700; color: #8A6943; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                    🏨 CHI TIẾT ĐẶT PHÒNG
                                </div>
                                <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 13px;">
                                    <tr style="border-bottom: 1px solid #EAE6DF;">
                                        <td width="35%" style="color: #666666;">Hạng phòng:</td>
                                        <td style="font-weight: 700; color: #1A1A1A; font-size: 14px;">{$roomName}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Hình thức:</td>
                                        <td style="color: #1A1A1A; font-weight: 600;">{$bookingType} ({$duration})</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Nhận phòng (Check-in):</td>
                                        <td style="color: #047857; font-weight: 700;">{$checkIn}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Trả phòng (Check-out):</td>
                                        <td style="color: #B91C1C; font-weight: 700;">{$checkOut}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Số lượng khách:</td>
                                        <td style="color: #1A1A1A;">{$guests}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Yêu cầu đặc biệt:</td>
                                        <td style="color: #4B5563; font-style: italic;">{$specialRequests}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Price Summary -->
                            <div style="background-color: #1A1A1A; color: #FFFFFF; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px;">
                                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #A3A3A3; margin-bottom: 4px;">
                                    Tổng Tiền Dự Kiến
                                </div>
                                <div style="font-size: 26px; font-weight: 700; color: #E8DCB9;">
                                    {$totalPrice}
                                </div>
                                <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">
                                    Thời gian gửi đơn: {$createdAt}
                                </div>
                            </div>

                            <!-- CTA Button -->
                            <div style="text-align: center;">
                                <a href="{$adminUrl}" target="_blank" style="display: inline-block; background-color: #C29A64; color: #1A1A1A; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 2px 8px rgba(194, 154, 100, 0.4);">
                                    👉 Mở Trang Quản Trị Khách Sạn
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #FAF9F5; border-top: 1px solid #EAE6DF; padding: 20px 32px; text-align: center; font-size: 11px; color: #737373;">
                            <strong>Galaxy Boutique Hotel Saigon</strong><br>
                            Địa chỉ: 269/19 Đề Thám, P. Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh<br>
                            Hotline: 028 2248 7782 • Email: galaxyboutiquehotel2022@gmail.com
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

    return sendHtmlEmail($recipientEmail, $subject, $html);
}

/**
 * Gửi email xác nhận đặt phòng cho Khách hàng
 */
function sendCustomerConfirmationEmail($booking) {
    $guestEmail = trim($booking['guest_email'] ?? '');
    if (empty($guestEmail) || !filter_var($guestEmail, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $code = htmlspecialchars($booking['booking_code'] ?? 'GBH-0000');
    $guestName = htmlspecialchars($booking['guest_name'] ?? 'Quý khách');
    $guestPhone = htmlspecialchars($booking['guest_phone'] ?? '');
    $roomName = htmlspecialchars($booking['room_name'] ?? 'Phòng Khách Sạn');
    $bookingType = ($booking['booking_type'] ?? 'daily') === 'daily' ? 'Theo Ngày / Đêm' : 'Theo Giờ';
    $duration = ($booking['booking_type'] ?? 'daily') === 'daily' 
        ? (($booking['nights_count'] ?? 1) . ' đêm') 
        : (($booking['hours_count'] ?? 2) . ' giờ');
    $checkIn = htmlspecialchars(($booking['check_in_date'] ?? '') . ' (' . ($booking['check_in_time'] ?? '14:00') . ')');
    $checkOut = htmlspecialchars(($booking['check_out_date'] ?? '') . ' (' . ($booking['check_out_time'] ?? '12:00') . ')');
    $totalPrice = number_format(floatval($booking['total_price'] ?? 0), 0, ',', '.') . ' ₫';

    $subject = "Xác nhận yêu cầu đặt phòng #{$code} - Galaxy Boutique Hotel Saigon";

    $html = <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #1A1A1A; padding: 32px; text-align: center;">
                            <div style="color: #E8DCB9; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">
                                GALAXY BOUTIQUE HOTEL SAIGON
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                                XÁC NHẬN YÊU CẦU ĐẶT PHÒNG
                            </h1>
                            <div style="display: inline-block; background-color: #C29A64; color: #1A1A1A; font-weight: 700; font-size: 12px; padding: 5px 14px; border-radius: 6px; margin-top: 14px;">
                                MÃ PHÒNG: #{$code}
                            </div>
                        </td>
                    </tr>

                    <!-- Welcome Note -->
                    <tr>
                        <td style="padding: 32px 32px 16px 32px;">
                            <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
                                Xin chào <strong>{$guestName}</strong>,
                            </p>
                            <p style="font-size: 13px; line-height: 1.6; color: #4B5563; margin: 0;">
                                Cảm ơn bạn đã lựa chọn <strong>Galaxy Boutique Hotel</strong> cho kỳ lưu trú tại TP. Hồ Chí Minh. Bộ phận lễ tân của chúng tôi đã nhận được thông tin đặt phòng và sẽ liên hệ qua số điện thoại <strong>{$guestPhone}</strong> để xác nhận trong thời gian sớm nhất.
                            </p>
                        </td>
                    </tr>

                    <!-- Booking Voucher -->
                    <tr>
                        <td style="padding: 0 32px 24px 32px;">
                            <div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 12px; padding: 20px;">
                                <div style="font-size: 11px; font-weight: 700; color: #8A6943; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px dashed #D5CEBF; padding-bottom: 8px;">
                                    📋 THÔNG TIN LƯU TRÚ CỦA BẠN
                                </div>
                                <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 13px;">
                                    <tr>
                                        <td width="40%" style="color: #666666;">Hạng phòng:</td>
                                        <td style="font-weight: 700; color: #1A1A1A;">{$roomName}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Hình thức thuê:</td>
                                        <td style="color: #1A1A1A; font-weight: 600;">{$bookingType} ({$duration})</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Thời gian nhận phòng:</td>
                                        <td style="color: #047857; font-weight: 700;">{$checkIn}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Thời gian trả phòng:</td>
                                        <td style="color: #B91C1C; font-weight: 700;">{$checkOut}</td>
                                    </tr>
                                    <tr style="border-top: 1px solid #EAE6DF;">
                                        <td style="color: #666666; font-weight: 700; padding-top: 10px;">Tổng thanh toán dự kiến:</td>
                                        <td style="color: #8A6943; font-weight: 700; font-size: 16px; padding-top: 10px;">{$totalPrice}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;">
                            <div style="background-color: #F3F4F6; border-radius: 12px; padding: 18px; font-size: 12px; line-height: 1.6; color: #4B5563;">
                                <strong style="color: #1F2937; display: block; margin-bottom: 6px;">📌 Lưu ý quan trọng khi nhận phòng:</strong>
                                • <strong>Giờ nhận phòng tiêu chuẩn:</strong> Từ 14:00 | <strong>Giờ trả phòng:</strong> Trước 12:00.<br>
                                • Quý khách vui lòng xuất trình <strong>CCCD / Hộ chiếu</strong> bản gốc khi làm thủ tục tại quầy lễ tân.<br>
                                • Nếu cần hỗ trợ nhận phòng sớm hoặc gửi hành lý, vui lòng gọi hotline <strong>028 2248 7782</strong>.
                            </div>

                            <div style="margin-top: 24px; text-align: center;">
                                <a href="https://maps.google.com/?q=Galaxy+Boutique+Hotel+269/19+Đề+Thám+Quận+1" target="_blank" style="display: inline-block; background-color: #1A1A1A; color: #FFFFFF; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                                    📍 Xem Chỉ Đường Tới Khách Sạn Trên Google Maps
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #FAF9F5; border-top: 1px solid #EAE6DF; padding: 24px 32px; text-align: center; font-size: 11px; color: #737373;">
                            <strong>GALAXY BOUTIQUE HOTEL SAIGON</strong><br>
                            📍 269/19 Đề Thám, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh<br>
                            📞 Hotline 24/7: <strong>028 2248 7782</strong> • ✉️ Email: galaxyboutiquehotel2022@gmail.com
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

    return sendHtmlEmail($guestEmail, $subject, $html);
}

/**
 * Gửi cả 2 email (cho Lễ tân và Khách hàng)
 */
function sendBookingEmails($booking, $receptionEmail = 'galaxyboutiquehotel2022@gmail.com') {
    $resReception = sendReceptionNotificationEmail($booking, $receptionEmail);
    $resCustomer = sendCustomerConfirmationEmail($booking);

    return [
        'reception_sent' => $resReception,
        'customer_sent' => $resCustomer
    ];
}
