# Baseline results

Chạy: `node scripts/eval-prompts.mjs --write`. Đây là structure score, không phải live model quality.

| Case | Baseline | Optimized | Min | Result |
|---|---:|---:|---:|---|
| coding | 1.67 | 93.33 | 75 | PASS |
| research | 0 | 96.66 | 75 | PASS |
| ux-audit | 1.67 | 96.66 | 75 | PASS |

## Vì sao baseline thấp

- Coding: `Review this code and find bugs.` — thiếu role, context, scope, output schema, acceptance; điểm 1.67 đến từ chữ “review” khớp tiêu chí maintenance.
- Research: `Summarize this article.` — không khớp tiêu chí cấu trúc nào; 0.
- UX: `Review my UI and tell me what to fix.` — thiếu persona/route/viewport/evidence/schema; 1.67 từ “review”.

## Kết luận

Baseline không đủ để dùng làm prompt chuẩn. Không có điểm nào được gán thủ công.
