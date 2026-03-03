<template>
  <div class="file-explorer">
    <div class="header">
      <h3>Presentations</h3>
      <n-button type="primary" size="small" @click="showTemplateModal = true">
        + New
      </n-button>
    </div>

    <div class="file-list">
      <n-spin :show="loading">
        <n-list v-if="presentations.length > 0" hoverable clickable>
          <n-list-item
            v-for="presentation in presentations"
            :key="presentation.id"
            :class="{ active: presentation.id === selectedId }"
            @click="selectPresentation(presentation.id)"
          >
            <template #prefix>
              <n-icon><DocumentTextOutline /></n-icon>
            </template>
            {{ presentation.title }}
          </n-list-item>
        </n-list>
        <n-empty v-else description="No presentations yet" size="small" />
      </n-spin>
    </div>

    <TemplateModal
      v-model:show="showTemplateModal"
      @created="onPresentationCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NButton, NList, NListItem, NIcon, NEmpty, NSpin } from "naive-ui";
import { DocumentTextOutline } from "@vicons/ionicons5";
import TemplateModal from "./TemplateModal.vue";

interface Presentation {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Emits {
  (e: "select", presentationId: string): void;
}

const emit = defineEmits<Emits>();

const presentations = ref<Presentation[]>([]);
const loading = ref(false);
const selectedId = ref<string | null>(null);
const showTemplateModal = ref(false);

const fetchPresentations = async () => {
  loading.value = true;
  try {
    const response = await fetch("/api/presentations");
    if (response.ok) {
      presentations.value = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch presentations:", error);
  } finally {
    loading.value = false;
  }
};

const selectPresentation = (id: string) => {
  selectedId.value = id;
  emit("select", id);
};

const onPresentationCreated = (id: string) => {
  fetchPresentations();
  selectPresentation(id);
};

onMounted(() => {
  fetchPresentations();
});
</script>

<style scoped>
.file-explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1e1e1e;
  color: #cccccc;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #2c2c2c;
}

.header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #cccccc;
}

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.file-list :deep(.n-list-item) {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-list :deep(.n-list-item:hover) {
  background-color: #2a2d2e;
}

.file-list :deep(.n-list-item.active) {
  background-color: #37373d;
}

.file-list :deep(.n-icon) {
  margin-right: 8px;
  color: #cccccc;
}
</style>
