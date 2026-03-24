<template>
  <div
    v-if="isOpen && section"
    class="tutorial-detail-overlay"
    @click="handleOverlayClick"
  >
    <div class="tutorial-detail" @click.stop>
      <!-- Header -->
      <div class="detail-header">
        <button class="back-button" @click="goBack" title="返回">
          <span>←</span>
        </button>
        <div class="header-content">
          <span class="header-icon">{{ section.icon }}</span>
          <h2>{{ section.title }}</h2>
        </div>
        <button class="close-button" @click="close" title="關閉">
          <span>✕</span>
        </button>
      </div>

      <!-- Content -->
      <div class="detail-content">
        <!-- Description -->
        <div class="detail-description">
          <p>{{ section.description }}</p>
        </div>

        <!-- Content Sections -->
        <div
          v-for="(contentSection, index) in section.content"
          :key="index"
          class="content-section"
        >
          <h3>{{ contentSection.subtitle }}</h3>
          <ul>
            <li
              v-for="(item, itemIndex) in contentSection.items"
              :key="itemIndex"
              v-html="item"
            ></li>
          </ul>
        </div>

        <!-- Example Code -->
        <div v-if="section.example" class="example-section">
          <h3>📋 {{ section.example.title }}</h3>
          <div class="code-block">
            <div class="code-header">
              <span class="code-language">{{ section.example.language }}</span>
              <button
                class="copy-button"
                @click="copyCode"
                :title="copyButtonText"
              >
                {{ copyButtonText }}
              </button>
            </div>
            <pre><code>{{ section.example.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { TutorialSection } from '../client/data/tutorialContent';

interface Props {
  isOpen: boolean;
  section: TutorialSection | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'back'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const copyButtonText = ref('複製');

function close() {
  emit('close');
}

function goBack() {
  emit('back');
}

function handleOverlayClick() {
  close();
}

async function copyCode() {
  if (!props.section?.example) return;

  try {
    await navigator.clipboard.writeText(props.section.example.code);
    copyButtonText.value = '已複製！';
    setTimeout(() => {
      copyButtonText.value = '複製';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy code:', err);
    copyButtonText.value = '複製失敗';
    setTimeout(() => {
      copyButtonText.value = '複製';
    }, 2000);
  }
}

// Reset copy button text when section changes
watch(() => props.section, () => {
  copyButtonText.value = '複製';
});
</script>

<style scoped>
.tutorial-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.tutorial-detail {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #e0e0e0;
  gap: 16px;
}

.back-button,
.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #95a5a6;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.back-button:hover,
.close-button:hover {
  background: #f5f5f5;
  color: #2c3e50;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
}

.header-content h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.detail-description {
  margin-bottom: 32px;
  padding: 16px;
  background: #f8f9fa;
  border-left: 4px solid #5d8aa8;
  border-radius: 8px;
}

.detail-description p {
  margin: 0;
  color: #555;
  font-size: 15px;
  line-height: 1.6;
}

.content-section {
  margin-bottom: 32px;
}

.content-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.content-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.content-section li {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #444;
  font-size: 14px;
  line-height: 1.6;
}

.content-section li:last-child {
  border-bottom: none;
}

.content-section li :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 13px;
  color: #e74c3c;
}

.content-section li :deep(strong) {
  color: #2c3e50;
  font-weight: 600;
}

.example-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid #e0e0e0;
}

.example-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.code-block {
  background: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1e1e1e;
  border-bottom: 1px solid #404040;
}

.code-language {
  font-size: 12px;
  color: #95a5a6;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.copy-button {
  background: none;
  border: 1px solid #555;
  color: #95a5a6;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background: #404040;
  color: white;
  border-color: #666;
}

.code-block pre {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #e8e8e8;
  white-space: pre;
}

/* Scrollbar styling */
.detail-content::-webkit-scrollbar {
  width: 8px;
}

.detail-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

.code-block pre::-webkit-scrollbar {
  height: 8px;
}

.code-block pre::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.code-block pre::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.code-block pre::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
