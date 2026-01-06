export type FilterType = "all" | "tsx" | "css" | "md" | "json" | "glob";

export interface DiscoverOptions {
  targetPath: string;
  filter?: FilterType;
  pattern?: string;
  exclude?: string[];
  maxSize?: number;
}

export interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
}
