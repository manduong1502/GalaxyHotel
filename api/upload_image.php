<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
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

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Vui lòng chọn file hình ảnh hợp lệ']);
    exit;
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$fileType = mime_content_type($file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Định dạng file không được hỗ trợ. Vui lòng tải lên ảnh JPG, PNG hoặc WEBP']);
    exit;
}

// 10MB maximum limit
if ($file['size'] > 10 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Kích thước file quá lớn (tối đa 10MB)']);
    exit;
}

// Target directory: ../images/uploads/
$uploadDir = __DIR__ . '/../images/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
if (!$ext) {
    $ext = ($fileType === 'image/png') ? 'png' : (($fileType === 'image/webp') ? 'webp' : 'jpg');
}

$filename = 'img_' . time() . '_' . rand(1000, 9999) . '.' . strtolower($ext);
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $publicUrl = '/images/uploads/' . $filename;
    echo json_encode([
        'success' => true,
        'message' => 'Tải lên hình ảnh thành công!',
        'url' => $publicUrl,
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Không thể lưu file trên máy chủ. Vui lòng kiểm tra quyền thư mục']);
}
