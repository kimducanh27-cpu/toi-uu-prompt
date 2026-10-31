# toi-uu-prompt — Kit tối ưu prompt

Bộ kit để **audit, viết lại, đo và đóng gói prompt** cho Gemini, Claude, GPT và Antigravity. Mục tiêu không phải viết prompt dài hơn, mà là prompt **rõ mục tiêu, đủ ngữ cảnh, có ràng buộc, đầu ra kiểm được và có bằng chứng**.

## Trạng thái

- Phiên bản: `0.1.1` (đang xây theo FlowPlan).
- Phạm vi: prompt-only; **chưa chạy live eval model** trong repo.
- Nguyên tắc: không bịa điểm, không copy prompt/code ngoài license, không đưa secret/PII vào prompt.

## Dùng nhanh

```bash
node scripts/eval-prompts.mjs          # chấm cấu trúc baseline/optimized
node scripts/eval-prompts.mjs --json   # xuất JSON
node scripts/check-docs.mjs            # kiểm file/link/secret/path
node scripts/sync-plugin.mjs --check   # plugin package có lệch nguồn?
agy plugin validate plugins/prompt-optimizer --strict
```

- Audit prompt: đọc `prompts/audit.md`.
- Tối ưu prompt: đọc `prompts/optimize.md`.
- Rubric: `docs/rubric.md`.
- Ví dụ: `examples/`.
- Đóng gói: `commands/`, `skills/`, `subagents/`, `hooks/`, `plugins/`.

## Cấu trúc

```text
docs/       research, rubric, taxonomy, models, architecture, eval, usage, flowplan
prompts/    optimize, audit, core templates, CHANGELOG
examples/   4 case baseline vs optimized
evals/      cases, rubric máy đọc, negative cases, results
scripts/    eval-prompts, check-docs, sync-plugin
commands/   /optimize-prompt (Claude Code)
skills/     prompt-optimizer
subagents/  prompt-auditor (read-only)
hooks/      validate-prompt, antigravity-hook
plugins/    prompt-optimizer package (tự chứa)
```

## Quy trình 5 phần

1. **Mục tiêu** — muốn đạt gì.
2. **Bối cảnh** — ai dùng, dữ kiện nào có thật.
3. **Phạm vi** — làm gì, bỏ gì.
4. **Ràng buộc** — độ dài, nguồn, giọng, an toàn.
5. **Nghiệm thu** — kiểm được bằng gì.

## Đo và bằng chứng

### Structure eval ≠ live eval

| Loại | Công cụ | Đo gì | Không đo gì |
|---|---|---|---|
| Structure eval | `scripts/eval-prompts.mjs` | Có đủ mục tiêu/bối cảnh/phạm vi/ràng buộc/output/nghiệm thu; pattern nguy hiểm; cap | Model có trả lời đúng/ hay hơn không |
| Live eval | Cần model/API (chưa có trong repo) | Chất lượng output thật, win-rate A/B | Không thay owner review |

- `scripts/eval-prompts.mjs` chỉ là **static linter cho cấu trúc prompt**; điểm 100 không có nghĩa prompt chắc chắn tốt hơn.
- Live eval cần model/API; nếu thiếu, ghi `blocked`, không suy điểm.
- Mỗi thay đổi prompt ghi `prompts/CHANGELOG.md` + before/after.
- Kết quả eval lưu trong `evals/results/`.

## Giới hạn

- Chưa có API/model để chạy live eval.
- Không cam kết tối ưu cho mọi model; phải eval lại theo model/version.
- Không dùng prompt để vượt quyền, deploy, xóa dữ liệu hoặc gửi dữ liệu thật.

## Tài liệu

- [Rubric 100 điểm](docs/rubric.md)
- [Eval & negative controls](docs/eval.md)
- [Cách dùng](docs/usage.md)
- [FlowPlan guide](docs/flowplan.md)
- [Đóng gói command/skill/hook/plugin](docs/packaging.md)

## Nguồn

- [Nguồn & mức bằng chứng](docs/sources.md) — docs chính thức + claude-howto + ghi chú Bụi Code.
- claude-howto (MIT): https://github.com/luongnv89/claude-howto
