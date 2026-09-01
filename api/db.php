<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - DATABASE CONFIG (MySQL PDO Connection)
// Cấu hình thông tin database trên hosting cPanel của AZDIGI
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = 'localhost';
$db_name = 'maacriz_galaxy';     // Tên database chính xác trên hosting cPanel AZDIGI
$db_user = 'maacriz_galaxy';     // Tên user database cPanel
$db_pass = 'GalaxyHotel@2026';   // Mật khẩu database

// Load custom config if exists (không bị ghi đè khi update code)
$customConfigFile = __DIR__ . '/db_config.php';
if (file_exists($customConfigFile)) {
    include_once $customConfigFile;
}

$pdo = null;

// Thử kết nối với thông tin cấu hình
$credentialsToTry = [
    ['host' => $db_host, 'name' => $db_name, 'user' => $db_user, 'pass' => $db_pass],
    ['host' => 'localhost', 'name' => 'maacriz_galaxy', 'user' => 'maacriz_galaxy', 'pass' => 'GalaxyHotel@2026'],
    ['host' => 'localhost', 'name' => 'maacriz_galaxy', 'user' => 'maacriz_galaxy', 'pass' => 'galaxy2026'],
    ['host' => 'localhost', 'name' => 'maacriz_galaxy', 'user' => 'maacriz_user', 'pass' => 'GalaxyHotel@2026'],
    ['host' => 'localhost', 'name' => 'galaxy_hotel', 'user' => 'galaxy_user', 'pass' => 'GalaxyHotel@2026'],
    ['host' => 'localhost', 'name' => 'galaxy_hotel', 'user' => 'root', 'pass' => '']
];

foreach ($credentialsToTry as $cred) {
    try {
        $pdo = new PDO("mysql:host={$cred['host']};dbname={$cred['name']};charset=utf8mb4", $cred['user'], $cred['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        if ($pdo) {
            break;
        }
    } catch (PDOException $e) {
        // Continue trying next combination
    }
}
