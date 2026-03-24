#!/usr/bin/env tsx
/**
 * Generate Slidev Vue Layouts from PPTX Theme Analysis
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

interface ImageInfo {
  id: string;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ShapeInfo {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor?: string;
}

interface LayoutInfo {
  name: string;
  type: string;
  images: ImageInfo[];
  shapes: ShapeInfo[];
}

interface ThemeAnalysis {
  name: string;
  layouts: LayoutInfo[];
}

function sanitizeLayoutName(name: string): string {
  return name
    .replace(/[()（）]/g, "")
    .replace(/[&＆]/g, "and")
    .replace(/[_\s]+/g, "-")
    .replace(/^(\d)/, "layout-$1")
    .toLowerCase();
}

function generateVueLayout(layout: LayoutInfo, layoutIndex: number): string {
  const sanitizedName = sanitizeLayoutName(layout.name);

  const backgroundLayers = layout.images
    .map((img, i) => {
      return `    <div class="bg-layer-${i + 1}"></div>`;
    })
    .join("\n");

  const backgroundStyles = layout.images
    .map((img, i) => {
      const imgFile = `../layout-${layoutIndex + 1}-image-${i + 1}.png`;
      return `
.bg-layer-${i + 1} {
  position: absolute;
  left: ${img.x}px;
  top: ${img.y}px;
  width: ${img.width}px;
  height: ${img.height}px;
  background-image: url('${imgFile}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}`;
    })
    .join("\n");

  const shapes = layout.shapes
    .filter((s) => s.fillColor)
    .map((shape, i) => {
      return `
.shape-${i + 1} {
  position: absolute;
  left: ${shape.x}px;
  top: ${shape.y}px;
  width: ${shape.width}px;
  height: ${shape.height}px;
  background-color: ${shape.fillColor};
  pointer-events: none;
}`;
    })
    .join("\n");

  return `<script setup lang="ts">
// Layout: ${layout.name}
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-${sanitizedName}">
${backgroundLayers}
    ${layout.shapes
      .filter((s) => s.fillColor)
      .map((_, i) => `<div class="shape-${i + 1}"></div>`)
      .join("\n    ")}
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-${sanitizedName} {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--slidev-theme-light, #FFFFFF);
}

.content-area {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2rem;
  z-index: 10;
}
${backgroundStyles}
${shapes}
</style>
`;
}

function generateLayoutIndex(layouts: LayoutInfo[]): string {
  const layoutNames = layouts.map((l) => sanitizeLayoutName(l.name));

  return `# NICS Theme Layouts

此主題包含 ${layouts.length} 種版面配置，對應原始 PPTX 模板的設計。

## 可用的 Layouts

${layouts
  .map((layout, i) => {
    const sanitizedName = sanitizeLayoutName(layout.name);
    return `### ${i + 1}. \`${sanitizedName}\`

**原始名稱**: ${layout.name}
**圖片**: ${layout.images.length} 張
**圖形**: ${layout.shapes.length} 個

\`\`\`yaml
---
layout: ${sanitizedName}
---
\`\`\`
`;
  })
  .join("\n")}

## 使用方式

在 \`slides.md\` 的每一頁前面加上 layout 指定：

\`\`\`markdown
---
layout: ${sanitizeLayoutName(layouts[0].name)}
---

# 你的標題

內容...

---
layout: ${sanitizeLayoutName(layouts[1].name)}
---

# 下一頁

更多內容...
\`\`\`

## 常用 Layouts 對應

| 用途 | Layout 名稱 |
|------|-------------|
${layouts
  .slice(0, 10)
  .map((layout, i) => {
    const sanitizedName = sanitizeLayoutName(layout.name);
    const purpose = layout.name.includes("封面")
      ? "封面"
      : layout.name.includes("章節")
        ? "章節頁"
        : layout.name.includes("內頁")
          ? "內頁"
          : layout.name.includes("封底")
            ? "封底"
            : layout.name.includes("大綱")
              ? "大綱"
              : layout.name.includes("前言")
                ? "前言"
                : "一般";
    return `| ${purpose} | \`${sanitizedName}\` |`;
  })
  .join("\n")}
`;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ 使用方法: tsx scripts/generate-layouts.ts <theme-dir>");
    console.error("\n範例:");
    console.error("  tsx scripts/generate-layouts.ts data/themes/nics-theme");
    process.exit(1);
  }

  const themeDir = args[0];
  const analysisPath = join(themeDir, "theme-analysis.json");

  console.log("\n" + "=".repeat(80));
  console.log("🎨 Generating Slidev Vue Layouts from PPTX Analysis");
  console.log("=".repeat(80));
  console.log(`\n📁 主題目錄: ${themeDir}`);

  try {
    const analysisContent = await readFile(analysisPath, "utf-8");
    const analysis: ThemeAnalysis = JSON.parse(analysisContent);

    console.log(`\n📊 找到 ${analysis.layouts.length} 個版面配置`);

    const layoutsDir = join(themeDir, "layouts");
    await mkdir(layoutsDir, { recursive: true });

    for (let i = 0; i < analysis.layouts.length; i++) {
      const layout = analysis.layouts[i];
      const sanitizedName = sanitizeLayoutName(layout.name);
      const vueContent = generateVueLayout(layout, i);
      const vuePath = join(layoutsDir, `${sanitizedName}.vue`);

      await writeFile(vuePath, vueContent);
      console.log(
        `  ✓ ${sanitizedName}.vue (${layout.images.length} 圖片, ${layout.shapes.length} 圖形)`,
      );
    }

    const indexContent = generateLayoutIndex(analysis.layouts);
    const indexPath = join(layoutsDir, "README.md");
    await writeFile(indexPath, indexContent);
    console.log(`  ✓ README.md (使用說明)`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ Layouts 生成完成！");
    console.log("=".repeat(80));
    console.log(`\n📦 生成檔案: ${analysis.layouts.length + 1} 個`);
    console.log(`📁 位置: ${layoutsDir}/`);
    console.log("\n下一步:");
    console.log("  1. 重啟容器: ./deploy.sh restart");
    console.log("  2. 在 slides.md 中使用 layout（參考 layouts/README.md）");
    console.log("");
  } catch (error) {
    console.error("\n❌ 錯誤:", error);
    process.exit(1);
  }
}

main();
