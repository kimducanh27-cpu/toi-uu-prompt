# Core prompt templates

Dùng theo thứ tự: system → task → context → constraints → output schema → examples → self-check → token budget.

- Chỉ dùng phần cần; không nhồi hết nếu task đơn giản.
- Placeholder dùng `{{...}}`; thay bằng dữ kiện thật.
- Không đưa secret/PII vào template.
- Sau khi ghép, chạy audit theo `docs/rubric.md`.
