# Research — mục tiêu, người dùng, phạm vi

Ngày: 2026-10-30. Trạng thái repo lúc bắt đầu: chỉ có `README.md` tiêu đề.

## 1. Mục tiêu

Xây một bộ kit **tối ưu prompt** có thể:

1. Audit prompt hiện có theo rubric rõ ràng.
2. Chẩn đoán phần thiếu: mục tiêu, bối cảnh, phạm vi, ràng buộc, định dạng đầu ra, ví dụ, tiêu chí nghiệm thu.
3. Viết lại 2–3 phiên bản, so sánh bằng eval và chọn trong phạm vi owner duyệt.
4. Đóng gói prompt thành command/skill/subagent/hook/plugin để tái sử dụng.
5. Lưu bằng chứng, version và handoff; không bịa điểm hoặc kết quả.

## 2. Người dùng

- Người viết prompt không chuyên: cần câu hỏi rõ, ví dụ, đầu ra kiểm được.
- Developer/agent builder: cần template, eval, versioning, đóng gói.
- Owner/người duyệt: cần báo cáo 1 trang, biết prompt nào đổi, rủi ro gì.

## 3. Definition of Done

- Có rubric 100 điểm và taxonomy prompt.
- Có prompt audit/rewrite chạy được, có guardrail.
- Có 3 case baseline vs optimized và eval harness chạy local/CI.
- Có negative controls; không sửa test để pass.
- Có command/skill/subagent/hook/plugin manifests.
- Có README, usage, FlowPlan guide, CI check.
- Không có secret/PII/absolute path; link/path kiểm được.

## 4. Non-goals

- Không huấn luyện/fine-tune model.
- Không phải marketplace prompt.
- Không tự chạy prompt trên production hoặc gửi dữ liệu thật.
- Không copy nguyên prompt/code từ repo khác khi chưa có license.
- Không hứa điểm chất lượng nếu chưa chạy model/eval tương ứng.

## 5. Câu hỏi research

1. Một prompt tốt cần những phần nào?
2. Khác biệt giữa prompt cho Gemini, Claude, GPT và Antigravity là gì?
3. Cách đo prompt mà không fake điểm?
4. Cách đóng gói prompt để tái sử dụng: command, skill, subagent, hook, plugin?
5. Cách tránh prompt injection, hallucination và scope creep?

## 6. Kết luận research ban đầu

- Khung 5 phần của Bụi Code: **Mục tiêu — Bối cảnh — Phạm vi — Ràng buộc — Nghiệm thu**. Có thể map sang rubric.
- Few-shot mạnh cho định dạng/giọng; luật rõ mạnh cho logic/tính toán.
- “Hỏi trước khi làm” giảm số vòng sửa; giới hạn tối đa 5 câu.
- Skill/command/hook/plugin của claude-howto đáng học về **đóng gói**, không copy nội dung.
- Eval cần tách **kiểm tra cấu trúc** (deterministic) khỏi **chất lượng output** (cần model/người chấm). Không trộn hai loại điểm.

## 7. Quyết định cho kit

- Rubric 100 điểm, có trọng số và cap.
- Eval mặc định là **structure eval** chạy local/CI; live model eval là optional và phải ghi `blocked` nếu thiếu model/API.
- Prompt được version trong `prompts/CHANGELOG.md`.
- Mỗi thay đổi lớn có before/after, case và evidence.
- FlowPlan dùng để hiển thị thứ tự; repo là nguồn sự thật cho file.

## 8. Giới hạn

- Research này dựa trên docs chính thức + ghi chú học tập; chưa chạy live eval trên mọi model.
- Số context/token của model thay đổi; phải kiểm lại tại thời điểm dùng.
- Ghi chú Bụi Code là tài liệu học tập local, không republish nguyên văn.
