<template>
  <div class="slidev-preview">
    <NavigationHint />
    <iframe
      v-if="previewUrl"
      :src="previewUrl"
      :key="iframeKey"
      class="preview-frame"
      frameborder="0"
      allow="fullscreen"
      @load="onLoad"
    ></iframe>
    
    <div v-else class="preview-placeholder">
      <p>{{ status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, defineExpose } from "vue";
import NavigationHint from "./NavigationHint.vue";

interface Props {
  presentationId: string;
}

const props = defineProps<Props>();

const previewUrl = ref<string | null>(null);
const slidevPort = ref<number | null>(null);
const status = ref("正在啟動簡報...");
const iframeKey = ref(0);
let statusCheckInterval: ReturnType<typeof setInterval> | null = null;

const checkStatus = async () => {
  if (!props.presentationId) {
    status.value = "未選擇簡報";
    return;
  }
  try {
    const response = await fetch(
      `/api/presentations/${props.presentationId}/status`,
    );
    const data = await response.json();

    if (data.port) {
      slidevPort.value = data.port;
      previewUrl.value = `/slidev/${data.port}/`;
      status.value = "簡報已就緒";
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
      }
    } else if (data.status === "starting") {
      status.value = "正在啟動 Slidev...";
    } else {
      status.value = "正在啟動簡報...";
      startPresentation();
    }
  } catch (error) {
    status.value = "狀態檢查錯誤";
  }
};

const startPresentation = async () => {
  if (!props.presentationId) {
    status.value = "未選擇簡報";
    return;
  }
  try {
    const response = await fetch(
      `/api/presentations/${props.presentationId}/start`,
      { method: "POST" },
    );
    const data = await response.json();
    
    if (data.port) {
      slidevPort.value = data.port;
      previewUrl.value = `/slidev/${data.port}/`;
      status.value = "簡報已就緒";
    }
  } catch (error) {
    status.value = "啟動簡報失敗";
  }
};

const onLoad = () => {
  status.value = "預覽已載入";
};

// Expose reload method to parent
const reload = () => {
  // Get current page from iframe
  try {
    const iframe = document.querySelector('.preview-frame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      // Try to get page from iframe's location hash
      const iframeUrl = iframe.contentWindow.location.href;
      const currentPage = iframeUrl.match(/#\/(\d+)/) || iframeUrl.match(/[?&]page=(\d+)/);
      
      // Reload iframe while preserving page
      iframeKey.value++;
      
      // Navigate to saved page after reload
      if (currentPage) {
        const pageNum = currentPage[1];
        setTimeout(() => {
          if (previewUrl.value) {
            previewUrl.value = `/slidev/${slidevPort.value}/#/${pageNum}`;
            // Force another key change to trigger navigation
            setTimeout(() => iframeKey.value++, 100);
          }
        }, 500);
      }
    } else {
      // Fallback: just reload
      iframeKey.value++;
    }
  } catch (error) {
    // Cross-origin or other error - just reload
    iframeKey.value++;
  }
};

defineExpose({ reload });

watch(
  () => props.presentationId,
  () => {
    previewUrl.value = null;
    checkStatus();
    statusCheckInterval = setInterval(checkStatus, 2000);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
});
</script>

<style scoped>
.slidev-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
  color: #888;
  font-size: 1rem;
}
</style>
