import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url }: { url: string } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing GitHub URL" }, { status: 400 });

    const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) {
      return NextResponse.json({ error: "Only GitHub PR URLs are supported (e.g., https://github.com/owner/repo/pull/123)" }, { status: 400 });
    }

    const [, owner, repo, prNumber] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}.diff`;

    const headers: Record<string, string> = { Accept: "application/vnd.github.v3.diff" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const ghRes = await fetch(apiUrl, { headers });
    if (!ghRes.ok) {
      return NextResponse.json({ error: `GitHub API error: ${ghRes.status} ${ghRes.statusText}` }, { status: ghRes.status });
    }

    const diff = await ghRes.text();
    return NextResponse.json({ diff, prNumber: Number(prNumber), repo: `${owner}/${repo}` });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch PR diff" }, { status: 500 });
  }
}
