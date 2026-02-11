# Roo Code Setup Guide
<!-- Roo Code 設定指南 -->

## Purpose
<!-- 目的 -->

This guide helps you set up Roo Code for working on the AISliDev project.
<!-- 本指南幫助你設定 Roo Code 以在 AISliDev 專案上工作。 -->

---

## Prerequisites
<!-- 前置需求 -->

- VSCode installed
  <!-- 已安裝 VSCode -->
  
- Roo Code extension installed
  <!-- 已安裝 Roo Code 擴充功能 -->

---

## Setup Steps
<!-- 設定步驟 -->

### 1. Read Main Configuration
<!-- 1. 閱讀主要配置 -->

Start by reading [`AI.md`](../AI.md) in the project root. This is the tool-agnostic AI configuration that both Claude Code and Roo Code users follow.
<!-- 首先閱讀專案根目錄的 AI.md。這是 Claude Code 和 Roo Code 使用者都遵循的工具無關 AI 配置。 -->

Roo Code will automatically read this file when working on the project.
<!-- Roo Code 在專案工作時會自動讀取此檔案。 -->

### 2. Setup Custom Instructions
<!-- 2. 設定自訂指令 -->

Roo Code uses **Custom Instructions** instead of external memory files like Claude Code.
<!-- Roo Code 使用**自訂指令**而非像 Claude Code 那樣的外部 memory 檔案。 -->

#### A. Open Roo Code Settings
<!-- A. 開啟 Roo Code 設定 -->

1. Open Roo Code in VSCode
   <!-- 在 VSCode 中開啟 Roo Code -->

2. Click the settings icon (⚙️) in Roo Code panel
   <!-- 點擊 Roo Code 面板中的設定圖示 -->

3. Look for "Custom Instructions" or "User Instructions" section
   <!-- 尋找「自訂指令」或「使用者指令」區段 -->

#### B. Copy Template Content
<!-- B. 複製範本內容 -->

Open [`.roo/custom-instructions.md`](./custom-instructions.md) and copy the content.
<!-- 開啟 .roo/custom-instructions.md 並複製內容。 -->

Alternatively, you can use [`.ai/memory/MEMORY_TEMPLATE.md`](../.ai/memory/MEMORY_TEMPLATE.md) which has the same structure.
<!-- 或者，你可以使用 .ai/memory/MEMORY_TEMPLATE.md，它有相同的結構。 -->

#### C. Paste into Custom Instructions
<!-- C. 貼到自訂指令 -->

1. Paste the template into the Custom Instructions field in Roo Code settings
   <!-- 將範本貼到 Roo Code 設定中的自訂指令欄位 -->

2. **Customize** these sections for your personal workflow:
   <!-- 為你的個人工作流程**自訂**這些區段： -->
   
   - **Language preference**: Traditional Chinese (Taiwan) for conversations
     <!-- 語言偏好：對話用繁體中文（台灣） -->
   
   - **Communication style**: Direct/detailed, quick summaries, etc.
     <!-- 溝通風格：直接/詳細、快速摘要等 -->
   
   - **Your focus areas**: Frontend/backend/full-stack
     <!-- 你的關注領域：前端/後端/全端 -->
   
   - **Personal reminders**: Things you often forget
     <!-- 個人提醒：你經常忘記的事情 -->

3. Save the settings
   <!-- 儲存設定 -->

### 3. Understand Roo Code Features
<!-- 3. 理解 Roo Code 功能 -->

#### Extended Thinking (Built-in)
<!-- Extended Thinking（內建） -->

Roo Code has **built-in extended thinking** that shows reasoning process automatically.
<!-- Roo Code 有**內建的 extended thinking**，會自動顯示推理過程。 -->

**Where to see it**:
<!-- 在哪裡看到它： -->

- Thinking process appears in `