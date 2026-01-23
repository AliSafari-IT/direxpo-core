import type { FilterType } from "./types.js";

export function matchesFilter(filename: string, filter: FilterType): boolean {
  const ext = filename.substring(filename.lastIndexOf("."));
  
  switch (filter) {
    case "all":
      return true;
    case "tsx":
      return [".ts", ".tsx", ".js", ".jsx"].includes(ext);
    case "css":
      return [".css", ".scss", ".sass", ".less"].includes(ext);
    case "md":
      return [".md", ".markdown"].includes(ext);
    case "json":
      return ext === ".json";
    case "glob":
      return true;
    default:
      return true;
  }
}
