import type { Dirent } from "fs";
import { stat, readdir } from "fs/promises";
import { join, relative } from "path";
import type { DiscoverOptions } from "./types.js";
import { resolveRoot, toPosixRelPath } from "./path-utils.js";
import { parseExclude, isExcluded } from "./exclude.js";
import { matchesFilter } from "./filter.js";
import { matchesGlob } from "./glob.js";

export async function discoverFiles(options: DiscoverOptions): Promise<string[]> {
  try {
    const { targetPath, filter = "all", pattern, exclude, maxSize = Infinity } = options;

    const resolvedPath = resolveRoot(targetPath);
    const maxSizeBytes = maxSize * 1024 * 1024;
    const excludePatterns = parseExclude(exclude);

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
        const posixRelPath = toPosixRelPath(relPath);

        if (isExcluded(posixRelPath, excludePatterns)) {
          continue;
        }

        if (entry.isDirectory()) {
          await walkDir(fullPath);
          continue;
        }

        if (!entry.isFile()) continue;

        if (filter === "glob") {
          if (pattern) {
            if (!matchesGlob(posixRelPath, pattern)) {
              continue;
            }
          }
        } else {
          if (!matchesFilter(entry.name, filter)) {
            continue;
          }
        }

        try {
          const stats = await stat(fullPath);
          if (stats.size <= maxSizeBytes) {
            files.push(posixRelPath);
          }
        } catch {
        }
      }
    }

    await walkDir(resolvedPath);

    return files.sort();
  } catch {
    return [];
  }
}

export function shouldExclude(relPath: string, excludeSet: Set<string>): boolean {
  return isExcluded(relPath, Array.from(excludeSet));
}
