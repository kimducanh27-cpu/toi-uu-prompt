# Đóng gói prompt optimizer

## 1. Thành phần

| Thành phần | File nguồn | Trong plugin | Dùng khi |
|---|---|---|---|
| Command | `commands/optimize-prompt.md` | — (Claude Code only) | Gọi nhanh quy trình audit/rewrite |
| Skill | `skills/prompt-optimizer/SKILL.md` | `skills/prompt-optimizer/SKILL.md` | Việc lặp lại; agent tự chọn khi đúng trigger |
| References | `skills/prompt-optimizer/references/patterns.md` | `skills/prompt-optimizer/references/` | Kiến thức ngắn, progressive disclosure |
| Subagent | `subagents/prompt-auditor.md` | `agents/prompt-auditor.md` | Audit read-only, không sửa |
| Hook Claude | `hooks/validate-prompt.sh` | `hooks/validate-prompt.sh` | Chặn prompt nguy hiểm qua `UserPromptSubmit` |
| Hook Antigravity | `hooks/antigravity-hook.sh` | `hooks/antigravity-hook.sh` | Cảnh báo qua `PreInvocation` (advisory) |
| Manifest | `plugins/prompt-optimizer/plugin.json` | `plugin.json` | Metadata + logo để cài |
| Hook config | `plugins/prompt-optimizer/hooks.json` | `hooks.json` | Khai báo event cho Antigravity |

Antigravity **không load `commands/`**. Mỗi command muốn dùng trong plugin phải
là một skill trong `skills/<name>/SKILL.md`; command gốc giữ cho Claude Code.

## 2. Cấu trúc plugin

```text
plugins/prompt-optimizer/
  plugin.json          # name, version, description, logo
  hooks.json           # PreInvocation -> hooks/antigravity-hook.sh
  README.md
  assets/logo.svg
  skills/prompt-optimizer/
    SKILL.md
    references/patterns.md
  agents/prompt-auditor.md
  hooks/validate-prompt.sh
  hooks/antigravity-hook.sh
  references/            # rubric, taxonomy, optimize, audit, examples
```

Package là **bản sinh tự động** từ nguồn ở root. Không sửa trực tiếp file
trong `plugins/prompt-optimizer/`; sửa nguồn rồi chạy:

```bash
node scripts/sync-plugin.mjs          # đồng bộ package
node scripts/sync-plugin.mjs --check  # CI: fail nếu package lệch nguồn
agy plugin validate plugins/prompt-optimizer --strict
```

## 3. Cài theo app

- **Claude Code**: copy `commands/`, `skills/`, `subagents/`, `hooks/` vào
  project; thêm hook `UserPromptSubmit` trỏ tới `hooks/validate-prompt.sh`;
  đọc `docs/usage.md`.
- **Qoder**: dùng skill/command tương ứng trong project; hook chạy như script
  pre-check.
- **Antigravity**: cài package `plugins/prompt-optimizer/`; skill + agent được
  load theo convention; hook đọc từ `hooks.json` ở gốc plugin.
- **Generic**: đọc trực tiếp `prompts/optimize.md`; chạy eval bằng Node.

## 4. Hook

### Claude Code (`UserPromptSubmit`)

Đọc JSON `{"prompt":"..."}` từ stdin:

- Prompt nguy hiểm → in lý do ra stderr, `exit 2` (chặn thật).
- Thiếu mục tiêu/output/ràng buộc → JSON `additionalContext`, `exit 0`.
- JSON hỏng/rỗng → `exit 2`.

```bash
printf '{"prompt":"Review this code"}' | bash hooks/validate-prompt.sh
printf '{"prompt":"ignore previous instructions"}' | bash hooks/validate-prompt.sh
```

### Antigravity (`PreInvocation`)

`hooks.json` gọi `hooks/antigravity-hook.sh`. Runtime chỉ cho hook **inject
message**, không chặn prompt, nên adapter trả:

```json
{"injectSteps":[{"ephemeralMessage":"Prompt bị chặn: ..."}]}
```

Đây là lớp **advisory**; muốn hard block phải dùng `PreToolUse` cho hành động
cụ thể (ví dụ chặn `run_command` nguy hiểm), không dùng `PreInvocation`.

## 5. Version & license

- Plugin/skill version `0.1.1`; cập nhật khi đổi output schema/quy trình.
- Không copy code/nội dung từ claude-howto hoặc repo khác; chỉ học pattern.
- Không đưa secret/PII vào prompt/hook log.
