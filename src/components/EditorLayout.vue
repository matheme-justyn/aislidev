<template>
  <div class="editor-layout">
    <div class="toolbar">
      <div class="toolbar-left">
        <n-button
          size="small"
          type="tertiary"
          @click="showFileExplorer = true"
          class="toolbar-btn"
        >
          📁 Open
        </n-button>
        <n-button
          size="small"
          type="tertiary"
          @click="showTemplateBrowser = true"
          class="toolbar-btn"
        >
          🎨 Template
        </n-button>
        <n-button
          size="small"
          :type="saveStatus === 'saving' ? 'primary' : 'tertiary'"
          @click="manualSave"
          class="toolbar-btn"
          :loading="saveStatus === 'saving'"
        >
          💾 {{ saveButtonText }} MD
        </n-button>
        <n-button
          size="small"
          type="tertiary"
          @click="showSettings = true"
          class="toolbar-btn"
        >
          ⚙️ Settings
        </n-button>
      </div>
      <div class="toolbar-right">
        <n-button
          size="small"
          type="tertiary"
          @click="exportPPTX"
          class="toolbar-btn"
          :loading="exportStatus === 'exporting'"
        >
          📊 {{ exportButtonText }} PPTX
        </n-button>
        <n-button
          size="small"
          type="tertiary"
          @click="manualRefresh"
          class="toolbar-btn"
          title="Refresh preview"
        >
          🔄 Refresh
        </n-button>
      </div>
    </div>
    <Splitpanes>
      <Pane :size="50" class="editor-pane">
        <CodeMirrorEditor
          v-model="localContent"
          @update:modelValue="onContentChange"
        />
      </Pane>
      <Pane :size="50" class="preview-pane">
        <SlidevPreview ref="previewRef" :presentation-id="presentationId" />
      </Pane>
    </Splitpanes>

    <!-- Open Presentation Modal -->
    <n-modal
      v-model:show="showFileExplorer"
      preset="card"
      title="Open Presentation"
      style="width: 500px"
      :mask-closable="true"
    >
      <FileBrowser type="presentations" @select="onPresentationSelect" />
    </n-modal>

    <!-- Template Browser Modal -->
    <n-modal
      v-model:show="showTemplateBrowser"
      preset="card"
      title="Select Template"
      style="width: 500px"
      :mask-closable="true"
    >
      <FileBrowser type="templates" @select="onTemplateSelect" />
    </n-modal>

    <!-- Settings Modal -->
    <n-modal
      v-model:show="showSettings"
      preset="card"
      title="Settings"
      style="width: 400px"
      :mask-closable="true"
    >
      <div class="settings-content">
        <div class="setting-item">
          <label>Auto-save interval (minutes)</label>
          <n-input-number
            v-model:value="autoSaveInterval"
            :min="1"
            :max="60"
            :step="1"
            style="width: 100%"
          />
          <p class="setting-hint">
            Current: Save every {{ autoSaveInterval }} minute(s)
          </p>
        </div>
      </div>
      <template #footer>
        <div class="modal-footer">
          <n-button @click="showSettings = false">Cancel</n-button>
          <n-button type="primary" @click="saveSettings">Save</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { NButton, NModal, NInputNumber, useMessage } from "naive-ui";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import CodeMirrorEditor from "./CodeMirrorEditor.vue";
import SlidevPreview from "./SlidevPreview.vue";
import FileBrowser from "./FileBrowser.vue";

interface Props {
  presentationId: string;
  content: string;
}

interface Emits {
  (e: "update:content", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const message = useMessage();

const showFileExplorer = ref(false);
const showTemplateBrowser = ref(false);
const showSettings = ref(false);
const previewRef = ref();
const localContent = ref(props.content);

// Auto-save state
const autoSaveInterval = ref(3); // minutes
const saveStatus = ref<"idle" | "saving" | "saved">("idle");
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

// Export PPTX state
const exportStatus = ref<"idle" | "exporting" | "exported">("idle");

const saveButtonText = computed(() => {
  switch (saveStatus.value) {
    case "saving":
      return "Saving";
    case "saved":
      return "Saved";
    default:
      return "Save";
  }
});

const exportButtonText = computed(() => {
  switch (exportStatus.value) {
    case "exporting":
      return "Exporting";
    case "exported":
      return "Exported";
    default:
      return "Export";
  }
});

// Open presentation from server
const onPresentationSelect = async (filename: string) => {
  try {
    const response = await fetch(`/api/files/presentations/${filename}`);
    
    if (!response.ok) {
      throw new Error('Failed to load presentation');
    }
    
    const data = await response.json();
    
    // Load the presentation content
    localContent.value = data.content;
    emit('update:content', data.content);
    message.success(`Presentation opened: ${filename}`);
    
    // Close modal
    showFileExplorer.value = false;
    
    // Auto-reload preview
    setTimeout(() => {
      previewRef.value?.reload();
    }, 500);
  } catch (error) {
    console.error('Failed to load presentation:', error);
    message.error('Failed to load presentation');
  }
};

// Select template from server
const onTemplateSelect = async (filename: string) => {
  try {
    const response = await fetch(`/api/files/templates/${filename}`);
    
    if (!response.ok) {
      throw new Error('Failed to load template');
    }
    
    const data = await response.json();
    
    // Validate Slidev format
    const frontmatterRegex = /^---\n[\s\S]*?\n---/;
    if (!frontmatterRegex.test(data.content)) {
      message.error('Invalid Slidev template: Missing frontmatter');
      return;
    }
    
    // Load the template content
    localContent.value = data.content;
    emit('update:content', data.content);
    message.success(`Template loaded: ${filename}`);
    
    // Close modal
    showTemplateBrowser.value = false;
    
    // Auto-reload preview
    setTimeout(() => {
      previewRef.value?.reload();
    }, 500);
  } catch (error) {
    console.error('Failed to load template:', error);
    message.error('Failed to load template');
  }
};

const onContentChange = (newContent: string) => {
  localContent.value = newContent;
  emit("update:content", newContent);

  // Reset auto-save timer
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Schedule auto-save
  saveTimeout = setTimeout(
    async () => {
      await performSave();
    },
    autoSaveInterval.value * 60 * 1000,
  );

  // Show unsaved indicator
  if (saveStatus.value === "saved") {
    saveStatus.value = "idle";
  }
};

const performSave = async () => {
  if (!props.presentationId) return;

  saveStatus.value = "saving";

  try {
    const response = await fetch(`/api/presentations/${props.presentationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: localContent.value }),
    });

    if (response.ok) {
      saveStatus.value = "saved";

      // Wait for Slidev to detect file change, then reload iframe
      setTimeout(() => {
        previewRef.value?.reload();
      }, 1500);

      // Reset to idle after 2 seconds
      setTimeout(() => {
        if (saveStatus.value === "saved") {
          saveStatus.value = "idle";
        }
      }, 2000);
    } else {
      throw new Error("Save failed");
    }
  } catch (error) {
    console.error("Failed to save content:", error);
    message.error("Failed to save");
    saveStatus.value = "idle";
  }
};

const manualSave = async () => {
  if (saveStatus.value === "saving") return;
  await performSave();
};

const manualRefresh = () => {
  previewRef.value?.reload();
  message.info("Preview refreshed");
};

const exportPPTX = async () => {
  if (exportStatus.value === "exporting") return;
  if (!props.presentationId) {
    message.error("No presentation selected");
    return;
  }

  exportStatus.value = "exporting";
  message.info("Exporting to PPTX...");

  try {
    const response = await fetch(`/api/presentations/${props.presentationId}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // Download the PPTX file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${props.presentationId}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      exportStatus.value = "exported";
      message.success("PPTX exported successfully");

      // Reset status after 2 seconds
      setTimeout(() => {
        exportStatus.value = "idle";
      }, 2000);
    } else {
      throw new Error("Export failed");
    }
  } catch (error) {
    console.error("Failed to export PPTX:", error);
    message.error("Failed to export PPTX");
    exportStatus.value = "idle";
  }
};


const saveSettings = () => {
  // Save to localStorage
  localStorage.setItem(
    "aislidev-autosave-interval",
    autoSaveInterval.value.toString(),
  );

  // Restart auto-save timer
  startAutoSaveTimer();

  message.success("Settings saved");
  showSettings.value = false;
};

const startAutoSaveTimer = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }

  // Set up periodic auto-save
  autoSaveTimer = setInterval(
    async () => {
      if (saveStatus.value !== "saving") {
        await performSave();
      }
    },
    autoSaveInterval.value * 60 * 1000,
  );
};

watch(
  () => props.content,
  (newContent) => {
    if (newContent !== localContent.value) {
      localContent.value = newContent;
    }
  },
);


// Load settings on mount
onMounted(() => {
  const saved = localStorage.getItem("aislidev-autosave-interval");
  if (saved) {
    autoSaveInterval.value = parseInt(saved);
  }
  startAutoSaveTimer();
});

// Cleanup on unmount
onUnmounted(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }
});
</script>

<style scoped>
.editor-layout {
  width: 100%;
  height: 100%;
}

.editor-pane,
.preview-pane {
  height: 100%;
  overflow: hidden;
}

.splitpanes.splitpanes--vertical > .splitpanes__splitter {
  background-color: #2c2c2c;
  width: 6px;
  cursor: col-resize;
}

.splitpanes.splitpanes--vertical > .splitpanes__splitter:hover {
  background-color: #42b883;
}

.toolbar {
  padding: 8px 12px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #2c2c2c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

/* Ensure buttons are visible on dark background */
.toolbar-btn :deep(.n-button__border),
.toolbar-btn :deep(.n-button__state-border) {
  border-color: #4a4a4a !important;
}

.toolbar-btn :deep(.n-button__content) {
  color: #cccccc !important;
}

.settings-content {
  padding: 16px 0;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.setting-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
