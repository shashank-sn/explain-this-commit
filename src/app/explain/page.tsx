"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExplainPage() {
  const router = useRouter();
  const [diff, setDiff] = useState("");
  const [ghUrl, setGhUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = diff.trim();
    if (!trimmed) {
      setError("Paste a git diff or enter a GitHub PR URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      router.push(`/report?id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleFetchGitHub() {
    setError("");
    if (!ghUrl.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/fetch-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ghUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setDiff(data.diff);
      setGhUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch PR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Explain a Diff</h1>
      <p className="mt-2 text-muted">Paste a git diff, commit, or pull request diff. We&apos;ll translate it into plain English.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Or paste a GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)"
            value={ghUrl}
            onChange={(e) => setGhUrl(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="button"
            onClick={handleFetchGitHub}
            disabled={loading || !ghUrl.trim()}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-border/30 disabled:opacity-40 transition-colors"
          >
            Fetch
          </button>
        </div>

        <textarea
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
          placeholder={`Paste your diff here...

Example:
diff --git a/src/checkout.ts b/src/checkout.ts
- price = subtotal
+ price = subtotal + tax`}
          rows={18}
          className="w-full rounded-xl border border-border bg-surface p-4 font-mono text-sm leading-relaxed placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y"
        />

        {error && (
          <div className="rounded-lg border border-risk-high/20 bg-risk-high/5 p-3 text-sm text-risk-high">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !diff.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Explain This Commit
            </>
          )}
        </button>
      </form>

      <div className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">How It Works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent mt-0.5">1</span>
            <p className="text-sm text-muted"><strong className="text-foreground">Paste</strong> any git diff, commit, or PR diff — or drop a GitHub PR URL.</p>
          </div>
          <div className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent mt-0.5">2</span>
            <p className="text-sm text-muted"><strong className="text-foreground">Analyze</strong> — AI reads the code changes and extracts intent, impact, and risk.</p>
          </div>
          <div className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent mt-0.5">3</span>
            <p className="text-sm text-muted"><strong className="text-foreground">Understand</strong> — get explanations for founders, PMs, QA, and developers in one report.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
