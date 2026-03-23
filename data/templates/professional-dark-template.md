---
theme: default
background: https://images.unsplash.com/photo-1506905925346-21bda4d32df4
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Professional Presentation
mdc: true
colorSchema: dark
---

<style>
:root {
  --slidev-theme-primary: #5d8aa8;
  --slidev-theme-accents-blue: #5d8aa8;
}
</style>

# Professional Presentation

Elegant slides for business and technical presentations

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Start Presentation <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

---
layout: default
---

# Table of Contents

<Toc maxDepth="1"></Toc>

---
transition: fade-out
---

# Introduction

## Welcome to Our Presentation

This template features:

<v-clicks>

- 📊 **Professional styling** with dark theme
- 🎨 **Custom color scheme** using CSS variables
- 💼 **Business-focused** layouts and content
- 🔢 **Line numbers** for code examples
- 🎯 **Smooth transitions** between slides

</v-clicks>

<br>

> Perfect for corporate presentations, technical talks, and business pitches.

---
layout: two-cols
layoutClass: gap-16
---

# Key Features

<v-clicks>

- Clean, professional design
- Dark theme for better contrast
- Multiple layout options
- Code syntax highlighting
- Interactive components
- Export to PDF/PPTX

</v-clicks>

::right::

# Technical Stack

```typescript {all|1-3|5-8|10-12}
// Modern development workflow
import { defineComponent } from 'vue'
import { useSlides } from '@slidev/client'

// Type-safe components
interface SlideProps {
  title: string
  content: string
}

// Reactive presentations
export default defineComponent({
  name: 'ProfessionalSlide'
})
```

---
layout: center
class: text-center
---

# Data Visualization

<div class="grid grid-cols-2 gap-8 mt-8">
  <div>
    <h3>Q1 Results</h3>
    <div class="text-6xl font-bold text-blue-400">+42%</div>
    <p class="text-gray-400">Growth YoY</p>
  </div>
  <div>
    <h3>Q2 Projection</h3>
    <div class="text-6xl font-bold text-green-400">+58%</div>
    <p class="text-gray-400">Expected Growth</p>
  </div>
</div>

---
layout: quote
---

# "Design is not just what it looks like and feels like. Design is how it works."

— Steve Jobs

---
layout: center
class: text-center
---

# Thank You

Questions and Discussion

[Documentation](https://sli.dev) · [GitHub](https://github.com/slidevjs/slidev)
