-- =========================================================
-- GALAXY BOUTIQUE HOTEL - DATABASE SCHEMA (MySQL / MariaDB)
-- Tương thích hoàn toàn với hosting AZDIGI cPanel / phpMyAdmin
-- =========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. BẢNG TÀI KHOẢN QUẢN TRỊ (users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `fullname` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'receptionist') DEFAULT 'receptionist',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mật khẩu mặc định: admin / galaxy2026 (hoặc letan / 123456)
INSERT INTO `users` (`username`, `password`, `fullname`, `role`) VALUES
('admin', '$2y$10$e8vE8F9e8Y6lOqW2/u4gOeN9p2I8qW9h7x0X.sLzO8nUeD9vI2nO6', 'Quản Trị Viên (Admin)', 'admin'),
('letan', '$2y$10$e8vE8F9e8Y6lOqW2/u4gOeN9p2I8qW9h7x0X.sLzO8nUeD9vI2nO6', 'Lễ Tân Khách Sạn', 'receptionist')
ON DUPLICATE KEY UPDATE `fullname` = VALUES(`fullname`);

-- 2. BẢNG HẠNG PHÒNG & BẢNG GIÁ (rooms)
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name_vi` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `subtitle_vi` VARCHAR(255),
  `subtitle_en` VARCHAR(255),
  `price_per_night` DECIMAL(12,2) NOT NULL DEFAULT 650000.00,
  `price_hourly_first2h` DECIMAL(12,2) NOT NULL DEFAULT 150000.00,
  `price_hourly_extra` DECIMAL(12,2) NOT NULL DEFAULT 50000.00,
  `max_adults` INT NOT NULL DEFAULT 2,
  `max_children` INT NOT NULL DEFAULT 1,
  `area_sqm` INT NOT NULL DEFAULT 15,
  `bed_type_vi` VARCHAR(100),
  `bed_type_en` VARCHAR(100),
  `view_vi` VARCHAR(100),
  `view_en` VARCHAR(100),
  `amenities_json` TEXT,
  `images_json` TEXT,
  `description_vi` TEXT,
  `description_en` TEXT,
  `status` ENUM('available', 'occupied', 'cleaning', 'maintenance') DEFAULT 'available',
  `is_popular` TINYINT(1) DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chèn 8 phòng thực tế của Galaxy Hotel
INSERT INTO `rooms` (`id`, `name_vi`, `name_en`, `slug`, `subtitle_vi`, `subtitle_en`, `price_per_night`, `price_hourly_first2h`, `price_hourly_extra`, `max_adults`, `max_children`, `area_sqm`, `bed_type_vi`, `bed_type_en`, `view_vi`, `view_en`, `images_json`, `status`, `is_popular`) VALUES
('phong-a', 'Phòng A (Standard Deluxe)', 'Room A (Standard Deluxe)', 'phong-a', 'Không gian ấm cúng, thiết kế hiện đại và tiện nghi hoàn hảo cho 2 người', 'Cozy atmosphere, modern design and perfect comfort for 2 guests', 650000.00, 150000.00, 50000.00, 2, 1, 15, '1 Giường Đôi Queen (1.6m x 2.0m)', '1 Queen Double Bed (1.6m x 2.0m)', 'Cửa sổ đón gió tự nhiên', 'Natural Breeze Window', '[\"/images/rooms/phong-a.jpg\",\"/images/rooms/phong-ad.jpg\"]', 'available', 1),
('phong-ad', 'Phòng AD (Deluxe Triple)', 'Room AD (Deluxe Triple)', 'phong-ad', 'Không gian rộng rãi, thoáng mát dành cho nhóm 3 khách hoặc gia đình nhỏ', 'Spacious and airy room for 3 guests or small families', 650000.00, 180000.00, 60000.00, 3, 1, 18, '1 Giường Đôi King + 1 Giường Đơn', '1 King Bed + 1 Single Bed', 'Cửa sổ đón ánh sáng tự nhiên', 'Daylight Window', '[\"/images/rooms/phong-ad.jpg\",\"/images/rooms/phong-a.jpg\"]', 'available', 0),
('phong-b', 'Phòng B (Superior Triple)', 'Room B (Superior Triple)', 'phong-b', 'Thiết kế tinh tế, không gian yên tĩnh và tiện nghi hoàn hảo cho kỳ nghỉ trọn vẹn', 'Refined design, quiet space and full amenities for a complete holiday', 650000.00, 180000.00, 60000.00, 3, 1, 20, '1 Giường Đôi lớn (1.8m x 2.0m) + 1 Giường Đơn', '1 Large King Bed + 1 Single Bed', 'Hướng phố Quận 1 thoáng đãng', 'Open District 1 City Scenery', '[\"/images/rooms/phong-b.jpg\",\"/images/hero-1.jpg\"]', 'available', 1),
('phong-c', 'Phòng C (Family Suite - 5 Khách)', 'Room C (Family Suite - 5 Guests)', 'phong-c', 'Không gian gia đình rộng 25m², 2 giường đôi lớn cho tối đa 5 người lưu trú', 'Spacious 25sqm family room with 2 large double beds accommodating up to 5 guests', 650000.00, 200000.00, 70000.00, 5, 2, 25, '2 Giường Đôi King Size (1.6m x 2.0m)', '2 King Double Beds (1.6m x 2.0m)', 'Cửa sổ đón gió & ánh sáng tự nhiên', 'Breeze & Natural Daylight Window', '[\"/images/rooms/phong-c.jpg\",\"/images/rooms/phong-d.jpg\"]', 'available', 1),
('phong-d', 'Phòng D (Grand Family - 5 Khách)', 'Room D (Grand Family - 5 Guests)', 'phong-d', 'Phòng lớn nhất 28m² với 2 giường đôi Queen, cửa sổ lớn view phố thoáng mát', 'Largest 28sqm suite with 2 Queen beds and large panoramic windows', 650000.00, 200000.00, 70000.00, 5, 2, 28, '2 Giường Queen Size (1.8m x 2.0m)', '2 Queen Beds (1.8m x 2.0m)', 'Cửa sổ lớn toàn cảnh góc phố', 'Large Window with Street Corner View', '[\"/images/rooms/phong-d.jpg\",\"/images/rooms/phong-b.jpg\"]', 'available', 0),
('phong-e', 'Phòng E (Executive King)', 'Room E (Executive King)', 'phong-e', 'Không gian ấm cúng, sang trọng và yên tĩnh dành riêng cho giấc ngủ sâu', 'Cozy, elegant and peaceful space dedicated to restful deep sleep', 650000.00, 160000.00, 50000.00, 2, 1, 18, '1 Giường King Size êm ái (1.8m x 2.0m)', '1 Plush King Bed (1.8m x 2.0m)', 'Không gian yên tĩnh, cách âm tốt', 'Quiet & Soundproofed Ambience', '[\"/images/rooms/phong-a.jpg\",\"/images/hero-2.jpg\"]', 'available', 0),
('phong-don-tiet-kiem', 'Phòng Đơn Tiết Kiệm (Không Cửa Sổ)', 'Budget Single Room (No Window)', 'phong-don-tiet-kiem', 'Góc nghỉ yên tĩnh, gọn gàng và đầy đủ tiện nghi với mức giá siêu tiết kiệm', 'Quiet, compact and fully equipped retreat at an ultra-budget rate', 390000.00, 120000.00, 40000.00, 1, 1, 14, '1 Giường Đôi (1.4m x 2.0m)', '1 Double Bed (1.4m x 2.0m)', 'Yên tĩnh tuyệt đối trong nhà', 'Total Indoor Tranquility', '[\"/images/rooms/phong-a.jpg\",\"/images/rooms/phong-ad.jpg\"]', 'available', 0),
('phong-doi-tieu-chuan', 'Phòng Đôi Tiêu Chuẩn (Không Cửa Sổ)', 'Standard Double Room (No Window)', 'phong-doi-tieu-chuan', 'Không gian ấm cúng dành cho hai người, sạch sẽ và thoải mái ngay trung tâm', 'Cozy space for two, clean and comfortable right in downtown', 420000.00, 140000.00, 40000.00, 2, 1, 16, '1 Giường Đôi Queen (1.6m x 2.0m)', '1 Queen Double Bed (1.6m x 2.0m)', 'Không gian yên tĩnh', 'Quiet Indoor Ambience', '[\"/images/rooms/phong-b.jpg\",\"/images/rooms/phong-c.jpg\"]', 'available', 0)
ON DUPLICATE KEY UPDATE `name_vi` = VALUES(`name_vi`);

-- 3. BẢNG ĐƠN ĐẶT PHÒNG (bookings)
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_code` VARCHAR(20) NOT NULL UNIQUE,
  `booking_type` ENUM('daily', 'hourly') NOT NULL DEFAULT 'daily',
  `room_id` VARCHAR(50) NOT NULL,
  `room_name` VARCHAR(150) NOT NULL,
  `guest_name` VARCHAR(100) NOT NULL,
  `guest_phone` VARCHAR(30) NOT NULL,
  `guest_email` VARCHAR(100),
  `check_in_date` DATE NOT NULL,
  `check_in_time` VARCHAR(10) NOT NULL DEFAULT '14:00',
  `check_out_date` DATE NOT NULL,
  `check_out_time` VARCHAR(10) NOT NULL DEFAULT '12:00',
  `hours_count` INT DEFAULT NULL,
  `nights_count` INT DEFAULT NULL,
  `adults` INT NOT NULL DEFAULT 1,
  `children` INT NOT NULL DEFAULT 0,
  `total_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `special_requests` TEXT,
  `staff_notes` TEXT,
  `status` ENUM('pending', 'confirmed', 'checked_in', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_room_id` (`room_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_check_in` (`check_in_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG CÀI ĐẶT HỆ THỐNG & GOOGLE SHEETS WEBHOOK (settings)
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` VARCHAR(50) PRIMARY KEY,
  `setting_value` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('hotel_name', 'Galaxy Boutique Hotel'),
('hotel_address', '269/19 Đề Thám, P. Bến Thành, Quận 1, TP. Hồ Chí Minh'),
('hotel_phone', '028 2248 7782'),
('hotel_zalo', '079 329 5664'),
('hotel_email', 'galaxyboutiquehotel2022@gmail.com'),
('gsheet_webhook_url', '')
ON DUPLICATE KEY UPDATE `setting_key` = `setting_key`;

SET FOREIGN_KEY_CHECKS = 1;
