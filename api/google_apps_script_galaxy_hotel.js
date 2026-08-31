/**
 * =========================================================================
 * GALAXY BOUTIQUE HOTEL - HỆ THỐNG GOOGLE APPS SCRIPT CAO CẤP
 * Tự động phân loại đơn theo từng Tháng + Thống kê doanh thu + Quản lý Khách hàng
 * Kèm hệ thống gửi Email thông báo tức thì qua hạ tầng Google MailApp
 * =========================================================================
 * 
 * 📌 TÍNH NĂNG TỰ ĐỘNG HÓA 100%:
 * 1. 📊 Sheet "📊 TỔNG QUAN & THỐNG KÊ": Tự động tính tổng doanh thu, tổng số đơn, đơn theo giờ/ngày.
 * 2. 🗓️ Sheet TỪNG THÁNG (VD: "Tháng 08-2026", "Tháng 09-2026"): Tự động tạo mới khi sang tháng mới và ghi đơn vào đúng tháng.
 * 3. 📋 Sheet "📋 TẤT CẢ ĐƠN ĐẶT": Lưu trữ toàn bộ dữ liệu lịch sử tập trung.
 * 4. 👥 Sheet "👥 KHÁCH HÀNG (CRM)": Tự động lưu thông tin khách hàng, số lần đặt và tổng chi tiêu.
 * 5. 📧 Email thông báo tức thì: Gửi email thiết kế sang trọng đến lễ tân và email xác nhận cho khách.
 * 
 * -------------------------------------------------------------------------
 * 🚀 HƯỚNG DẪN CÀI ĐẶT NHANH (MẤT 2 PHÚT):
 * 1. Truy cập: https://sheets.new để tạo một trang tính Google Sheet mới.
 * 2. Đổi tên Google Sheet thành: "Galaxy Boutique Hotel - Quản Lý Đơn Đặt Phòng"
 * 3. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script
 * 4. Xóa sạch code mặc định và DÁN TOÀN BỘ NỘI DUNG FILE NÀY VÀO.
 * 5. Bấm nút: Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 *    - Loại: Ứng dụng web (Web app)
 *    - Mô tả: Galaxy Hotel Booking System
 *    - Thực thi dưới dạng: Tôi (Me)
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)  <-- [BẮT BUỘC CHỌN ANYONE]
 * 6. Bấm Triển khai -> Cấp quyền (Review permissions -> Chọn Gmail -> Advanced -> Go to ... (unsafe) -> Allow).
 * 7. Copy URL Ứng dụng web (dạng: https://script.google.com/macros/s/AKfycb.../exec).
 * 8. Dán URL này vào trang Admin của Galaxy Hotel (Mục: Cài Đặt & SMTP Mail -> Google Sheets Webhook)!
 * =========================================================================
 */

// Email nhận thông báo đặt phòng của chủ khách sạn / Lễ tân
var NOTIFICATION_EMAIL = "minhmanuzu@gmail.com"; 

/**
 * Xử lý khi mở URL trên trình duyệt (Kiểm tra trạng thái Webhook)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "success",
    "service": "Galaxy Boutique Hotel Booking Webhook",
    "version": "2.0",
    "message": "Webhook Google Apps Script đang hoạt động bình thường và sẵn sàng nhận đơn đặt phòng!"
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Xử lý khi website gửi đơn đặt phòng sang (POST Webhook)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa tránh xung đột khi nhiều khách đặt phòng cùng lúc

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};

    // Đọc dữ liệu JSON hoặc Form POST linh hoạt
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var now = new Date();
    var timestamp = data.createdAt || Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    // Xác định Tháng của đơn (dựa theo ngày check-in hoặc ngày tạo đơn)
    var checkInDateStr = data.checkInDate || Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
    var monthKey = "Tháng " + getMonthYearString(checkInDateStr);

    var numericPrice = parsePrice(data.totalPrice);
    var bookingCode = data.bookingCode || "GBH-" + Math.floor(1000 + Math.random() * 9000);

    // 1. Ghi vào Sheet "📋 TẤT CẢ ĐƠN ĐẶT" (Master Sheet)
    var masterSheet = getOrCreateMasterSheet(ss);
    masterSheet.appendRow([
      timestamp,
      bookingCode,
      data.bookingType || "Theo Ngày",
      data.roomName || "Hạng Phòng Mặc Định",
      data.guestName || "Khách Hàng",
      "'" + (data.guestPhone || ""), // Dấu ' để giữ nguyên số 0 ở đầu SĐT
      data.guestEmail || "",
      data.checkInDate + (data.checkInTime ? " (" + data.checkInTime + ")" : ""),
      data.checkOutDate + (data.checkOutTime ? " (" + data.checkOutTime + ")" : ""),
      data.duration || "",
      data.guests || "",
      numericPrice,
      data.status || "Chờ xác nhận",
      data.specialRequests || "Không"
    ]);

    var masterLastRow = masterSheet.getLastRow();
    masterSheet.getRange(masterLastRow, 12).setNumberFormat("#,##0 \"₫\"");
    masterSheet.getRange(masterLastRow, 1, 1, 14).setVerticalAlignment("middle");

    // 2. Tự động ghi vào Sheet RIÊNG CỦA THÁNG ĐÓ (VD: "Tháng 08-2026")
    var monthSheet = getOrCreateMonthSheet(ss, monthKey);
    monthSheet.appendRow([
      timestamp,
      bookingCode,
      data.bookingType || "Theo Ngày",
      data.roomName || "Hạng Phòng Mặc Định",
      data.guestName || "Khách Hàng",
      "'" + (data.guestPhone || ""),
      data.guestEmail || "",
      data.checkInDate + (data.checkInTime ? " (" + data.checkInTime + ")" : ""),
      data.checkOutDate + (data.checkOutTime ? " (" + data.checkOutTime + ")" : ""),
      data.duration || "",
      data.guests || "",
      numericPrice,
      data.status || "Chờ xác nhận",
      data.specialRequests || "Không"
    ]);

    var monthLastRow = monthSheet.getLastRow();
    monthSheet.getRange(monthLastRow, 12).setNumberFormat("#,##0 \"₫\"");
    monthSheet.getRange(monthLastRow, 1, 1, 14).setVerticalAlignment("middle");

    // 3. Tự động cập nhật cơ sở dữ liệu Khách hàng (CRM)
    updateCustomerCRM(ss, data, numericPrice, timestamp);

    // 4. Khởi tạo/cập nhật Bảng điều khiển Thống kê (Dashboard)
    setupStatsDashboard(ss);

    // 5. Gửi Email thông báo tức thì tới Chủ khách sạn / Lễ tân
    if (NOTIFICATION_EMAIL) {
      sendHotelNotificationEmail(data, bookingCode);
    }

    // 6. Gửi Email xác nhận đặt phòng cho khách (nếu khách có điền email)
    if (data.guestEmail && data.guestEmail.indexOf("@") !== -1 && data.guestEmail !== NOTIFICATION_EMAIL) {
      sendCustomerEmail(data, bookingCode);
    }

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Đã lưu đơn thành công vào Google Sheet & gửi thông báo Email!",
      "bookingCode": bookingCode,
      "monthSheet": monthKey
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// -------------------------------------------------------------------------
// CÁC HÀM TIỆN ÍCH & TỰ ĐỘNG TẠO SHEET
// -------------------------------------------------------------------------

/** Lấy hoặc tạo Sheet Master "📋 TẤT CẢ ĐƠN ĐẶT" */
function getOrCreateMasterSheet(ss) {
  var sheetName = "📋 TẤT CẢ ĐƠN ĐẶT";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName, 1);
    var headers = [
      "Thời Gian Đặt", "Mã Đơn", "Hình Thức", "Hạng Phòng", "Tên Khách Hàng",
      "Số Điện Thoại", "Email", "Nhận Phòng", "Trả Phòng", "Thời Lượng",
      "Số Khách", "Tổng Tiền (VNĐ)", "Trạng Thái", "Yêu Cầu Đặc Biệt"
    ];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1A1A1A", "#E8DCB9");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Lấy hoặc tạo Sheet cho từng Tháng riêng biệt (VD: "Tháng 08-2026") */
function getOrCreateMonthSheet(ss, monthName) {
  var sheet = ss.getSheetByName(monthName);
  if (!sheet) {
    sheet = ss.insertSheet(monthName);
    var headers = [
      "Thời Gian Đặt", "Mã Đơn", "Hình Thức", "Hạng Phòng", "Tên Khách Hàng",
      "Số Điện Thoại", "Email", "Nhận Phòng", "Trả Phòng", "Thời Lượng",
      "Số Khách", "Tổng Tiền (VNĐ)", "Trạng Thái", "Yêu Cầu Đặc Biệt"
    ];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#8A6943", "#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Tự động cập nhật cơ sở dữ liệu Khách hàng (CRM) */
function updateCustomerCRM(ss, data, price, lastBookingTime) {
  if (!data.guestPhone) return;
  var sheetName = "👥 KHÁCH HÀNG (CRM)";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = ["Số Điện Thoại", "Họ & Tên", "Email", "Số Lần Đặt", "Tổng Chi Tiêu (VNĐ)", "Lần Đặt Gần Nhất", "Phòng Ưa Thích"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1D4ED8", "#FFFFFF");
    sheet.setFrozenRows(1);
  }

  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var cleanPhone = data.guestPhone.toString().trim();
  var rowIndex = -1;

  for (var i = 1; i < values.length; i++) {
    if (values[i][0].toString().replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > 1) {
    // Đã có khách hàng -> Cập nhật số lần đặt & tổng tiền
    var currentCount = Number(values[rowIndex - 1][3]) || 1;
    var currentSpend = Number(values[rowIndex - 1][4]) || 0;
    sheet.getRange(rowIndex, 4).setValue(currentCount + 1);
    sheet.getRange(rowIndex, 5).setValue(currentSpend + price);
    sheet.getRange(rowIndex, 6).setValue(lastBookingTime);
    sheet.getRange(rowIndex, 7).setValue(data.roomName || "");
  } else {
    // Khách hàng mới -> Thêm dòng mới
    sheet.appendRow([
      "'" + cleanPhone,
      data.guestName || "",
      data.guestEmail || "",
      1,
      price,
      lastBookingTime,
      data.roomName || ""
    ]);
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 5).setNumberFormat("#,##0 \"₫\"");
  }
}

/** Tạo bảng điều khiển Thống kê tự động (Dashboard) */
function setupStatsDashboard(ss) {
  var sheetName = "📊 TỔNG QUAN & THỐNG KÊ";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName, 0);
    sheet.setTabColor("#C29A64");

    // Tiêu đề Dashboard
    sheet.getRange("A1:E1").merge();
    sheet.getRange("A1").setValue("🏨 GALAXY BOUTIQUE HOTEL - BẢNG ĐIỀU KHIỂN & THỐNG KÊ DOANH THU")
      .setBackground("#1A1A1A").setFontColor("#E8DCB9").setFontWeight("bold").setFontSize(13).setHorizontalAlignment("center");
    
    // Thống kê nhanh
    sheet.getRange("A3:B3").merge().setValue("TỔNG QUAN TẤT CẢ").setFontWeight("bold").setBackground("#F4F1EA");
    sheet.getRange("A4").setValue("Tổng Số Đơn Đặt Phòng:");
    sheet.getRange("B4").setFormula("=COUNTA('📋 TẤT CẢ ĐƠN ĐẶT'!B2:B)");

    sheet.getRange("A5").setValue("Tổng Doanh Thu Dự Kiến:");
    sheet.getRange("B5").setFormula("=SUM('📋 TẤT CẢ ĐƠN ĐẶT'!L2:L)").setNumberFormat("#,##0 \"₫\"");

    sheet.getRange("A6").setValue("Tổng Số Khách Hàng (CRM):");
    sheet.getRange("B6").setFormula("=COUNTA('👥 KHÁCH HÀNG (CRM)'!A2:A)");

    sheet.getRange("A7").setValue("Đơn Đặt Theo Giờ:");
    sheet.getRange("B7").setFormula("=COUNTIF('📋 TẤT CẢ ĐƠN ĐẶT'!C2:C, \"*Giờ*\")");

    sheet.getRange("A8").setValue("Đơn Đặt Theo Ngày/Đêm:");
    sheet.getRange("B8").setFormula("=COUNTIF('📋 TẤT CẢ ĐƠN ĐẶT'!C2:C, \"*Ngày*\")");

    sheet.getRange("A3:B8").setBorder(true, true, true, true, true, true);
    sheet.setColumnWidth(1, 240);
    sheet.setColumnWidth(2, 180);
  }
}

/** Định dạng hàng tiêu đề */
function formatHeaderRow(sheet, colCount, bgColor, fontColor) {
  var range = sheet.getRange(1, 1, 1, colCount);
  range.setBackground(bgColor)
    .setFontColor(fontColor)
    .setFontWeight("bold")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);
  for (var i = 1; i <= colCount; i++) {
    sheet.autoResizeColumn(i);
  }
}

/** Chuyển đổi định dạng ngày sang Tháng MM-YYYY */
function getMonthYearString(dateStr) {
  try {
    if (dateStr && dateStr.indexOf("-") !== -1) {
      var parts = dateStr.split("-");
      if (parts.length >= 2) {
        return parts[1] + "-" + parts[0];
      }
    }
  } catch (e) {}
  var d = new Date();
  return Utilities.formatDate(d, "Asia/Ho_Chi_Minh", "MM-yyyy");
}

/** Chuyển chuỗi tiền "1.300.000 VNĐ" thành số 1300000 */
function parsePrice(priceStr) {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  var cleaned = priceStr.toString().replace(/[^\d]/g, "");
  return Number(cleaned) || 0;
}

// -------------------------------------------------------------------------
// GỬI EMAIL THÔNG BÁO TỨC THÌ
// -------------------------------------------------------------------------

function sendHotelNotificationEmail(data, bookingCode) {
  var emailSubject = "🔔 [ĐẶT PHÒNG MỚI #" + bookingCode + "] " + data.guestName + " - " + data.roomName;
  var emailHtml = '<div style="background-color: #F4F1EA; padding: 25px; font-family: Arial, sans-serif; color: #1A1A1A;">'
    + '<div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">'
    + '<div style="background-color: #1A1A1A; padding: 24px; text-align: center;">'
    + '<div style="color: #E8DCB9; font-size: 11px; font-weight: bold; letter-spacing: 2px;">GALAXY BOUTIQUE HOTEL</div>'
    + '<h2 style="color: #FFFFFF; margin: 6px 0 0 0; font-size: 18px;">THÔNG BÁO ĐƠN ĐẶT PHÒNG MỚI</h2>'
    + '<div style="display: inline-block; background-color: #C29A64; color: #1A1A1A; font-weight: bold; font-size: 12px; padding: 3px 10px; border-radius: 5px; margin-top: 10px;">Mã Đơn: #' + bookingCode + '</div>'
    + '</div>'
    + '<div style="padding: 25px;">'
    + '<div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 10px; padding: 15px; margin-bottom: 20px;">'
    + '<div style="font-size: 11px; font-weight: bold; color: #8A6943; margin-bottom: 8px;">👤 KHÁCH HÀNG:</div>'
    + '<div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">' + (data.guestName || "Khách hàng") + '</div>'
    + '<div style="font-size: 14px; color: #2563EB; font-weight: bold;">📞 SĐT: <a href="tel:' + data.guestPhone + '" style="color: #2563EB; text-decoration: none;">' + data.guestPhone + '</a> (Bấm để gọi)</div>'
    + (data.guestEmail ? '<div style="font-size: 12px; color: #666; margin-top: 4px;">✉️ Email: ' + data.guestEmail + '</div>' : '')
    + '</div>'
    + '<div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 10px; padding: 15px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">'
    + '<div style="font-size: 11px; font-weight: bold; color: #8A6943; margin-bottom: 8px;">🏨 THÔNG TIN LƯU TRÚ:</div>'
    + '<div>• <strong>Hạng phòng:</strong> ' + (data.roomName || "") + '</div>'
    + '<div>• <strong>Hình thức:</strong> ' + (data.bookingType || "") + ' (' + (data.duration || "") + ')</div>'
    + '<div>• <strong>Nhận phòng:</strong> <span style="color: #047857; font-weight: bold;">' + data.checkInDate + ' (' + (data.checkInTime || "14:00") + ')</span></div>'
    + '<div>• <strong>Trả phòng:</strong> <span style="color: #B91C1C; font-weight: bold;">' + data.checkOutDate + ' (' + (data.checkOutTime || "12:00") + ')</span></div>'
    + '<div>• <strong>Số khách:</strong> ' + (data.guests || "") + '</div>'
    + (data.specialRequests ? '<div>• <strong>Yêu cầu:</strong> <em>' + data.specialRequests + '</em></div>' : '')
    + '</div>'
    + '<div style="background-color: #1A1A1A; color: #FFFFFF; border-radius: 10px; padding: 16px; text-align: center;">'
    + '<div style="font-size: 11px; color: #A3A3A3; text-transform: uppercase;">Tổng Tiền Dự Kiến</div>'
    + '<div style="font-size: 22px; font-weight: bold; color: #E8DCB9; margin-top: 2px;">' + (typeof data.totalPrice === "number" ? data.totalPrice.toLocaleString("vi-VN") + " ₫" : data.totalPrice) + '</div>'
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

function sendCustomerEmail(data, bookingCode) {
  var customerSubject = "Xác nhận yêu cầu đặt phòng #" + bookingCode + " - Galaxy Boutique Hotel Saigon";
  var customerHtml = '<div style="background-color: #F4F1EA; padding: 25px; font-family: Arial, sans-serif; color: #1A1A1A;">'
    + '<div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">'
    + '<div style="background-color: #1A1A1A; padding: 25px; text-align: center;">'
    + '<div style="color: #E8DCB9; font-size: 11px; font-weight: bold; letter-spacing: 2px;">GALAXY BOUTIQUE HOTEL SAIGON</div>'
    + '<h2 style="color: #FFFFFF; margin: 6px 0 0 0; font-size: 18px;">XÁC NHẬN YÊU CẦU ĐẶT PHÒNG</h2>'
    + '<div style="display: inline-block; background-color: #C29A64; color: #1A1A1A; font-weight: bold; font-size: 12px; padding: 3px 10px; border-radius: 5px; margin-top: 10px;">Mã Đơn: #' + bookingCode + '</div>'
    + '</div>'
    + '<div style="padding: 25px;">'
    + '<p style="font-size: 14px; margin-top: 0;">Xin chào <strong>' + (data.guestName || "Quý khách") + '</strong>,</p>'
    + '<p style="font-size: 13px; color: #4B5563; line-height: 1.5;">Cảm ơn bạn đã lựa chọn Galaxy Boutique Hotel. Lễ tân của chúng tôi đã ghi nhận thông tin đặt phòng của bạn và sẽ liên hệ qua số điện thoại <strong>' + data.guestPhone + '</strong> để xác nhận trong thời gian sớm nhất.</p>'
    + '<div style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 10px; padding: 15px; margin: 18px 0; font-size: 13px; line-height: 1.6;">'
    + '<div style="font-size: 11px; font-weight: bold; color: #8A6943; margin-bottom: 8px;">📋 CHI TIẾT ĐẶT PHÒNG:</div>'
    + '<div>• Hạng phòng: <strong>' + (data.roomName || "") + '</strong></div>'
    + '<div>• Hình thức: <strong>' + (data.bookingType || "") + ' (' + (data.duration || "") + ')</strong></div>'
    + '<div>• Nhận phòng: <strong>' + data.checkInDate + ' (' + (data.checkInTime || "14:00") + ')</strong></div>'
    + '<div>• Trả phòng: <strong>' + data.checkOutDate + ' (' + (data.checkOutTime || "12:00") + ')</strong></div>'
    + '<div>• Tổng thanh toán dự kiến: <strong style="color: #8A6943; font-size: 15px;">' + (typeof data.totalPrice === "number" ? data.totalPrice.toLocaleString("vi-VN") + " ₫" : data.totalPrice) + '</strong></div>'
    + '</div>'
    + '<div style="background-color: #F3F4F6; border-radius: 8px; padding: 12px; font-size: 12px; color: #4B5563; line-height: 1.5;">'
    + '📌 <strong>Lưu ý nhận phòng:</strong><br>'
    + '• Nhận phòng từ 14:00 | Trả phòng trước 12:00.<br>'
    + '• Vui lòng xuất trình CCCD/Hộ chiếu khi làm thủ tục.<br>'
    + '• Hotline hỗ trợ 24/7: <strong>028 2248 7782</strong> • Zalo: <strong>079 329 5664</strong>.'
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
