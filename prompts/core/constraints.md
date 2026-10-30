# Constraints template

```text
Ràng buộc:
- Độ dài: {{length}}
- Giọng/ngôn ngữ: {{tone_locale}}
- Định dạng: {{format}}
- Nguồn: chỉ dùng {{sources}}; thiếu thì ghi `[CẦN KIỂM CHỨNG]`.
- Không bịa: số liệu, tên, giá, trích dẫn, kết quả test.
- An toàn: không đưa secret/PII; không làm {{dangerous_actions}} khi chưa duyệt.
- Nếu yêu cầu nằm ngoài phạm vi: nói rõ và đề xuất bước tiếp.
```

## Do

- Ràng buộc đo được: số từ, số mục, schema.
- Ưu tiên rõ khi có xung đột.
- Có hành vi khi thiếu dữ liệu.

## Don't

- “Ngắn gọn nhưng đầy đủ chi tiết” mà không nói ưu tiên.
- Cấm chung chung “không được sai”.
- Đặt ràng buộc mâu thuẫn với output schema.
