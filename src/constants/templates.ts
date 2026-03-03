export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const templates: PresentationTemplate[] = [
  {
    id: "slidev-official",
    name: "Slidev Official Example",
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
];
