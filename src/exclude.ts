export function parseExclude(input?: string | string[]): string[] {
  if (!input) return [];
  
  if (Array.isArray(input)) {
    return input.flatMap(item => 
      item.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    );
  }
  
  return input.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
}

export function isExcluded(relPath: string, patterns: string[]): boolean {
  const posixPath = relPath.replace(/\\/g, "/");
  
  const commonExcludes = ["node_modules", ".git", ".next", "dist", "build", ".output"];
  
  for (const ex of commonExcludes) {
    if (matchesSegment(posixPath, ex)) {
      return true;
    }
  }
  
  for (const pattern of patterns) {
    const posixPattern = pattern.replace(/\\/g, "/");
    
    if (posixPattern.includes("*") || posixPattern.includes("?")) {
      if (matchesGlobPattern(posixPath, posixPattern)) {
        return true;
      }
    } else {
      if (matchesSegment(posixPath, posixPattern)) {
        return true;
      }
    }
  }
  
  return false;
}

function matchesSegment(path: string, segment: string): boolean {
  const parts = path.split("/");
  return parts.includes(segment);
}

function matchesGlobPattern(path: string, pattern: string): boolean {
  const segments = pattern.split("/");
  let regexPattern = "";
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    
    if (segment === "**") {
      if (i > 0 && segments[i - 1] === "**") {
        continue;
      }
      if (i === segments.length - 1) {
        if (i > 0) regexPattern += "/";
        regexPattern += ".*";
      } else if (segments[i + 1] === "**") {
        if (i > 0) regexPattern += "/";
        regexPattern += ".*";
        i++;
      } else {
        if (i === 0) {
          regexPattern += "(?:.*/)?";
        } else {
          regexPattern += "/(?:.*/)?";
        }
      }
    } else {
      if (i > 0 && segments[i - 1] !== "**") {
        regexPattern += "/";
      }
      const escaped = segment
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, "[^/]*")
        .replace(/\?/g, "[^/]");
      regexPattern += escaped;
    }
  }
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}
