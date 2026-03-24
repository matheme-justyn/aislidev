---
theme: "@slidev/theme-default"
background: https://images.unsplash.com/photo-1517694712202-14dd9538aa97
layout: cover
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
title: 我的簡報標題
info: |
  ## 簡報說明
  在此描述您的簡報內容
---

# 我的簡報標題

副標題或說明文字

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    按空白鍵進入下一頁 <carbon:arrow-right class="inline"/>
  </span>
</div>

---

## layout: default

# 目錄

<Toc minDepth="1" maxDepth="2"></Toc>

---

## layout: section

# 第一章節

---

# 投影片標題

使用 Markdown 語法撰寫內容：

- 第一點
- 第二點
- 第三點

```ts
// 程式碼範例
console.log("Hello, Slidev!");
```

---

# 結尾

謝謝觀看！

<style>
.slidev-layout {
  padding: 2rem;
}
</style>
