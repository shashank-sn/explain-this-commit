import { NextRequest, NextResponse } from "next/server";
import { analyzeDiff } from "@/lib/analyzer";
import { parseDiffStats } from "@/lib/diff-parser";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { diff }: { diff: string } = await req.json();

    if (!diff || typeof diff !== "string" || diff.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a meaningful diff (at least 10 characters)." }, { status: 400 });
    }

    const result = await analyzeDiff(diff);
    const stats = parseDiffStats(diff);

    const title = result.commitTitle || result.oneLiner || "Untitled Analysis";

    const analysis = await prisma.analysis.create({
      data: {
        title,
        rawDiff: diff,
        oneLiner: result.oneLiner,
        detailedSummary: result.detailedSummary,
        businessImpact: result.businessImpact,
        riskScore: result.riskScore,
        riskReasoning: result.riskReasoning,
        changeType: result.changeType,
        tags: JSON.stringify(result.tags),
        founderView: result.founderView,
        pmView: result.pmView,
        qaView: result.qaView,
        devView: result.devView,
        changelog: result.changelog,
        commitTitle: result.commitTitle,
        testCases: JSON.stringify(result.testCases),
        affectedAreas: JSON.stringify(result.affectedAreas),
      },
    });

    return NextResponse.json({ id: analysis.id, title: analysis.title, oneLiner: analysis.oneLiner, stats });
  } catch (err) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Failed to analyze diff";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
