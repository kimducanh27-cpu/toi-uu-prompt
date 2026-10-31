# FlowPlan guide

Plan: **Tối ưu Prompt — Kit đánh giá & viết lại prompt**
ID: `plan-1793373940703-0003`

## 1. Cách đọc

- Mỗi thẻ là một bước: title, description, type, files, dependencies.
- Thẻ chỉ được bắt đầu khi các dependencies đã xong.
- Sau mỗi bước: cập nhật title/description/files nếu kết quả khác kế hoạch.
- Không đổi dependency tùy tiện; nếu đổi, ghi lý do.

## 2. Thứ tự

| Order | Thẻ | Type | Phụ thuộc |
|---:|---|---|---|
| 0 | Research mục tiêu & nguồn | research | — |
| 1 | Research claude-howto + Bụi Code | research | 0 |
| 2 | Rubric & taxonomy | planning | 0 |
| 3 | Model profiles & eval tools | research | 0 |
| 4 | Architecture & workflow | planning | 2, 3, 1 |
| 5 | Core templates | create | 4 |
| 6 | Optimize/audit prompts | create | 4, 5 |
| 7 | 3 examples | create | 5, 6 |
| 8 | Eval harness | create | 6 |
| 9 | Test baseline/negative | test | 7, 8 |
| 10 | Refine prompts | edit | 9 |
| 11 | Packaging command/skill/hook/plugin | create | 10, 5, 6, 1 |
| 12 | README/usage/FlowPlan docs | create | 10, 11 |
| 13 | Final acceptance/CI | test | 12, 11 |

## 3. Trạng thái

- `✅ DONE` trong title = đã xong, có file/evidence.
- Không có dấu = chưa bắt đầu hoặc đang chờ.
- Kết quả thật nằm trong repo, không chỉ trên FlowPlan.

## 4. Cập nhật thẻ

- Xong bước: thêm `✅ DONE` + file thật nếu khác dự kiến.
- Nếu bước bị chặn: ghi `BLOCKED` + lý do + cách mở.
- Không đánh dấu xong nếu chưa chạy eval/check tương ứng.

## 5. Giới hạn

- FlowPlan là bảng điều phối, không thay git/eval/evidence.
- Plan có thể đổi khi research phát hiện scope mới; owner duyệt trước khi mở rộng.

## 6. Trạng thái plan gốc (2026-10-31)

| Order | Thẻ | Trạng thái | Evidence |
|---:|---|---|---|
| 0–4 | Research, rubric, architecture | ✅ DONE | `docs/research*.md`, `docs/rubric.md`, `docs/architecture.md` |
| 5–6 | Core templates, optimize/audit | ✅ DONE | `prompts/core/*`, `prompts/optimize.md`, `prompts/audit.md` |
| 7 | Examples | ✅ DONE | `examples/*.md` (4 case) |
| 8–10 | Eval harness, test, refine | ✅ DONE | `scripts/eval-prompts.mjs`, `evals/` |
| 11 | Packaging | ✅ DONE | `plugins/prompt-optimizer/`, `scripts/sync-plugin.mjs` |
| 12 | README/usage/FlowPlan | ✅ DONE | `README.md`, `docs/usage.md`, file này |
| 13 | Final acceptance/CI | ⏳ IN PROGRESS | chờ Phase 6 của plan remediation |

## 7. Remediation 32 cards (P0/P1)

Nguồn: plan "Fix P0/P1 từ 5 agy reviews — toi-uu-prompt commit 78009ac".

| Phase | Cards | Nội dung | Trạng thái |
|---|---|---|---|
| 0 | 0–1 | Workspace, backup, reproducible tests | ✅ DONE |
| 1 | 2–5 | Hook security (fail-open, newline, exit code, +x) | ✅ DONE |
| 2 | 6–10 | Rubric/extractSection/negative controls/rounding | ✅ DONE |
| 3 | 11–13 | Plugin manifest, subagent tools, logo | ✅ DONE |
| 4 | 14–18 | XML delimiters, English patterns, JSON few-shot, metadata, blocked_status | ✅ DONE |
| 5 | 19–27 | Docs, version, negative controls, link/secret checks, baselines | ✅ DONE |
| 6 | 28–32 | Full test, CI simulation, adversarial, readiness, push | ✅ DONE — push `408c50c`, CI run `41179527631` success |

### Evidence phase 3–5

```bash
node scripts/eval-prompts.mjs            # PASS, 4 case + 6 negative
node scripts/check-docs.mjs              # PASS, links/JSON/secrets/paths
node scripts/sync-plugin.mjs --check     # PASS, package in sync
agy plugin validate plugins/prompt-optimizer --strict  # PASS, 1 skill/1 agent/1 hook
```

### Ghi chú

- Hook Claude từng fail-open vì `process.stdin.read()` trả `null`; đã đổi sang
  `readFileSync(0)`, chặn bằng `exit 2`.
- Antigravity không có `UserPromptSubmit` và không cho `PreInvocation` chặn;
  adapter chỉ inject cảnh báo.
- `commands/` không được Antigravity load; package dùng skill thay thế.

