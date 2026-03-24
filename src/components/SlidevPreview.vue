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
import { ref, watch, onUnmounted, onMounted, defineExpose } from "vue";
import NavigationHint from "./NavigationHint.vue";
import { slidevBridge, type NavState } from "../lib/slidevBridge";

interface Props {
  presentationId: string;
}

const props = defineProps<Props>();

const previewUrl = ref<string | null>(null);
const slidevPort = ref<number | null>(null);
const status = ref("正在啟動簡報...");
const iframeKey = ref(0);
let statusCheckInterval: ReturnType<typeof setInterval> | null = null;
const currentSlideNo = ref<number>(1); // 追蹤當前頁碼

const checkStatus = async () => {
  if (!props.presentationId) {
    console.log("[Preview] No presentation ID");
    status.value = "未選擇簡報";
    return;
  }
  console.log(`[Preview] Checking status for: ${props.presentationId}`);
  try {
    const response = await fetch(
      `/api/presentations/${props.presentationId}/status`,
    );
    const data = await response.json();
    console.log("[Preview] Status response:", data);

    if (data.port) {
      slidevPort.value = data.port;
      previewUrl.value = `/slidev/${data.port}/`;
      console.log(`[Preview] Preview URL set: ${previewUrl.value}`);
      status.value = "簡報已就緒";
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
      }
    } else if (data.status === "starting") {
      status.value = "正在啟動 Slidev...";
    } else {
      status.value = "正在啟動簡報...";
      console.log("[Preview] Starting presentation...");
      startPresentation();
    }
  } catch (error) {
    console.error("[Preview] Status check error:", error);
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
      previewUrl.value = `http://localhost:${data.port}/`; // 直接訪問 Slidev (繞過 proxy)
      status.value = "簡報已就緒";
    }
  } catch (error) {
    status.value = "啟動簡報失敗";
  }
};

const onLoad = () => {
  status.value = "預覽已載入";
};

// 使用 postMessage 重新載入並保持頁碼
const reload = () => {
  // 保存當前頁碼
  const savedPageNo = currentSlideNo.value;

  // 重新載入 iframe
  iframeKey.value++;

  // 等待 iframe 載入後導航到保存的頁碼
  setTimeout(() => {
    if (savedPageNo > 1) {
      slidevBridge.navigate(savedPageNo);
    }
  }, 1000); // 給 Slidev 足夠的時間初始化
};

defineExpose({ reload });

// 附加 iframe 並訂閱導航狀態
onMounted(() => {
  // 訂閱導航狀態更新
  const unsubscribe = slidevBridge.onNavigation((navState: NavState) => {
    currentSlideNo.value = navState.no;
    console.log("[SlidevPreview] Navigation:", navState);
  });

  // 附加 iframe
  const iframe = document.querySelector(".preview-frame") as HTMLIFrameElement;
  if (iframe) {
    slidevBridge.attach(iframe);
  }

  // 清理
  onUnmounted(() => {
    unsubscribe();
  });
});

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
