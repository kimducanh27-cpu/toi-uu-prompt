# Output schema template

## Dạng JSON

```json
{
  "blocked_status": {
    "state": "ok|partial|blocked",
    "reason": null,
    "missing": []
  },
  "summary": "string",
  "items": [
    {
      "id": "string",
      "claim": "string",
      "evidence": ["string"],
      "confidence": "high|medium|low"
    }
  ],
  "unknowns": ["string"],
  "next": "string"
}
```

## Dạng Markdown

```text
## Trạng thái
- state: ok | partial | blocked
- reason: ... (bắt buộc nếu state khác ok)
- missing: ...

## Kết quả
- ...

## Bằng chứng
- ...

## Chưa kiểm / chưa rõ
- ...

## Việc tiếp theo
- ...
```

## Quy tắc

- Field bắt buộc phải có; thiếu thì ghi `null`/`[]`/`[CẦN KIỂM CHỨNG]`, không bỏ field.
- `blocked_status.state` chỉ nhận `ok`, `partial`, `blocked`.
- Nếu `state` là `partial` hoặc `blocked`: `reason` bắt buộc, `missing` liệt kê phần thiếu, `items` có thể rỗng.
- Chuỗi JSON phải escape `"` thành `\"`, newline thành `\n`, tab thành `\t`; không chèn control character thô.
- Không thêm chữ ngoài JSON nếu đã yêu cầu JSON-only.
- Nếu schema không phù hợp dữ liệu, nói rõ và đề xuất sửa; không tự phá schema.
- Output phải kiểm được bằng mắt/máy.
