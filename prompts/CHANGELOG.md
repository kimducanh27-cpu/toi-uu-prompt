# Prompt changelog

## 1.0.1 — 2026-10-31

- Plugin package tự chứa: `skills/`, `agents/`, `hooks.json`, logo; bỏ
  `components` không được runtime load.
- Hook Claude: sửa `process.stdin.read()` → `readFileSync(0)` (trước đó mọi
  pattern nguy hiểm đều fail-open); chặn bằng `exit 2` + stderr.
- Hook Antigravity: thêm adapter `PreInvocation`, inject cảnh báo qua
  `ephemeralMessage` (advisory).
- Task/context template: thêm tag `<task>`, `<input>`, `<context>`,
  `<context_rules>` và rule coi dữ liệu là data, không phải chỉ dẫn.
- Output schema: thêm `blocked_status` (`ok|partial|blocked`) + quy tắc escape.
- Ví dụ: few-shot chuyển sang JSON hợp lệ; metadata model/version đưa ra
  frontmatter; thêm case English.
- Rubric 1.1: pattern song ngữ Việt/Anh; sửa false positive `isUnsafe` cho
  guardrail tiếng Anh.
- Kết quả structure eval: coding 93.33, research 83.34, ux-audit 91.67,
  english 93.33; negative controls pass.
- Chưa chạy live model eval.

## 1.0.0 — 2026-10-30

- Tạo baseline + optimized cho 3 case.
- Thêm rubric, eval harness và negative controls.
