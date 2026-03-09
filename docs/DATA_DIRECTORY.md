# Data Directory Structure

AISlidev stores your presentations and templates in the `data/` directory.

## 📁 Directory Structure

```
data/
├── presentations/      # Your presentation files
│   ├── example-1.md
│   ├── example-2.md
│   └── my-slides.md
└── templates/          # Template files
    ├── seriph-template.md
    ├── apple-basic-template.md
    └── custom-template.md
```

## 📝 How to Use

### 1. Open Presentation (📁 Open Button)

Click the "📁 Open" button to browse and open presentations from `data/presentations/`.

**To add a presentation:**

1. Place your `.md` file in `data/presentations/`
2. Click "📁 Open" in the editor
3. Select your file from the list

### 2. Load Template (🎨 Template Button)

Click the "🎨 Template" button to load a template from `data/templates/`.

**To add a template:**

1. Place your Slidev template `.md` file in `data/templates/`
2. Click "🎨 Template" in the editor
3. Select your template from the list

## ✅ Valid Slidev Format

All files must have Slidev frontmatter at the beginning:

```markdown
---
theme: default
background: https://cover.sli.dev
---

# Your First Slide

Content here...

---

# Second Slide

More content...
```

**Required:**

- File must start with `---`
- Frontmatter block (YAML format)
- End frontmatter with `---`

## 🎨 Example Template Files

### Seriph Theme Template

Create `data/templates/seriph-template.md`:

```markdown
---
theme: seriph
background: https://cover.sli.dev
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
---

# Welcome to Slidev

Presentation slides for developers

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---

# What is Slidev?

Slidev is a slides maker and presenter designed for developers...

---

# Features

- 📝 **Text-based** - Focus on content with Markdown
- 🎨 **Themable** - Theme can be shared and used with npm packages
- 🧑‍💻 **Developer Friendly** - Code highlighting, live coding
- 🤹 **Interactive** - Embed Vue components
- 🎥 **Recording** - Built-in recording and camera view
```

### Apple Basic Theme Template

Create `data/templates/apple-basic-template.md`:

```markdown
---
theme: apple-basic
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
---

# Presentation Title

Subtitle or tagline

---

# Agenda

- Introduction
- Main Content
- Conclusion
- Q&A

---

# Introduction

Your introduction content here...
```

## 🐳 Container Volume Mapping

When running AISlidev in a container, map the `data/` directory:

```bash
# Podman
podman run -d \
  -p 13000:13000 \
  -v ./data:/app/data:Z \
  aislidev

# Docker
docker run -d \
  -p 13000:13000 \
  -v ./data:/app/data \
  aislidev
```

This allows you to:

- Persist your presentations and templates
- Edit files directly on your host system
- Share files between container restarts
