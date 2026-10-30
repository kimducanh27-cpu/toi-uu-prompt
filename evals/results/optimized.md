# Optimized results

Chạy: `node scripts/eval-prompts.mjs --write`.

| Case | Baseline | Optimized | Min | Result | Caps |
|---|---:|---:|---:|---|---|
| coding | 1.67 | 93.33 | 75 | PASS | none |
| research | 0 | 96.66 | 75 | PASS | none |
| ux-audit | 1.67 | 96.66 | 75 | PASS | none |

## Tiêu chí đã đạt

Cả 3 prompt optimized có: role/goal, context, scope, constraints/safety, output schema, ví dụ, acceptance/self-check, model/token, version/owner.

## Không claim

- Đây là điểm **cấu trúc**, chưa chạy model thật.
- Chưa đo token thực; `{{max_tokens}}` là placeholder.
- Chưa chứng minh output hay hơn baseline về nội dung.
- Live eval cần model/API; nếu thiếu ghi `blocked`.
