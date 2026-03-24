<template>
  <div class="file-browser">
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="items.length === 0" class="empty">
      <p>
        No {{ type === "presentations" ? "presentations" : "themes" }} found
      </p>
      <p class="hint">
        Place your
        {{
          type === "presentations"
            ? "presentation directories"
            : "theme directories"
        }}
        in:
        <code>data/{{ type === "presentations" ? "slides" : "themes" }}/</code>
      </p>
      <p class="hint" v-if="type === 'presentations'">
        Each presentation should be a directory containing
        <code>slides.md</code>
      </p>
    </div>

    <div v-else class="file-list">
      <div
        v-for="item in items"
        :key="item.id"
        class="file-item"
        :class="{ invalid: !item.valid, disabled: !item.valid }"
        @click="item.valid && selectItem(item.id)"
      >
        <span class="file-icon">{{ item.valid ? "📁" : "❌" }}</span>
        <div class="file-info">
          <span class="file-name">{{ item.name }}</span>
          <div v-if="!item.valid && item.errors" class="file-errors">
            <span class="error-badge">Invalid</span>
            <ul class="error-list">
              <li v-for="(err, idx) in item.errors" :key="idx">{{ err }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
  type: "presentations" | "themes";
}

interface Emits {
  (e: "select", id: string): void;
}

interface ItemInfo {
  id: string;
  name: string;
  path: string;
  valid: boolean;
  errors?: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const items = ref<ItemInfo[]>([]);
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

    if (props.type === "presentations") {
      items.value = data.presentations || [];
    } else {
      items.value = (data.themes || []).map((theme: any) => ({
        id: theme.id,
        name: theme.name,
        path: theme.themePath,
        valid: true,
      }));
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unknown error";
  } finally {
    loading.value = false;
  }
};

const selectItem = (id: string) => {
  emit("select", id);
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
  text-align: center;
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
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover:not(.disabled) {
  background: #f5f5f5;
  border-color: #42b883;
}

.file-item.invalid {
  border-color: #ffebee;
  background: #fff8f8;
}

.file-item.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.file-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-name {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.file-errors {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #ffebee;
  color: #c62828;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  align-self: flex-start;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  color: #d32f2f;
}

.error-list li {
  padding-left: 12px;
  position: relative;
  margin-bottom: 2px;
}

.error-list li::before {
  content: "•";
  position: absolute;
  left: 0;
}
</style>
