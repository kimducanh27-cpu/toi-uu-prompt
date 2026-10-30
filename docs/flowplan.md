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
