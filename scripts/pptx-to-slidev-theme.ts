#!/usr/bin/env tsx
/**
 * PPTX to Slidev Theme Converter
 *
 * 完整的 PPTX 主題提取與 Slidev 主題生成工具
 */

import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { readFile, writeFile, mkdir } from "fs/promises";
import { basename, join } from "path";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: false,
});

interface PPTXTheme {
  name: string;
  colors: {
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
    accent5: string;
    accent6: string;
    dk1: string;
    dk2: string;
    lt1: string;
    lt2: string;
  };
  fonts: {
    heading: {
      latin: string;
      ea: string;
    };
    body: {
      latin: string;
      ea: string;
    };
  };
  background?: {
    type: "color" | "image" | "gradient" | "none";
    value?: string;
    imageData?: Buffer;
    imageExt?: string;
  };
  layouts: LayoutInfo[];
}

interface LayoutInfo {
  name: string;
  type: string;
  images: ImageInfo[];
  shapes: ShapeInfo[];
}

interface ImageInfo {
  id: string;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data?: Buffer;
  ext?: string;
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

function extractColor(colorNode: any): string {
  if (!colorNode) return "#000000";

  if (colorNode["a:srgbClr"]) {
    const val = colorNode["a:srgbClr"]["@_val"];
    return `#${val}`;
  }

  if (colorNode["a:sysClr"]) {
    const lastClr = colorNode["a:sysClr"]["@_lastClr"];
    if (lastClr) return `#${lastClr}`;
  }

  if (colorNode["a:schemeClr"]) {
    const val = colorNode["a:schemeClr"]["@_val"];
    return `scheme:${val}`;
  }

  return "#000000";
}

function resolveSchemeColor(
  color: string,
  colors: PPTXTheme["colors"],
): string {
  if (!color.startsWith("scheme:")) return color;

  const schemeKey = color.replace("scheme:", "");
  const colorKey = schemeKey as keyof PPTXTheme["colors"];

  if (colorKey in colors) {
    const resolved = colors[colorKey];
    if (resolved.startsWith("#")) return resolved;
  }

  return color;
}

function extractColorWithScheme(
  node: any,
  colors: PPTXTheme["colors"],
): string {
  const rawColor = extractColor(node);
  return resolveSchemeColor(rawColor, colors);
}

function emuToPixels(emu: number): number {
  return Math.round(emu / 9525);
}

async function extractPPTXTheme(
  pptxPath: string,
  outputDir: string,
): Promise<PPTXTheme> {
  console.log("\n📦 正在解壓 PPTX 檔案...");
  const buffer = await readFile(pptxPath);
  const zip = await JSZip.loadAsync(buffer);

  console.log("🎨 提取主題顏色...");
  const themeXml = await zip.file("ppt/theme/theme1.xml")?.async("string");
  if (!themeXml) throw new Error("找不到主題檔案");

  const themeData = parser.parse(themeXml);
  const themeName = themeData["a:theme"]["@_name"] || "Unnamed Theme";
  const clrScheme = themeData["a:theme"]["a:themeElements"]["a:clrScheme"];

  const colors: PPTXTheme["colors"] = {
    accent1: extractColor(clrScheme["a:accent1"]),
    accent2: extractColor(clrScheme["a:accent2"]),
    accent3: extractColor(clrScheme["a:accent3"]),
    accent4: extractColor(clrScheme["a:accent4"]),
    accent5: extractColor(clrScheme["a:accent5"]),
    accent6: extractColor(clrScheme["a:accent6"]),
    dk1: extractColor(clrScheme["a:dk1"]),
    dk2: extractColor(clrScheme["a:dk2"]),
    lt1: extractColor(clrScheme["a:lt1"]),
    lt2: extractColor(clrScheme["a:lt2"]),
  };

  console.log("🔤 提取字型方案...");
  const fontScheme = themeData["a:theme"]["a:themeElements"]["a:fontScheme"];
  const majorFont = fontScheme["a:majorFont"];
  const minorFont = fontScheme["a:minorFont"];

  const fonts: PPTXTheme["fonts"] = {
    heading: {
      latin: majorFont["a:latin"]["@_typeface"] || "Arial",
      ea: majorFont["a:ea"]["@_typeface"] || "微軟正黑體",
    },
    body: {
      latin: minorFont["a:latin"]["@_typeface"] || "Arial",
      ea: minorFont["a:ea"]["@_typeface"] || "微軟正黑體",
    },
  };

  console.log("🖼️  提取母片背景...");
  const masterXml = await zip
    .file("ppt/slideMasters/slideMaster1.xml")
    ?.async("string");
  let background: PPTXTheme["background"] = { type: "none" };

  if (masterXml) {
    const masterData = parser.parse(masterXml);
    const cSld = masterData["p:sldMaster"]?.["p:cSld"];
    const bg = cSld?.["p:bg"];

    if (bg?.["p:bgPr"]) {
      const bgPr = bg["p:bgPr"];

      if (bgPr["a:solidFill"]) {
        background = {
          type: "color",
          value: extractColorWithScheme(bgPr["a:solidFill"], colors),
        };
      } else if (bgPr["a:blipFill"]) {
        const blip = bgPr["a:blipFill"]["a:blip"];
        const rId = blip?.["@_r:embed"] || blip?.["@_r:link"];

        if (rId) {
          const relsXml = await zip
            .file("ppt/slideMasters/_rels/slideMaster1.xml.rels")
            ?.async("string");
          if (relsXml) {
            const relsData = parser.parse(relsXml);
            const rels = Array.isArray(
              relsData["Relationships"]["Relationship"],
            )
              ? relsData["Relationships"]["Relationship"]
              : [relsData["Relationships"]["Relationship"]];
            const imageRel = rels.find((r: any) => r["@_Id"] === rId);

            if (imageRel) {
              const imagePath = imageRel["@_Target"];
              const imageFile = zip.file(`ppt/slideMasters/${imagePath}`);

              if (imageFile) {
                const imageData = await imageFile.async("nodebuffer");
                const ext = imagePath.split(".").pop() || "png";

                background = {
                  type: "image",
                  value: imagePath,
                  imageData,
                  imageExt: ext,
                };

                console.log(
                  `  ✓ 背景圖片: ${imagePath} (${(imageData.length / 1024).toFixed(2)} KB)`,
                );
              }
            }
          }
        }
      }
    }
  }

  console.log("📄 提取版面配置...");
  const layoutFiles = Object.keys(zip.files)
    .filter(
      (name) =>
        name.startsWith("ppt/slideLayouts/slideLayout") &&
        name.endsWith(".xml") &&
        !name.includes("_rels"),
    )
    .sort();

  const layouts: LayoutInfo[] = [];

  for (const layoutFile of layoutFiles) {
    const layoutNum = layoutFiles.indexOf(layoutFile) + 1;
    const layoutXml = await zip.file(layoutFile)?.async("string");
    if (!layoutXml) continue;

    const layoutData = parser.parse(layoutXml);
    const layoutCSld = layoutData["p:sldLayout"]["p:cSld"];
    const layoutName = layoutCSld["@_name"] || `Layout ${layoutNum}`;
    const layoutType = layoutData["p:sldLayout"]["@_type"] || "custom";

    const images: ImageInfo[] = [];
    const shapes: ShapeInfo[] = [];

    const spTree = layoutCSld["p:spTree"];
    if (spTree) {
      const pics = spTree["p:pic"];
      const picArray = pics ? (Array.isArray(pics) ? pics : [pics]) : [];

      const relsPath = layoutFile
        .replace(".xml", ".xml.rels")
        .replace("slideLayouts/", "slideLayouts/_rels/");
      const relsXml = await zip.file(relsPath)?.async("string");
      let rels: any[] = [];

      if (relsXml) {
        const relsData = parser.parse(relsXml);
        rels = Array.isArray(relsData["Relationships"]["Relationship"])
          ? relsData["Relationships"]["Relationship"]
          : [relsData["Relationships"]["Relationship"]];
      }

      for (const pic of picArray) {
        const nvPicPr = pic["p:nvPicPr"];
        const id = nvPicPr?.["p:cNvPr"]?.["@_id"] || "";

        const blipFill = pic["p:blipFill"];
        const blip = blipFill?.["a:blip"];
        const rId = blip?.["@_r:embed"] || blip?.["@_r:link"];

        const spPr = pic["p:spPr"];
        const xfrm = spPr?.["a:xfrm"];
        const off = xfrm?.["a:off"];
        const ext = xfrm?.["a:ext"];

        const x = emuToPixels(parseInt(off?.["@_x"] || "0"));
        const y = emuToPixels(parseInt(off?.["@_y"] || "0"));
        const width = emuToPixels(parseInt(ext?.["@_cx"] || "0"));
        const height = emuToPixels(parseInt(ext?.["@_cy"] || "0"));

        if (rId) {
          const imageRel = rels.find((r: any) => r["@_Id"] === rId);
          if (imageRel) {
            const imagePath = imageRel["@_Target"].replace("../", "");
            const imageFile = zip.file(`ppt/${imagePath}`);

            if (imageFile) {
              const imageData = await imageFile.async("nodebuffer");
              const ext = imagePath.split(".").pop() || "png";

              images.push({
                id,
                path: imagePath,
                x,
                y,
                width,
                height,
                data: imageData,
                ext,
              });
            }
          }
        }
      }

      const sps = spTree["p:sp"];
      const spArray = sps ? (Array.isArray(sps) ? sps : [sps]) : [];

      for (const sp of spArray) {
        const nvSpPr = sp["p:nvSpPr"];
        const id = nvSpPr?.["p:cNvPr"]?.["@_id"] || "";
        const txBox = nvSpPr?.["p:cNvSpPr"]?.["@_txBox"];

        if (txBox === "1") continue;

        const spPr = sp["p:spPr"];
        const xfrm = spPr?.["a:xfrm"];
        const off = xfrm?.["a:off"];
        const ext = xfrm?.["a:ext"];

        const x = emuToPixels(parseInt(off?.["@_x"] || "0"));
        const y = emuToPixels(parseInt(off?.["@_y"] || "0"));
        const width = emuToPixels(parseInt(ext?.["@_cx"] || "0"));
        const height = emuToPixels(parseInt(ext?.["@_cy"] || "0"));

        const solidFill = spPr?.["a:solidFill"];
        const fillColor = solidFill
          ? extractColorWithScheme(solidFill, colors)
          : undefined;

        shapes.push({
          id,
          type: "shape",
          x,
          y,
          width,
          height,
          fillColor,
        });
      }
    }

    layouts.push({
      name: layoutName,
      type: layoutType,
      images,
      shapes,
    });

    console.log(
      `  ✓ ${layoutName}: ${images.length} 張圖片, ${shapes.length} 個圖形`,
    );
  }

  console.log(`\n💾 儲存提取的資源到 ${outputDir}...`);
  await mkdir(outputDir, { recursive: true });

  if (background.type === "image" && background.imageData) {
    const bgPath = join(outputDir, `background.${background.imageExt}`);
    await writeFile(bgPath, background.imageData);
    console.log(`  ✓ 背景圖片: ${bgPath}`);
  }

  for (const layout of layouts) {
    for (let i = 0; i < layout.images.length; i++) {
      const img = layout.images[i];
      if (img.data) {
        const imgPath = join(
          outputDir,
          `layout-${layouts.indexOf(layout) + 1}-image-${i + 1}.${img.ext}`,
        );
        await writeFile(imgPath, img.data);
      }
    }
  }

  console.log(
    `  ✓ 共儲存 ${layouts.reduce((sum, l) => sum + l.images.length, 0)} 張圖片`,
  );

  return {
    name: themeName,
    colors,
    fonts,
    background,
    layouts,
  };
}

function generateSlidevTheme(
  theme: PPTXTheme,
  outputDir: string,
): { [filename: string]: string } {
  const themeName = theme.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();

  const packageJson = {
    name: `slidev-theme-${themeName}`,
    version: "0.1.0",
    keywords: ["slidev-theme", "slidev", "theme"],
    engines: {
      slidev: ">=0.48.0",
    },
  };

  const indexCss = `
@import '@slidev/client/styles/layouts-base.css';

:root {
  /* 主題顏色 */
  --slidev-theme-primary: ${theme.colors.accent1};
  --slidev-theme-accent: ${theme.colors.accent2};
  --slidev-theme-accent-3: ${theme.colors.accent3};
  --slidev-theme-accent-4: ${theme.colors.accent4};
  --slidev-theme-accent-5: ${theme.colors.accent5};
  --slidev-theme-accent-6: ${theme.colors.accent6};
  
  /* 深淺色 */
  --slidev-theme-dark: ${theme.colors.dk1};
  --slidev-theme-dark-2: ${theme.colors.dk2};
  --slidev-theme-light: ${theme.colors.lt1};
  --slidev-theme-light-2: ${theme.colors.lt2};
  
  /* 字型 */
  --slidev-theme-font-heading: "${theme.fonts.heading.ea}", "${theme.fonts.heading.latin}", sans-serif;
  --slidev-theme-font-body: "${theme.fonts.body.ea}", "${theme.fonts.body.latin}", sans-serif;
}

body {
  font-family: var(--slidev-theme-font-body);
  color: var(--slidev-theme-dark);
  background-color: var(--slidev-theme-light);
}

.slidev-layout {
  font-family: var(--slidev-theme-font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--slidev-theme-font-heading);
  color: var(--slidev-theme-primary);
}

a {
  color: var(--slidev-theme-accent);
}

code {
  background-color: var(--slidev-theme-accent-3);
  color: var(--slidev-theme-dark);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

${
  theme.background?.type === "image"
    ? `
.slidev-layout {
  background-image: url('./background.${theme.background.imageExt}');
  background-size: cover;
  background-position: center;
}
`
    : theme.background?.type === "color"
      ? `
.slidev-layout {
  background-color: ${theme.background.value};
}
`
      : ""
}
`.trim();

  const indexTs = `
import './index.css'
`.trim();

  const readme = `
# Slidev Theme: ${theme.name}

> 從 PPTX 檔案自動生成的 Slidev 主題

## 顏色方案

- Primary: \`${theme.colors.accent1}\`
- Accent: \`${theme.colors.accent2}\`
- Dark: \`${theme.colors.dk1}\`
- Light: \`${theme.colors.lt1}\`

## 字型

- 標題: ${theme.fonts.heading.ea} / ${theme.fonts.heading.latin}
- 內文: ${theme.fonts.body.ea} / ${theme.fonts.body.latin}

## 使用方式

在 Slidev 簡報的 frontmatter 中指定此主題：

\`\`\`yaml
---
theme: ${themeName}
---
\`\`\`
`.trim();

  return {
    "package.json": JSON.stringify(packageJson, null, 2),
    "index.css": indexCss,
    "index.ts": indexTs,
    "README.md": readme,
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "❌ 使用方法: tsx scripts/pptx-to-slidev-theme.ts <pptx-file> [output-dir]",
    );
    console.error("\n範例:");
    console.error("  tsx scripts/pptx-to-slidev-theme.ts data/template.pptx");
    console.error(
      "  tsx scripts/pptx-to-slidev-theme.ts data/template.pptx data/extracted-theme",
    );
    process.exit(1);
  }

  const pptxPath = args[0];
  const outputDir = args[1] || "data/extracted-theme";

  console.log("\n" + "=".repeat(80));
  console.log("🚀 PPTX to Slidev Theme Converter");
  console.log("=".repeat(80));
  console.log(`\n📁 輸入: ${pptxPath}`);
  console.log(`📁 輸出: ${outputDir}`);

  try {
    const theme = await extractPPTXTheme(pptxPath, outputDir);

    console.log("\n📝 生成 Slidev 主題檔案...");
    const themeFiles = generateSlidevTheme(theme, outputDir);

    await mkdir(join(outputDir, "styles"), { recursive: true });

    for (const [filename, content] of Object.entries(themeFiles)) {
      let filePath: string;
      if (filename === "index.css" || filename === "index.ts") {
        filePath = join(outputDir, "styles", filename);
      } else {
        filePath = join(outputDir, filename);
      }
      await writeFile(filePath, content);
      console.log(
        `  ✓ ${filename === "index.css" || filename === "index.ts" ? "styles/" + filename : filename}`,
      );
    }

    const summaryPath = join(outputDir, "theme-analysis.json");
    await writeFile(summaryPath, JSON.stringify(theme, null, 2));
    console.log(`  ✓ theme-analysis.json (完整分析結果)`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ 主題檔案生成完成！");
    console.log("=".repeat(80));
    console.log(`\n📦 主題檔案已生成到: ${outputDir}`);
    console.log("\n檔案結構:");
    console.log(`  ${outputDir}/`);
    console.log(`  ├── package.json`);
    console.log(`  ├── styles/`);
    console.log(`  │   ├── index.css`);
    console.log(`  │   └── index.ts`);
    console.log(`  ├── README.md`);
    console.log(`  ├── theme-analysis.json`);
    console.log(`  └── layout-*.png (背景圖片)`);

    console.log("\n⚠️  重要：主題檔案已生成，但尚未生成 Vue layouts");
    console.log("\n下一步（必須執行）:");
    console.log(
      `  1. 生成 layouts: npx tsx scripts/generate-layouts.ts ${outputDir}`,
    );

    const isInThemesDir = outputDir.includes("data/themes/");

    if (isInThemesDir) {
      console.log("  2. 重啟容器: ./deploy.sh restart");
      console.log("  3. 在前端主題選擇器中選擇此主題");
    } else {
      console.log(
        `  2. 移動主題到 themes 目錄: mv ${outputDir} data/themes/your-theme-name`,
      );
      console.log("  3. 重啟容器: ./deploy.sh restart");
      console.log("  4. 在前端主題選擇器中選擇此主題");
    }
    console.log("");
  } catch (error) {
    console.error("\n❌ 錯誤:", error);
    process.exit(1);
  }
}

main();
