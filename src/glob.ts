export function globToRegExp(pattern: string): RegExp {
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
  
  return new RegExp(`^${regexPattern}$`);
}

export function matchesGlob(relPosixPath: string, pattern: string): boolean {
  const regex = globToRegExp(pattern);
  return regex.test(relPosixPath);
}
