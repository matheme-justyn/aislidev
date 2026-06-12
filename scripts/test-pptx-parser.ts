#!/usr/bin/env tsx
/**
 * PPTX Theme Parser Test Script
 *
 * 測試從 PPTX 檔案中提取設計元素：
 * - 主題顏色（accent colors）
 * - 字型設定（標題字型、內文字型）
 * - 背景設定（顏色/圖片）
 *
 * 使用方法:
 *   tsx scripts/test-pptx-parser.ts path/to/presentation.pptx
 */

import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { readFile } from "fs/promises";
import { basename } from "path";

// ==================== Types ====================

interface PPTXTheme {
  colors: {
    primary: string; // accent1
    secondary: string; // accent2
    accent3: string;
    accent4: string;
    accent5: string;
    accent6: string;
    dark1: string; // dk1 (主要深色)
    light1: string; // lt1 (主要淺色)
    dark2: string; // dk2 (次要深色)
    light2: string; // lt2 (次要淺色)
  };
  fonts: {
    heading: {
      latin: string; // 拉丁字元（英文）
      ea: string; // 東亞字元（中文）
    };
    body: {
      latin: string;
      ea: string;
    };
  };
  background?: {
    type: "color" | "image" | "none";
    value?: string; // 顏色值或圖片路徑
  };
}

// ==================== Color Extraction ====================

/**
 * 提取顏色值
 * PPTX 支援多種顏色格式：srgbClr, sysClr, schemeClr 等
 */
function extractColor(colorNode: any): string {
  if (!colorNode) {
    return "#000000"; // 預設黑色
  }

  // srgbClr: 直接的 RGB 顏色值
  if (colorNode["a:srgbClr"]) {
    const val = colorNode["a:srgbClr"]["@_val"];
    return `#${val}`;
  }

  // sysClr: 系統顏色
  if (colorNode["a:sysClr"]) {
    const lastClr = colorNode["a:sysClr"]["@_lastClr"];
    if (lastClr) {
      return `#${lastClr}`;
    }
  }

  // schemeClr: 引用主題顏色（較複雜，先返回描述）
  if (colorNode["a:schemeClr"]) {
    const val = colorNode["a:schemeClr"]["@_val"];
    return `scheme:${val}`;
  }

  return "#000000";
}

// ==================== Theme Extraction ====================

/**
 * 從 PPTX 檔案中提取主題資訊
 */
async function extractPPTXTheme(pptxBuffer: Buffer): Promise<PPTXTheme> {
  console.log("\n📦 正在解壓 PPTX 檔案...");
  const zip = await JSZip.loadAsync(pptxBuffer);

  // 1. 解析主題檔案 (ppt/theme/theme1.xml)
  console.log("📄 讀取 ppt/theme/theme1.xml...");
  const themeFile = zip.file("ppt/theme/theme1.xml");
  if (!themeFile) {
    throw new Error("找不到 ppt/theme/theme1.xml");
  }

  const themeXml = await themeFile.async("string");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const themeData = parser.parse(themeXml);

  // 2. 提取顏色方案
  console.log("🎨 提取顏色方案...");
  const clrScheme = themeData["a:theme"]["a:themeElements"]["a:clrScheme"];

  const colors = {
    primary: extractColor(clrScheme["a:accent1"]),
    secondary: extractColor(clrScheme["a:accent2"]),
    accent3: extractColor(clrScheme["a:accent3"]),
    accent4: extractColor(clrScheme["a:accent4"]),
    accent5: extractColor(clrScheme["a:accent5"]),
    accent6: extractColor(clrScheme["a:accent6"]),
    dark1: extractColor(clrScheme["a:dk1"]),
    light1: extractColor(clrScheme["a:lt1"]),
    dark2: extractColor(clrScheme["a:dk2"]),
    light2: extractColor(clrScheme["a:lt2"]),
  };

  // 3. 提取字型方案
  console.log("🔤 提取字型方案...");
  const fontScheme = themeData["a:theme"]["a:themeElements"]["a:fontScheme"];

  const fonts = {
    heading: {
      latin: fontScheme["a:majorFont"]["a:latin"]["@_typeface"] || "Arial",
      ea: fontScheme["a:majorFont"]["a:ea"]["@_typeface"] || "微軟正黑體",
    },
    body: {
      latin: fontScheme["a:minorFont"]["a:latin"]["@_typeface"] || "Arial",
      ea: fontScheme["a:minorFont"]["a:ea"]["@_typeface"] || "微軟正黑體",
    },
  };

  // 4. 提取背景設定 (從 slideMaster1.xml)
  console.log("🖼️  提取背景設定...");
  let background: PPTXTheme["background"] = { type: "none" };

  const slideMasterFile = zip.file("ppt/slideMasters/slideMaster1.xml");
  if (slideMasterFile) {
    const slideMasterXml = await slideMasterFile.async("string");
    const slideMasterData = parser.parse(slideMasterXml);

    const cSld = slideMasterData["p:sldMaster"]?.["p:cSld"];
    const bg = cSld?.["p:bg"];

    if (bg) {
      const bgPr = bg["p:bgPr"];

      // 檢查是否有實心填充 (solidFill)
      if (bgPr?.["a:solidFill"]) {
        background = {
          type: "color",
          value: extractColor(bgPr["a:solidFill"]),
        };
      }

      // 檢查是否有圖片填充 (blipFill)
      if (bgPr?.["a:blipFill"]) {
        const blip = bgPr["a:blipFill"]["a:blip"];
        const rId = blip?.["@_r:embed"] || blip?.["@_r:link"];
        if (rId) {
          background = {
            type: "image",
            value: rId, // 關係 ID，實際圖片需要從 _rels 解析
          };
        }
      }
    }
  }

  return { colors, fonts, background };
}

// ==================== Display Results ====================

/**
 * 顯示提取結果
 */
function displayTheme(theme: PPTXTheme, filename: string) {
  console.log("\n" + "=".repeat(60));
  console.log(`📊 PPTX 主題分析結果: ${filename}`);
  console.log("=".repeat(60));

  console.log("\n🎨 顏色方案:");
  console.log(`  主要顏色 (Primary):   ${theme.colors.primary}`);
  console.log(`  次要顏色 (Secondary): ${theme.colors.secondary}`);
  console.log(`  輔助色 3 (Accent 3):  ${theme.colors.accent3}`);
  console.log(`  輔助色 4 (Accent 4):  ${theme.colors.accent4}`);
  console.log(`  輔助色 5 (Accent 5):  ${theme.colors.accent5}`);
  console.log(`  輔助色 6 (Accent 6):  ${theme.colors.accent6}`);
  console.log(`  深色 1   (Dark 1):    ${theme.colors.dark1}`);
  console.log(`  淺色 1   (Light 1):   ${theme.colors.light1}`);
  console.log(`  深色 2   (Dark 2):    ${theme.colors.dark2}`);
  console.log(`  淺色 2   (Light 2):   ${theme.colors.light2}`);

  console.log("\n🔤 字型方案:");
  console.log(`  標題字型 (拉丁):     ${theme.fonts.heading.latin}`);
  console.log(`  標題字型 (東亞):     ${theme.fonts.heading.ea}`);
  console.log(`  內文字型 (拉丁):     ${theme.fonts.body.latin}`);
  console.log(`  內文字型 (東亞):     ${theme.fonts.body.ea}`);

  console.log("\n🖼️  背景設定:");
  if (theme.background?.type === "none") {
    console.log("  類型: 無背景 (或使用預設)");
  } else if (theme.background?.type === "color") {
    console.log(`  類型: 純色背景`);
    console.log(`  顏色: ${theme.background.value}`);
  } else if (theme.background?.type === "image") {
    console.log(`  類型: 圖片背景`);
    console.log(`  關係 ID: ${theme.background.value}`);
  }

  console.log("\n" + "=".repeat(60));
}

/**
 * 生成 Slidev 主題預覽
 */
function generateSlidevThemePreview(theme: PPTXTheme) {
  console.log("\n📝 Slidev 主題 CSS 預覽:");
  console.log("=".repeat(60));

  const css = `
:root {
  /* 主題顏色 */
  --slidev-theme-primary: ${theme.colors.primary};
  --slidev-theme-secondary: ${theme.colors.secondary};
  --slidev-theme-accent-3: ${theme.colors.accent3};
  --slidev-theme-accent-4: ${theme.colors.accent4};
  --slidev-theme-accent-5: ${theme.colors.accent5};
  --slidev-theme-accent-6: ${theme.colors.accent6};
  
  /* 深淺色 */
  --slidev-theme-dark: ${theme.colors.dark1};
  --slidev-theme-light: ${theme.colors.light1};
  
  /* 字型 */
  --slidev-theme-font-heading: "${theme.fonts.heading.ea}", "${theme.fonts.heading.latin}", sans-serif;
  --slidev-theme-font-body: "${theme.fonts.body.ea}", "${theme.fonts.body.latin}", sans-serif;
}

.slidev-layout {
  font-family: var(--slidev-theme-font-body);
  color: var(--slidev-theme-dark);
  background-color: var(--slidev-theme-light);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--slidev-theme-font-heading);
  color: var(--slidev-theme-primary);
}

a {
  color: var(--slidev-theme-secondary);
}

code {
  background-color: var(--slidev-theme-accent-3);
}
`;

  console.log(css);
  console.log("=".repeat(60));
}

// ==================== Main ====================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ 錯誤: 請提供 PPTX 檔案路徑");
    console.error("\n使用方法:");
    console.error(
      "  tsx scripts/test-pptx-parser.ts path/to/presentation.pptx",
    );
    process.exit(1);
  }

  const pptxPath = args[0];
  const filename = basename(pptxPath);

  try {
    console.log(`\n🚀 開始解析 PPTX: ${filename}`);

    // 讀取檔案
    const buffer = await readFile(pptxPath);
    console.log(`✅ 檔案大小: ${(buffer.length / 1024).toFixed(2)} KB`);

    // 提取主題
    const theme = await extractPPTXTheme(buffer);

    // 顯示結果
    displayTheme(theme, filename);
    generateSlidevThemePreview(theme);

    console.log("\n✅ 解析完成！");
  } catch (error) {
    console.error("\n❌ 解析失敗:", error);
    process.exit(1);
  }
}

main();
