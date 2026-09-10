<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - LIST UPLOADED IMAGES API
// Quét và trả về danh sách toàn bộ ảnh có sẵn trong thư mục /uploads/
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$webRoot = dirname(__DIR__);
$possibleDirs = [
    $webRoot . '/uploads/',
    $webRoot . '/images/uploads/',
    __DIR__ . '/uploads/'
];

$uploadDir = null;
$urlPrefix = '/uploads/';

foreach ($possibleDirs as $idx => $dir) {
    if (is_dir($dir)) {
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

if (!$uploadDir) {
    $uploadDir = $possibleDirs[0];
    @mkdir($uploadDir, 0777, true);
}

$images = [];

if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    $validExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'heic'];

    foreach ($files as $file) {
        if ($file === '.' || $file === '..' || $file === '.htaccess') {
            continue;
        }

        $filePath = $uploadDir . $file;
        if (is_file($filePath)) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, $validExts)) {
                $size = filesize($filePath);
                $mtime = filemtime($filePath);

                // Format size
                if ($size >= 1048576) {
                    $sizeFormatted = round($size / 1048576, 2) . ' MB';
                } else {
                    $sizeFormatted = round($size / 1024, 1) . ' KB';
                }

                $images[] = [
                    'filename' => $file,
                    'url' => $urlPrefix . $file,
                    'size' => $size,
                    'sizeFormatted' => $sizeFormatted,
                    'updatedAt' => date('Y-m-d H:i:s', $mtime),
                    'timestamp' => $mtime
                ];
            }
        }
    }

    // Sort newest first
    usort($images, function($a, $b) {
        return $b['timestamp'] - $a['timestamp'];
    });
}

// Also include stock images if uploads has few items
$stockDir = $webRoot . '/images/';
if (is_dir($stockDir)) {
    $stockFiles = scandir($stockDir);
    $validExts = ['jpg', 'jpeg', 'png', 'webp'];
    foreach ($stockFiles as $sFile) {
        if ($sFile === '.' || $sFile === '..' || is_dir($stockDir . $sFile)) continue;
        $ext = strtolower(pathinfo($sFile, PATHINFO_EXTENSION));
        if (in_array($ext, $validExts)) {
            $sFilePath = $stockDir . $sFile;
            $images[] = [
                'filename' => $sFile,
                'url' => '/images/' . $sFile,
                'size' => filesize($sFilePath),
                'sizeFormatted' => round(filesize($sFilePath) / 1024, 1) . ' KB',
                'updatedAt' => date('Y-m-d H:i:s', filemtime($sFilePath)),
                'timestamp' => filemtime($sFilePath)
            ];
        }
    }
}

echo json_encode([
    'success' => true,
    'total' => count($images),
    'data' => $images
]);
