# Research — claude-howto

Nguồn: https://github.com/luongnv89/claude-howto
License: MIT. Version đọc được: `2.1.310`. Ngày đọc: 2026-10-30.

## 1. Cấu trúc repo

Repo là tutorial + mẫu thực hành cho Claude Code, chia 10 chương:

| Chương | Nội dung | Bài học cho prompt optimizer |
|---|---|---|
| 01 slash commands | Command tái sử dụng | Prompt tốt nên đóng gói thành command có mô tả, tham số, đầu ra |
| 02 memory | `CLAUDE.md`, memory dự án | Tách luật dài hạn khỏi prompt ngắn hạn; tránh lặp lại |
| 03 skills | `SKILL.md` + references | Description để agent biết khi nào dùng; progressive disclosure |
| 04 subagents | Agent chuyên biệt | Tách vai audit/rewrite/eval; giới hạn tool và quyền |
| 05 MCP | Kết nối tool ngoài | Chỉ thêm tool khi thật cần; bảo mật dữ liệu |
| 06 hooks | Hook chặn/kiểm tra | `validate-prompt.sh` chặn lệnh nguy hiểm trước khi chạy |
| 07 plugins | Đóng gói command + subagent + MCP + hook | Một manifest, cài một lần, có version |
| 08 checkpoints | Checkpoint/rewind | Lưu trạng thái trước khi thử prompt variant; so sánh A/B |
| 09 advanced | Plan mode, quyền, auto mode | Prompt nhiều bước cần plan + điểm dừng + quyền rõ |
| 10 CLI | Headless/batch | Dùng CLI cho eval/batch read-only; không thay browser |

## 2. Pattern đáng lấy

### 2.1 Command có cấu trúc

`01-slash-commands/optimize.md` cho thấy command nên có:

- Mô tả ngắn trong frontmatter.
- Thứ tự ưu tiên kiểm tra.
- Định dạng đầu ra cố định.
- Version/nguồn/model tương thích.

Áp dụng: `commands/optimize-prompt.md` của kit cần mô tả, tham số, output schema và guardrail.

### 2.2 Skill = quy trình + kiến thức tách rời

`03-skills/README.md` và các skill mẫu dùng `SKILL.md` cho quy trình, file phụ cho kiến thức. Đây là progressive disclosure: agent chỉ đọc phần cần.

Áp dụng: `skills/prompt-optimizer/SKILL.md` giữ quy trình; `references/patterns.md` giữ pattern dài.

### 2.3 Subagent có ranh giới

`04-subagents/` cho thấy mỗi subagent có role/tool/model riêng. Không nên để một agent vừa audit vừa sửa vừa chấm điểm.

Áp dụng: `subagents/prompt-auditor.md` là read-only; optimize do main/owner duyệt.

### 2.4 Hook như cổng an toàn

`06-hooks/validate-prompt.sh` đọc prompt từ stdin, chặn mẫu nguy hiểm (`rm -rf /`, drop database, deploy production khi chưa duyệt) và cảnh báo thiếu test khi refactor.

Áp dụng: `hooks/validate-prompt.sh` của kit chặn prompt nguy hiểm/thiếu context, nhưng không thay review của owner.

### 2.5 Plugin đóng gói nhiều thành phần

`07-plugins/` mô tả plugin gồm command, subagent, MCP, hook, config. Đây là cách phân phối kit gọn.

Áp dụng: `plugins/prompt-optimizer/plugin.json` liệt kê command/skill/hook/subagent; README hướng dẫn cài.

### 2.6 Checkpoint để thử variant

`08-checkpoints/` dùng checkpoint/rewind để thử A/B mà không mất trạng thái. Prompt optimization nên lưu baseline trước khi thử variants.

Áp dụng: eval lưu baseline/variant results; không ghi đè baseline.

## 3. Không copy gì

- Không copy code shell/Python hoặc nội dung hướng dẫn nguyên văn.
- Không dùng tên command/skill của repo như thể là của kit.
- Chỉ học cấu trúc, sau đó viết lại theo ngữ cảnh kit và license của mình.

## 4. Giới hạn

- Repo là tutorial, không phải benchmark độc lập.
- Một số thông tin version Claude Code có thể thay đổi; kiểm lại docs chính thức khi dùng.
- Không có đánh giá chất lượng prompt; chỉ có pattern đóng gói.
