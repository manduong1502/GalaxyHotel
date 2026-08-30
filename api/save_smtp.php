<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - SAVE SMTP CONFIGURATION API
// =========================================================================

header('Content-Type: application/json; charset=UTF-8');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $configFile = __DIR__ . '/smtp_config.json';
    if (file_exists($configFile)) {
        $config = json_decode(file_get_contents($configFile), true);
        // Ẩn mật khẩu khi trả về
        if (!empty($config['password'])) {
            $config['password'] = '••••••••••••••••';
        }
        echo json_encode(['success' => true, 'config' => $config]);
    } else {
        echo json_encode(['success' => true, 'config' => null]);
    }
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');
    $host = trim($input['host'] ?? 'smtp.gmail.com');
    $port = intval($input['port'] ?? 465);

    if (empty($username)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Vui lòng nhập địa chỉ Gmail gửi thư']);
        exit();
    }

    $configFile = __DIR__ . '/smtp_config.json';
    
    // Nếu người dùng không nhập pass mới và pass cũ đang là mask
    if ($password === '••••••••••••••••' && file_exists($configFile)) {
        $oldConfig = json_decode(file_get_contents($configFile), true);
        $password = $oldConfig['password'] ?? '';
    }

    $configData = [
        'host' => $host,
        'port' => $port,
        'username' => $username,
        'password' => $password,
        'from_name' => 'Galaxy Boutique Hotel',
        'updated_at' => date('d/m/Y H:i:s')
    ];

    file_put_contents($configFile, json_encode($configData, JSON_PRETTY_PRINT));

    echo json_encode([
        'success' => true,
        'message' => 'Đã lưu cấu hình Gmail SMTP thành công!'
    ]);
    exit();
}
