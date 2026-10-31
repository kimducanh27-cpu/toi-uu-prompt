# Local test report

Generated: 2026-10-31T07:09:51.742Z

| Test | Status | Exit | Expected | Missing text |
|---|---|---:|---:|---|
| check-docs | PASS | 0 | 0 | — |
| structure eval | PASS | 0 | 0 | — |
| plugin sync | PASS | 0 | 0 | — |
| hook: safe prompt warns | PASS | 0 | 0 | — |
| hook: injection blocks | PASS | 2 | 2 | — |
| hook: rm -fr blocks | PASS | 2 | 2 | — |
| hook: deploy newline blocks | PASS | 2 | 2 | — |
| hook: malformed blocks | PASS | 2 | 2 | — |
| hook: safe structured passes | PASS | 0 | 0 | — |
| antigravity: blocked injects | PASS | 0 | 0 | — |
| antigravity: safe is empty | PASS | 0 | 0 | — |
| plugin validate --strict | PASS | 0 | 0 | — |

PASS — 12 tests.
