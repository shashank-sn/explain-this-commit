import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const analyses = await prisma.analysis.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      oneLiner: true,
      changeType: true,
      riskScore: true,
      tags: true,
      createdAt: true,
    },
    take: 50,
  });

  const parsed = analyses.map((a) => ({
    ...a,
    tags: JSON.parse(a.tags),
  }));

  return NextResponse.json(parsed);
}
