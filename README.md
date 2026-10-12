# Lật Hình 20/10 🌹

Game lật hình nội bộ dành cho các chị em nhân ngày Phụ nữ Việt Nam 20/10.

## Cách chơi
1. Chọn tên trong dropdown → bấm **Tiếp tục**.
2. Màn hình xác nhận lại tên (tránh chọn nhầm người) → bấm **Đúng, bắt đầu!** — thời gian bắt đầu được ghi lại tại thời điểm này.
3. Lật 2 thẻ một lượt, trùng icon thì thẻ biến mất và lộ dần **bức ảnh riêng của mỗi chị** bên dưới.
4. Mở hết thẻ → hiện ảnh đầy đủ + lời chúc + thời gian hoàn thành, số lượt lật.

## Tùy chỉnh — sửa `config.js`
- `players`: danh sách tên + ảnh chỉ định cho từng người. Bỏ ảnh vào `images/` (nên dùng ảnh vuông, < 500KB).
- `rows` / `cols`: kích thước lưới (mặc định 4x4 = 8 cặp).
- `onePlayPerDevice`: chặn chơi lại trên cùng thiết bị.
- `sheetWebhookUrl`: URL ghi kết quả về Google Sheet (bên dưới).

## Ghi kết quả vào Google Sheet (đo thời gian tập trung)
1. Tạo Google Sheet mới → **Tiện ích mở rộng → Apps Script**.
2. Dán nội dung `apps-script.gs` → Lưu.
3. **Triển khai → Tùy chọn triển khai mới** → loại **Ứng dụng web**; *Thực thi với tư cách*: Tôi; *Ai có quyền truy cập*: Bất kỳ ai.
4. Copy URL Web App (`https://script.google.com/macros/s/.../exec`) dán vào `sheetWebhookUrl` trong `config.js`, commit & push.

Mỗi người chơi sẽ ghi 2 dòng: **Bắt đầu** (ngay khi xác nhận) và **Hoàn thành** (kèm số giây, số lượt lật).
Không cấu hình webhook thì kết quả chỉ lưu trên trình duyệt của người chơi.

## Chạy local
```bash
python3 -m http.server 8000
```
Mở http://localhost:8000
