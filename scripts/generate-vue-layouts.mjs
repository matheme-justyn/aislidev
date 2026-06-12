#!/usr/bin/env node

/**
 * 根據 PPTX 分析結果生成所有 Vue layout 檔案
 * 使用 Slidev 最佳實踐：具名 slots + props
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PPTX_PATH = path.join(
  __dirname,
  "../data/NICS資安院簡報公版範本檔(經典設計版)_1140731.pptx",
);
const OUTPUT_DIR = path.join(__dirname, "../data/themes/nics-theme/layouts");

// EMU 轉換為百分比
function emuToPercent(emu, isWidth = true) {
  const slideSize = isWidth ? 9144000 : 6858000;
  return ((emu / slideSize) * 100).toFixed(2);
}

// EMU 轉換為像素
function emuToPx(emu) {
  return Math.round((emu / 914400) * 96);
}

// 生成 placeholder 的 slot 名稱
function getSlotName(placeholder, index) {
  if (placeholder.type === "title") {
    return "default";
  }

  const names = ["subtitle", "content", "footer", "extra"];
  if (
    placeholder.idx !== undefined &&
    placeholder.idx >= 1 &&
    placeholder.idx <= names.length
  ) {
    return names[placeholder.idx - 1];
  }

  return `body-${index}`;
}

// 生成 Vue layout 檔案內容
function generateLayoutVue(layoutData) {
  const { name, images, shapes, placeholders } = layoutData;

  // 生成背景圖片層
  const bgLayers = images
    .map((img, idx) => {
      const imgNum = layoutData.num;
      const imgPath = `/layout-${imgNum}-image-${img.idx}.png`;

      return `    <!-- 背景圖片 ${img.idx} -->
    <div 
      class="bg-image-${img.idx}" 
      :style="{ backgroundImage: \`url(\${props.bgImage${img.idx} || '${imgPath}'})\` }"
    />`;
    })
    .join("\n");

  // 生成形狀層
  const shapeLayers = shapes
    .map((shape, idx) => {
      return `    <!-- 裝飾形狀 ${idx + 1} -->
    <div class="shape-${idx + 1}" />`;
    })
    .join("\n");

  // 生成 placeholder 內容區域
  const contentAreas = placeholders
    .map((ph, idx) => {
      const slotName = getSlotName(ph, idx);
      const className =
        slotName === "default" ? "title-area" : `${slotName}-area`;

      if (slotName === "default") {
        return `    <!-- 主標題區域 -->
    <div class="${className}" :class="props.class">
      <slot />
    </div>`;
      } else {
        return `    <!-- ${slotName} 區域 -->
    <div class="${className}" :class="props.class">
      <slot name="${slotName}" />
    </div>`;
      }
    })
    .join("\n");

  // 生成 CSS 樣式
  const bgStyles = images
    .map((img, idx) => {
      const left = emuToPx(img.x);
      const top = emuToPx(img.y);
      const width = emuToPx(img.cx);
      const height = emuToPx(img.cy);

      return `.bg-image-${img.idx} {
  position: absolute;
  left: ${left}px;
  top: ${top}px;
  width: ${width}px;
  height: ${height}px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}`;
    })
    .join("\n\n");

  const shapeStyles = shapes
    .map((shape, idx) => {
      const left = emuToPx(shape.x);
      const top = emuToPx(shape.y);
      const width = emuToPx(shape.cx);
      const height = emuToPx(shape.cy);
      const bgColor = shape.fillColor || "transparent";

      return `.shape-${idx + 1} {
  position: absolute;
  left: ${left}px;
  top: ${top}px;
  width: ${width}px;
  height: ${height}px;
  background-color: ${bgColor};
  pointer-events: none;
  z-index: 1;
}`;
    })
    .join("\n\n");

  const contentStyles = placeholders
    .map((ph, idx) => {
      const slotName = getSlotName(ph, idx);
      const className =
        slotName === "default" ? "title-area" : `${slotName}-area`;

      const left = emuToPercent(ph.x, true);
      const top = emuToPercent(ph.y, false);
      const width = emuToPercent(ph.cx, true);
      const height = emuToPercent(ph.cy, false);

      return `.${className} {
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${width}%;
  height: ${height}%;
  z-index: 2;
}`;
    })
    .join("\n\n");

  // 生成使用範例
  const usageExample = placeholders
    .filter((_, idx) => getSlotName(_, idx) !== "default")
    .map((ph, idx) => {
      const slotName = getSlotName(ph, idx + 1);
      return `  ::${slotName}::
  ${slotName} 內容`;
    })
    .join("\n\n");

  // 組合完整的 Vue 檔案
  return `<!--
  Layout: ${name}
  
  Usage:
  \`\`\`md
  ---
  layout: ${name.replace(/[()&]/g, "").replace(/\s+/g, "-").replace(/_/g, "-")}
  ---
  
  # 主標題
  
${usageExample}
  \`\`\`
-->

<script setup lang="ts">
const props = defineProps({
  class: { type: String },
  layoutClass: { type: String }
})
</script>

<template>
  <div class="slidev-layout nics-${name.replace(/[()&]/g, "").replace(/\s+/g, "-").replace(/_/g, "-")}" :class="props.layoutClass">
${bgLayers}
${shapeLayers ? "\n" + shapeLayers : ""}
${contentAreas}
  </div>
</template>

<style scoped>
.slidev-layout {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--slidev-theme-light, #ffffff);
}

${bgStyles}
${shapeStyles ? "\n" + shapeStyles : ""}
${contentStyles}
</style>
`;
}

// 主函數
async function main() {
  console.log("🔍 正在分析 PPTX 檔案...\n");

  const data = fs.readFileSync(PPTX_PATH);
  const zip = await JSZip.loadAsync(data);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true,
  });

  // 取得所有 slideLayout 檔案
  const layoutFiles = Object.keys(zip.files)
    .filter((name) => name.match(/^ppt\/slideLayouts\/slideLayout\d+\.xml$/))
    .sort();

  console.log(`找到 ${layoutFiles.length} 個 layout\n`);

  let successCount = 0;

  for (const layoutFile of layoutFiles) {
    const layoutXML = await zip.file(layoutFile).async("text");
    const layoutData = parser.parse(layoutXML);

    const cSld = layoutData["p:sldLayout"]["p:cSld"];
    const layoutName = cSld["@_name"];
    const layoutNum = parseInt(layoutFile.match(/slideLayout(\d+)\.xml/)[1]);

    const spTree = cSld["p:spTree"];

    // 收集所有元素
    const images = [];
    const shapes = [];
    const placeholders = [];

    // 處理圖片
    if (spTree["p:pic"]) {
      const pics = Array.isArray(spTree["p:pic"])
        ? spTree["p:pic"]
        : [spTree["p:pic"]];
      pics.forEach((pic, idx) => {
        const spPr = pic["p:spPr"];
        if (spPr?.["a:xfrm"]) {
          const xfrm = spPr["a:xfrm"];
          const off = xfrm["a:off"];
          const ext = xfrm["a:ext"];

          images.push({
            idx: idx + 1,
            x: off?.["@_x"] || 0,
            y: off?.["@_y"] || 0,
            cx: ext?.["@_cx"] || 0,
            cy: ext?.["@_cy"] || 0,
          });
        }
      });
    }

    // 處理形狀（包含 placeholder）
    if (spTree["p:sp"]) {
      const sps = Array.isArray(spTree["p:sp"])
        ? spTree["p:sp"]
        : [spTree["p:sp"]];
      sps.forEach((sp) => {
        const nvSpPr = sp["p:nvSpPr"];
        const spPr = sp["p:spPr"];
        const txBody = sp["p:txBody"];
        const ph = nvSpPr?.["p:nvPr"]?.["p:ph"];

        if (spPr?.["a:xfrm"]) {
          const xfrm = spPr["a:xfrm"];
          const off = xfrm["a:off"];
          const ext = xfrm["a:ext"];

          const shapeData = {
            x: off?.["@_x"] || 0,
            y: off?.["@_y"] || 0,
            cx: ext?.["@_cx"] || 0,
            cy: ext?.["@_cy"] || 0,
          };

          // 如果是 placeholder
          if (ph && txBody) {
            placeholders.push({
              type: ph["@_type"] || "body",
              idx: ph["@_idx"],
              ...shapeData,
            });
          } else if (!txBody) {
            // 純形狀（無文字）
            let fillColor = null;
            if (spPr["a:solidFill"]) {
              const solidFill = spPr["a:solidFill"];
              if (solidFill["a:srgbClr"]) {
                fillColor = "#" + solidFill["a:srgbClr"]["@_val"];
              } else if (solidFill["a:schemeClr"]) {
                const schemeClr = solidFill["a:schemeClr"]["@_val"];
                const colorMap = {
                  accent1: "#93CFBF",
                  accent2: "#C2C823",
                  dk1: "#242424",
                  lt1: "#FFFFFF",
                };
                fillColor = colorMap[schemeClr] || null;
              }
            }

            if (fillColor) {
              shapes.push({
                ...shapeData,
                fillColor,
              });
            }
          }
        }
      });
    }

    // 排序 placeholders
    placeholders.sort((a, b) => {
      if (a.type === "title" && b.type !== "title") return -1;
      if (a.type !== "title" && b.type === "title") return 1;
      if (a.idx === undefined) return 1;
      if (b.idx === undefined) return -1;
      return a.idx - b.idx;
    });

    const layoutInfo = {
      num: layoutNum,
      name: layoutName,
      images,
      shapes,
      placeholders,
    };

    // 生成 Vue 檔案
    const vueContent = generateLayoutVue(layoutInfo);

    // 檔案名稱（移除特殊字元）
    const fileName =
      layoutName.replace(/[()&]/g, "").replace(/\s+/g, "-").replace(/_/g, "-") +
      ".vue";

    const outputPath = path.join(OUTPUT_DIR, fileName);

    fs.writeFileSync(outputPath, vueContent, "utf-8");

    console.log(`✅ ${fileName}`);
    console.log(
      `   - ${images.length} 張圖片, ${shapes.length} 個形狀, ${placeholders.length} 個內容區域`,
    );

    successCount++;
  }

  console.log(`\n🎉 完成！成功生成 ${successCount} 個 layout 檔案`);
  console.log(`📁 輸出目錄: ${OUTPUT_DIR}`);
}

main().catch(console.error);
