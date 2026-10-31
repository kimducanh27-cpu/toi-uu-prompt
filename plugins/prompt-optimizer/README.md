# Prompt Optimizer plugin

Plugin tự chứa để audit, viết lại và đo prompt theo rubric 100 điểm.

## Thành phần

| Thành phần | Đường dẫn | Vai trò |
|---|---|---|
| Skill | `skills/prompt-optimizer/SKILL.md` | Quy trình audit → diagnose → rewrite → eval |
| References | `skills/prompt-optimizer/references/` | Rubric, taxonomy, prompt mẫu, ví dụ |
| Agent | `agents/prompt-auditor.md` | Audit read-only, không sửa prompt |
| Hook | `hooks.json` + `hooks/antigravity-hook.sh` | Cảnh báo prompt nguy hiểm/thiếu phần (advisory) |

## Cài

```bash
agy plugin validate plugins/prompt-optimizer --strict
agy plugin install plugins/prompt-optimizer
```

Với Claude Code, copy `skills/`, `agents/`, `hooks/` vào project và thêm hook
`UserPromptSubmit` trỏ tới `hooks/validate-prompt.sh`.

## Hook

- Claude Code: `hooks/validate-prompt.sh` đọc JSON `{"prompt":"..."}`; exit 2 +
  stderr để chặn prompt nguy hiểm.
- Antigravity: `hooks.json` dùng event `PreInvocation`; runtime không cho hook
  chặn prompt, nên adapter inject cảnh báo qua `ephemeralMessage`. Đây là
  **advisory**, không phải hard block.

## Giới hạn

- Không chạy live eval model; `eval-prompts.mjs` chỉ chấm cấu trúc prompt.
- Không đưa secret/PII vào prompt hoặc log hook.
- Không dùng plugin để vượt quyền, deploy production hoặc xóa dữ liệu.

## Nguồn

- Rubric và quy trình: repo `kimducanh27-cpu/toi-uu-prompt`.
- Hook contract: tài liệu `agy-customizations/docs/hooks.md` của Antigravity.
