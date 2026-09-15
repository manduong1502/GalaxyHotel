<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - SAVE SMTP CONFIGURATION API
// =========================================================================

header('Content-Type: application/json; charset=UTF-8');

$method = $_SERVER['REQUEST_METHOD'];

function getPossibleSmtpConfigFiles() {
    $webRoot = dirname(__DIR__);
    return [
        __DIR__ . '/data/smtp_config.json',
        __DIR__ . '/smtp_config.json',
        $webRoot . '/uploads/smtp_config.json'
    ];
}

function loadSmtpConfig() {
    foreach (getPossibleSmtpConfigFiles() as $path) {
        if (file_exists($path)) {
            $content = @file_get_contents($path);
            if ($content) {
                $cfg = json_decode($content, true);
                if (is_array($cfg)) return $cfg;
            }
        }
    }
    return null;
}

function saveSmtpConfig($configData) {
    $encoded = json_encode($configData, JSON_PRETTY_PRINT);
    foreach (getPossibleSmtpConfigFiles() as $path) {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($path, $encoded);
        @chmod($path, 0666);
    }
}

if ($method === 'GET') {
    $config = loadSmtpConfig();
    if ($config) {
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

    $existingConfig = loadSmtpConfig();
    
    // Nếu người dùng không nhập pass mới và pass cũ đang là mask
    if ($password === '••••••••••••••••' && $existingConfig) {
        $password = $existingConfig['password'] ?? '';
    }

    $configData = [
        'host' => $host,
        'port' => $port,
        'username' => $username,
        'password' => $password,
        'from_name' => 'Galaxy Boutique Hotel',
        'updated_at' => date('d/m/Y H:i:s')
    ];

    saveSmtpConfig($configData);

    echo json_encode([
        'success' => true,
        'message' => 'Đã lưu cấu hình Gmail SMTP thành công!'
    ]);
    exit();
}
