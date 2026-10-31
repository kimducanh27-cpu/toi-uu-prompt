import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, dirname, basename } from "node:path";

const root = process.cwd();
const required = [
  "README.md", "VERSION", "LICENSE", "docs/research.md", "docs/research-claude-howto.md",
  "docs/research-bui-code.md", "docs/sources.md", "docs/rubric.md", "docs/taxonomy.md",
  "docs/models.md", "docs/architecture.md", "docs/eval.md", "docs/usage.md",
  "docs/flowplan.md", "docs/packaging.md", "docs/readiness.md", "prompts/optimize.md", "prompts/audit.md",
  "prompts/CHANGELOG.md", "prompts/core/README.md", "prompts/core/system.md",
  "prompts/core/task.md", "prompts/core/context.md", "prompts/core/constraints.md",
  "prompts/core/output-schema.md", "prompts/core/examples.md", "prompts/core/self-check.md",
  "prompts/core/token-budget.md", "examples/README.md", "examples/coding-agent.md",
  "examples/research-agent.md", "examples/ux-audit-agent.md", "evals/cases.json",
  "evals/rubric.json", "evals/negative-cases.json", "evals/results/eval.json",
  "evals/results/eval.md", "evals/results/baseline.md", "evals/results/optimized.md",
  "evals/results/negative-controls.md", "scripts/eval-prompts.mjs", "scripts/check-docs.mjs",
  "commands/optimize-prompt.md", "skills/prompt-optimizer/SKILL.md",
  "skills/prompt-optimizer/references/patterns.md", "subagents/prompt-auditor.md",
  "hooks/validate-prompt.sh", "hooks/antigravity-hook.sh",
  "plugins/prompt-optimizer/plugin.json", "plugins/prompt-optimizer/hooks.json",
  "plugins/prompt-optimizer/assets/logo.svg", "plugins/prompt-optimizer/README.md",
  "plugins/prompt-optimizer/skills/prompt-optimizer/SKILL.md",
  "plugins/prompt-optimizer/agents/prompt-auditor.md",
  "plugins/prompt-optimizer/references/rubric.md", "scripts/sync-plugin.mjs",
  "scripts/test-all.mjs", "scripts/ci-local.sh",
  ".github/workflows/validate.yml"
];

const failures = [];
for (const file of required) {
  if (!existsSync(join(root, file))) failures.push(`missing: ${file}`);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules" || name === "dist") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const textExt = new Set([".md", ".json", ".mjs", ".sh", ".yml", ".yaml", ".txt"]);
const absolutePath = /(?:\b[A-Za-z]:[\\/]|\/(?:Users|home)\/|[\\/](?:Downloads|AppData)[\\/])/;
const secret = /(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY)/;
const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const link = /\[(?:[^\[\]]|\[[^\]]*\])*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function isTextFile(file) {
  const ext = extname(file);
  const base = basename(file);
  return textExt.has(ext) || base === "VERSION" || base === "LICENSE" ||
    base.startsWith(".env") || base === ".gitignore";
}

for (const file of walk(root)) {
  if (!isTextFile(file)) continue;
  const rel = relative(root, file).replaceAll("\\", "/");
  const text = readFileSync(file, "utf8");
  if (absolutePath.test(text)) failures.push(`absolute path: ${rel}`);
  if (secret.test(text)) failures.push(`possible secret: ${rel}`);
  for (const match of text.matchAll(email)) {
    if (!match[0].toLowerCase().endsWith("@example.com")) {
      failures.push(`email: ${rel} (${match[0]})`);
      break;
    }
  }
  if (extname(file) === ".md") {
    for (const match of text.matchAll(link)) {
      let target = match[1].split("#")[0].trim();
      if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
      if (!target || /^(?:https?:|mailto:|data:)/i.test(target) || target.startsWith("#")) continue;
      try {
        target = decodeURIComponent(target);
      } catch (error) {
        // keep the raw target; existsSync below will report it
      }
      // Links resolve relative to the markdown file, not the repo root.
      const resolved = resolve(dirname(file), target);
      if (!existsSync(resolved)) failures.push(`broken link: ${rel} -> ${target}`);
    }
  }
}

for (const file of ["evals/cases.json", "evals/rubric.json", "evals/negative-cases.json", "plugins/prompt-optimizer/plugin.json", "plugins/prompt-optimizer/hooks.json"]) {
  try {
    JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    failures.push(`invalid JSON: ${file} (${error.message})`);
  }
}

if (failures.length) {
  console.log(`FAIL (${failures.length})`);
  for (const failure of failures) console.log(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`PASS — ${required.length} required files, links/JSON/secrets/paths clean.`);
}
