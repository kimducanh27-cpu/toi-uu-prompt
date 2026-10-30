# Cách dùng

## 1. Chỉ audit prompt

1. Đọc `prompts/audit.md`.
2. Đưa prompt gốc + mục tiêu/model/output.
3. Nhận điểm, finding P0–P3, 3 việc ưu tiên.
4. Không sửa trong audit.

## 2. Tối ưu prompt

1. Đọc `prompts/optimize.md` hoặc gọi `/optimize-prompt`.
2. Trả lời tối đa 5 câu intake.
3. Nhận audit + 2–3 variant.
4. Chọn variant; owner duyệt scope.
5. Chạy `node scripts/eval-prompts.mjs`.
6. Ghi changelog; chỉ dùng khi structure eval pass.

## 3. Dùng trong app

- **Claude Code**: copy `commands/`, `skills/`, `subagents/`, `hooks/`; thêm hook UserPromptSubmit.
- **Qoder**: đọc `skills/prompt-optimizer/SKILL.md` hoặc chạy `prompts/optimize.md`.
- **Antigravity**: copy skill/rule vào `.agents/`; subagent read-only; browser chỉ main `/browser`.
- **Generic**: đọc trực tiếp prompt; chạy eval bằng Node.

## 4. Đọc điểm

- 90–100: sẵn sàng; vẫn cần owner review.
- 75–89: dùng kèm lưu ý.
- 60–74: cần sửa.
- <60: không dùng.
- Điểm là **cấu trúc**, không phải chất lượng output model.
- Live eval cần model/API; thiếu thì `blocked`.

## 5. Ví dụ

```bash
node scripts/eval-prompts.mjs
# CASE         BASE OPT MIN RESULT
# coding       1.67 93.33 75 PASS
# research     0 96.66 75 PASS
# ux-audit     1.67 96.66 75 PASS
```

## 6. Không làm

- Không đưa secret/PII vào prompt.
- Không dùng prompt để vượt quyền/deploy/xóa dữ liệu.
- Không sửa eval case để pass.
- Không copy prompt/code ngoài license.
