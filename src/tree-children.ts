import { readdir, stat } from "fs/promises";
import { join } from "path";
import type { FilterType } from "./types.js";
import { resolveRoot, resolveWithinRoot, toPosixRelPath } from "./path-utils.js";
import { parseExclude, isExcluded } from "./exclude.js";
import { matchesFilter } from "./filter.js";

export interface TreeNodeLite {
  type: "dir" | "file";
  name: string;
  relPath: string;
  size?: number;
  hasChildren?: boolean;
}

export interface TreeChildrenOptions {
  root: string;
  rel?: string;
  filter?: FilterType;
  exclude?: string | string[];
}

export async function listTreeChildren(opts: TreeChildrenOptions): Promise<{
  rootAbs: string;
  rel: string;
  nodes: TreeNodeLite[];
}> {
  const rootAbs = resolveRoot(opts.root);
  const rel = opts.rel || "";
  const filter = opts.filter || "all";
  const excludePatterns = parseExclude(opts.exclude);

  const targetPath = rel ? resolveWithinRoot(rootAbs, rel) : rootAbs;
  if (!targetPath) {
    return { rootAbs, rel, nodes: [] };
  }

  let entries;
  try {
    entries = await readdir(targetPath, { withFileTypes: true });
  } catch {
    return { rootAbs, rel, nodes: [] };
  }

  const nodes: TreeNodeLite[] = [];

  for (const entry of entries) {
    const itemRelPath = toPosixRelPath(rel ? `${rel}/${entry.name}` : entry.name);

    if (isExcluded(itemRelPath, excludePatterns)) {
      continue;
    }

    if (entry.isDirectory()) {
      nodes.push({
        type: "dir",
        name: entry.name,
        relPath: itemRelPath,
        hasChildren: true,
      });
    } else if (entry.isFile()) {
      if (!matchesFilter(entry.name, filter)) {
        continue;
      }

      try {
        const fullPath = join(targetPath, entry.name);
        const stats = await stat(fullPath);
        nodes.push({
          type: "file",
          name: entry.name,
          relPath: itemRelPath,
          size: stats.size,
        });
      } catch {
        continue;
      }
    }
  }

  nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "dir" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return { rootAbs, rel, nodes };
}
