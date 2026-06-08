"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Report = {
  id: string;
  title: string;
  rawDiff: string;
  oneLiner: string;
  detailedSummary: string;
  businessImpact: string | null;
  riskScore: number;
  riskReasoning: string;
  changeType: string;
  tags: string[];
  founderView: string | null;
  pmView: string | null;
  qaView: string | null;
  devView: string | null;
  changelog: string | null;
  commitTitle: string | null;
  testCases: string[];
  affectedAreas: string[];
  createdAt: string;
};

function riskColor(score: number) {
  if (score <= 30) return "bg-risk-low/10 text-risk-low border-risk-low/20";
  if (score <= 60) return "bg-risk-medium/10 text-risk-medium border-risk-medium/20";
  if (score <= 85) return "bg-risk-high/10 text-risk-high border-risk-high/20";
  return "bg-risk-critical/10 text-risk-critical border-risk-critical/20";
}

function riskLabel(score: number) {
  if (score <= 30) return "Low Risk";
  if (score <= 60) return "Medium Risk";
  if (score <= 85) return "High Risk";
  return "Critical";
}

function RoleSection({ label, role, content }: { label: string; role: string; content: string | null }) {
  const icons: Record<string, string> = {
    Founder: "👤",
    "Product Manager": "📋",
    QA: "🧪",
    Developer: "💻",
  };
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icons[role] || "•"}</span>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted">{label}</h3>
      </div>
      <p className="text-sm leading-relaxed">{content || "N/A"}</p>
    </div>
  );
}

function ReportContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No report ID provided.");
      setLoading(false);
      return;
    }
    fetch(`/api/report?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setReport(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-64 rounded-lg bg-border" />
          <div className="h-5 w-96 rounded-lg bg-border" />
          <div className="h-40 rounded-xl bg-border mt-8" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-risk-high/20 bg-risk-high/5 p-6 text-center">
          <p className="text-risk-high font-medium">{error || "Report not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <button onClick={() => window.history.back()} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </button>

      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
            <p className="mt-1 text-muted">{report.oneLiner}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${riskColor(report.riskScore)}`}>
              {riskLabel(report.riskScore)} · {report.riskScore}/100
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {report.tags.map((tag: string) => (
            <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">{tag.replace(/-/g, " ")}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Executive Summary</h2>
          <p className="text-base leading-relaxed">{report.detailedSummary}</p>
          {report.businessImpact && (
            <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Business Impact</span>
              <p className="mt-1 text-sm">{report.businessImpact}</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Who Should See This</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <RoleSection label="Founder" role="Founder" content={report.founderView} />
            <RoleSection label="Product Manager" role="Product Manager" content={report.pmView} />
            <RoleSection label="QA" role="QA" content={report.qaView} />
            <RoleSection label="Developer" role="Developer" content={report.devView} />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Risk Assessment</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 rounded-full h-2 bg-border">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${report.riskScore}%`,
                  background: report.riskScore <= 30 ? "#22c55e" : report.riskScore <= 60 ? "#f59e0b" : report.riskScore <= 85 ? "#ef4444" : "#7c3aed",
                }}
              />
            </div>
            <span className="text-sm font-semibold tabular-nums">{report.riskScore}/100</span>
          </div>
          <p className="text-sm text-muted">{report.riskReasoning}</p>
        </section>

        {report.testCases.length > 0 && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Testing Checklist</h2>
            <ul className="space-y-2">
              {report.testCases.map((tc: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-muted shrink-0">{i + 1}.</span>
                  <span>{tc}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {report.affectedAreas.length > 0 && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Potentially Affected Areas</h2>
            <div className="flex flex-wrap gap-2">
              {report.affectedAreas.map((area: string) => (
                <span key={area} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm">{area}</span>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Release Notes</h2>
          <p className="text-sm">{report.changelog || report.oneLiner}</p>
          {report.commitTitle && (
            <div className="mt-3 rounded-lg border border-border bg-accent/5 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Suggested Commit Title</span>
              <p className="mt-1 font-mono text-sm">{report.commitTitle}</p>
            </div>
          )}
        </section>

        <section>
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showDiff ? "rotate-90" : ""}`}>
              <path d="m9 18 6-6-6-6"/>
            </svg>
            {showDiff ? "Hide raw diff" : "View raw diff"}
          </button>
          {showDiff && (
            <pre className="mt-3 rounded-xl border border-border bg-surface p-4 font-mono text-xs leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
              {report.rawDiff}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-64 rounded-lg bg-border" />
          <div className="h-5 w-96 rounded-lg bg-border" />
          <div className="h-40 rounded-xl bg-border mt-8" />
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
