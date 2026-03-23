---
theme: seriph
background: https://images.unsplash.com/photo-1506905925346-21bda4d32df4
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Seriph Theme Template
  Elegant presentation template with Seriph theme.
drawings:
  persist: false
transition: slide-left
title: Presentation Title
mdc: true
---

# Presentation Title

Your Subtitle Here

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub" title="Open in GitHub"
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

# What is Slidev?

Slidev is a slides maker and presenter designed for developers.

- 📝 **Text-based** - focus on the content with Markdown
- 🎨 **Themeable** - theme can be shared and used with npm packages
- 🧑‍💻 **Developer Friendly** - code highlighting, live coding with autocompletion
- 🤹 **Interactive** - embedding Vue components to enhance your expressions
- 🎥 **Recording** - built-in recording and camera view
- 📤 **Portable** - export into PDF, PNGs, or even a hostable SPA
- 🛠 **Hackable** - anything possible on a webpage

<br>
<br>

Read more about [Why Slidev?](https://sli.dev/guide/why)

---
layout: two-cols
layoutClass: gap-16
---

# Left Column

This is the left column content.

You can add:
- Bullet points
- **Bold text**
- *Italic text*
- `Code snippets`

::right::

# Right Column

This is the right column content.

```ts
// TypeScript code example
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'John',
  age: 30
}
```

---
layout: center
class: text-center
---

# Learn More

[Documentation](https://sli.dev) · [GitHub](https://github.com/slidevjs/slidev) · [Showcases](https://sli.dev/showcases.html)
