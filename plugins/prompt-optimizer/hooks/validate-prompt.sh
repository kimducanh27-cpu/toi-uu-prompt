#!/usr/bin/env bash
# UserPromptSubmit hook: block dangerous prompts and warn on missing sections.
# Contract: exit 2 + stderr blocks the prompt (Claude Code); exit 0 + JSON adds context.
set -euo pipefail

block() {
  printf '%s\n' "$1" >&2
  exit 2
}

# Parse JSON with Node.js from stdin
PROMPT=$(node -e "
const input = require('fs').readFileSync(0, 'utf8');
try {
  const data = JSON.parse(input);
  console.log(data.prompt || data.user_prompt || '');
} catch (error) {
  process.exit(1);
}
" 2>/dev/null) || block "Malformed input or parsing error"

if [ -z "$PROMPT" ]; then
  block "Empty prompt after parsing"
fi

# Dangerous patterns. Node.js regex gives cross-line matching without grep escaping.
DANGEROUS_CHECK=$(node -e "
const text = require('fs').readFileSync(0, 'utf8');
const patterns = [
  /\brm\s+(?:-[a-z-]*[rf][a-z-]*\s*)+/i,   // rm -rf, rm -fr, rm -r -f
  /drop\s+(database|schema)/i,              // drop database/schema
  /truncate\s+table/i,                      // truncate table
  /format\s+disk/i,                         // format disk
  /git\s+push\s+(-f|--force)(?!-with-lease)/i, // git push -f/--force
  /ignore\s+(all\s+)?previous/i,            // ignore previous/all previous
  /reveal\s*(the\s*)?(system\s*)?prompt/i   // reveal system prompt
];

for (const pattern of patterns) {
  if (pattern.test(text)) {
    console.log('BLOCKED');
    process.exit(0);
  }
}
process.exit(1);
" <<< "$PROMPT" 2>/dev/null) && block "Blocked dangerous prompt pattern"

# Production deploy needs explicit owner approval. [\s\S] catches newline splits.
DEPLOY_CHECK=$(node -e "
const text = require('fs').readFileSync(0, 'utf8');
if (/deploy[\s\S]{0,120}?production/i.test(text)) {
  console.log('BLOCKED');
  process.exit(0);
} else {
  process.exit(1);
}
" <<< "$PROMPT" 2>/dev/null) && {
  if [ ! -f ".deployment-approved" ]; then
    block "Production deploy requires owner approval (.deployment-approved)."
  fi
}

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
