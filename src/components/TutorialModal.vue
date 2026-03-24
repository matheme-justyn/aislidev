<template>
  <div
    v-if="isOpen"
    class="tutorial-modal-overlay"
    @click="handleOverlayClick"
  >
    <div class="tutorial-modal" @click.stop>
      <!-- Header -->
      <div class="tutorial-header">
        <h2>📚 使用教學</h2>
        <button class="close-button" @click="close" title="關閉">
          <span>✕</span>
        </button>
      </div>

      <!-- Description -->
      <div class="tutorial-description">
        <p>了解如何管理簡報檔案和自訂主題</p>
      </div>

      <!-- Section List -->
      <div class="tutorial-sections">
        <div
          v-for="section in sections"
          :key="section.id"
          class="section-card"
          @click="openDetail(section)"
        >
          <div class="section-icon">{{ section.icon }}</div>
          <div class="section-content">
            <h3>{{ section.title }}</h3>
            <p>{{ section.description }}</p>
          </div>
          <div class="section-arrow">→</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="tutorial-footer">
        <p>
          <strong>提示：</strong>點擊任一項目查看詳細說明和範例
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { tutorialSections, type TutorialSection } from '../client/data/tutorialContent';

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'open-detail', section: TutorialSection): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const sections = ref(tutorialSections);

function close() {
  emit('close');
}

function handleOverlayClick() {
  close();
}

function openDetail(section: TutorialSection) {
  emit('open-detail', section);
}
</script>

<style scoped>
.tutorial-modal-overlay {
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
  z-index: 1000;
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

.tutorial-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
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

.tutorial-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #e0e0e0;
}

.tutorial-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

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
}

.close-button:hover {
  background: #f5f5f5;
  color: #2c3e50;
}

.tutorial-description {
  padding: 16px 32px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.tutorial-description p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

.tutorial-sections {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.section-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.section-card:hover {
  border-color: #5d8aa8;
  background: #f8f9fa;
  transform: translateX(4px);
}

.section-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.section-content {
  flex: 1;
}

.section-content h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.section-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.section-arrow {
  font-size: 20px;
  color: #95a5a6;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.section-card:hover .section-arrow {
  transform: translateX(4px);
  color: #5d8aa8;
}

.tutorial-footer {
  padding: 16px 32px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.tutorial-footer p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.tutorial-footer strong {
  color: #2c3e50;
}

/* Scrollbar styling */
.tutorial-sections::-webkit-scrollbar {
  width: 8px;
}

.tutorial-sections::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tutorial-sections::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.tutorial-sections::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}
</style>
