<template>
  <div v-if="!isDismissed" class="navigation-hint">
    <span class="hint-text">
      💡 提示：點擊投影片或按空白鍵切換頁面 | 使用 ← → 方向鍵導航
    </span>
    <button @click="dismiss" class="close-btn" aria-label="關閉提示">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const isDismissed = ref(false);
const STORAGE_KEY = "aislidev-navigation-hint-dismissed";

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  isDismissed.value = stored === "true";
});

const dismiss = () => {
  isDismissed.value = true;
  localStorage.setItem(STORAGE_KEY, "true");
};
</script>

<style scoped>
.navigation-hint {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(24, 24, 27, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.hint-text {
  color: #e5e7eb;
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0 8px;
  margin-left: 16px;
  transition: color 0.2s ease, transform 0.2s ease;
}

.close-btn:hover {
  color: #fff;
  transform: scale(1.1);
}

.close-btn:active {
  transform: scale(0.95);
}
</style>
