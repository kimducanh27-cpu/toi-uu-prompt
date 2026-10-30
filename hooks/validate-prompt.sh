#!/usr/bin/env bash
# UserPromptSubmit hook: block dangerous prompts and warn on missing sections.
set -euo pipefail

INPUT=$(cat)
PROMPT=$(printf '%s' "$INPUT" | node -e '
let input = "";
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    process.stdout.write(String(data.prompt || data.user_prompt || ""));
  } catch {
    process.stdout.write("");
  }
});
' 2>/dev/null || true)

if [ -z "$PROMPT" ]; then
  exit 0
fi

DANGEROUS=(
  "rm -rf /"
  "drop database"
  "format disk"
  "git push --force"
  "ignore previous instructions"
  "reveal system prompt"
)

for pattern in "${DANGEROUS[@]}"; do
  if printf '%s' "$PROMPT" | grep -qi -- "$pattern"; then
    printf '{"decision":"block","reason":"Blocked dangerous prompt pattern: %s"}' "$pattern"
    exit 0
  fi
done

if printf '%s' "$PROMPT" | grep -qiE 'deploy.*production'; then
  if [ ! -f ".deployment-approved" ]; then
    printf '{"decision":"block","reason":"Production deploy requires owner approval (.deployment-approved)."}'
    exit 0
  fi
fi

WARNINGS=()
if ! printf '%s' "$PROMPT" | grep -qiE 'mục tiêu|nhiệm vụ|task|goal'; then
  WARNINGS+=("Thiếu mục tiêu/nhiệm vụ.")
fi
if ! printf '%s' "$PROMPT" | grep -qiE 'đầu ra|output|schema|định dạng'; then
  WARNINGS+=("Thiếu định dạng đầu ra.")
fi
if ! printf '%s' "$PROMPT" | grep -qiE 'ràng buộc|constraint|không bịa|không được'; then
  WARNINGS+=("Thiếu ràng buộc/an toàn.")
fi

if [ ${#WARNINGS[@]} -gt 0 ]; then
  message=$(IFS=' '; echo "${WARNINGS[*]}")
  printf '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Prompt thiếu phần: %s"}}' "$message"
fi

exit 0
