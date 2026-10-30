---
name: prompt-optimizer
description: "Audit, chẩn đoán và viết lại prompt theo rubric 100 điểm; dùng khi prompt mơ hồ, thiếu output schema, tối ưu token hoặc cần variant A/B/C. Không dùng để chạy prompt trên production."
---

# Prompt Optimizer

## Khi nào dùng

- Prompt trả kết quả chung chung, sai format hoặc thiếu ràng buộc.
- Cần audit trước khi sửa prompt.
- Cần so sánh baseline với 2–3 variants.
- Cần đóng gói prompt thành command/skill.

Không dùng cho: viết prompt tấn công, bypass quyền, deploy/xóa dữ liệu, hoặc thay owner duyệt.

## Quy trình

1. **Intake** — mục tiêu, audience, model, output, nguồn, non-goals; tối đa 5 câu.
2. **Audit** — chấm 9 tiêu chí theo `docs/rubric.md`; finding P0–P3; không sửa.
3. **Diagnose** — top 3 nút thắt, map 5 phần.
4. **Rewrite** — 2–3 variant A/B/C kèm trade-off.
5. **Eval** — `node scripts/eval-prompts.mjs`; live eval chỉ khi có model.
6. **Owner duyệt** — chọn variant/scope.
7. **Version** — ghi `prompts/CHANGELOG.md`, before/after.
8. **Packaging** — command/skill/hook nếu việc lặp lại.

## References

- `references/patterns.md` — pattern ngắn: 5 phần, few-shot, ask-first, self-check, anti-injection.
- `docs/rubric.md` — thang điểm.
- `prompts/optimize.md` — prompt đầy đủ.
- `examples/` — 3 case.

## Output

- Audit: điểm + finding + 3 việc ưu tiên.
- Rewrite: 2–3 variant + trade-off.
- Eval: structure score, negative controls, phần chưa kiểm.
- Không nói “tối ưu nhất” nếu chưa có live eval.

## Guardrail

- Không secret/PII; không prompt injection; không copy ngoài license.
- Không sửa prompt gốc trước khi owner duyệt.
- Không sửa eval case để pass.
- Thiếu browser/model/tool: ghi `blocked`, không suy.
