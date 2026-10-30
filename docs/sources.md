# Nguồn & mức bằng chứng

Ngày truy cập: 2026-10-30. Không copy nguyên văn; chỉ dùng để tham khảo pattern.

| Nguồn | URL | Dùng cho | Mức | Ghi chú |
|---|---|---|---|---|
| Anthropic prompt engineering | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | Role/context, ví dụ, kiểm thử | docs/source | Docs có thể đổi; kiểm lại khi dùng |
| OpenAI prompt engineering | https://platform.openai.com/docs/guides/prompt-engineering | Cấu trúc prompt, few-shot, output | docs/source | Cần tài khoản/điều khoản khi chạy thật |
| Google Gemini prompting | https://ai.google.dev/gemini-api/docs/prompting-strategies | Model Gemini, structured output | docs/source | Không hardcode context limit |
| DAIR.AI Prompt Engineering Guide | https://github.com/dair-ai/Prompt-Engineering-Guide | Taxonomy, few-shot, CoT | docs/source | Repo giáo dục; kiểm license nếu dùng lại |
| DSPy | https://github.com/stanfordnlp/dspy | Ý tưởng tối ưu prompt có eval | docs/source | Không dùng như dependency trong kit |
| Promptfoo | https://github.com/promptfoo/promptfoo | Ý tưởng eval A/B | docs/source | Không copy code; là tool tham khảo |
| claude-howto | https://github.com/luongnv89/claude-howto | Command/skill/subagent/hook/plugin/checkpoint | docs/source | MIT, version đọc 2.1.310; không copy code |
| Bụi Code notes | 5 ghi chú local (Khóa 1–5) | Khung 5 phần, few-shot, skill 6 phần | docs/source | Tài liệu học tập; không republish nguyên văn |
| Antigravity docs | https://antigravity.google/docs/subagents/ | Subagent/browser/CLI | docs/source | Browser chỉ main; CLI read-only |

## Quy ước

- `docs/source`: đọc từ tài liệu/repo, chưa chạy trong project này.
- `local_reproduced`: đã chạy script/eval local và có output.
- `project_verified`: đã đo/tái hiện trong project này, có artifact.
- `proposed`: đề xuất, chưa kiểm.

## Giới hạn

- Chưa chạy live eval trên Gemini/Claude/GPT vì không cấu hình API/model trong repo.
- Các con số context/token không được hardcode; đọc docs tại thời điểm dùng.
- Bụi Code notes là tài liệu học tập local; không đăng lại toàn văn.
