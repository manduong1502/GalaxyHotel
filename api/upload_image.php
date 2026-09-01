<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

// Target directory: ../images/uploads/
$uploadDir = dirname(__DIR__) . '/images/uploads/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}

// 1. Handle Multipart Form-Data File Upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    
    // Check file size (max 15MB)
    if ($file['size'] > 15 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Kích thước file quá lớn (tối đa 15MB)']);
        exit;
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    if (!$ext) {
        $ext = 'jpg';
    }
    $ext = strtolower($ext);

    $filename = 'img_' . date('Ymd_His') . '_' . rand(1000, 9999) . '.' . $ext;
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        @chmod($targetPath, 0644);
        echo json_encode([
            'success' => true,
            'message' => 'Tải lên hình ảnh thành công!',
            'url' => '/images/uploads/' . $filename,
            'filename' => $filename
        ]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Không thể lưu file trên máy chủ. Vui lòng kiểm tra quyền thư mục images/uploads'
        ]);
        exit;
    }
}

// 2. Handle JSON / Base64 Upload
$rawInput = file_get_contents('php://input');
if ($rawInput) {
    $data = json_decode($rawInput, true);
    if (isset($data['base64'])) {
        $base64Data = $data['base64'];
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
            $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
            $type = strtolower($type[1]);
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                $type = 'jpg';
            }
            $base64Data = base64_decode($base64Data);
            if ($base64Data === false) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Giải mã base64 thất bại']);
                exit;
            }

            $filename = 'img_' . date('Ymd_His') . '_' . rand(1000, 9999) . '.' . $type;
            $targetPath = $uploadDir . $filename;

            if (file_put_contents($targetPath, $base64Data)) {
                @chmod($targetPath, 0644);
                echo json_encode([
                    'success' => true,
                    'message' => 'Tải lên hình ảnh base64 thành công!',
                    'url' => '/images/uploads/' . $filename,
                    'filename' => $filename
                ]);
                exit;
            }
        }
    }
}

http_response_code(400);
echo json_encode([
    'success' => false, 
    'message' => 'Vui lòng chọn file hình ảnh hợp lệ (hoặc file quá dung lượng máy chủ cho phép)'
]);
