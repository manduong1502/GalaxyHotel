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
$db_name = 'galaxy_hotel';      // Thay bằng tên database trên cPanel AZDIGI
$db_user = 'galaxy_user';      // Thay bằng username database trên cPanel
$db_pass = 'GalaxyHotel@2026';  // Thay bằng password database

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Return graceful JSON error if DB connection fails
    // http_response_code(500);
    // echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    // exit();
}
