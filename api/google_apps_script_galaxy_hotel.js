/**
 * =========================================================================
 * GALAXY BOUTIQUE HOTEL - GOOGLE SHEETS ENTERPRISE ENGINE V3.1 (100% NO FORMULA ERROR)
 * =========================================================================
 * 
 * 🛡️ NÂNG CẤP V3.1:
 * - Thay thế công thức dễ lỗi bằng cơ chế TÍNH TOÁN TRỰC TIẾP TỪ SCRIPT (Direct Calculation).
 * - Không bao giờ bị lỗi #ERROR!, #REF!, #VALUE! trên bất kỳ tài khoản Google nào.
 * - Tự động cập nhật số liệu Dashboard chính xác từng giây mỗi khi có đơn mới!
 * =========================================================================
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "success",
    "service": "Galaxy Boutique Hotel Google Sheets Engine",
    "version": "3.1-Stable",
    "timestamp": new Date().toISOString(),
    "message": "Webhook đang hoạt động hoàn hảo! Sẵn sàng nhận đơn đặt phòng."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(15000); 

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = parsePayload(e);

    if (!data || Object.keys(data).length === 0) {
      logError(ss, "Payload rỗng hoặc không đúng định dạng", JSON.stringify(e));
      return ContentService.createTextOutput(JSON.stringify({
        "result": "error",
        "message": "Dữ liệu gửi sang bị rỗng"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var result = processBookingData(ss, data);

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "bookingCode": result.bookingCode,
      "monthSheet": result.monthKey,
      "message": "Đã lưu đơn thành công vào Google Sheet!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    logError(ss, "Lỗi trong doPost: " + error.toString(), error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

function processBookingData(ss, data) {
  var now = new Date();
  var timestamp = data.createdAt || Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  
  var bookingCode = (data.bookingCode || "GBH-" + Math.floor(1000 + Math.random() * 9000)).toString().trim();
  var checkInStr = (data.checkInDate || Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "yyyy-MM-dd")).toString().trim();
  var monthKey = "Tháng " + extractMonthYear(checkInStr);
  
  var numericPrice = parseSafePrice(data.totalPrice);
  var cleanPhone = formatPhoneNumber(data.guestPhone);
  var guestName = (data.guestName || "Khách Hàng").toString().trim();
  var roomName = (data.roomName || "Phòng Tiêu Chuẩn").toString().trim();
  var bookingType = (data.bookingType || "Theo Ngày").toString().trim();
  var duration = (data.duration || (bookingType === "Theo Giờ" ? "2 giờ" : "1 đêm")).toString().trim();
  var guests = (data.guests || "1 Lớn").toString().trim();
  var guestEmail = (data.guestEmail || "").toString().trim();
  var status = (data.status || "Chờ xác nhận").toString().trim();
  var specialRequests = (data.specialRequests || "Không").toString().trim();
  var checkInDisplay = checkInStr + (data.checkInTime ? " (" + data.checkInTime + ")" : "");
  var checkOutDisplay = (data.checkOutDate || "") + (data.checkOutTime ? " (" + data.checkOutTime + ")" : "");

  var rowData = [
    timestamp,
    bookingCode,
    bookingType,
    roomName,
    guestName,
    "'" + cleanPhone,
    guestEmail,
    checkInDisplay,
    checkOutDisplay,
    duration,
    guests,
    numericPrice,
    status,
    specialRequests
  ];

  // 1. Ghi vào Sheet "TẤT CẢ ĐƠN ĐẶT" (Master)
  var masterSheet = getOrCreateMasterSheet(ss);
  appendOrUpdateBookingRow(masterSheet, bookingCode, rowData);

  // 2. Ghi vào Sheet RIÊNG CỦA THÁNG ĐÓ (VD: "Tháng 08-2026")
  var monthSheet = getOrCreateMonthSheet(ss, monthKey);
  appendOrUpdateBookingRow(monthSheet, bookingCode, rowData);

  // 3. Tự động cập nhật CRM khách hàng
  var crmSheet = updateCustomerCRM(ss, cleanPhone, guestName, guestEmail, numericPrice, timestamp, roomName);

  // 4. Tính toán và cập nhật Dashboard Thống Kê TRỰC TIẾP (100% Không dùng công thức chuỗi dễ lỗi)
  updateStatsDashboardDirect(ss, masterSheet, crmSheet);

  cleanupDefaultSheet(ss);

  return { bookingCode: bookingCode, monthKey: monthKey };
}

function appendOrUpdateBookingRow(sheet, bookingCode, rowData) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var existingRowIndex = -1;

  for (var i = 1; i < values.length; i++) {
    if (values[i][1] && values[i][1].toString().trim() === bookingCode) {
      existingRowIndex = i + 1;
      break;
    }
  }

  if (existingRowIndex > 1) {
    sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
    sheet.getRange(existingRowIndex, 12).setNumberFormat("#,##0 \"₫\"");
  } else {
    sheet.appendRow(rowData);
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 12).setNumberFormat("#,##0 \"₫\"");
    sheet.getRange(newRow, 6).setNumberFormat("@");
    sheet.getRange(newRow, 1, 1, rowData.length).setVerticalAlignment("middle");
  }
}

function getOrCreateMasterSheet(ss) {
  var name = "TẤT CẢ ĐƠN ĐẶT";
  var sheet = ss.getSheetByName(name) || ss.getSheetByName("📋 TẤT CẢ ĐƠN ĐẶT");
  if (!sheet) {
    sheet = ss.insertSheet(name, 1);
    sheet.setTabColor("#1A1A1A");
    var headers = ["Thời Gian Đặt", "Mã Đơn", "Hình Thức", "Hạng Phòng", "Tên Khách Hàng", "Số Điện Thoại", "Email", "Nhận Phòng", "Trả Phòng", "Thời Lượng", "Số Khách", "Tổng Tiền (VNĐ)", "Trạng Thái", "Yêu Cầu Đặc Biệt"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1A1A1A", "#E8DCB9");
    sheet.setFrozenRows(1);
    initColumnWidths(sheet);
  }
  return sheet;
}

function getOrCreateMonthSheet(ss, monthName) {
  var sheet = ss.getSheetByName(monthName);
  if (!sheet) {
    sheet = ss.insertSheet(monthName);
    sheet.setTabColor("#8A6943");
    var headers = ["Thời Gian Đặt", "Mã Đơn", "Hình Thức", "Hạng Phòng", "Tên Khách Hàng", "Số Điện Thoại", "Email", "Nhận Phòng", "Trả Phòng", "Thời Lượng", "Số Khách", "Tổng Tiền (VNĐ)", "Trạng Thái", "Yêu Cầu Đặc Biệt"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#8A6943", "#FFFFFF");
    sheet.setFrozenRows(1);
    initColumnWidths(sheet);
  }
  return sheet;
}

function updateCustomerCRM(ss, cleanPhone, guestName, guestEmail, price, lastBookingTime, roomName) {
  var name = "KHÁCH HÀNG (CRM)";
  var sheet = ss.getSheetByName(name) || ss.getSheetByName("👥 KHÁCH HÀNG (CRM)");
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.setTabColor("#1D4ED8");
    var headers = ["Số Điện Thoại", "Họ & Tên", "Email", "Số Lần Đặt", "Tổng Chi Tiêu (VNĐ)", "Lần Đặt Gần Nhất", "Phòng Ưa Thích"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1D4ED8", "#FFFFFF");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(3, 220);
    sheet.setColumnWidth(4, 110);
    sheet.setColumnWidth(5, 160);
    sheet.setColumnWidth(6, 170);
    sheet.setColumnWidth(7, 180);
  }

  if (!cleanPhone) return sheet;

  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var targetDigits = cleanPhone.replace(/\D/g, '').slice(-9);
  var rowIndex = -1;

  for (var i = 1; i < values.length; i++) {
    var existingPhone = (values[i][0] || "").toString().replace(/\D/g, '').slice(-9);
    if (existingPhone && existingPhone === targetDigits) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > 1) {
    var currentCount = Number(values[rowIndex - 1][3]) || 1;
    var currentSpend = Number(values[rowIndex - 1][4]) || 0;
    sheet.getRange(rowIndex, 2).setValue(guestName || values[rowIndex - 1][1]);
    if (guestEmail) sheet.getRange(rowIndex, 3).setValue(guestEmail);
    sheet.getRange(rowIndex, 4).setValue(currentCount + 1);
    sheet.getRange(rowIndex, 5).setValue(currentSpend + price);
    sheet.getRange(rowIndex, 6).setValue(lastBookingTime);
    if (roomName) sheet.getRange(rowIndex, 7).setValue(roomName);
    sheet.getRange(rowIndex, 5).setNumberFormat("#,##0 \"₫\"");
  } else {
    sheet.appendRow(["'" + cleanPhone, guestName, guestEmail, 1, price, lastBookingTime, roomName]);
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1).setNumberFormat("@");
    sheet.getRange(newRow, 5).setNumberFormat("#,##0 \"₫\"");
    sheet.getRange(newRow, 1, 1, 7).setVerticalAlignment("middle");
  }
  return sheet;
}

/**
 * Tính toán số liệu Dashboard TRỰC TIẾP từ code Apps Script (Đảm bảo 100% không bao giờ bị #ERROR!)
 */
function updateStatsDashboardDirect(ss, masterSheet, crmSheet) {
  var name = "TỔNG QUAN & THỐNG KÊ";
  var sheet = ss.getSheetByName(name) || ss.getSheetByName("📊 TỔNG QUAN & THỐNG KÊ");
  
  if (!sheet) {
    sheet = ss.insertSheet(name, 0);
    sheet.setTabColor("#C29A64");
  }

  // Tiêu đề
  sheet.getRange("A1:E1").merge();
  sheet.getRange("A1").setValue("🏨 GALAXY BOUTIQUE HOTEL - BẢNG ĐIỀU KHIỂN DOANH THU & ĐẶT PHÒNG")
    .setBackground("#1A1A1A").setFontColor("#E8DCB9").setFontWeight("bold").setFontSize(13).setHorizontalAlignment("center");

  sheet.getRange("A3:B3").merge().setValue("CHỈ SỐ TOÀN BỘ HOẠT ĐỘNG").setFontWeight("bold").setBackground("#F4F1EA");

  sheet.getRange("A4").setValue("Tổng Số Đơn Đặt Phòng:");
  sheet.getRange("A5").setValue("Tổng Doanh Thu Dự Kiến:");
  sheet.getRange("A6").setValue("Tổng Số Khách Hàng (CRM):");
  sheet.getRange("A7").setValue("Đơn Đặt Theo Giờ:");
  sheet.getRange("A8").setValue("Đơn Đặt Theo Ngày/Đêm:");

  // Tính toán số liệu thực tế từ dữ liệu
  var totalBookings = 0;
  var totalRevenue = 0;
  var hourlyCount = 0;
  var dailyCount = 0;

  if (masterSheet && masterSheet.getLastRow() > 1) {
    var masterValues = masterSheet.getDataRange().getValues();
    totalBookings = masterValues.length - 1;

    for (var i = 1; i < masterValues.length; i++) {
      var price = Number(masterValues[i][11]) || 0;
      totalRevenue += price;

      var typeStr = (masterValues[i][2] || "").toString().toLowerCase();
      if (typeStr.indexOf("giờ") !== -1 || typeStr.indexOf("hourly") !== -1) {
        hourlyCount++;
      } else {
        dailyCount++;
      }
    }
  }

  var totalCustomers = 0;
  if (crmSheet && crmSheet.getLastRow() > 1) {
    totalCustomers = crmSheet.getLastRow() - 1;
  }

  // Ghi trực tiếp giá trị số sạch sẽ vào các ô
  sheet.getRange("B4").setValue(totalBookings);
  sheet.getRange("B5").setValue(totalRevenue).setNumberFormat("#,##0 \"₫\"");
  sheet.getRange("B6").setValue(totalCustomers);
  sheet.getRange("B7").setValue(hourlyCount);
  sheet.getRange("B8").setValue(dailyCount);

  sheet.getRange("A3:B8").setBorder(true, true, true, true, true, true);
  sheet.getRange("B4:B8").setFontWeight("bold").setHorizontalAlignment("right").setFontSize(11);

  sheet.setColumnWidth(1, 240);
  sheet.setColumnWidth(2, 180);
}

function parsePayload(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return e.parameter || {};
    }
  }
  return e.parameter || {};
}

function extractMonthYear(dateStr) {
  try {
    if (typeof dateStr === "string" && dateStr.trim().length > 0) {
      var matchYMD = dateStr.match(/(\d{4})[-\/](\d{1,2})/);
      if (matchYMD) {
        var m = ("0" + matchYMD[2]).slice(-2);
        return m + "-" + matchYMD[1];
      }
      var matchDMY = dateStr.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
      if (matchDMY) {
        var m = ("0" + matchDMY[2]).slice(-2);
        return m + "-" + matchDMY[3];
      }
    }
  } catch (e) {}
  
  var d = new Date();
  return Utilities.formatDate(d, "Asia/Ho_Chi_Minh", "MM-yyyy");
}

function parseSafePrice(price) {
  if (typeof price === "number") return isNaN(price) ? 0 : price;
  if (!price) return 0;
  var str = price.toString().replace(/[^\d]/g, "");
  var num = Number(str);
  return isNaN(num) ? 0 : num;
}

function formatPhoneNumber(phone) {
  if (!phone) return "";
  var str = phone.toString().trim();
  if (str.indexOf("84") === 0 && str.length >= 10) {
    str = "0" + str.substring(2);
  }
  if (str.indexOf("+84") === 0) {
    str = "0" + str.substring(3);
  }
  return str.replace(/[^\d\s\+\-\.]/g, '');
}

function formatHeaderRow(sheet, colCount, bgColor, fontColor) {
  var range = sheet.getRange(1, 1, 1, colCount);
  range.setBackground(bgColor).setFontColor(fontColor).setFontWeight("bold").setFontSize(11).setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);
}

function initColumnWidths(sheet) {
  var widths = [160, 120, 110, 180, 180, 140, 200, 160, 160, 110, 120, 140, 120, 200];
  for (var i = 0; i < widths.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
}

function cleanupDefaultSheet(ss) {
  try {
    var defaultSheets = ["Trang tính 1", "Sheet1", "Sheet 1"];
    for (var i = 0; i < defaultSheets.length; i++) {
      var s = ss.getSheetByName(defaultSheets[i]);
      if (s && s.getLastRow() <= 1 && ss.getSheets().length > 1) {
        ss.deleteSheet(s);
      }
    }
  } catch (e) {}
}

function logError(ss, message, detail) {
  try {
    var sheet = ss.getSheetByName("⚙️ LOGS");
    if (!sheet) {
      sheet = ss.insertSheet("⚙️ LOGS");
      sheet.appendRow(["Thời Gian", "Thông Báo Lỗi", "Chi Tiết"]);
      sheet.getRange(1, 1, 1, 3).setBackground("#DC2626").setFontColor("#FFFFFF").setFontWeight("bold");
    }
    sheet.appendRow([
      Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss"),
      message,
      detail
    ]);
  } catch (e) {}
}

function runSelfTest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("--- BẮT ĐẦU KIỂM THỬ HỆ THỐNG GALAXY HOTEL ---");

  var sampleBooking1 = {
    bookingCode: "GBH-TEST01",
    bookingType: "Theo Ngày",
    roomName: "Phòng VIP Ban Công",
    guestName: "Nguyễn Văn Test",
    guestPhone: "079 329 5664",
    guestEmail: "test@galaxyhotel.com",
    checkInDate: "2026-08-31",
    checkInTime: "14:00",
    checkOutDate: "2026-09-02",
    checkOutTime: "12:00",
    duration: "2 đêm",
    guests: "2 Lớn",
    totalPrice: "1.300.000 VNĐ",
    status: "Chờ xác nhận",
    specialRequests: "Cần phòng tầng cao yên tĩnh"
  };

  processBookingData(ss, sampleBooking1);
  Logger.log("✅ KIỂM THỬ HOÀN TẤT 100%!");
}
