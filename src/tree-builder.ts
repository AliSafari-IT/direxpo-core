import { basename } from "path";
import type { TreeNode } from "./types.js";

export function buildFolderTree(filePaths: string[], basePath: string): TreeNode {
  const root: TreeNode = {
    name: basename(basePath) || "root",
    path: basePath,
    isDir: true,
    children: [],
  };

  const nodeMap = new Map<string, TreeNode>();
  nodeMap.set("", root);

  const sortedPaths = [...filePaths].sort();

  for (const relativePath of sortedPaths) {
    const parts = relativePath.split(/[\\/]/).filter(Boolean);

    let currentPath = "";
    let currentNode = root;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!nodeMap.has(currentPath)) {
        const dirNode: TreeNode = {
          name: part,
          path: currentPath,
          isDir: true,
          children: [],
        };
        nodeMap.set(currentPath, dirNode);
        currentNode.children.push(dirNode);
      }

      currentNode = nodeMap.get(currentPath)!;
    }

    const fileName = parts[parts.length - 1];
    const fileNode: TreeNode = {
      name: fileName,
      path: relativePath,
      isDir: false,
      children: [],
    };
    currentNode.children.push(fileNode);
  }

  sortTree(root);
  return root;
}

function sortTree(node: TreeNode): void {
  node.children.sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  node.children.forEach(sortTree);
}

export function renderTreeToMarkdown(
  node: TreeNode,
  prefix = "",
  isLast = true,
  isRoot = true,
): string {
  const lines: string[] = [];
  const label = node.isDir ? `${node.name}/` : node.name;

  if (isRoot) {
    lines.push(label);

    const lastIndex = node.children.length - 1;
    node.children.forEach((child, idx) => {
      lines.push(
        renderTreeToMarkdown(child, "", idx === lastIndex, false).trimEnd(),
      );
    });

    return lines.filter(Boolean).join("\n") + "\n";
  }

  const connector = isLast ? "└─ " : "├─ ";
  lines.push(`${prefix}${connector}${label}`);

  const childPrefix = prefix + (isLast ? "   " : "│  ");
  const lastIndex = node.children.length - 1;

  node.children.forEach((child, idx) => {
    lines.push(
      renderTreeToMarkdown(child, childPrefix, idx === lastIndex, false).trimEnd(),
    );
  });

  return lines.filter(Boolean).join("\n") + "\n";
}

export function generateTreeSection(filePaths: string[], basePath: string): string {
  if (!filePaths.length) return "";
  const tree = buildFolderTree(filePaths, basePath);
  const treeText = renderTreeToMarkdown(tree);
  return `## Project Structure\n\n\`\`\`\n${treeText}\`\`\`\n`;
}
