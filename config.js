// ===== CẤU HÌNH GAME — chỉ cần sửa file này =====
window.GAME_CONFIG = {
  // Danh sách người chơi + ảnh được chỉ định (đặt ảnh trong thư mục images/)
  // Ảnh có thể là .jpg / .png / .svg, nên dùng ảnh vuông (VD 800x800).
  players: [
    { name: "Nguyễn Thị An",    image: "images/anh-01.svg" },
    { name: "Trần Thị Bình",    image: "images/anh-02.svg" },
    { name: "Lê Thị Cúc",       image: "images/anh-03.svg" },
    { name: "Phạm Thị Dung",    image: "images/anh-04.svg" },
    { name: "Hoàng Thị Hoa",    image: "images/anh-05.svg" },
    { name: "Vũ Thị Lan",       image: "images/anh-06.svg" },
    { name: "Đặng Thị Mai",     image: "images/anh-07.svg" },
    { name: "Bùi Thị Ngọc",     image: "images/anh-08.svg" },
  ],

  // Lưới thẻ: rows * cols phải là số chẵn và <= 2 * số icon bên dưới
  rows: 4,
  cols: 4,
  icons: ["🌹", "🌷", "🌸", "🌻", "💐", "🌺", "🎀", "💝", "🦋", "💄", "👠", "🍰"],

  // URL Web App của Google Apps Script để ghi thời gian vào Google Sheet.
  // Để trống "" nếu chỉ cần xem kết quả trên máy (không ghi tập trung).
  // Hướng dẫn: xem README.md, mục "Ghi kết quả vào Google Sheet".
  sheetWebhookUrl: "",

  // true = mỗi người chỉ được chơi 1 lần trên mỗi thiết bị
  onePlayPerDevice: true,
};
