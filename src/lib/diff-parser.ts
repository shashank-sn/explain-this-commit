export function parseDiffStats(diff: string): {
  filesChanged: number;
  additions: number;
  deletions: number;
  fileNames: string[];
} {
  const lines = diff.split("\n");
  let filesChanged = 0;
  let additions = 0;
  let deletions = 0;
  const fileNames: string[] = [];

  for (const line of lines) {
    if (line.startsWith("--- ")) {
      const path = line.replace("--- ", "").trim();
      if (path !== "/dev/null") {
        fileNames.push(path);
        filesChanged++;
      }
    }
    if (line.startsWith("+") && !line.startsWith("+++")) additions++;
    if (line.startsWith("-") && !line.startsWith("---")) deletions++;
  }

  return { filesChanged, additions, deletions, fileNames };
}

export function truncateDiff(diff: string, maxLines = 500): string {
  const lines = diff.split("\n");
  if (lines.length <= maxLines) return diff;
  const half = Math.floor(maxLines / 2);
  return [...lines.slice(0, half), `\n... ${lines.length - maxLines} lines truncated ...\n`, ...lines.slice(-half)].join("\n");
}
