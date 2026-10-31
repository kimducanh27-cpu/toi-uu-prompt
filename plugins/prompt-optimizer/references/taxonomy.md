# Taxonomy prompt

## 1. Theo vai trò

| Loại | Dùng khi | Đầu ra |
|---|---|---|
| System / role | Thiết lập vai, quyền, giới hạn | Luật ổn định cho cả phiên |
| Task | Một việc cụ thể | Kết quả đúng format |
| Context | Cần đưa dữ kiện/nguồn | Tóm tắt dữ kiện, không bịa |
| Rewrite | Sửa prompt khác | Prompt mới + diff + lý do |
| Audit | Chỉ chấm, không sửa | Finding + điểm + evidence |
| Eval | Chấm output/prompt | Điểm, pass/fail, lỗi |
| Agent | Nhiều bước, tool | Plan + hành động + evidence |
| Skill / command | Việc lặp lại | Quy trình + reference + output mẫu |
| Subagent | Việc độc lập, read-only | Kết quả + evidence, không tự merge |

## 2. Theo cấu trúc

- **Zero-shot**: việc quen, mô tả rõ; không cần ví dụ.
- **Few-shot**: cần format/giọng/classification; 2–3 ví dụ.
- **Prompt chaining**: việc dài; output bước trước là input bước sau.
- **Self-check**: yêu cầu kiểm lại trước khi trả.
- **Constrained output**: JSON/schema/markdown cố định.
- **Tool-using**: cần đọc file/chạy lệnh/browser; phải có quyền và fallback.

## 3. Vòng đời

```text
intake → audit → diagnose → rewrite 2–3 variants → eval → owner duyệt → version → release
```

- **Intake**: mục tiêu, người dùng, model, dữ liệu, ràng buộc, non-goals.
- **Audit**: rubric 100; finding P0–P3.
- **Rewrite**: tối thiểu (A), cấu trúc đầy đủ (B), model-specific (C).
- **Eval**: structure trước; live model sau nếu có.
- **Owner duyệt**: chọn variant; không tự đổi scope.
- **Version**: `prompts/CHANGELOG.md`, ghi before/after.
- **Release**: chỉ khi owner cho phép.

## 4. Khi nào dùng loại nào

| Việc | Loại chính | Ghi chú |
|---|---|---|
| Prompt trả lời tự do | Task + context | Thêm output format nếu cần dùng lại |
| Trích xuất dữ liệu | Task + schema + few-shot | Ít ví dụ, cùng schema |
| Audit prompt | Audit read-only | Không sửa trong cùng lượt |
| Sửa prompt | Rewrite + eval | Owner duyệt trước khi thay |
| Quy trình lặp | Skill/command | Tách references |
| Nhiều bước có tool | Agent | Plan + stop condition + evidence |

## 5. Nguyên tắc đặt tên

- Tên nói **việc**, không nói “helper”.
- Description nói **khi nào dùng** và **không dùng**.
- File dùng kebab-case; version trong frontmatter/CHANGELOG.
- Không dùng một prompt cho quá nhiều vai.
