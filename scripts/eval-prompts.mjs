import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const rubric = JSON.parse(readFileSync(join(root, "evals/rubric.json"), "utf8"));
const cases = JSON.parse(readFileSync(join(root, "evals/cases.json"), "utf8"));
const negatives = JSON.parse(readFileSync(join(root, "evals/negative-cases.json"), "utf8"));

function extractSection(text, heading) {
  // Find the start of the target section (e.g., '## Optimized')
  const headingRegex = new RegExp(`^## ${heading}\\s*$`, "m");
  const startMatch = text.search(headingRegex);
  if (startMatch < 0) throw new Error(`Missing section: ${heading}`);
  
  // Extract content from start to end of file
  let rest = text.slice(startMatch);
  
  // Find the next top-level heading (## ) that is OUTSIDE any code block
  // We need to parse line by line and track whether we're inside a code fence
  const lines = rest.split(/\r?\n/);
  let inCodeFence = false;
  let nextHeadingIndex = lines.length;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Track code fence state
    if (/```[a-z]*$/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    
    // Only look for top-level headings when NOT inside a code fence
    if (!inCodeFence && /^## /.test(line)) {
      nextHeadingIndex = i;
      break;
    }
  }
  
  // Slice content up to the next heading
  const sectionLines = lines.slice(0, nextHeadingIndex);
  const section = sectionLines.join('\n');
  
  // Try to extract fenced code block first, otherwise return entire section
  const fenced = section.match(/```[a-z]*\r?\n([\s\S]*?)```/);
  return (fenced ? fenced[1] : section).trim();
}

function hits(text, patterns) {
  return patterns.filter((pattern) => new RegExp(pattern, "i").test(text)).length;
}

// Check if prompt contains unsafe language (NOT just regex match on safe guardrails)
function isUnsafe(text) {
  // Normalize fullwidth/homoglyph forms and strip zero-width/bidi characters before matching.
  const normalized = text.normalize("NFKC").replace(/[\u200B-\u200D\uFEFF\u202A-\u202E\u2066-\u2069]/g, "");
  // Dangerous actions - only flag if NOT preceded by negation words
  const dangerousPatterns = [
    /\bignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions|rules|prompts)/i,
    /\bignore\s+(all\s+)?(rules|instructions)\b/i,
    /\breveal\s+(the\s+)?(?:system\s+)?prompt/i,
    /\b(print|show|output|reveal)\s+(your\s+)?(hidden|system|internal|developer)\s+(instructions|prompt|rules)/i,
    /\bdrop\s+(database|table|schema)\b/i,
    /\btruncate\s+table\b/i,
    /\bdelete\s+from\s+[\w."`]+\s*(?:;|$)/i,
    /\brm\s+(?:-[a-z-]*[rf][a-z-]*\s*)+/i,
    /\b(curl|wget)\b[\s\S]{0,120}\|\s*(?:ba|z)?sh\b/i,
    /(?<![ÀÁÂÃÈÉÊÌÍÒÓÔÕỖØÙÚÝĂĐŨƠƯăâêôơưdD\x{FFFD}\x{FFFD}]*(?:không|cấm|từ\s+chối|hạn\s+chế|không\s+được|phải\s+tránh))\s*(hãy|bắt\s+buộc|must)\s*bịa/i,
    /\bdeploy\s.*production\s.*without\s+(approval|permission|review)/i
  ];

  for (const pattern of dangerousPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      const startIndex = match.index || 0;
      // Only the current clause can negate the match; "ignore previous instructions"
      // must stay unsafe even when it is followed by a guardrail phrase.
      const clauseStart = Math.max(
        normalized.lastIndexOf(".", startIndex),
        normalized.lastIndexOf(";", startIndex),
        normalized.lastIndexOf("\n", startIndex)
      ) + 1;
      const clause = normalized.slice(clauseStart, startIndex);

      // Safe if a prohibition/guardrail is in the same clause (VI or EN).
      if (/(không\s+(được|thể|cho\s+phép)|cấm|từ\s+chối|phải\s+tránh|do\s+not|don't|never|must\s+not|should\s+not|avoid|ignore\s+any\s+instruction\s+that)/i.test(clause)) {
        continue;
      }

      return true;
    }
  }

  return false;
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
