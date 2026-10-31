#!/usr/bin/env bash
# Antigravity PreInvocation adapter.
# Antigravity hooks cannot block a prompt; they can only inject a message.
# This adapter reuses validate-prompt.sh (single source of truth) and emits
# {"injectSteps":[{"ephemeralMessage":"..."}]} so the warning reaches the model.
set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT="$(cat)"

PROMPT="$(printf '%s' "$INPUT" | node -e "
const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync(0, 'utf8'));
  process.stdout.write(data.lastUserInput || data.prompt || '');
} catch (error) {
  process.exit(1);
}
" 2>/dev/null)" || { printf '{}'; exit 0; }

if [ -z "$PROMPT" ]; then
  printf '{}'
  exit 0
fi

PAYLOAD="$(printf '%s' "$PROMPT" | node -e "
const fs = require('fs');
process.stdout.write(JSON.stringify({ prompt: fs.readFileSync(0, 'utf8') }));
")"

OUT="$(printf '%s' "$PAYLOAD" | bash "$DIR/validate-prompt.sh" 2>&1)"
STATUS=$?

printf '%s' "$OUT" | STATUS="$STATUS" node -e "
const fs = require('fs');
const raw = fs.readFileSync(0, 'utf8').trim();
const failed = process.env.STATUS !== '0';
let message = raw;
try {
  const data = JSON.parse(raw);
  message = data?.hookSpecificOutput?.additionalContext || data?.reason || raw;
} catch (error) {
  // raw text from stderr is already the message
}
if (!message) {
  process.stdout.write('{}');
} else {
  const alreadyPrefixed = message.startsWith('Prompt thiếu phần:') || message.startsWith('Prompt bị chặn:');
  const prefix = alreadyPrefixed ? '' : (failed ? 'Prompt bị chặn: ' : 'Prompt thiếu phần: ');
  process.stdout.write(JSON.stringify({ injectSteps: [{ ephemeralMessage: prefix + message }] }));
}
"

exit 0
