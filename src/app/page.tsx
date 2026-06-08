"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HistoryItem = {
  id: string;
  title: string;
  oneLiner: string;
  changeType: string;
  riskScore: number;
  tags: string[];
  createdAt: string;
};

function riskColor(score: number) {
  if (score <= 30) return "bg-risk-low/10 text-risk-low border-risk-low/20";
  if (score <= 60) return "bg-risk-medium/10 text-risk-medium border-risk-medium/20";
  if (score <= 85) return "bg-risk-high/10 text-risk-high border-risk-high/20";
  return "bg-risk-critical/10 text-risk-critical border-risk-critical/20";
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Dashboard() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Explain This Commit</h1>
        <p className="mt-2 text-muted max-w-xl">
          Translate any git diff, commit, or pull request into plain English — for founders, PMs, designers, QA, and everyone else.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/explain" className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Explain a Diff
          </Link>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Recent Analyses</h2>

      {loading && (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-muted">No analyses yet. Paste a diff to get started.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/report?id=${item.id}`}
              className="group rounded-xl border border-border bg-surface p-5 hover:border-accent/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base truncate group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted mt-0.5">{item.oneLiner}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.tags.filter((t: string) => t !== item.changeType).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">{tag.replace(/-/g, " ")}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskColor(item.riskScore)}`}>
                    {item.riskScore}/100
                  </span>
                  <span className="text-xs text-muted">{timeAgo(item.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
