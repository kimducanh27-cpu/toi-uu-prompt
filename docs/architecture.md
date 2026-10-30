# Kiến trúc repo & workflow

## 1. Cấu trúc

```text
README.md
docs/             research, rubric, taxonomy, models, architecture, eval, usage, flowplan
prompts/          optimize.md, audit.md, CHANGELOG.md
prompts/core/     system, task, context, constraints, output-schema, examples, self-check, token-budget
examples/         coding-agent, research-agent, ux-audit-agent
evals/            cases.json, rubric.json, negative-cases.json, results/
scripts/          eval-prompts.mjs, check-docs.mjs
commands/         optimize-prompt.md
skills/           prompt-optimizer/SKILL.md + references/
subagents/        prompt-auditor.md
hooks/            validate-prompt.sh
plugins/          prompt-optimizer/plugin.json
.github/          workflows/validate.yml
```

## 2. Nguồn sự thật

- `docs/rubric.md` — thang điểm và cap.
- `evals/rubric.json` — rubric máy đọc; phải khớp docs.
- `prompts/optimize.md` — quy trình audit/rewrite.
- `prompts/core/` — template tái sử dụng.
- `prompts/CHANGELOG.md` — version và lý do thay đổi.
- `evals/results/` — bằng chứng chạy eval; không sửa tay điểm.

## 3. Vòng đời prompt

```text
intake → audit (review-only) → diagnose → 2–3 variants → eval →
owner chọn → version → đóng gói command/skill → release
```

### Gate

1. Intake đủ mục tiêu, audience, model, dữ liệu, non-goals.
2. Audit có finding + evidence; không sửa trong audit.
3. Rewrite có 2–3 variant và trade-off.
4. Eval structure pass; live eval nếu có model.
5. Owner duyệt variant và scope.
6. Version + changelog.
7. Final check link/path/secret/eval.

## 4. Quyền

- **Owner**: duyệt scope, variant, release/push.
- **Main agent**: chạy audit/eval, đề xuất, cập nhật file sau khi duyệt.
- **Subagent read-only**: audit/eval; không sửa prompt gốc.
- **Hook**: chặn prompt nguy hiểm/thiếu context; không thay owner duyệt.

## 5. FlowPlan mapping

Mỗi thẻ = một bước có:
- title, description, type, files, dependencies.
- Kết quả thực tế ghi vào file trong repo, không chỉ trên FlowPlan.
- Sau mỗi bước, cập nhật thẻ (title/description/files nếu cần).

## 6. Version

- `prompts/CHANGELOG.md` dùng `MAJOR.MINOR.PATCH`.
- Thay đổi cấu trúc/output schema → minor.
- Sửa clarity/token nhỏ → patch.
- Mỗi entry có before/after, lý do, eval liên quan.

## 7. Đóng gói

- Command cho việc gọi nhanh.
- Skill cho quy trình lặp + references.
- Subagent read-only cho audit.
- Hook cho safety gate.
- Plugin để cài một lần; manifest rõ version/license.

## 8. Giới hạn

- Không có model/API mặc định; live eval blocked nếu thiếu.
- Không cam kết prompt tối ưu cho mọi model; phải eval lại theo model.
- Không copy code/nội dung nguồn ngoài license.
