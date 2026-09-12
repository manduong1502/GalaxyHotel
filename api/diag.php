<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - SYSTEM DIAGNOSTICS (PURE JSON FLAT-FILE ENGINE)
// =========================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$webRoot = dirname(__DIR__);
$dataDir = __DIR__ . '/data';
$uploadsDir = $webRoot . '/uploads';

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0777, true);
}

// Test writing to 3 locations
$testData = json_encode(['time' => date('Y-m-d H:i:s'), 'status' => 'OK']);

$write1 = @file_put_contents($dataDir . '/test_write.json', $testData);
$err1 = error_get_last();

$write2 = @file_put_contents(__DIR__ . '/test_write.json', $testData);
$err2 = error_get_last();

$write3 = @file_put_contents($uploadsDir . '/test_write.json', $testData);
$err3 = error_get_last();

$files = [
    'data/rooms.json' => file_exists($dataDir . '/rooms.json'),
    'data/bookings.json' => file_exists($dataDir . '/bookings.json'),
    'data/inquiries.json' => file_exists($dataDir . '/inquiries.json'),
    'data/room_locks.json' => file_exists($dataDir . '/room_locks.json'),
    'data/banners.json' => file_exists($dataDir . '/banners.json'),
    'data/services.json' => file_exists($dataDir . '/services.json'),
    'data/gallery.json' => file_exists($dataDir . '/gallery.json'),
    'uploads/inquiries.json' => file_exists($uploadsDir . '/inquiries.json'),
    'api/inquiries.json' => file_exists(__DIR__ . '/inquiries.json'),
    'api/smtp_config.json' => file_exists(__DIR__ . '/smtp_config.json')
];

echo json_encode([
    'success' => true,
    'engine' => 'JSON Flat-File Database',
    'write_tests' => [
        'api/data/' => ($write1 !== false),
        'api/' => ($write2 !== false),
        'uploads/' => ($write3 !== false)
    ],
    'files_status' => $files,
    'php_version' => phpversion(),
    'server_time' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
