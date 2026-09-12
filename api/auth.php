<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - ADMIN AUTH REST API (STANDALONE JSON ENGINE)
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['username']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Vui lòng nhập tên đăng nhập và mật khẩu']);
    exit();
}

$username = trim($input['username']);
$password = trim($input['password']);

if (($username === 'admin' && $password === 'galaxy2026') || ($username === 'letan' && $password === '123456')) {
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $username === 'admin' ? 'usr-admin' : 'usr-letan',
            'username' => $username,
            'name' => $username === 'admin' ? 'Quản Trị Viên (Admin)' : 'Lễ Tân Khách Sạn',
            'role' => $username === 'admin' ? 'admin' : 'receptionist',
            'token' => bin2hex(random_bytes(24))
        ]
    ]);
    exit();
}

http_response_code(401);
echo json_encode(['success' => false, 'message' => 'Tên đăng nhập hoặc mật khẩu không chính xác']);
