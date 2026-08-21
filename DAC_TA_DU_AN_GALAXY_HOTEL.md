# TÀI LIỆU ĐẶC TẢ YÊU CẦU & KIẾN TRÚC KỸ THUẬT DỰ ÁN
# WEBSITE KHÁCH SẠN GALAXY (GALAXY HOTEL)

---

## MỤC LỤC
1. [Tổng Quan Dự Án & Định Vị Thương Hiệu](#1-tổng-quan-dự-án--định-vị-thương-hiệu)
2. [Đánh Giá & Phân Tích Website Mẫu (nhathalavish.com)](#2-đánh-giá--phân-tích-website-mẫu-nhathalavishcom)
3. [Đề Xuất Công Nghệ & Kiến Trúc Hệ Thống (Tech Stack)](#3-đề-xuất-công-nghệ--kiến-trúc-hệ-thống-tech-stack)
4. [Đặc Tả Chi Tiết Các Phân Hệ Chức Năng (Feature Specifications)](#4-đặc-tả-chi-tiết-các-phân-hệ-chức-năng-feature-specifications)
5. [Thiết Kế Cơ Sở Dữ Liệu Google Sheets (Database Schema)](#5-thiết-kế-cơ-sở-dữ-liệu-google-sheets-database-schema)
6. [Thiết Kế Google Apps Script API & Luồng Tự Động Hóa Email](#6-thiết-kế-google-apps-script-api--luồng-tự-động-hóa-email)
7. [Quy Chuẩn Thiết Kế Giao Diện (UI/UX Design Standards)](#7-quy-chuẩn-thiết-kế-giao-diện-uiux-design-standards)
8. [Lộ Trình Triển Khai (Project Roadmap)](#8-lộ-trình-triển-khai-project-roadmap)

---

## 1. TỔNG QUAN DỰ ÁN & ĐỊNH VỊ THƯƠNG HIỆU

- **Tên dự án:** Galaxy Hotel Official Website & Booking Engine
- **Mục tiêu:** Xây dựng cổng thông tin và hệ thống đặt phòng trực tuyến sang trọng, tốc độ cao, hỗ trợ đặt phòng linh hoạt **theo Giờ (Hourly)** và **theo Ngày (Daily)**, đồng bộ trực tiếp với **Google Sheets** để quản lý đơn đặt và phòng ốc với chi phí vận hành 0 VNĐ.
- **Đối tượng khách hàng mục tiêu:**
  - Khách du lịch, công tác trong và ngoài nước (cần giao diện song ngữ Anh - Việt mượt mà).
  - Khách hàng có nhu cầu nghỉ ngơi ngắn giờ (transit, công tác trong ngày, nghỉ trưa) hoặc nghỉ dưỡng dài ngày.
  - Ban quản trị khách sạn cần quản lý vận hành tinh gọn qua Google Sheets và nhận thông báo tức thì qua Email.

---

## 2. ĐÁNH GIÁ & PHÂN TÍCH WEBSITE MẪU (nhathalavish.com)

### 2.1. Điểm mạnh của website mẫu
- Bố cục danh mục rõ ràng (Trang chủ, Giới thiệu, Hạng phòng, Nhà hàng, Phòng gym, Hình ảnh, Liên hệ).
- Đã có tính năng chuyển đổi ngôn ngữ Việt - Anh cơ bản.
- Có hiển thị hotline và thông tin pháp nhân ở chân trang.

### 2.2. Điểm yếu & Các hạn chế cần khắc phục triệt để trên Galaxy Hotel
1. **Thiết kế thị giác (UI):**
   - Sử dụng công nghệ giao diện cũ (Bootstrap 3/jQuery, FontAwesome đời cũ), thiếu chiều sâu và cảm giác cao cấp (luxury feel).
   - Màu sắc và độ tương phản chưa tối ưu; chữ trên banner slider khó đọc.
   - Chưa áp dụng các chuẩn thiết kế hiện đại như Glassmorphism, Micro-interactions, Dynamic Bento Grid.
2. **Trải nghiệm người dùng (UX) & Booking Flow:**
   - **Thiếu Booking Engine thực tế:** Khách hàng vào xem chỉ có form liên hệ thô sơ, không lọc được phòng theo ngày/giờ và số lượng khách thực tế.
   - **Không có tính năng đặt phòng theo Giờ (Hourly Booking):** Đây là phân khúc doanh thu rất lớn của các khách sạn hiện đại.
   - **Không có lịch kiểm tra phòng trống (Availability Calendar):** Khách không biết ngày/giờ nào phòng còn trống trước khi liên hệ.
   - **Chưa tối ưu Mobile:** Menu responsive cơ bản, các nút bấm nhỏ, chưa tối ưu vùng ngón tay cái (thumb zone) của người dùng điện thoại.
3. **Hiệu năng & Vận hành:**
   - Tốc độ tải trang phụ thuộc vào hosting truyền thống, thiếu cơ chế bộ nhớ đệm (caching) và SSR/SSG.
   - Hệ thống quản trị phức tạp, không đồng bộ tiện lợi với công cụ làm việc quen thuộc của chủ khách sạn (như Google Sheets).

---

## 3. ĐỀ XUẤT CÔNG NGHỆ & KIẾN TRÚC HỆ THỐNG (TECH STACK)

### 3.1. Bảng so sánh các phương án công nghệ

| Tiêu chí | Phương án 1: Next.js 14+ / React + TypeScript (KHUYÊN DÙNG) | Phương án 2: Vite + React SPA | Phương án 3: HTML/CSS/Vanilla JS thuần |
| :--- | :--- | :--- | :--- |
| **Tối ưu SEO khách sạn** | ⭐⭐⭐⭐⭐ Cực cao (Server-Side Rendering & Static Generation) | ⭐⭐⭐ Trung bình (Cần prerender) | ⭐⭐⭐⭐ Tốt nhưng bảo trì khó |
| **Trải nghiệm UI/UX & Tốc độ** | ⭐⭐⭐⭐⭐ Tải trang tức thì, hiệu ứng mượt mà (Framer Motion) | ⭐⭐⭐⭐ Nhanh nhưng tải ban đầu chậm hơn | ⭐⭐⭐ Dễ bị giật nếu nhiều script |
| **Đa ngôn ngữ (i18n)** | ⭐⭐⭐⭐⭐ Chuẩn hóa URL (`/vi`, `/en`), SEO quốc tế tốt | ⭐⭐⭐ Tự chuyển đổi bằng State | ⭐⭐ Phải tạo 2 file HTML riêng biệt |
| **Bảo mật kết nối API Google** | ⭐⭐⭐⭐⭐ API Routes ẩn Webhook Key / App Script URL an toàn | ⭐⭐⭐ Lộ URL Webhook phía Client | ⭐⭐⭐ Lộ URL Webhook |
| **Chi phí hạ tầng** | **0 VNĐ / tháng** (Deploy Vercel / Cloudflare) | **0 VNĐ / tháng** | **0 VNĐ / tháng** |

### 3.2. Kiến trúc giải pháp lựa chọn: **Next.js + TypeScript + Tailwind CSS + Google Apps Script**

```
+-----------------------------------------------------------------------------------+
|                           NGƯỜI DÙNG / KHÁCH HÀNG                                |
|  [Desktop / Tablet / Smartphone] (Giao diện chuẩn Song ngữ VI / EN)               |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                     FRONTEND: NEXT.JS APP ROUTER + TAILWIND CSS                   |
|  - Booking Bar (Đặt theo Ngày / Đặt theo Giờ)                                     |
|  - Room Details & Interactive Availability Calendar                               |
|  - Fast Booking Modal + Validation                                                |
|  - Client-Side i18n & Currency Formatter (VND / USD)                              |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ (Secure Internal API Routes / Proxy)
+-----------------------------------------------------------------------------------+
|                     GOOGLE APPS SCRIPT (GAS) - SERVERLESS ENGINE                 |
|  - Endpoint DoGet: Trả dữ liệu Phòng, Giá, Trạng thái, Lịch trống (JSON)          |
|  - Endpoint DoPost: Nhận đơn đặt phòng, Kiểm tra trùng lịch, Ghi dữ liệu          |
|  - Service: MailApp.sendEmail() -> Gửi thông báo tức thì tới Admin & Khách hàng   |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        GOOGLE SHEETS (HỆ CƠ SỞ DỮ LIỆU)                           |
|  [Sheet 1: Rooms]        [Sheet 2: Bookings]       [Sheet 3: BlockedSlots]        |
|  [Sheet 4: Settings]     [Sheet 5: Services]       [Sheet 6: CustomerLeads]       |
+-----------------------------------------------------------------------------------+
```

---

## 4. ĐẶC TẢ CHI TIẾT CÁC PHÂN HỆ CHỨC NĂNG

### Phân hệ 1: Hệ thống Đa Ngôn Ngữ (Bilingual System VI/EN)
- Chuyển đổi linh hoạt 1-click giữa Tiếng Việt (VI) và Tiếng Anh (EN) trên thanh Header hoặc Mobile Drawer.
- Lưu trạng thái lựa chọn ngôn ngữ vào `localStorage` và đồng bộ URL.
- Toàn bộ nội dung tĩnh, tên phòng, tiện nghi, điều khoản và email thông báo đều được thiết kế song ngữ.

### Phân hệ 2: Danh Mục Hạng Phòng & Bảng Giá Chi Tiết
- Hiển thị danh sách các hạng phòng:
  - *Standard Room (Phòng Tiêu Chuẩn)*
  - *Superior Room (Phòng Cao Cấp)*
  - *Deluxe City View (Phòng Deluxe Hướng Phố)*
  - *Galaxy Executive Suite (Phòng Suite Hạng Sang)*
  - *Family Suite (Phòng Gia Đình)*
- Mỗi thẻ phòng hiển thị:
  - Ảnh đại diện chất lượng cao (hỗ trợ Slider/Gallery nhiều ảnh).
  - Diện tích ($m^2$), Số lượng khách tối đa (Người lớn + Trẻ em), Loại giường (King/Twin).
  - Tiện nghi nổi bật (Bồn tắm, Ban công, Smart TV, Minibar, Wifi tốc độ cao...).
  - Bảng giá minh bạch: **Giá theo Giờ (2 giờ đầu + giờ tiếp theo)** & **Giá theo Đêm/Ngày**.
  - Quy định nhận/trả phòng chuẩn (Check-in từ 14:00 - Check-out trước 12:00 hôm sau).

### Phân hệ 3: Bộ Lọc & Tìm Kiếm Phòng Thông Minh (Dual-Mode Booking Bar)
- **Tab 1: Đặt theo Ngày (Daily Booking)**
  - Chọn Ngày nhận phòng (Check-in Date) & Ngày trả phòng (Check-out Date).
  - Giờ nhận/trả phòng mặc định hiển thị rõ ràng (14:00 - 12:00).
  - Chọn số khách: Người lớn, Trẻ em, Số phòng cần đặt.
- **Tab 2: Đặt theo Giờ (Hourly / Day-use Booking)**
  - Chọn Ngày sử dụng.
  - Chọn Khung giờ nhận phòng (Ví dụ: 09:00, 13:00, 20:00...) và Khung giờ trả phòng (Số giờ dự kiến: 2h, 3h, 4h...).
  - Chọn số lượng khách.
- **Bộ lọc kết quả:** Hệ thống lọc ra đúng các hạng phòng phù hợp với số lượng khách và còn slot trống trong khoảng thời gian đã chọn.

### Phân hệ 4: Lịch Kiểm Tra Phòng Trống Trực Quan (Room Availability Calendar)
- Khi khách bấm vào trang chi tiết của từng phòng, xuất hiện **Bảng lịch tương tác (Interactive Calendar)**:
  - Hiển thị theo tháng với trạng thái màu sắc:
    - 🟢 *Màu xanh lá:* Còn trống toàn bộ các khung giờ.
    - 🟡 *Màu vàng/cam:* Đã có khách đặt một số khung giờ (bấm vào xem chi tiết các slot giờ còn lại).
    - 🔴 *Màu đỏ:* Đã kín phòng / Khóa lịch.
  - Khách có thể click trực tiếp vào ngày/khung giờ trên lịch để điền thông tin đặt phòng ngay.

### Phân hệ 5: Luồng Đặt Phòng & Xác Nhận Đơn Hàng (Quick Checkout Flow)
1. **Bước 1:** Khách chọn phòng từ kết quả tìm kiếm hoặc từ trang chi tiết.
2. **Bước 2 (Form thông tin):**
   - Họ và tên, Số điện thoại (bắt buộc), Email, Ghi chú đặc biệt (yêu cầu tầng cao, giường đôi, xe đưa đón...).
   - Tóm tắt chi phí dự tính (Số đêm/giờ x Đơn giá + Phụ phí nếu có).
3. **Bước 3 (Gửi đơn):**
   - Khách bấm "Gửi Yêu Cầu Đặt Phòng".
   - Hệ thống hiển thị popup thành công kèm Mã Đặt Phòng (Booking Code, VD: `GLX-202608-8832`).
   - Hướng dẫn bước tiếp theo: Lễ tân khách sạn sẽ gọi điện xác nhận trong vòng 10-15 phút.

### Phân hệ 6: Quản Trị Dữ Liệu Qua Google Sheets & Tự Động Hóa Email
- **Ghi nhận đơn đặt phòng:** Dữ liệu tự động đẩy vào Sheet `Bookings` kèm thời gian thực (Timestamp).
- **Gửi Email thông báo Admin:** Ngay khi có đơn mới, Google Apps Script kích hoạt hàm gửi email tự động tới hòm thư Admin (`admin@galaxyhotel.vn` hoặc Gmail của chủ KS):
  - Tiêu đề: `[ĐƠN ĐẶT PHÒNG MỚI - GALAXY HOTEL] Mã: GLX-8832 - Khách: Nguyễn Văn A`
  - Nội dung HTML định dạng đẹp: Chi tiết phòng, Thời gian Check-in/Out, Số điện thoại để Admin chỉ cần 1 click là gọi điện xác nhận ngay.
- **Gửi Email xác nhận cho Khách hàng (Tùy chọn):** Email tóm tắt đơn và thông tin liên hệ của khách sạn.

### Phân hệ 7: Trang Quản Trị Admin (Web Admin Portal & Quản Lý Google Sheets)
- **Phương thức 1 (Trực tiếp qua Google Sheets):** Dành cho thao tác nhanh gọn trên máy tính/điện thoại di động bằng app Google Sheets (sửa giá, thêm phòng, đổi ảnh, khóa phòng đột xuất).
- **Phương thức 2 (Trang Admin Dashboard trên Web):**
  - Đăng nhập bảo mật (Mã PIN / Mật khẩu Admin).
  - Quản lý danh sách phòng: Chỉnh sửa giá giờ, giá ngày, mô tả, bật/tắt hiển thị phòng.
  - Quản lý đơn đặt phòng: Cập nhật trạng thái (Chờ xác nhận -> Đã xác nhận -> Đã nhận phòng -> Đã hủy).
  - Khóa lịch phòng nhanh (dành cho trường hợp khách đặt trực tiếp tại quầy hoặc sửa chữa phòng).

### Phân hệ 8: Các Trang Giới Thiệu & Dịch Vụ Khách Sạn
- **Trang Giới thiệu (About Galaxy):** Câu chuyện thương hiệu, vị trí địa lý đắc địa, cam kết chất lượng dịch vụ, chứng chỉ & giải thưởng.
- **Trang Dịch vụ & Tiện ích (Services & Amenities):**
  - Nhà hàng ẩm thực (Galaxy Sky Dining & Buffet Sáng).
  - Dịch vụ Spa & Massage trị liệu thư giãn.
  - Dịch vụ Đưa đón sân bay (Airport Shuttle Service).
  - Phòng tập Gym & Bể bơi vô cực (Infinity Pool).
  - Dịch vụ Tour tham quan địa phương & Cho thuê xe.
- **Trang Thư viện Ảnh (Gallery):** Phân chia danh mục ảnh (Toàn cảnh, Phòng nghỉ, Ẩm thực, Tiện ích, Sự kiện).
- **Trang Liên hệ & Vị trí (Contact & Map):** Tích hợp Google Maps, Form gửi tin nhắn nhanh, Hotline Zalo/WhatsApp.

---

## 5. THIẾT KẾ CƠ SỞ DỮ LIỆU GOOGLE SHEETS (DATABASE SCHEMA)

### Bảng 1: Sheet `Rooms` (Danh sách phòng)
| Cột | Tên trường | Kiểu dữ liệu | Ví dụ | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| A | `room_id` | Text | `STD-01` | Mã định danh phòng |
| B | `name_vi` | Text | `Phòng Standard Hướng Phố` | Tên tiếng Việt |
| C | `name_en` | Text | `Standard City View Room` | Tên tiếng Anh |
| D | `slug` | Text | `standard-city-view` | Đường dẫn URL |
| E | `price_per_night` | Number | `850000` | Giá theo đêm (VNĐ) |
| F | `price_hourly_first2h` | Number | `350000` | Giá 2 giờ đầu (VNĐ) |
| G | `price_hourly_extra` | Number | `100000` | Giá mỗi giờ tiếp theo (VNĐ) |
| H | `max_adults` | Number | `2` | Số người lớn tối đa |
| I | `max_children` | Number | `1` | Số trẻ em tối đa |
| J | `area_sqm` | Number | `28` | Diện tích ($m^2$) |
| K | `bed_type` | Text | `1 Giường King (1m8)` | Loại giường |
| L | `amenities_vi` | Text | `Wifi, Bồn tắm, Minibar, Smart TV` | Tiện nghi (phân cách dấu phẩy) |
| M | `amenities_en` | Text | `Wifi, Bathtub, Minibar, Smart TV` | Tiện nghi tiếng Anh |
| N | `images` | Text (JSON/URL) | `url1.jpg, url2.jpg, url3.jpg` | Danh sách link ảnh |
| O | `description_vi` | Long Text | `Phòng tiêu chuẩn ấm cúng...` | Mô tả tiếng Việt |
| P | `description_en` | Long Text | `Cozy standard room...` | Mô tả tiếng Anh |
| Q | `is_active` | Boolean | `TRUE` | Trạng thái hiển thị trên web |

### Bảng 2: Sheet `Bookings` (Danh sách đơn đặt phòng)
| Cột | Tên trường | Kiểu dữ liệu | Ví dụ | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| A | `booking_id` | Text | `GLX-202608-8832` | Mã đơn hàng |
| B | `created_at` | DateTime | `2026-08-21 19:30:00` | Thời gian đặt |
| C | `room_id` | Text | `STD-01` | Mã phòng khách chọn |
| D | `room_name` | Text | `Phòng Standard Hướng Phố` | Tên phòng tại thời điểm đặt |
| E | `booking_type` | Text | `HOURLY` hoặc `DAILY` | Hình thức: Theo Giờ / Theo Ngày |
| F | `check_in_date` | Date/Text | `2026-08-25` | Ngày nhận phòng |
| G | `check_in_time` | Time/Text | `14:00` | Giờ nhận phòng |
| H | `check_out_date` | Date/Text | `2026-08-26` | Ngày trả phòng |
| I | `check_out_time` | Time/Text | `12:00` | Giờ trả phòng |
| J | `duration` | Text | `1 Đêm` hoặc `3 Giờ` | Thời lượng sử dụng |
| K | `guest_name` | Text | `Nguyễn Văn A` | Tên khách hàng |
| L | `guest_phone` | Text | `0901234567` | Số điện thoại liên hệ |
| M | `guest_email` | Text | `guest@example.com` | Email khách |
| N | `adults_count` | Number | `2` | Số lượng người lớn |
| O | `children_count` | Number | `0` | Số lượng trẻ em |
| P | `total_amount` | Number | `850000` | Tổng tiền dự tính (VNĐ) |
| Q | `special_requests` | Text | `Cần nhận phòng tầng cao` | Ghi chú của khách |
| R | `status` | Text | `PENDING` / `CONFIRMED` / `CANCELLED` | Trạng thái xử lý |
| S | `admin_note` | Text | `Đã gọi xác nhận lúc 19:45` | Ghi chú của lễ tân |

### Bảng 3: Sheet `BlockedSlots` (Khóa lịch / Đã có khách)
| Cột | Tên trường | Kiểu dữ liệu | Ví dụ | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| A | `slot_id` | Text | `BLK-001` | Mã khóa lịch |
| B | `room_id` | Text | `STD-01` | Mã phòng bị khóa |
| C | `start_datetime` | DateTime | `2026-08-25 14:00` | Bắt đầu khóa |
| D | `end_datetime` | DateTime | `2026-08-26 12:00` | Kết thúc khóa |
| E | `reason` | Text | `Đơn GLX-8832` / `Bảo trì phòng` | Lý do |

### Bảng 4: Sheet `Settings` (Cài đặt hệ thống)
- `hotel_name`: Galaxy Hotel & Suites
- `hotline`: 028 1234 5678 - 0988 xxx xxx
- `email_admin`: booking@galaxyhotel.vn
- `address`: Số 123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh
- `standard_checkin`: 14:00
- `standard_checkout`: 12:00
- `cancellation_policy_vi`: Miễn phí hủy phòng trước 24 giờ nhận phòng...
- `cancellation_policy_en`: Free cancellation up to 24 hours prior to check-in...

---

## 6. THIẾT KẾ GOOGLE APPS SCRIPT API & LUỒNG TỰ ĐỘNG HÓA EMAIL

### 6.1. Các Action API cung cấp
- **`GET ?action=getRooms`**: Trả về toàn bộ danh sách phòng và tiện nghi dạng JSON.
- **`GET ?action=getRoomDetail&slug=...`**: Trả về chi tiết 1 phòng kèm danh sách ngày/giờ đã bị đặt.
- **`GET ?action=checkAvailability&roomId=...&start=...&end=...`**: Kiểm tra phòng có trùng lịch trong khoảng thời gian hay không.
- **`POST ?action=createBooking`**: Ghi nhận đơn mới vào Sheet `Bookings`, tự động ghi vào `BlockedSlots`, sau đó trigger hàm gửi Email thông báo.
- **`POST ?action=updateRoom`**: Cập nhật thông tin phòng từ Web Admin (yêu cầu Secret API Token).

### 6.2. Mẫu Email Thông Báo Tự Động Gửi Cho Admin
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
  <div style="background-color: #0f172a; color: #f8fafc; padding: 24px; text-align: center;">
    <h2 style="margin: 0; color: #d4af37; font-size: 24px;">GALAXY HOTEL</h2>
    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">THÔNG BÁO: CÓ ĐƠN ĐẶT PHÒNG MỚI</p>
  </div>
  <div style="padding: 24px; color: #334155;">
    <p style="font-size: 16px;">Chào Lễ Tân / Quản Lý,</p>
    <p>Khách sạn vừa nhận được một yêu cầu đặt phòng mới từ website với thông tin chi tiết như sau:</p>
    
    <div style="background: #f8fafc; border-left: 4px solid #d4af37; padding: 16px; margin: 16px 0; border-radius: 4px;">
      <p style="margin: 4px 0;"><strong>Mã đơn hàng:</strong> <span style="color: #0f172a; font-weight: bold;">{{BOOKING_ID}}</span></p>
      <p style="margin: 4px 0;"><strong>Hạng phòng:</strong> {{ROOM_NAME}}</p>
      <p style="margin: 4px 0;"><strong>Hình thức:</strong> {{BOOKING_TYPE_TEXT}} ({{DURATION}})</p>
      <p style="margin: 4px 0;"><strong>Thời gian nhận phòng:</strong> <span style="color: #15803d; font-weight: bold;">{{CHECKIN_TIME}} - {{CHECKIN_DATE}}</span></p>
      <p style="margin: 4px 0;"><strong>Thời gian trả phòng:</strong> {{CHECKOUT_TIME}} - {{CHECKOUT_DATE}}</p>
      <p style="margin: 4px 0;"><strong>Số khách:</strong> {{ADULTS}} Người lớn, {{CHILDREN}} Trẻ em</p>
      <p style="margin: 4px 0;"><strong>Tổng tiền dự kiến:</strong> <span style="color: #b45309; font-size: 18px; font-weight: bold;">{{TOTAL_AMOUNT}} VNĐ</span></p>
    </div>

    <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Thông Tin Khách Hàng</h3>
    <ul style="list-style: none; padding-left: 0; line-height: 1.8;">
      <li>👤 <strong>Họ tên:</strong> {{GUEST_NAME}}</li>
      <li>📞 <strong>Số điện thoại:</strong> <a href="tel:{{GUEST_PHONE}}" style="color: #2563eb; font-weight: bold; font-size: 16px;">{{GUEST_PHONE}} (Bấm để gọi ngay)</a></li>
      <li>✉️ <strong>Email:</strong> {{GUEST_EMAIL}}</li>
      <li>📝 <strong>Ghi chú:</strong> {{SPECIAL_REQUESTS}}</li>
    </ul>

    <div style="text-align: center; margin-top: 30px;">
      <a href="{{SHEET_URL}}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Mở Bảng Google Sheets Quản Lý</a>
    </div>
  </div>
</div>
```

---

## 7. QUY CHUẨN THIẾT KẾ GIAO DIỆN (UI/UX DESIGN STANDARDS)

### 7.1. Bảng màu chủ đạo (Luxury Color Palette)
- **Primary / Brand Dark:** `#0A0F1D` (Deep Cosmic Navy/Black) - Tạo sự huyền bí, sang trọng chuẩn 5 sao.
- **Accent / Metallic Gold:** `#D4AF37` / `#E5C07B` (Vàng kim cao cấp) - Dùng cho các chi tiết điểm nhấn, badge, nút CTA chính.
- **Secondary Surface:** `#141C2E` và `#F8F9FA` (Hỗ trợ Dark Mode & Light Luxury).
- **Text & Typography:** 
  - Tiêu đề: Font Serif hiện đại sang trọng (`Playfair Display` hoặc `Cinzel` / `Cormorant Garamond`).
  - Nội dung: Font Grotesk tinh tế, dễ đọc (`Plus Jakarta Sans` hoặc `Outfit`).

### 7.2. Chuẩn mực Responsive & Mobile First
- Navbar dạng Floating Pill (đảo nổi) tinh tế trên máy tính, chuyển sang Bottom Action Bar hoặc Drawer Menu tối ưu ngón tay cái trên Smartphone.
- Form tìm kiếm phòng dạng Sticky Bar cố định ở chân màn hình điện thoại giúp khách hàng có thể tra cứu và đặt phòng bất kỳ lúc nào khi đang cuộn trang.

---

## 8. LỘ TRÌNH TRIỂN KHAI (PROJECT ROADMAP)

- **Giai đoạn 1 (Thiết kế & Khung cấu trúc):** Xây dựng bộ UI Component, Navigation, Bilingual Switcher, Hero Section và Room Showcase.
- **Giai đoạn 2 (Booking Engine & Availability Calendar):** Hoàn thiện bộ lọc tìm kiếm theo Ngày / theo Giờ, Lịch hiển thị trạng thái phòng trống tương tác, Form Checkout.
- **Giai đoạn 3 (Google Sheets Backend & Email Integration):** Viết mã nguồn Google Apps Script, kết nối API 2 chiều, thiết lập Webhook lưu trữ đơn và trigger gửi Email tự động.
- **Giai đoạn 4 (Admin Dashboard & Tối ưu hóa):** Trang quản lý phòng Admin, kiểm thử tương thích Mobile 100%, đo lường tốc độ tải trang (PageSpeed Insights) và bàn giao.
