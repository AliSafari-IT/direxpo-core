import { mkdir, rm, writeFile } from "fs/promises";
import { resolve } from "path";
import type { DemoOutput, DemoSection } from "./demo.js";
import { collectDemoOutput } from "./demo.js";

async function buildDemoSite(): Promise<void> {
  const distDir = resolve(process.cwd(), "dist");
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  const output = await collectDemoOutput();
  const basePath = process.env.BASE_PATH || "/direxpo-core/";
  const html = renderHtml(output, basePath);

  await writeFile(resolve(distDir, "index.html"), html, "utf-8");
}

function renderSection(section: DemoSection): string {
  const lines = section.lines
    .map((line) => `<li><code>${line}</code></li>`)
    .join("");

  return `
    <section class="demo-section">
      <header>
        <h2>${section.title}</h2>
        <p>${section.summary}</p>
      </header>
      <ul>${lines}</ul>
    </section>
  `;
}

function renderHtml(output: DemoOutput, basePath: string = "/"): string {
  const sectionsHtml = output.sections.map(renderSection).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="${basePath}" />
    <title>Direxpo-Core Demo</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@asafarim/design-tokens/css/index.css"
    />
    <style>
      :root {
        font-family: var(--asm-font-family-space-grotesk, var(--asm-font-family-primary));
        line-height: 1.6;
        color: var(--asm-color-text);
        background-color: var(--asm-color-bg);
      }
      body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: linear-gradient(
          120deg,
          var(--asm-color-primary-50),
          var(--asm-color-secondary-50)
        );
      }
      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: var(--asm-space-16) var(--asm-space-6) var(--asm-space-20);
      }
      header.page-header {
        text-align: center;
        margin-bottom: var(--asm-space-12);
      }
      header.page-header h1 {
        font-size: clamp(2rem, 5vw, 3rem);
        margin: 0 0 var(--asm-space-3);
        font-weight: var(--asm-font-weight-600);
      }
      header.page-header p {
        margin: 0;
        color: var(--asm-color-text-muted);
      }
      .demo-section {
        background: var(--asm-color-surface);
        border-radius: var(--asm-radius-xl);
        padding: var(--asm-space-8);
        margin-bottom: var(--asm-space-6);
        box-shadow: var(--asm-effect-shadow-xl);
        border: 1px solid var(--asm-color-border);
      }
      .demo-section header {
        margin-bottom: var(--asm-space-4);
      }
      .demo-section h2 {
        margin: 0;
        font-size: 1.3rem;
        color: var(--asm-color-text);
      }
      .demo-section p {
        margin: var(--asm-space-2) 0 0;
        color: var(--asm-color-text-muted);
      }
      .demo-section ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
        max-height: 320px;
        overflow: auto;
      }
      .demo-section li {
        padding: var(--asm-space-2) 0;
        border-bottom: 1px solid var(--asm-color-border);
      }
      .demo-section code {
        font-family: var(--asm-font-family-mono);
        font-size: 0.9rem;
        color: var(--asm-color-text);
      }
      footer {
        margin-top: var(--asm-space-10);
        text-align: center;
        color: var(--asm-color-text-muted);
        font-size: 0.95rem;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="page-header">
        <p>Fixture: ${output.fixtureDir.replace(/\\\\/g, "/")}</p>
      </header>
      ${sectionsHtml}
      <footer>
        Generated ${new Date().toLocaleString()}
      </footer>
    </main>
  </body>
</html>`;
}

await buildDemoSite();
