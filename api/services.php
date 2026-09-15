<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - SERVICES & TOURS REST API (PURE JSON ENGINE)
// Lưu trữ độc lập 100% bằng JSON, không phụ thuộc MySQL
// =========================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

// Multi-location persistence paths
function getPossibleServicesFiles() {
    $webRoot = dirname(__DIR__);
    return [
        __DIR__ . '/data/services.json',
        $webRoot . '/uploads/services.json',
        __DIR__ . '/services.json'
    ];
}

function safeFilePutContents($filePath, $content) {
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    $res = @file_put_contents($filePath, $content, LOCK_EX);
    if ($res === false) {
        $res = @file_put_contents($filePath, $content);
    }
    if ($res !== false) {
        @chmod($filePath, 0666);
    }
    return $res !== false;
}

function saveServicesJson($boxes) {
    $encoded = json_encode(array_values($boxes), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    foreach (getPossibleServicesFiles() as $path) {
        safeFilePutContents($path, $encoded);
    }
}

function loadServicesJson() {
    foreach (getPossibleServicesFiles() as $path) {
        if (file_exists($path)) {
            $content = @file_get_contents($path);
            if ($content) {
                $json = json_decode($content, true);
                if (is_array($json) && count($json) > 0) {
                    return $json;
                }
            }
        }
    }
    return null;
}

$defaultBoxes = [
    [
        'id' => 'box-1',
        'tag' => [
            'vi' => 'TOUR TRẢI NGHIỆM',
            'en' => 'LOCAL TOURS'
        ],
        'title' => [
            'vi' => 'Tour Trải Nghiệm & Khám Phá',
            'en' => 'Discovery & Sightseeing Tours'
        ],
        'desc' => [
            'vi' => 'Hỗ trợ đặt tour chất lượng cao khám phá vẻ đẹp Nam Bộ và lịch sử Sài Gòn hào hùng.',
            'en' => 'High-quality local tour booking assistance exploring Southern Vietnam beauty and historical landmarks.'
        ],
        'image' => '/images/tour-mekong.jpg',
        'hours' => [
            'vi' => '24/7 Hỗ trợ',
            'en' => '24/7 Support'
        ],
        'items' => [
            'vi' => [
                'Hành Trình Miền Tây (Mekong delta)',
                'Khám phá Địa đạo Củ Chi (Cu Chi Tunnels)',
                'Một vòng Sài Gòn (City Tour)'
            ],
            'en' => [
                'Mekong Delta Discovery Tour',
                'Cu Chi Tunnels Historical Journey',
                'Ho Chi Minh City Highlights Tour'
            ]
        ]
    ],
    [
        'id' => 'box-2',
        'tag' => [
            'vi' => 'GIẶT ỦI LẤY NHANH',
            'en' => 'EXPRESS LAUNDRY'
        ],
        'title' => [
            'vi' => 'Dịch Vụ Giặt Sấy',
            'en' => 'Laundry & Dry Cleaning'
        ],
        'desc' => [
            'vi' => 'Dịch vụ giặt sấy thơm tho sạch sẽ trong ngày, giao nhận tận phòng nhanh chóng và chu đáo.',
            'en' => 'Same-day fresh and clean laundry service with convenient room pickup and delivery.'
        ],
        'image' => '/images/towels.png',
        'hours' => [
            'vi' => 'Lấy trong ngày',
            'en' => 'Same-day Service'
        ],
        'items' => [
            'vi' => [
                'Giặt sấy khô thơm tho lấy ngay trong ngày',
                'Ủi và chăm sóc trang phục theo yêu cầu',
                'Giá cả bình dân, hỗ trợ giao nhận tại phòng'
            ],
            'en' => [
                'Fresh express wash & dry within the day',
                'Garment steaming & ironing upon request',
                'Affordable rates with room doorstep delivery'
            ]
        ]
    ],
    [
        'id' => 'box-3',
        'tag' => [
            'vi' => 'TRUNG TÂM QUẬN 1',
            'en' => 'PRIME DISTRICT 1'
        ],
        'title' => [
            'vi' => 'Vị Trí Vàng Trung Tâm Sài Gòn',
            'en' => 'Golden Central Location'
        ],
        'desc' => [
            'vi' => 'Nằm trong hẻm 269 Đề Thám yên tĩnh nhưng chỉ cách phố đi bộ Bùi Viện và chợ Bến Thành vài bước chân.',
            'en' => 'Quiet alley at 269 De Tham, steps away from vibrant Bui Vien Walking Street & Ben Thanh Market.'
        ],
        'image' => '/images/bui-vien-night.jpg',
        'hours' => [
            'vi' => 'Vị trí đắc địa',
            'en' => 'Prime Location'
        ],
        'items' => [
            'vi' => [
                'Đi bộ 2 phút ra Phố Tây Bùi Viện',
                'Đi bộ 5 phút đến Chợ Bến Thành & Công viên 23/9',
                'Gần Dinh Độc Lập, Nhà thờ Đức Bà & Bến Bạch Đằng'
            ],
            'en' => [
                '2-minute walk to Bui Vien Walking Street',
                '5-minute walk to Ben Thanh Market & September 23rd Park',
                'Close to Independence Palace, Notre Dame Cathedral & Bach Dang Wharf'
            ]
        ]
    ]
];

// Handle POST: Update Services Boxes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
        exit;
    }

    $boxes = $data;
    saveServicesJson($boxes);

    echo json_encode([
        'success' => true,
        'message' => 'Đã lưu cấu hình dịch vụ & tour thành công',
        'data' => $boxes
    ]);
    exit;
}

// Handle GET: Retrieve Services Boxes
$boxes = loadServicesJson();

if (!$boxes || count($boxes) === 0) {
    $boxes = $defaultBoxes;
    saveServicesJson($boxes);
}

echo json_encode([
    'success' => true,
    'total' => count($boxes),
    'data' => $boxes
]);
