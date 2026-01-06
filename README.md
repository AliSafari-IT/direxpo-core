# @asafarim/direxpo-core

Pure utilities for file discovery and folder tree generation. No runtime dependencies.

## Features

- **File Discovery**: Recursively discover files with filtering options
- **Tree Building**: Generate folder structure trees
- **Smart Exclusions**: Automatic exclusion of common directories (node_modules, .git, etc.)
- **Type-Safe**: Full TypeScript support

## 🎯 Live Demo

See the package in action: **[direxpo-core Demo](https://alisafari-it.github.io/direxpo-core/)**

The demo showcases 8 different use cases with code examples and live output.

## Installation

```bash
pnpm add @asafarim/direxpo-core
```

## Usage

### Discover Files

```typescript
import { discoverFiles } from '@asafarim/direxpo-core';

const files = await discoverFiles({
  targetPath: './src',
  filter: 'tsx',
  exclude: ['tests', '__mocks__'],
  maxSize: 5 // MB
});
```

### Generate Tree

```typescript
import { generateTreeSection } from '@asafarim/direxpo-core';

const treeMarkdown = generateTreeSection(files, './src');
console.log(treeMarkdown);
```

## API

### `discoverFiles(options: DiscoverOptions): Promise<string[]>`

Discovers files matching the specified criteria.

**Options:**

- `targetPath: string` - Directory to scan
- `filter?: FilterType` - File type filter ('all' | 'tsx' | 'css' | 'md' | 'json' | 'glob')
- `pattern?: string` - Glob pattern (when filter is 'glob')
- `exclude?: string[]` - Directories to exclude
- `maxSize?: number` - Maximum file size in MB

### `generateTreeSection(filePaths: string[], basePath: string): string`

Generates a markdown tree structure from file paths.

### `buildFolderTree(filePaths: string[], basePath: string): TreeNode`

Builds a tree data structure from file paths.

### `renderTreeToMarkdown(node: TreeNode): string`

Renders a tree node to markdown format.

## License

MIT
