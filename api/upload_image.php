<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - PERSISTENT IMAGE UPLOAD API
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Chỉ hỗ trợ phương thức POST']);
    exit;
}

// Determine best persistent upload directory
$webRoot = dirname(__DIR__);
$possibleDirs = [
    $webRoot . '/uploads/',
    $webRoot . '/images/uploads/',
    __DIR__ . '/uploads/'
];

$uploadDir = null;
$urlPrefix = '/uploads/';

foreach ($possibleDirs as $idx => $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    if (is_dir($dir) && is_writable($dir)) {
        $uploadDir = $dir;
        if ($idx === 0) {
            $urlPrefix = '/uploads/';
        } elseif ($idx === 1) {
            $urlPrefix = '/images/uploads/';
        } else {
            $urlPrefix = '/api/uploads/';
        }
        break;
    }
}

// Fallback to first dir
if (!$uploadDir) {
    $uploadDir = $possibleDirs[0];
    @mkdir($uploadDir, 0777, true);
    $urlPrefix = '/uploads/';
}

// Auto-create .htaccess in uploadDir to allow direct image access
$htPath = $uploadDir . '.htaccess';
if (!file_exists($htPath)) {
    @file_put_contents($htPath, "<IfModule mod_authz_core.c>\nRequire all granted\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nAllow from all\n</IfModule>\n");
}

// 1. Handle Multipart Form-Data File Upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    
    // Check file size (max 20MB)
    if ($file['size'] > 20 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Kích thước file quá lớn (tối đa 20MB)']);
        exit;
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    if (!$ext) {
        $ext = 'jpg';
    }
    $ext = strtolower($ext);
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])) {
        $ext = 'jpg';
    }

    $filename = 'img_' . date('Ymd_His') . '_' . rand(1000, 9999) . '.' . $ext;
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        @chmod($targetPath, 0644);
        echo json_encode([
            'success' => true,
            'message' => 'Tải lên hình ảnh thành công!',
            'url' => $urlPrefix . $filename,
            'filename' => $filename
        ]);
        exit;
    } else {
        // Fallback: read file to base64 so data is NEVER lost
        $fileContent = @file_get_contents($file['tmp_name']);
        if ($fileContent) {
            $base64 = 'data:image/' . $ext . ';base64,' . base64_encode($fileContent);
            echo json_encode([
                'success' => true,
                'message' => 'Đã lưu ảnh dạng trực tiếp an toàn!',
                'url' => $base64,
                'isBase64' => true
            ]);
            exit;
        }
    }
}

// 2. Handle JSON / Base64 Upload
$rawInput = file_get_contents('php://input');
if ($rawInput) {
    $data = json_decode($rawInput, true);
    if (isset($data['base64']) && !empty($data['base64'])) {
        $base64Data = $data['base64'];
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
            $rawB64 = substr($base64Data, strpos($base64Data, ',') + 1);
            $typeExt = strtolower($type[1]);
            if (!in_array($typeExt, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                $typeExt = 'jpg';
            }
            $decoded = base64_decode($rawB64);
            if ($decoded !== false) {
                $filename = 'img_' . date('Ymd_His') . '_' . rand(1000, 9999) . '.' . $typeExt;
                $targetPath = $uploadDir . $filename;

                if (@file_put_contents($targetPath, $decoded)) {
                    @chmod($targetPath, 0644);
                    echo json_encode([
                        'success' => true,
                        'message' => 'Tải lên hình ảnh base64 thành công!',
                        'url' => $urlPrefix . $filename,
                        'filename' => $filename
                    ]);
                    exit;
                }
            }
        }
        
        // If file save failed, return base64 string directly so it remains preserved in database
        echo json_encode([
            'success' => true,
            'message' => 'Đã lưu ảnh dạng dữ liệu mã hóa an toàn!',
            'url' => $base64Data,
            'isBase64' => true
        ]);
        exit;
    }
}

http_response_code(400);
echo json_encode([
    'success' => false, 
    'message' => 'Vui lòng chọn file hình ảnh hợp lệ (hoặc file quá dung lượng máy chủ cho phép)'
]);
