import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const analysis = await prisma.analysis.findUnique({ where: { id } });
  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...analysis,
    tags: JSON.parse(analysis.tags),
    testCases: JSON.parse(analysis.testCases),
    affectedAreas: JSON.parse(analysis.affectedAreas),
  });
}
