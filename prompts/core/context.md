# Context template

```text
Bối cảnh:
- Người đọc/người dùng: {{audience}}
- Họ cần quyết định/làm gì: {{job}}
- Dữ kiện đã biết: {{facts}}
- Nguồn được phép dùng: {{sources}}
- Điều chưa biết: {{unknowns}}

Chỉ dùng dữ kiện trong mục “Dữ kiện đã biết” và “Nguồn được phép dùng”.
Nếu thiếu, ghi `[CẦN KIỂM CHỨNG]`; không tự điền.
```

## Do

- Nói ai đọc và họ cần làm gì.
- Tách dữ kiện thật / giả định / chưa biết.
- Ghi nguồn và ngày nếu có.

## Don't

- Đưa cả tài liệu dài nếu chỉ cần 3 dữ kiện.
- Trộn dữ liệu thật với ví dụ giả mà không ghi.
- Đưa PII/secret vào context.
