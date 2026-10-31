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

### Claude Code

Copy `commands/`, `skills/`, `subagents/`, `hooks/` vào project. Thêm hook
`UserPromptSubmit` trỏ tới `hooks/validate-prompt.sh`; hook chặn bằng
`exit 2` + stderr.

### Qoder

Đọc `skills/prompt-optimizer/SKILL.md` hoặc chạy `prompts/optimize.md`.
Command `/optimize-prompt` chỉ dùng khi host hỗ trợ `commands/`.

### Antigravity

Cài package đã đóng gói:

```bash
node scripts/sync-plugin.mjs
agy plugin validate plugins/prompt-optimizer --strict
agy plugin install plugins/prompt-optimizer
```

Package có skill, agent và `hooks.json`; **không** có `commands/` vì
Antigravity không load command. Hook `PreInvocation` chỉ inject cảnh báo,
không chặn prompt.

Copy thủ công vào `.agents/` chỉ khi không dùng `agy plugin install`; giữ
subagent read-only và browser ở main session.

### Generic

Đọc trực tiếp prompt; chạy eval bằng Node.

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
# coding       6.66 93.33 75 PASS
# research     5 83.34 75 PASS
# ux-audit     6.66 91.67 75 PASS
# english      3.33 93.33 90 PASS
```

## 6. Không làm

- Không đưa secret/PII vào prompt.
- Không dùng prompt để vượt quyền/deploy/xóa dữ liệu.
- Không sửa eval case để pass.
- Không copy prompt/code ngoài license.
