#!/usr/bin/env tsx
/**
 * PPTX Slide Master Analyzer
 *
 * 深入分析 PPTX 母片 (Slide Master) 的完整設計設定
 */

import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { readFile, writeFile } from "fs/promises";
import { basename } from "path";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: false,
});

interface LayoutInfo {
  name: string;
  type: string;
  hasBackground: boolean;
  backgroundType?: "color" | "image" | "gradient";
}

async function analyzePPTX(pptxPath: string) {
  const buffer = await readFile(pptxPath);
  const zip = await JSZip.loadAsync(buffer);

  console.log("\n" + "=".repeat(80));
  console.log(`📊 PPTX 母片分析: ${basename(pptxPath)}`);
  console.log("=".repeat(80));

  const themeXml = await zip.file("ppt/theme/theme1.xml")?.async("string");
  const themeData = parser.parse(themeXml!);

  console.log("\n🎨 主題顏色方案:");
  const clrScheme = themeData["a:theme"]["a:themeElements"]["a:clrScheme"];
  const themeName = themeData["a:theme"]["@_name"];
  console.log(`  主題名稱: ${themeName}`);

  const colors = {
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

  console.log(`  Accent 1: ${colors.accent1}`);
  console.log(`  Accent 2: ${colors.accent2}`);
  console.log(`  Accent 3: ${colors.accent3}`);
  console.log(`  Accent 4: ${colors.accent4}`);
  console.log(`  Accent 5: ${colors.accent5}`);
  console.log(`  Accent 6: ${colors.accent6}`);
  console.log(`  Dark 1:   ${colors.dk1}`);
  console.log(`  Dark 2:   ${colors.dk2}`);
  console.log(`  Light 1:  ${colors.lt1}`);
  console.log(`  Light 2:  ${colors.lt2}`);

  const masterXml = await zip
    .file("ppt/slideMasters/slideMaster1.xml")
    ?.async("string");
  const masterData = parser.parse(masterXml!);

  console.log("\n📐 母片 (Slide Master) 設定:");

  const cSld = masterData["p:sldMaster"]["p:cSld"];
  const masterName = cSld["@_name"];
  console.log(`  母片名稱: ${masterName}`);

  const bg = cSld["p:bg"];
  if (bg) {
    console.log("\n  🖼️  母片背景:");
    const bgPr = bg["p:bgPr"];

    if (bgPr) {
      if (bgPr["a:solidFill"]) {
        const bgColor = extractColorWithScheme(bgPr["a:solidFill"], colors);
        console.log(`    類型: 純色背景`);
        console.log(`    顏色: ${bgColor}`);
      }

      if (bgPr["a:gradFill"]) {
        console.log(`    類型: 漸層背景`);
        const gradFill = bgPr["a:gradFill"];
        console.log(
          `    漸層類型: ${gradFill["a:lin"] ? "線性" : gradFill["a:path"] ? "路徑" : "未知"}`,
        );

        const gsLst = gradFill["a:gsLst"];
        if (gsLst && gsLst["a:gs"]) {
          const stops = Array.isArray(gsLst["a:gs"])
            ? gsLst["a:gs"]
            : [gsLst["a:gs"]];
          console.log(`    漸層站點數: ${stops.length}`);
          stops.forEach((stop: any, i: number) => {
            const pos = stop["@_pos"];
            const color = extractColorWithScheme(stop, colors);
            console.log(`      站點 ${i + 1}: 位置 ${pos}% - 顏色 ${color}`);
          });
        }
      }

      if (bgPr["a:blipFill"]) {
        console.log(`    類型: 圖片背景`);
        const blip = bgPr["a:blipFill"]["a:blip"];
        const rId = blip?.["@_r:embed"] || blip?.["@_r:link"];
        console.log(`    關係 ID: ${rId}`);

        if (rId) {
          const relsXml = await zip
            .file("ppt/slideMasters/_rels/slideMaster1.xml.rels")
            ?.async("string");
          if (relsXml) {
            const relsData = parser.parse(relsXml);
            const relationships = relsData["Relationships"]["Relationship"];
            const rels = Array.isArray(relationships)
              ? relationships
              : [relationships];
            const imageRel = rels.find((r: any) => r["@_Id"] === rId);
            if (imageRel) {
              const imagePath = imageRel["@_Target"];
              console.log(`    圖片路徑: ${imagePath}`);

              const imageFile = zip.file(`ppt/slideMasters/${imagePath}`);
              if (imageFile) {
                const imageBuffer = await imageFile.async("nodebuffer");
                console.log(
                  `    圖片大小: ${(imageBuffer.length / 1024).toFixed(2)} KB`,
                );
              }
            }
          }
        }
      }
    }
  }

  console.log("\n📄 版面配置 (Slide Layouts):");
  const layoutFiles = Object.keys(zip.files)
    .filter(
      (name) =>
        name.startsWith("ppt/slideLayouts/slideLayout") &&
        name.endsWith(".xml"),
    )
    .sort();

  console.log(`  總共 ${layoutFiles.length} 個版面配置\n`);

  const layouts: LayoutInfo[] = [];

  for (const layoutFile of layoutFiles) {
    const layoutXml = await zip.file(layoutFile)?.async("string");
    if (!layoutXml) continue;

    const layoutData = parser.parse(layoutXml);
    const layoutCSld = layoutData["p:sldLayout"]["p:cSld"];
    const layoutName = layoutCSld["@_name"];
    const layoutType = layoutData["p:sldLayout"]["@_type"] || "custom";

    const layoutBg = layoutCSld["p:bg"];
    let hasBackground = false;
    let backgroundType: "color" | "image" | "gradient" | undefined;

    if (layoutBg && layoutBg["p:bgPr"]) {
      hasBackground = true;
      const bgPr = layoutBg["p:bgPr"];
      if (bgPr["a:solidFill"]) backgroundType = "color";
      else if (bgPr["a:gradFill"]) backgroundType = "gradient";
      else if (bgPr["a:blipFill"]) backgroundType = "image";
    }

    layouts.push({
      name: layoutName,
      type: layoutType,
      hasBackground,
      backgroundType,
    });

    const bgInfo = hasBackground ? `[${backgroundType}]` : "";
    console.log(
      `  ${layoutFiles.indexOf(layoutFile) + 1}. ${layoutName} (${layoutType}) ${bgInfo}`,
    );
  }

  console.log("\n🔤 字型方案:");
  const fontScheme = themeData["a:theme"]["a:themeElements"]["a:fontScheme"];
  const fontSchemeName = fontScheme["@_name"];
  console.log(`  字型方案名稱: ${fontSchemeName}`);

  const majorFont = fontScheme["a:majorFont"];
  const minorFont = fontScheme["a:minorFont"];

  console.log(`  標題字型 (Major):`);
  console.log(`    拉丁字元: ${majorFont["a:latin"]["@_typeface"]}`);
  console.log(`    東亞字元: ${majorFont["a:ea"]["@_typeface"]}`);

  console.log(`  內文字型 (Minor):`);
  console.log(`    拉丁字元: ${minorFont["a:latin"]["@_typeface"]}`);
  console.log(`    東亞字元: ${minorFont["a:ea"]["@_typeface"]}`);

  console.log("\n💾 匯出詳細資料到 JSON...");
  const exportData = {
    theme: {
      name: themeName,
      colors,
    },
    master: {
      name: masterName,
      background: bg ? "yes" : "no",
    },
    layouts: layouts,
    fonts: {
      schemeName: fontSchemeName,
      heading: {
        latin: majorFont["a:latin"]["@_typeface"],
        ea: majorFont["a:ea"]["@_typeface"],
      },
      body: {
        latin: minorFont["a:latin"]["@_typeface"],
        ea: minorFont["a:ea"]["@_typeface"],
      },
    },
  };

  const outputPath = "data/pptx-analysis.json";
  await writeFile(outputPath, JSON.stringify(exportData, null, 2));
  console.log(`✅ 已匯出到: ${outputPath}`);

  console.log("\n" + "=".repeat(80));
  console.log("✅ 分析完成！");
  console.log("=".repeat(80) + "\n");
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

function extractColorWithScheme(node: any, colors: any): string {
  const colorNodes = [
    node["a:srgbClr"],
    node["a:sysClr"],
    node["a:schemeClr"],
  ].filter(Boolean);

  if (colorNodes.length === 0) return "#000000";

  const colorNode = colorNodes[0];

  if (node["a:srgbClr"]) {
    const val = node["a:srgbClr"]["@_val"];
    return `#${val}`;
  }

  if (node["a:sysClr"]) {
    const lastClr = node["a:sysClr"]["@_lastClr"];
    if (lastClr) return `#${lastClr}`;
  }

  if (node["a:schemeClr"]) {
    const schemeVal = node["a:schemeClr"]["@_val"];
    const colorKey = schemeVal
      .replace("accent", "accent")
      .replace("dk", "dk")
      .replace("lt", "lt");
    const resolvedColor = colors[colorKey] || `scheme:${schemeVal}`;

    if (resolvedColor.startsWith("#")) {
      return resolvedColor;
    }
    return `scheme:${schemeVal}`;
  }

  return "#000000";
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ 使用方法: tsx scripts/analyze-pptx-master.ts <pptx-file>");
  process.exit(1);
}

analyzePPTX(args[0]);
