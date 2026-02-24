<template>
  <div class="slidev-preview">
    <iframe
      v-if="previewUrl"
      :src="previewUrl"
      class="preview-frame"
      frameborder="0"
      @load="onLoad"
    ></iframe>
    <div v-else class="preview-placeholder">
      <p>{{ status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

interface Props {
  presentationId: string;
}

const props = defineProps<Props>();

const previewUrl = ref<string | null>(null);
const status = ref("Initializing preview...");

let statusCheckInterval: ReturnType<typeof setInterval> | null = null;

const checkStatus = async () => {
  try {
    const response = await fetch(
      `/api/presentations/${props.presentationId}/status`,
    );
    const data = await response.json();

    if (data.status === "running" && data.port) {
      previewUrl.value = `http://localhost:${data.port}`;
      status.value = "Preview ready";
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
      }
    } else if (data.status === "starting") {
      status.value = "Starting Slidev...";
    } else {
      status.value = "Starting presentation...";
      startPresentation();
    }
  } catch (error) {
    status.value = "Error checking status";
  }
};

const startPresentation = async () => {
  try {
    const response = await fetch(
      `/api/presentations/${props.presentationId}/start`,
      { method: "POST" },
    );
    const data = await response.json();

    if (data.port) {
      previewUrl.value = `http://localhost:${data.port}`;
      status.value = "Preview ready";
    }
  } catch (error) {
    status.value = "Failed to start presentation";
  }
};

const onLoad = () => {
  status.value = "Preview loaded";
};

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
