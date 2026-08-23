<?php
// =========================================================================
// GALAXY BOUTIQUE HOTEL - ROOMS & PRICING REST API
// =========================================================================

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (!$pdo) {
            echo json_encode(['success' => true, 'data' => []]);
            exit();
        }
        $stmt = $pdo->query("SELECT * FROM rooms ORDER BY price_per_night DESC");
        $rooms = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $rooms]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu ID phòng']);
            exit();
        }

        if ($pdo) {
            $stmt = $pdo->prepare("UPDATE rooms SET price_per_night = ?, price_hourly_first2h = ?, price_hourly_extra = ?, status = ? WHERE id = ?");
            $stmt->execute([
                $input['pricePerNight'],
                $input['priceHourlyFirst2h'],
                $input['priceHourlyExtra'],
                $input['status'] ?? 'available',
                $input['id']
            ]);
        }

        echo json_encode(['success' => true, 'message' => 'Cập nhật giá và trạng thái phòng thành công']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
        break;
}
