---
description: Audit và tối ưu một prompt theo rubric, có variant và eval.
argument-hint: [prompt hoặc đường dẫn file prompt]
---

Đọc `prompts/optimize.md`, `docs/rubric.md`, `docs/taxonomy.md`.

Dùng `$ARGUMENTS` làm prompt/phạm vi cần tối ưu.

1. Intake tối đa 5 câu nếu thiếu mục tiêu/model/output.
2. Audit rubric 100 điểm; không sửa trong bước này.
3. Đề xuất 2–3 variant (A minimal, B structured, C model-specific) kèm trade-off.
4. Chạy `node scripts/eval-prompts.mjs` nếu có case phù hợp; thiếu model live eval ghi `blocked`.
5. Chỉ sửa prompt gốc sau khi owner duyệt variant/scope.
6. Ghi version/lý do vào `prompts/CHANGELOG.md`; báo cáo before/after.

Không đưa secret/PII; không tạo prompt vượt quyền/deploy/xóa dữ liệu; không bịa điểm.
