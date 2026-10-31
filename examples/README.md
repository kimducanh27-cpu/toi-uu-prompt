# Ví dụ baseline vs optimized

Mỗi file có: baseline, optimized, input mẫu, output kỳ vọng, trade-off. Điểm
rubric lấy từ `evals/results/eval.json` sau khi chạy harness.

| Case | File | Baseline | Optimized | Min | Kết quả |
|---|---|---:|---:|---:|---|
| Coding review | `coding-agent.md` | 6.66 | 93.33 | 75 | PASS |
| Research brief | `research-agent.md` | 5 | 83.34 | 75 | PASS |
| UX audit | `ux-audit-agent.md` | 6.66 | 91.67 | 75 | PASS |
| English brief | `english-agent.md` | 3.33 | 93.33 | 90 | PASS |

- [Bảng điểm đầy đủ](../evals/results/eval.md)
- [Negative controls](../evals/results/negative-controls.md)

Điểm là **structure eval**, không phải chất lượng output model. Không dùng dữ
liệu thật/PII trong ví dụ.
