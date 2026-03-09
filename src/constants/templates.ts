export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const templates: PresentationTemplate[] = [
  {
    id: "slidev-official",
    name: "Slidev Official",
    description: "Official starter from Slidev documentation",
    content: `---
theme: default
---

# Welcome to Slidev

Presentation slides for developers

---

## What is Slidev?

Slidev is a slides maker and presenter designed for developers.

- 📝 **Text-based** - focus on the content with Markdown
- 🎨 **Themable** - theme can be shared and used with npm packages
- 🧑‍💻 **Developer Friendly** - code highlighting, live coding with auto complete
- 🤹 **Interactive** - embedding Vue components
- 🎥 **Recording** - built-in recording and camera view

---

## Get Started

Create your first slide by editing this markdown file.

Learn more at [sli.dev](https://sli.dev)`,
  },
  {
    id: "simple-talk",
    name: "Simple Talk",
    description: "Minimal template for quick presentations",
    content: `---
theme: default
---

# Your Presentation Title

Your Name | Date

---

## Introduction

- Point 1
- Point 2
- Point 3

---

## Main Content

Write your main content here...

---

## Conclusion

Thank you!`,
  },
  {
    id: "guting-lightweight",
    name: "Guting Lightweight",
    description: "輕量版主題 - 4 種基礎佈局，適合快速簡報",
    content: `---
theme: ./slidev-themes/guting-lightweight
layout: cover
---

# 古亭簡報

簡報人員：姓名與職稱  
簡報單位：單位名稱  
簡報日期：日期

---
layout: default
---

# 大綱

- 專案背景
- 技術架構
- 實施計畫
- 預期效益

---
layout: default
---

# 您的內容

在此輸入您的簡報內容...
`,
  },
  {
    id: "guting-standard",
    name: "Guting Standard ⭐",
    description: "標準版主題 - 23 種專業佈局，適合正式簡報",
    content: `---
theme: ./slidev-themes/guting-standard
layout: cover-public
---

# 古亭簡報

::meta::
簡報人員：姓名與職稱  
簡報單位：單位名稱  
簡報日期：日期

---
layout: section-1
---

# 第一章
簡介與背景

---
layout: outline-1
---

::title::
# 大綱

- 專案背景
- 技術架構
- 實施計畫
- 預期效益

---
layout: default
---

::title::
# 您的內容

在此輸入您的簡報內容...

---
layout: end
---

# 謝謝聆聽

::contact::
聯絡資訊：email@example.com
`,
  },
  {
    id: "guting-classic",
    name: "Guting Classic",
    description: "經典設計版 - 23 種佈局，Arial 通用字型",
    content: `---
theme: ./slidev-themes/guting-classic
layout: cover-public
---

# 古亭簡報

::meta::
簡報人員：姓名與職稱  
簡報單位：單位名稱  
簡報日期：日期

---
layout: section-1
---

# 第一章
簡介與背景

---
layout: default
---

::title::
# 您的內容

在此輸入您的簡報內容...

---
layout: end
---

# 謝謝聆聽

::contact::
聯絡資訊：email@example.com
`,
  },
];
