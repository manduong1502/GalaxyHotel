/**
 * =========================================================================
 * GALAXY BOUTIQUE HOTEL - GOOGLE APPS SCRIPT WEBHOOK + INSTANT EMAIL SYSTEM
 * Tự động ghi đơn vào Google Sheets VÀ gửi email thông báo trực tiếp vào Inbox Gmail
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (MẤT 2 PHÚT):
 * 1. Mở trình duyệt vào link: https://sheets.new (Tạo 1 Google Sheet mới)
 * 2. Đổi tên Sheet thành: "Galaxy Hotel - Quản Lý Đơn Đặt Phòng"
 * 3. Điền tiêu đề ở Hàng 1 (Dòng đầu tiên):
 *    [Thời Gian, Mã Đơn, Loại Đặt, Tên Phòng, Tên Khách, Số Điện Thoại, Email, Nhận Phòng, Trả Phòng, Thời Lượng, Số Khách, Tổng Tiền, Trạng Thái, Yêu Cầu]
 * 4. Trên thanh menu, bấm: Tiện ích mở rộng (Extensions) -> Apps Script
 * 5. Xóa sạch mọi code cũ có trong khung và DÁN TOÀN BỘ CODE NÀY VÀO.
 * 6. (Tùy chọn): Đổi biến NOTIFICATION_EMAIL bên dưới thành email của bạn (mặc định đã là minhmanuzu@gmail.com).
 * 7. Bấm nút: Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 *    - Chọn loại: Ứng dụng web (Web app)
 *    - Mô tả: Galaxy Booking Webhook
 *    - Thực thi dưới dạng: Tôi (Me)
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)  <-- BẮT BUỘC CHỌN "BẤT KỲ AI"
 * 8. Bấm Triển khai -> Cấp quyền cho Google (Review permissions -> Chọn Gmail của bạn -> Advanced -> Go to ... (unsafe) -> Allow).
 * 9. Sao chép URL ứng dụng web (dạng: https://script.google.com/macros/s/AKfycb.../exec).
 * 10. Dán URL này vào mục "Cài đặt & Kết nối dữ liệu" trong trang Admin của Galaxy Hotel!
 * =========================================================================
 */

// Email nhận thông báo của Lễ tân / Chủ khách sạn
var NOTIFICATION_EMAIL = "minhmanuzu@gmail.com"; 

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // 1. Ghi một dòng mới vào Google Sheet
    sheet.appendRow([
      data.createdAt || new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
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

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 14).setVerticalAlignment("middle");

    // 2. Gửi Email thông báo qua hạ tầng Google MailApp (Vào thẳng Hộp thư đến 100%)
    if (NOTIFICATION_EMAIL) {
      var emailSubject = "🔔 [ĐẶT PHÒNG MỚI #" + (data.bookingCode || "GBH") + "] " + data.guestName + " - " + data.roomName;
      
      var emailHtml = '<div style="background-color: #F4F1EA; padding: 25px; font-family: Arial, sans-serif; color: #1A1A1A;">'
        + '<div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">'
        + '<div style="background-color: #1A1A1A; padding: 24px; text-align: center;">'
        + '<div style="color: #E8DCB9; font-size: 11px; font-weight: bold; letter-spacing: 2px;">GALAXY BOUTIQUE HOTEL</div>'
        + '<h2 style="color: #FFFFFF; margin: 6px 0 0 0; font-size: 18px;">THÔNG BÁO ĐƠN ĐẶT PHÒNG MỚI</h2>'
        + '<div style="display: inline-block; background-color: #C29A64; color: #1A1A1A; font-weight: bold; font-size: 12px; padding: 3px 10px; border-radius: 5px; margin-top: 10px;">Mã Đơn: #' + (data.bookingCode || "GBH") + '</div>'
        + '</div>'
        + '<div style="padding: 25px;">'
        + '<div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 10px; padding: 15px; margin-bottom: 20px;">'
        + '<div style="font-size: 11px; font-weight: bold; color: #8A6943; margin-bottom: 8px;">👤 KHÁCH HÀNG:</div>'
        + '<div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">' + data.guestName + '</div>'
        + '<div style="font-size: 14px; color: #2563EB; font-weight: bold;">📞 SĐT: <a href="tel:' + data.guestPhone + '" style="color: #2563EB; text-decoration: none;">' + data.guestPhone + '</a> (Bấm để gọi)</div>'
        + (data.guestEmail ? '<div style="font-size: 12px; color: #666; margin-top: 4px;">✉️ Email: ' + data.guestEmail + '</div>' : '')
        + '</div>'
        + '<div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 10px; padding: 15px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">'
        + '<div style="font-size: 11px; font-weight: bold; color: #8A6943; margin-bottom: 8px;">🏨 THÔNG TIN LƯU TRÚ:</div>'
        + '<div>• <strong>Hạng phòng:</strong> ' + data.roomName + '</div>'
        + '<div>• <strong>Hình thức:</strong> ' + data.bookingType + ' (' + data.duration + ')</div>'
        + '<div>• <strong>Nhận phòng:</strong> <span style="color: #047857; font-weight: bold;">' + data.checkInDate + ' (' + (data.checkInTime || "14:00") + ')</span></div>'
        + '<div>• <strong>Trả phòng:</strong> <span style="color: #B91C1C; font-weight: bold;">' + data.checkOutDate + ' (' + (data.checkOutTime || "12:00") + ')</span></div>'
        + '<div>• <strong>Số khách:</strong> ' + data.guests + '</div>'
        + (data.specialRequests ? '<div>• <strong>Yêu cầu:</strong> <em>' + data.specialRequests + '</em></div>' : '')
        + '</div>'
        + '<div style="background-color: #1A1A1A; color: #FFFFFF; border-radius: 10px; padding: 16px; text-align: center;">'
        + '<div style="font-size: 11px; color: #A3A3A3; text-transform: uppercase;">Tổng Tiền Dự Kiến</div>'
        + '<div style="font-size: 22px; font-weight: bold; color: #E8DCB9; margin-top: 2px;">' + data.totalPrice + '</div>'
        + '</div>'
        + '</div>'
        + '<div style="background-color: #FAF9F5; border-top: 1px solid #EAE6DF; padding: 15px; text-align: center; font-size: 11px; color: #737373;">'
        + 'Galaxy Boutique Hotel • 269/19 Đề Thám, Quận 1, TP. HCM • Hotline: 028 2248 7782'
        + '</div>'
        + '</div></div>';

      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: emailSubject,
        htmlBody: emailHtml
      });
    }

    // 3. Nếu khách có điền email, gửi thêm email xác nhận cho khách
    if (data.guestEmail && data.guestEmail.indexOf("@") !== -1 && data.guestEmail !== NOTIFICATION_EMAIL) {
      var customerSubject = "Xác nhận yêu cầu đặt phòng #" + (data.bookingCode || "GBH") + " - Galaxy Boutique Hotel Saigon";
      var customerHtml = '<div style="background-color: #F4F1EA; padding: 25px; font-family: Arial, sans-serif; color: #1A1A1A;">'
        + '<div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">'
        + '<div style="background-color: #1A1A1A; padding: 25px; text-align: center;">'
        + '<div style="color: #E8DCB9; font-size: 11px; font-weight: bold; letter-spacing: 2px;">GALAXY BOUTIQUE HOTEL SAIGON</div>'
        + '<h2 style="color: #FFFFFF; margin: 6px 0 0 0; font-size: 18px;">XÁC NHẬN YÊU CẦU ĐẶT PHÒNG</h2>'
        + '<div style="display: inline-block; background-color: #C29A64; color: #1A1A1A; font-weight: bold; font-size: 12px; padding: 3px 10px; border-radius: 5px; margin-top: 10px;">Mã Đơn: #' + (data.bookingCode || "GBH") + '</div>'
        + '</div>'
        + '<div style="padding: 25px;">'
        + '<p style="font-size: 14px; margin-top: 0;">Xin chào <strong>' + data.guestName + '</strong>,</p>'
        + '<p style="font-size: 13px; color: #4B5563; line-height: 1.5;">Cảm ơn bạn đã lựa chọn Galaxy Boutique Hotel. Lễ tân của chúng tôi đã ghi nhận thông tin đặt phòng của bạn và sẽ liên hệ qua số điện thoại <strong>' + data.guestPhone + '</strong> để xác nhận trong thời gian sớm nhất.</p>'
        + '<div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 10px; padding: 15px; margin: 18px 0; font-size: 13px; line-height: 1.6;">'
        + '<div style="font-size: 11px; font-weight: bold; color: #8A6943; margin-bottom: 8px;">📋 CHI TIẾT ĐẶT PHÒNG:</div>'
        + '<div>• Hạng phòng: <strong>' + data.roomName + '</strong></div>'
        + '<div>• Hình thức: <strong>' + data.bookingType + ' (' + data.duration + ')</strong></div>'
        + '<div>• Nhận phòng: <strong>' + data.checkInDate + ' (' + (data.checkInTime || "14:00") + ')</strong></div>'
        + '<div>• Trả phòng: <strong>' + data.checkOutDate + ' (' + (data.checkOutTime || "12:00") + ')</strong></div>'
        + '<div>• Tổng thanh toán dự kiến: <strong style="color: #8A6943; font-size: 15px;">' + data.totalPrice + '</strong></div>'
        + '</div>'
        + '<div style="background-color: #F3F4F6; border-radius: 8px; padding: 12px; font-size: 12px; color: #4B5563; line-height: 1.5;">'
        + '📌 <strong>Lưu ý nhận phòng:</strong><br>'
        + '• Nhận phòng từ 14:00 | Trả phòng trước 12:00.<br>'
        + '• Vui lòng xuất trình CCCD/Hộ chiếu khi làm thủ tục.<br>'
        + '• Hotline hỗ trợ 24/7: <strong>028 2248 7782</strong>.'
        + '</div>'
        + '</div>'
        + '<div style="background-color: #FAF9F5; border-top: 1px solid #EAE6DF; padding: 15px; text-align: center; font-size: 11px; color: #737373;">'
        + 'Galaxy Boutique Hotel Saigon • 269/19 Đề Thám, Quận 1, TP. HCM'
        + '</div>'
        + '</div></div>';

      MailApp.sendEmail({
        to: data.guestEmail,
        subject: customerSubject,
        htmlBody: customerHtml
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Galaxy Boutique Hotel Webhook + Email Mailer is Active and Ready!");
}
