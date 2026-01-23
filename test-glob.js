function globToRegExp(pattern) {
  const segments = pattern.split("/");
  const regexParts = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    
    if (segment === "**") {
      if (i > 0 && segments[i - 1] === "**") {
        continue;
      }
      if (i === segments.length - 1) {
        regexParts.push(".*");
      } else if (segments[i + 1] === "**") {
        regexParts.push(".*");
        i++;
      } else {
        regexParts.push("(?:.*?/)?");
      }
    } else {
      const escaped = segment
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, "[^/]*")
        .replace(/\?/g, "[^/]");
      regexParts.push(escaped);
    }
  }
  
  const regexPattern = regexParts.join("/");
  return new RegExp(`^${regexPattern}$`);
}

function matchesGlob(relPosixPath, pattern) {
  const regex = globToRegExp(pattern);
  return regex.test(relPosixPath);
}

console.log("Test 1: **/*.md matching README.md");
console.log("Pattern: **/*.md");
console.log("Path: README.md");
console.log("Result:", matchesGlob("README.md", "**/*.md"));
console.log("Regex:", globToRegExp("**/*.md"));
console.log();

console.log("Test 2: **/*.md matching docs/guide.md");
console.log("Pattern: **/*.md");
console.log("Path: docs/guide.md");
console.log("Result:", matchesGlob("docs/guide.md", "**/*.md"));
console.log();

console.log("Test 3: src/**/generated/** matching src/generated/types.ts");
console.log("Pattern: src/**/generated/**");
console.log("Path: src/generated/types.ts");
console.log("Result:", matchesGlob("src/generated/types.ts", "src/**/generated/**"));
console.log("Regex:", globToRegExp("src/**/generated/**"));
console.log();

console.log("Test 4: src/**/generated/** matching src/utils/generated/index.ts");
console.log("Pattern: src/**/generated/**");
console.log("Path: src/utils/generated/index.ts");
console.log("Result:", matchesGlob("src/utils/generated/index.ts", "src/**/generated/**"));
