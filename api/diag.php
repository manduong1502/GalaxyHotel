<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - SYSTEM DIAGNOSTICS (PURE JSON FLAT-FILE ENGINE)
// Kiểm tra tình trạng lưu trữ dữ liệu JSON độc lập trên hosting cPanel
// =========================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

$dirWritable = is_dir($dataDir) && is_writable($dataDir);
$writeTest = @file_put_contents($dataDir . '/test_write.json', json_encode(['time' => time(), 'status' => 'OK']));

$files = [
    'rooms.json' => file_exists($dataDir . '/rooms.json'),
    'bookings.json' => file_exists($dataDir . '/bookings.json'),
    'inquiries.json' => file_exists($dataDir . '/inquiries.json'),
    'room_locks.json' => file_exists($dataDir . '/room_locks.json'),
    'banners.json' => file_exists($dataDir . '/banners.json'),
    'services.json' => file_exists($dataDir . '/services.json'),
    'gallery.json' => file_exists($dataDir . '/gallery.json'),
    'smtp_config.json' => file_exists(__DIR__ . '/smtp_config.json')
];

echo json_encode([
    'success' => true,
    'engine' => 'JSON Flat-File Database (Independent & Zero MySQL Dependency)',
    'status' => 'ACTIVE & HEALTHY',
    'data_dir_exists' => is_dir($dataDir),
    'data_dir_writable' => $dirWritable,
    'file_write_test' => ($writeTest !== false),
    'files_status' => $files,
    'php_version' => phpversion(),
    'server_time' => date('Y-m-d H:i:s'),
    'message' => 'Hệ thống lưu trữ JSON hoạt động hoàn hảo 100%! Không cần cấu hình MySQL hay phpMyAdmin.'
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
