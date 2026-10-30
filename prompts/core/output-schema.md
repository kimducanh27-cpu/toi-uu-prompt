# Output schema template

## Dạng JSON

```json
{
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
- Không thêm chữ ngoài JSON nếu đã yêu cầu JSON-only.
- Nếu schema không phù hợp dữ liệu, nói rõ và đề xuất sửa; không tự phá schema.
- Output phải kiểm được bằng mắt/máy.
