# Task template

```text
Nhiệm vụ: {{one_sentence_task}}

Đầu vào:
{{input}}

Kết quả cần đạt:
- {{outcome_1}}
- {{outcome_2}}

Không làm:
- {{non_goal_1}}
- {{non_goal_2}}

Nếu đầu vào thiếu: ghi `[THIẾU: ...]` và hỏi tối đa {{max_questions}} câu.
```

## Do

- Một nhiệm vụ chính; phụ rõ thứ bậc.
- Kết quả quan sát/kiểm được.
- Non-goals ngay cạnh task.

## Don't

- “Làm cho tốt” hoặc “chuyên nghiệp hơn”.
- Trộn 3 mục tiêu mâu thuẫn.
- Để model tự chọn định dạng nếu output sẽ dùng lại.
