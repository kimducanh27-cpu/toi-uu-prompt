import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const rubric = JSON.parse(readFileSync(join(root, "evals/rubric.json"), "utf8"));
const cases = JSON.parse(readFileSync(join(root, "evals/cases.json"), "utf8"));
const negatives = JSON.parse(readFileSync(join(root, "evals/negative-cases.json"), "utf8"));

function extractSection(text, heading) {
  const start = text.search(new RegExp(`^## ${heading}\\s*$`, "m"));
  if (start < 0) throw new Error(`Missing section: ${heading}`);
  const rest = text.slice(start).replace(/^## .*$/m, "");
  const next = rest.search(/^## /m);
  const section = next >= 0 ? rest.slice(0, next) : rest;
  const fenced = section.match(/```[a-z]*\n([\s\S]*?)```/);
  return (fenced ? fenced[1] : section).trim();
}

function hits(text, patterns) {
  return patterns.filter((pattern) => new RegExp(pattern, "i").test(text)).length;
}

function isUnsafe(text) {
  return rubric.unsafe_patterns.some((pattern) => new RegExp(pattern, "i").test(text));
}

function scorePrompt(text) {
  const criteria = rubric.criteria.map((criterion) => {
    const count = hits(text, criterion.patterns);
    const level = Math.min(3, count);
    const points = Number(((level / 3) * criterion.weight).toFixed(2));
    return { id: criterion.id, label: criterion.label, level, points, weight: criterion.weight };
  });
  let score = Number(criteria.reduce((sum, item) => sum + item.points, 0).toFixed(2));
  const caps = [];
  const output = criteria.find((item) => item.id === "output");
  const acceptance = criteria.find((item) => item.id === "acceptance");
  if (output?.level === 0) {
    score = Math.min(score, rubric.caps.missing_output);
    caps.push(`missing_output<=${rubric.caps.missing_output}`);
  }
  if (acceptance?.level === 0) {
    score = Math.min(score, rubric.caps.missing_acceptance);
    caps.push(`missing_acceptance<=${rubric.caps.missing_acceptance}`);
  }
  if (isUnsafe(text)) {
    score = Math.min(score, rubric.caps.unsafe);
    caps.push(`unsafe<=${rubric.caps.unsafe}`);
  }
  return { score, criteria, caps };
}

function loadCase(item) {
  const file = join(root, item.file);
  if (!existsSync(file)) throw new Error(`Missing case file: ${item.file}`);
  const text = readFileSync(file, "utf8");
  return {
    ...item,
    baseline: extractSection(text, "Baseline"),
    optimized: extractSection(text, "Optimized")
  };
}

const results = [];
let failed = false;
for (const item of cases) {
  const data = loadCase(item);
  const baseline = scorePrompt(data.baseline);
  const optimized = scorePrompt(data.optimized);
  const improved = optimized.score > baseline.score;
  const meetsMinimum = optimized.score >= item.min_optimized;
  if (!improved || !meetsMinimum) failed = true;
  results.push({
    id: data.id,
    title: data.title,
    baseline: baseline.score,
    optimized: optimized.score,
    min_optimized: item.min_optimized,
    improved,
    meetsMinimum,
    caps: optimized.caps,
    criteria: optimized.criteria
  });
}

const negativeResults = negatives.map((item) => {
  const result = scorePrompt(item.prompt);
  const pass = result.score <= item.max_score;
  if (!pass) failed = true;
  return { id: item.id, title: item.title, score: result.score, max_score: item.max_score, pass, caps: result.caps };
});

const output = { version: rubric.version, results, negativeResults, pass: !failed };
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log("CASE".padEnd(12), "BASE", "OPT", "MIN", "RESULT");
  for (const item of results) {
    console.log(item.id.padEnd(12), String(item.baseline).padStart(4), String(item.optimized).padStart(4), String(item.min_optimized).padStart(4), item.improved && item.meetsMinimum ? "PASS" : "FAIL");
  }
  console.log("\nNEGATIVE");
  for (const item of negativeResults) {
    console.log(item.id.padEnd(8), String(item.score).padStart(4), `<= ${item.max_score}`, item.pass ? "PASS" : "FAIL");
  }
  console.log(failed ? "\nFAIL — có case không đạt." : "\nPASS — structure eval.");
}

if (process.argv.includes("--write")) {
  mkdirSync(join(root, "evals/results"), { recursive: true });
  writeFileSync(join(root, "evals/results/eval.json"), JSON.stringify(output, null, 2));
  const lines = ["# Eval results", "", "Structure eval — không phải live model quality.", "", "## Cases", "", "| Case | Baseline | Optimized | Min | Result |", "|---|---:|---:|---:|---|"];
  for (const item of results) lines.push(`| ${item.id} | ${item.baseline} | ${item.optimized} | ${item.min_optimized} | ${item.improved && item.meetsMinimum ? "PASS" : "FAIL"} |`);
  lines.push("", "## Negative controls", "", "| Case | Score | Max | Result |", "|---|---:|---:|---|");
  for (const item of negativeResults) lines.push(`| ${item.id} | ${item.score} | ${item.max_score} | ${item.pass ? "PASS" : "FAIL"} |`);
  lines.push("", "## Caps", "", ...results.map((item) => `- ${item.id}: ${item.caps.length ? item.caps.join(", ") : "none"}`));
  writeFileSync(join(root, "evals/results/eval.md"), `${lines.join("\n")}\n`);
}

if (failed) process.exitCode = 1;
