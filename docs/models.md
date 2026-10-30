# Model profiles — dùng để chọn cách viết prompt

Đây là hướng dẫn **model-agnostic**, không phải bảng thông số cố định. Kiểm lại docs chính thức trước khi dùng; không hardcode context limit.

## 1. Bảng so sánh nhanh

| Model family | Điểm mạnh | Cách viết prompt | Structured output | Cần kiểm |
|---|---|---|---|---|
| **Gemini** | Long context, đa phương thức, agentic | Chia mục rõ; nêu mục tiêu + evidence; dùng schema | JSON schema/structured output | Context/tool theo model card; hallucination |
| **Claude** | Đọc hiểu dài, viết, tool use | Role/context rõ; XML/tag cho khối; ví dụ ngắn | JSON/schema; kiểm output | Context/tool theo docs hiện tại |
| **GPT** | Instruction following, tool calling | System/developer + task; output schema rõ | JSON schema/structured outputs | Model/version và tool availability |
| **Antigravity** | Agent harness, subagent, skill/rule | Prompt ngắn + file luật; mission packet; evidence | Theo agent/skill | Browser chỉ main; CLI read-only |

## 2. Gemini

- Dùng heading/section rõ; tách “mục tiêu”, “bối cảnh”, “đầu ra”.
- Với Gemini 4 Argon: model card ghi context 1M, text/image/audio/video; có hallucination và cutoff 03/2026 — phải dùng nguồn/tool, không tin trí nhớ.
- Nếu cần JSON: đưa schema hoặc mẫu; yêu cầu “không thêm chữ ngoài JSON”.
- Với việc dài: yêu cầu plan ngắn → thực hiện → self-check; không nhồi mọi luật vào một đoạn.

## 3. Claude

- Dùng role + context + task + constraints; có thể dùng thẻ XML để tách `context`, `task`, `output`.
- Few-shot ngắn, cùng format; tránh ví dụ dài.
- Với tool: nêu rõ tool nào được dùng, khi nào dừng, khi nào hỏi owner.
- Với văn bản dài: đưa tài liệu trong block riêng; yêu cầu trích dẫn vị trí.

## 4. GPT

- System/developer message giữ luật ổn định; user message giữ task/dữ liệu.
- Structured output/JSON schema nếu cần dùng lại; kiểm field bắt buộc.
- Tool calling: mô tả input/output, lỗi, fallback.
- Tránh nhồi nhiều mục tiêu mâu thuẫn trong một prompt.

## 5. Antigravity

- Prompt ngắn; luật dài đặt trong `AGENTS.md`/rules/skills.
- Custom subagent chạy clean-slate; mission phải đóng gói đủ context/evidence.
- Browser chỉ main qua `/browser`; custom subagent không browser.
- CLI `agy -p` hợp batch read-only; `/teamwork` cho multi-file; không dùng preview.
- Kỹ năng/skill nên ít; mỗi skill có description rõ khi nào dùng.

## 6. Quy tắc chung cho mọi model

1. Một mục tiêu chính; phụ rõ thứ bậc.
2. Nêu audience + dữ kiện; không để model tự đoán.
3. Nêu non-goals và điều cấm.
4. Đưa output schema/mẫu; nói rõ field bắt buộc.
5. 2–3 ví dụ nếu cần format/giọng.
6. Yêu cầu self-check và nói rõ khi thiếu dữ liệu.
7. Không đưa secret/PII; không yêu cầu hành động ngoài quyền.
8. Đo bằng eval; không suy điểm từ cảm giác.

## 7. Live eval

Repo chưa cấu hình API/model để chấm output thật. `scripts/eval-prompts.mjs` mặc định là **structure eval**. Live eval phải ghi `blocked` nếu thiếu model/API; không bịa điểm.
