import type { Dirent } from "fs";
import { stat, readdir } from "fs/promises";
import { resolve, join, relative, extname } from "path";
import type { DiscoverOptions } from "./types.js";

export async function discoverFiles(options: DiscoverOptions): Promise<string[]> {
  try {
    const { targetPath, filter = "all", exclude = [], maxSize = Infinity } =
      options;

    const resolvedPath = resolve(targetPath);
    const maxSizeBytes = maxSize * 1024 * 1024;
    const excludeSet = new Set(exclude || []);

    const extensionFilter = getExtensionFilter(filter);

    const files: string[] = [];

    async function walkDir(dir: string): Promise<void> {
      let entries: Dirent[];
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relPath = relative(resolvedPath, fullPath);

        if (shouldExclude(relPath, excludeSet)) {
          continue;
        }

        if (entry.isDirectory()) {
          await walkDir(fullPath);
          continue;
        }

        if (!entry.isFile()) continue;

        const ext = extname(entry.name);

        if (filter === "glob") {
          // glob expansion is handled in md-exporter; for discover we fallback to "all"
          // so the tree can still be generated deterministically for the same exclude/maxSize.
        } else if (!extensionFilter(ext)) {
          continue;
        }

        try {
          const stats = await stat(fullPath);
          if (stats.size <= maxSizeBytes) {
            files.push(fullPath);
          }
        } catch {
          // ignore
        }
      }
    }

    await walkDir(resolvedPath);

    return files.map((f) => relative(resolvedPath, f)).sort();
  } catch {
    return [];
  }
}

function getExtensionFilter(
  filterType: string,
): (ext: string) => boolean {
  switch (filterType) {
    case "tsx":
      return (ext) => [".ts", ".tsx", ".js", ".jsx"].includes(ext);
    case "css":
      return (ext) => ext === ".css";
    case "md":
      return (ext) => ext === ".md";
    case "json":
      return (ext) => ext === ".json";
    case "all":
    default:
      return () => true;
  }
}

export function shouldExclude(relPath: string, excludeSet: Set<string>): boolean {
  const normalizedPath = relPath.replace(/\\/g, "/");

  for (const pattern of excludeSet) {
    const normalizedPattern = pattern.replace(/\\/g, "/");
    if (
      normalizedPath === normalizedPattern ||
      normalizedPath.startsWith(normalizedPattern + "/") ||
      normalizedPath.includes("/" + normalizedPattern + "/") ||
      normalizedPath.endsWith("/" + normalizedPattern)
    ) {
      return true;
    }
  }

  const commonExcludes = ["node_modules", ".git", ".next", "dist", "build", ".output"];
  for (const ex of commonExcludes) {
    if (
      normalizedPath === ex ||
      normalizedPath.startsWith(ex + "/") ||
      normalizedPath.includes("/" + ex + "/")
    ) {
      return true;
    }
  }

  return false;
}
