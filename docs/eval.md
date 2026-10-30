# Eval prompt — structure score

## 1. Chạy

```bash
node scripts/eval-prompts.mjs
node scripts/eval-prompts.mjs --json
node scripts/eval-prompts.mjs --write
```

- `--write` ghi `evals/results/eval.json` và `eval.md`.
- Script không gọi model/API; chỉ chấm cấu trúc prompt.
- Không sửa test/case để pass.

## 2. Đo gì

9 tiêu chí trong `evals/rubric.json`:

- Mục tiêu/vai trò, bối cảnh, phạm vi, ràng buộc/an toàn, output schema, ví dụ, nghiệm thu/self-check, model/token, bảo trì/version.

Mỗi tiêu chí 0–3; điểm = `(level/3) × weight`. Tổng 100.

Cap:
- Thiếu output schema: tối đa 70.
- Thiếu acceptance: tối đa 80.
- Có mẫu unsafe/injection: tối đa 40.

## 3. Negative controls

`evals/negative-cases.json` có 3 case phải fail:
- Thiếu output schema.
- Prompt injection.
- Yêu cầu bịa dữ liệu.

Negative pass khi score ≤ max. Nếu không, eval fail.

## 4. Kết quả

`evals/results/eval.md` và `eval.json` chứa baseline/optimized, cap, pass/fail. Đây là `local_reproduced`, không phải `project_verified` cho chất lượng output model.

Kết quả 2026-10-30: coding 1.67 → 93.33; research 0 → 96.66; ux-audit 1.67 → 96.66; negative controls pass.

## 5. Live eval (optional)

Live eval cần model/API và rubric output; repo chưa cấu hình. Nếu chạy, lưu prompt/model/version, 2–3 lần, raw output và grader; thiếu model ghi `blocked`, không suy điểm.

## 6. Giới hạn

- Structure score không chứng minh output hay hơn.
- Prompt có thể đạt cấu trúc nhưng sai nghiệp vụ; cần owner review.
- Case hiện tại chỉ 3; thêm case thật trước khi dùng production.
