import { resolve, normalize, relative, sep } from "path";

export function resolveRoot(targetPath: string): string {
  return normalize(resolve(targetPath));
}

export function resolveWithinRoot(rootAbs: string, relPath: string): string | null {
  if (relPath.includes("\0")) {
    return null;
  }

  if (relPath.includes("..")) {
    return null;
  }

  const fullPath = normalize(resolve(rootAbs, relPath));

  const relToRoot = relative(rootAbs, fullPath);
  if (relToRoot.startsWith("..") || relToRoot === "") {
    return null;
  }

  if (process.platform === "win32") {
    if (fullPath.toLowerCase().startsWith(rootAbs.toLowerCase())) {
      return fullPath;
    }
    return null;
  }

  if (fullPath.startsWith(rootAbs + sep) || fullPath === rootAbs) {
    return fullPath;
  }

  return null;
}

export function toPosixRelPath(p: string): string {
  let normalized = p.replace(/\\/g, "/");
  if (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }
  return normalized;
}
