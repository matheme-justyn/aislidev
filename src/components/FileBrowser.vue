<template>
  <div class="file-browser">
    <div v-if="loading" class="loading">
      <p>Loading files...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="files.length === 0" class="empty">
      <p>
        No {{ type === "presentations" ? "presentations" : "templates" }} found
      </p>
      <p class="hint">
        Place your .md files in:
        <code>data/{{ type }}/</code>
      </p>
    </div>

    <div v-else class="file-list">
      <div
        v-for="file in files"
        :key="file.name"
        class="file-item"
        @click="selectFile(file.name)"
      >
        <span class="file-icon">📄</span>
        <span class="file-name">{{ file.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
  type: "presentations" | "templates";
}

interface Emits {
  (e: "select", filename: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const files = ref<{ name: string; path: string }[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const loadFiles = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`/api/files/${props.type}`);

    if (!response.ok) {
      throw new Error(`Failed to load ${props.type}`);
    }

    const data = await response.json();
    files.value = data.files;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unknown error";
  } finally {
    loading.value = false;
  }
};

const selectFile = (filename: string) => {
  emit("select", filename);
};

onMounted(() => {
  loadFiles();
});
</script>

<style scoped>
.file-browser {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.loading,
.error,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666;
}

.error {
  color: #e74c3c;
}

.empty .hint {
  margin-top: 8px;
  font-size: 0.9rem;
}

.empty code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  color: #42b883;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover {
  background: #f5f5f5;
  border-color: #42b883;
}

.file-icon {
  font-size: 1.2rem;
}

.file-name {
  flex: 1;
  font-size: 0.95rem;
  color: #333;
}
</style>
