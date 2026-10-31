# Readiness checklist

Ngày: 2026-10-31. Phạm vi: kit prompt-only + plugin package.

## 1. Kết quả kiểm

| Hạng mục | Lệnh | Kết quả |
|---|---|---|
| Docs/links/JSON/secret/path | `node scripts/check-docs.mjs` | PASS — 56+ file, không lỗi |
| Structure eval | `node scripts/eval-prompts.mjs` | PASS — 4 case, 11 negative |
| Plugin sync | `node scripts/sync-plugin.mjs --check` | PASS |
| Plugin manifest | `agy plugin validate plugins/prompt-optimizer --strict` | PASS — 1 skill, 1 agent, 1 hook |
| Local test suite | `node scripts/test-all.mjs` | PASS — 12 test |
| CI parity (local) | `bash scripts/ci-local.sh` | PASS — không phải Ubuntu runner |

## 2. Điểm đã sửa

- Hook Claude: `readFileSync(0)` thay `process.stdin.read()`; chặn bằng `exit 2` + stderr.
- Hook pattern: `rm -fr`, `rm -r -f`, deploy qua newline, SQL drop/truncate, pipe-to-shell.
- `isUnsafe`: NFKC + strip zero-width/bidi; guardrail VI/EN theo clause; không false positive.
- Plugin: bỏ `components`, thêm `logo`, `hooks.json`; package tự chứa, sync bằng script.
- Antigravity: `PreInvocation` adapter inject cảnh báo; ghi rõ đây là advisory.
- Prompt: XML delimiter, `blocked_status`, JSON few-shot, metadata ra frontmatter.
- Rubric 1.1: pattern song ngữ; case English đạt 93.33/90.
- Docs: usage/packaging/eval/flowplan/README đồng bộ; version 0.1.1.

## 3. Rủi ro còn mở

| Rủi ro | Mức | Trạng thái |
|---|---|---|
| Chưa chạy trên Ubuntu runner thật | Trung bình | Docker không có; WSL bị policy chặn. Đã chạy đúng lệnh trên Git Bash + Node 22; CI dùng Node 24 |
| Chưa live eval model | Cao | `blocked` — không có API/model; không suy điểm |
| Antigravity `PreInvocation` không chặn được prompt | Trung bình | Đã ghi rõ advisory; hard block cần `PreToolUse` |
| `agy plugin install` chưa chạy thử | Trung bình | Mới `validate --strict`; cài thử cần owner đồng ý |
| Hook phụ thuộc bash + Node | Thấp | Đã ghi trong README plugin |

## 4. Checklist trước khi push

- [x] `check-docs` pass.
- [x] `eval-prompts` pass, negative controls pass.
- [x] `sync-plugin --check` pass.
- [x] `agy plugin validate --strict` pass.
- [x] `test-all` pass.
- [x] Version đồng bộ: `VERSION` 0.1.1, plugin 0.1.1, examples 1.0.1.
- [x] Không có secret/PII/absolute path trong repo.
- [x] Push commit `408c50c` lên `origin/main`.
- [x] CI GitHub Actions xanh (run `41179527631`, job `docs` success).
- [ ] Owner duyệt cài thử plugin.

## 5. Kết luận

Sẵn sàng cho bước push/PR để chạy CI thật. Chưa tuyên bố "production-ready" cho
chất lượng prompt vì chưa có live eval; chỉ tuyên bố cấu trúc và an toàn hook đã
được kiểm bằng test lặp lại được.
