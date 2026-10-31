#!/usr/bin/env node
// Build the self-contained Antigravity/Claude plugin package from canonical sources.
// Usage: node scripts/sync-plugin.mjs [--check]
// --check exits 1 when the committed package drifts from the sources.
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = process.cwd();
const pluginDir = join(root, "plugins", "prompt-optimizer");
const tempDir = join(root, "plugins", ".prompt-optimizer-check");
const check = process.argv.includes("--check");

const SKILL_REPLACEMENTS = [
  ["docs/rubric.md", "references/rubric.md"],
  ["docs/taxonomy.md", "references/taxonomy.md"],
  ["prompts/optimize.md", "references/optimize.md"],
  ["prompts/audit.md", "references/audit.md"],
  ["prompts/CHANGELOG.md", "references/CHANGELOG.md"],
  ["examples/", "references/examples/"]
];

const AGENT_REPLACEMENTS = [
  ["docs/rubric.md", "../skills/prompt-optimizer/references/rubric.md"],
  ["docs/taxonomy.md", "../skills/prompt-optimizer/references/taxonomy.md"],
  ["prompts/optimize.md", "../skills/prompt-optimizer/references/optimize.md"],
  ["prompts/audit.md", "../skills/prompt-optimizer/references/audit.md"]
];

function transform(text, replacements) {
  return replacements.reduce((value, [from, to]) => value.split(from).join(to), text);
}

function copyText(source, target, replacements = []) {
  const text = readFileSync(join(root, source), "utf8");
  const output = transform(text, replacements);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, output, "utf8");
}

function copyFile(source, target) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, readFileSync(join(root, source)));
}

function copyExamples(targetRoot) {
  const sourceDir = join(root, "examples");
  for (const name of readdirSync(sourceDir)) {
    const full = join(sourceDir, name);
    if (!statSync(full).isFile() || !name.endsWith(".md")) continue;
    let text = readFileSync(full, "utf8");
    if (name === "README.md") {
      // The package has no evals/ directory; keep the reference as plain text.
      text = text
        .replace("[Bảng điểm đầy đủ](../evals/results/eval.md)", "Bảng điểm đầy đủ: xem repo `evals/results/eval.md`.")
        .replace("[Negative controls](../evals/results/negative-controls.md)", "Negative controls: xem repo `evals/results/negative-controls.md`.");
    }
    const target = join(targetRoot, "references", "examples", name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text, "utf8");
  }
}

function build(targetRoot) {
  const dirs = ["skills", "agents", "references", "hooks"];
  for (const dir of dirs) rmSync(join(targetRoot, dir), { recursive: true, force: true });

  copyText(
    "skills/prompt-optimizer/SKILL.md",
    join(targetRoot, "skills", "prompt-optimizer", "SKILL.md"),
    SKILL_REPLACEMENTS
  );
  copyFile(
    "skills/prompt-optimizer/references/patterns.md",
    join(targetRoot, "skills", "prompt-optimizer", "references", "patterns.md")
  );
  copyText(
    "subagents/prompt-auditor.md",
    join(targetRoot, "agents", "prompt-auditor.md"),
    AGENT_REPLACEMENTS
  );
  copyFile("hooks/validate-prompt.sh", join(targetRoot, "hooks", "validate-prompt.sh"));
  copyFile("hooks/antigravity-hook.sh", join(targetRoot, "hooks", "antigravity-hook.sh"));

  copyFile("docs/rubric.md", join(targetRoot, "references", "rubric.md"));
  copyFile("docs/taxonomy.md", join(targetRoot, "references", "taxonomy.md"));
  copyFile("prompts/optimize.md", join(targetRoot, "references", "optimize.md"));
  copyFile("prompts/audit.md", join(targetRoot, "references", "audit.md"));
  copyFile("prompts/CHANGELOG.md", join(targetRoot, "references", "CHANGELOG.md"));
  copyExamples(targetRoot);

  for (const script of ["validate-prompt.sh", "antigravity-hook.sh"]) {
    chmodSync(join(targetRoot, "hooks", script), 0o755);
  }
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function compare(expectedRoot, actualRoot) {
  const generated = (file) => ["skills/", "agents/", "references/", "hooks/"].some((dir) => file.startsWith(dir));
  const expected = walk(expectedRoot).map((file) => relative(expectedRoot, file).replaceAll("\\", "/")).filter(generated).sort();
  const actual = walk(actualRoot).map((file) => relative(actualRoot, file).replaceAll("\\", "/")).filter(generated).sort();
  const problems = [];

  for (const file of expected) {
    if (!actual.includes(file)) {
      problems.push(`missing: ${file}`);
      continue;
    }
    const a = readFileSync(join(expectedRoot, file));
    const b = readFileSync(join(actualRoot, file));
    if (!a.equals(b)) problems.push(`outdated: ${file}`);
  }
  for (const file of actual) {
    if (!expected.includes(file)) problems.push(`unexpected: ${file}`);
  }
  return problems;
}

if (check) {
  rmSync(tempDir, { recursive: true, force: true });
  build(tempDir);
  const problems = compare(tempDir, pluginDir);
  rmSync(tempDir, { recursive: true, force: true });
  if (problems.length) {
    console.error("Plugin package is out of sync. Run: node scripts/sync-plugin.mjs");
    for (const problem of problems) console.error(`- ${problem}`);
    process.exitCode = 1;
  } else {
    console.log("PASS — plugin package is in sync with sources.");
  }
} else {
  build(pluginDir);
  console.log(`Synced plugin package: ${relative(root, pluginDir)}`);
}
