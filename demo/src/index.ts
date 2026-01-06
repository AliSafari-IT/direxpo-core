import { discoverFiles, generateTreeSection, buildFolderTree } from "@asafarim/direxpo-core";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = resolve(fileURLToPath(import.meta.url), "..");

async function main() {
  console.log("🚀 Direxpo-Core Demo App\n");
  console.log("=".repeat(60));

  const fixtureDir = resolve(__dirname, "../fixtures/sample-project");

  // Use Case 1: Discover all files
  console.log("\n📁 Use Case 1: Discover All Files");
  console.log("-".repeat(60));
  const allFiles = await discoverFiles({
    targetPath: fixtureDir,
  });
  console.log(`Found ${allFiles.length} files:`);
  allFiles.forEach((f: string) => console.log(`  • ${f}`));

  // Use Case 2: Discover TypeScript/TSX files only
  console.log("\n\n📝 Use Case 2: Discover TypeScript/TSX Files");
  console.log("-".repeat(60));
  const tsxFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "tsx",
  });
  console.log(`Found ${tsxFiles.length} TypeScript files:`);
  tsxFiles.forEach((f: string) => console.log(`  • ${f}`));

  // Use Case 3: Discover CSS files
  console.log("\n\n🎨 Use Case 3: Discover CSS Files");
  console.log("-".repeat(60));
  const cssFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "css",
  });
  console.log(`Found ${cssFiles.length} CSS files:`);
  cssFiles.forEach((f: string) => console.log(`  • ${f}`));

  // Use Case 4: Discover Markdown files
  console.log("\n\n📚 Use Case 4: Discover Markdown Files");
  console.log("-".repeat(60));
  const mdFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "md",
  });
  console.log(`Found ${mdFiles.length} Markdown files:`);
  mdFiles.forEach((f: string) => console.log(`  • ${f}`));

  // Use Case 5: Discover JSON files
  console.log("\n\n⚙️  Use Case 5: Discover JSON Files");
  console.log("-".repeat(60));
  const jsonFiles = await discoverFiles({
    targetPath: fixtureDir,
    filter: "json",
  });
  console.log(`Found ${jsonFiles.length} JSON files:`);
  jsonFiles.forEach((f: string) => console.log(`  • ${f}`));

  // Use Case 6: Discover with exclusions
  console.log("\n\n🚫 Use Case 6: Discover with Exclusions");
  console.log("-".repeat(60));
  const filesWithExclude = await discoverFiles({
    targetPath: fixtureDir,
    exclude: ["node_modules", "dist"],
  });
  console.log(`Found ${filesWithExclude.length} files (excluding node_modules, dist):`);
  filesWithExclude.forEach((f: string) => console.log(`  • ${f}`));

  // Use Case 7: Generate folder tree
  console.log("\n\n🌳 Use Case 7: Generate Folder Tree");
  console.log("-".repeat(60));
  const tree = generateTreeSection(allFiles, fixtureDir);
  console.log(tree);

  // Use Case 8: Build and inspect tree structure
  console.log("\n\n🔍 Use Case 8: Build Tree Structure");
  console.log("-".repeat(60));
  const treeNode = buildFolderTree(allFiles, fixtureDir);
  console.log("Tree structure built:");
  console.log(JSON.stringify(treeNode, null, 2));

  console.log("\n" + "=".repeat(60));
  console.log("✅ Demo completed!\n");
}

main().catch(console.error);
