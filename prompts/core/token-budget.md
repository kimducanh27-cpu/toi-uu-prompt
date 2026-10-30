# Token budget template

```text
Ngân sách:
- Tổng prompt: tối đa {{max_tokens}} token (ước tính).
- System/rules: {{system_budget}}
- Context/dữ liệu: {{context_budget}}
- Ví dụ: {{example_budget}}
- Output: {{output_budget}}

Ưu tiên giữ: mục tiêu, output schema, ràng buộc an toàn.
Có thể cắt: lịch sử, giải thích lặp, ví dụ trùng.
Nếu vượt: tóm tắt context, bỏ ví dụ ít quan trọng, chỉ giữ luật cần.
```

## Do

- Đo bằng token thật nếu có tool; nếu không, ước lượng và ghi rõ.
- Progressive disclosure: file phụ chỉ đọc khi cần.
- Một luật chỉ nói một lần.

## Don't

- Nhồi toàn bộ tài liệu vào prompt.
- Cắt mất output schema/acceptance.
- Đổi model để “chạy cho vừa” mà không eval lại.
