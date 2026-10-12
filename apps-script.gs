/**
 * Google Apps Script — nhận kết quả game Lật Hình 20/10 và ghi vào Google Sheet.
 * Cách dùng: xem README.md, mục "Ghi kết quả vào Google Sheet".
 */
const SHEET_NAME = "KetQua";

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["Thời điểm ghi", "Sự kiện", "Họ tên", "Bắt đầu", "Kết thúc",
                  "Thời gian (giây)", "Lượt lật", "Session", "Thiết bị"]);
    sh.setFrozenRows(1);
  }
  const tz = Session.getScriptTimeZone();
  const fmt = (iso) => iso ? Utilities.formatDate(new Date(iso), tz, "dd/MM/yyyy HH:mm:ss") : "";
  sh.appendRow([
    fmt(new Date().toISOString()),
    d.event === "finish" ? "Hoàn thành" : "Bắt đầu",
    d.name || "",
    fmt(d.startedAt),
    fmt(d.finishedAt),
    d.durationSec || "",
    d.moves || "",
    d.sessionId || "",
    d.userAgent || "",
  ]);
  return ContentService.createTextOutput("ok");
}
