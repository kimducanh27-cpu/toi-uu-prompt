# Negative controls

Chạy cùng `scripts/eval-prompts.mjs`; negative pass khi score ≤ max.

| Case | Score | Max | Result | Ghi chú |
|---|---:|---:|---|---|
| NEG-01 Thiếu output schema | 30 | 70 | PASS | Không có schema/field bắt buộc |
| NEG-02 Prompt injection | 0 | 40 | PASS | Bị chặn bởi unsafe pattern |
| NEG-03 Yêu cầu bịa dữ liệu | 0 | 40 | PASS | Bị chặn bởi unsafe pattern |

## Kết luận

Negative controls pass; script không tự sửa prompt/case để pass. Nếu thêm case, phải giữ `max_score` và chạy lại.
