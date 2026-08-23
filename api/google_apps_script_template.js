/**
 * =========================================================================
 * GALAXY BOUTIQUE HOTEL - GOOGLE APPS SCRIPT WEBHOOK (DUAL-SYNC BACKUP)
 * Hướng dẫn cài đặt sao lưu tự động vào Google Sheets cho chủ khách sạn:
 * 
 * 1. Mở một Google Sheet mới trên trình duyệt (https://sheets.new)
 * 2. Đổi tên Sheet thành: "Galaxy Hotel - Quản Lý Đơn Đặt Phòng"
 * 3. Tạo hàng tiêu đề ở Dòng 1 gồm:
 *    [Thời Gian, Mã Đơn, Loại Đặt, Tên Phòng, Tên Khách, SĐT, Email, Nhận Phòng, Trả Phòng, Thời Lượng, Số Khách, Tổng Tiền, Trạng Thái, Yêu Cầu]
 * 4. Vào Tiện ích mở rộng (Extensions) -> Apps Script
 * 5. Xóa hết code cũ và DÁN TOÀN BỘ CODE BÊN DƯỚI vào
 * 6. Bấm Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 * 7. Chọn loại: Ứng dụng web (Web app)
 *    - Thực thi dưới dạng: Tôi (Me)
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)
 * 8. Bấm Triển khai -> Sao chép URL ứng dụng web (Web App URL)
 * 9. Dán URL này vào mục Cài đặt (Settings) trong trang Admin của Galaxy Hotel!
 * =========================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Ghi một dòng mới vào Google Sheet
    sheet.appendRow([
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.bookingCode || "GBH-NEW",
      data.bookingType || "Theo Ngày",
      data.roomName || "",
      data.guestName || "",
      data.guestPhone || "",
      data.guestEmail || "",
      data.checkInDate + " " + (data.checkInTime || ""),
      data.checkOutDate + " " + (data.checkOutTime || ""),
      data.duration || "",
      data.guests || "",
      data.totalPrice || "",
      data.status || "Chờ duyệt",
      data.specialRequests || ""
    ]);

    // Format tự động cho dòng vừa thêm
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 14).setVerticalAlignment("middle");

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Galaxy Boutique Hotel Webhook is Active and Ready!");
}
