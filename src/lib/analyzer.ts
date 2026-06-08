import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AnalysisSchema = z.object({
  oneLiner: z.string(),
  detailedSummary: z.string(),
  businessImpact: z.string(),
  riskScore: z.number().min(0).max(100),
  riskReasoning: z.string(),
  changeType: z.string(),
  tags: z.array(z.string()),
  founderView: z.string(),
  pmView: z.string(),
  qaView: z.string(),
  devView: z.string(),
  changelog: z.string(),
  commitTitle: z.string(),
  testCases: z.array(z.string()),
  affectedAreas: z.array(z.string()),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

const SYSTEM_PROMPT = `You are an expert software analyst who translates code changes (git diffs) into plain English that ANYONE can understand. Your audience includes founders, PMs, designers, QA testers, and junior engineers.

CRITICAL RULES:
1. NEVER explain code syntax. Explain INTENT and IMPACT.
2. Use simple, concrete language. No jargon unless necessary.
3. Always think about: "What does this mean for the user? For the business?"
4. Be specific, not generic. Don't say "made improvements" — say what improved.
5. If you spot a bug fix, say what was broken and who was affected.
6. If it's a refactor, say WHY it matters (performance? maintainability?).
7. Risk scoring: 0-30 = low, 31-60 = medium, 61-85 = high, 86-100 = critical.
8. Change type should be one or two of: bug-fix, new-feature, refactor, performance, security, ui-change, database-migration, api-change, documentation, config-change, dependency-update, test-change.
9. Output ONLY valid JSON — no markdown, no code fences, no extra text.`;

function buildUserPrompt(diff: string): string {
  return `Analyze this git diff and return a JSON object with these fields:

- oneLiner: 5-10 word summary anyone can understand
- detailedSummary: 2-4 sentence paragraph explaining what changed and why
- businessImpact: 1-2 sentences on what users/customers will notice
- riskScore: number 0-100
- riskReasoning: why this risk score, in 1-2 sentences
- changeType: primary type from the system prompt
- tags: array of applicable types (can include multiple)
- founderView: 1-2 sentence business-level explanation
- pmView: product impact in 1-2 sentences
- qaView: what QA should test, 1-2 sentences
- devView: technical explanation in 1-2 sentences
- changelog: 1-line changelog / release-note entry (past tense, user-facing)
- commitTitle: good conventional-commit style title (imperative mood)
- testCases: array of 3-5 specific test cases QA should verify
- affectedAreas: array of areas/modules potentially impacted

DIFF:
${diff}`;
}

export async function analyzeDiff(rawDiff: string): Promise<AnalysisResult> {
  const truncated = rawDiff.length > 12000 ? rawDiff.slice(0, 6000) + "\n...\n" + rawDiff.slice(-6000) : rawDiff;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(truncated) }],
  });

  const text = (response.content[0] as { type: "text"; text: string }).text;
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  const parsed = JSON.parse(cleaned);

  return AnalysisSchema.parse(parsed);
}
