# Direxpo-Core Demo App

A comprehensive demonstration of the `@asafarim/direxpo-core` package capabilities.

## Overview

This demo app showcases 8 different use cases for discovering and analyzing file structures in TypeScript/Node.js projects.

## Setup

```bash
# Install dependencies
pnpm install

# Build the core package first
cd ..
pnpm build
cd demo

# Run the demo
pnpm dev
```

## Use Cases Demonstrated

### 1. **Discover All Files**

Recursively discover all files in a directory without filtering.

```typescript
const allFiles = await discoverFiles({
  targetPath: './src',
});
```

### 2. **Discover TypeScript/TSX Files**

Filter discovery to only TypeScript and TSX files.

```typescript
const tsxFiles = await discoverFiles({
  targetPath: './src',
  filter: 'tsx',
});
```

### 3. **Discover CSS Files**

Find all stylesheet files in a project.

```typescript
const cssFiles = await discoverFiles({
  targetPath: './src',
  filter: 'css',
});
```

### 4. **Discover Markdown Files**

Locate all documentation files.

```typescript
const mdFiles = await discoverFiles({
  targetPath: './docs',
  filter: 'md',
});
```

### 5. **Discover JSON Files**

Find configuration and data files.

```typescript
const jsonFiles = await discoverFiles({
  targetPath: './',
  filter: 'json',
});
```

### 6. **Discover with Exclusions**

Exclude specific directories from discovery.

```typescript
const files = await discoverFiles({
  targetPath: './src',
  exclude: ['node_modules', 'dist', '.next'],
});
```

### 7. **Generate Folder Tree**

Create a markdown representation of the folder structure.

```typescript
const tree = generateTreeSection(files, basePath);
console.log(tree);
```

### 8. **Build Tree Structure**

Create a programmatic tree data structure for further processing.

```typescript
const treeNode = buildFolderTree(files, basePath);
console.log(JSON.stringify(treeNode, null, 2));
```

## Sample Project Structure

The demo includes a realistic sample project in `fixtures/sample-project/` with:

- `src/components/` - React components
- `src/styles/` - CSS stylesheets
- `src/utils/` - Utility functions
- `docs/` - Documentation
- `tests/` - Test files
- `package.json` - Project configuration

## Running the Demo

```bash
pnpm demo
```

This will execute all 8 use cases and display results with formatted output.

## Output Example

```
🚀 Direxpo-Core Demo App

============================================================

📁 Use Case 1: Discover All Files
------------------------------------------------------------
Found 10 files:
  • src/components/Button.tsx
  • src/components/Card.tsx
  • src/components/Header.tsx
  • src/styles/global.css
  • src/utils/helpers.ts
  • docs/ARCHITECTURE.md
  • package.json
  • README.md
  • ...

🌳 Use Case 7: Generate Folder Tree
------------------------------------------------------------
sample-project
├── docs
│   └── ARCHITECTURE.md
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Header.tsx
│   ├── styles
│   │   └── global.css
│   └── utils
│       └── helpers.ts
├── package.json
└── README.md
```

## Key Features Demonstrated

✅ **Flexible Filtering** - Filter by file type (tsx, css, md, json, all)
✅ **Smart Exclusions** - Exclude directories automatically or manually
✅ **Tree Generation** - Create markdown or programmatic tree structures
✅ **Type Safety** - Full TypeScript support
✅ **No Dependencies** - Pure utilities with no runtime dependencies

## API Reference

### `discoverFiles(options: DiscoverOptions): Promise<string[]>`

Discovers files matching specified criteria.

**Options:**

- `targetPath: string` - Directory to scan
- `filter?: FilterType` - File type filter ('all' | 'tsx' | 'css' | 'md' | 'json')
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
