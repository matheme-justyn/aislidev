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
        <n-dropdown
          trigger="click"
          :options="themeOptions"
          @select="switchTheme"
        >
          <n-button
            size="small"
            type="tertiary"
            class="toolbar-btn"
          >
            🎨 Theme
          </n-button>
        </n-dropdown>
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
import { NButton, NModal, NInputNumber, NDropdown, useMessage } from "naive-ui";
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
let message: ReturnType<typeof useMessage>;

const showFileExplorer = ref(false);
const showSettings = ref(false);
const previewRef = ref();
const localContent = ref(props.content);

// Available themes
const themeOptions = [
  { label: "Default", key: "default" },
  { label: "Seriph", key: "seriph" },
  { label: "Guting Lightweight ⚡", key: "guting-lightweight" },
  { label: "Guting Standard ⭐ (Recommended)", key: "guting-standard" },
  { label: "Guting Classic", key: "guting-classic" },
];

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

// Switch theme in frontmatter
const switchTheme = (themeKey: string) => {
  const content = localContent.value;
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    message.error('No frontmatter found in current file');
    return;
  }
  
  const frontmatter = match[1];
  const themeLineRegex = /^theme:\s*.*/m;
  
  let newFrontmatter: string;
  if (themeLineRegex.test(frontmatter)) {
    // Replace existing theme line
    newFrontmatter = frontmatter.replace(themeLineRegex, `theme: ${themeKey}`);
  } else {
    // Add theme line after first line (usually 'title:')
    const lines = frontmatter.split('\n');
    lines.splice(1, 0, `theme: ${themeKey}`);
    newFrontmatter = lines.join('\n');
  }
  
  const newContent = content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);
  localContent.value = newContent;
  emit('update:content', newContent);
  
  message.success(`Theme switched to: ${themeKey}`);
  
  // Auto-reload preview after a short delay
  setTimeout(() => {
    previewRef.value?.reload();
  }, 500);
};

const onContentChange = (newContent: string) => {
  localContent.value = newContent;
  emit("update:content", newContent);

  // Reset auto-save timer
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  console.log(`[AutoSave] Content changed, scheduling auto-save in ${autoSaveInterval.value} minutes`);

  // Schedule auto-save
  saveTimeout = setTimeout(
    async () => {
      console.log('[AutoSave] Timer triggered, performing auto-save...');
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
  if (!props.presentationId) {
    console.log('[Save] No presentation ID, skipping save');
    return;
  }

  console.log(`[Save] Status: ${saveStatus.value} -> saving`);
  saveStatus.value = "saving";

  try {
    const response = await fetch(`/api/presentations/${props.presentationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: localContent.value }),
    });

    if (response.ok) {
      console.log('[Save] Success! Status: saving -> saved');
      saveStatus.value = "saved";

      // Wait for Slidev to detect file change, then reload iframe
      setTimeout(() => {
        previewRef.value?.reload();
      }, 1500);

      // Reset to idle after 2 seconds
      setTimeout(() => {
        if (saveStatus.value === "saved") {
          console.log('[Save] Status: saved -> idle');
          saveStatus.value = "idle";
        }
      }, 2000);
    } else {
      throw new Error("Save failed");
    }
  } catch (error) {
    console.error("[Save] Failed to save content:", error);
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
    // Step 1: Trigger export
    const exportResponse = await fetch(`/api/presentations/${props.presentationId}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!exportResponse.ok) {
      throw new Error("Export failed");
    }

    const exportData = await exportResponse.json();
    
    if (!exportData.success || !exportData.downloadUrl) {
      throw new Error("Export response missing download URL");
    }

    // Step 2: Download the exported file
    const downloadResponse = await fetch(exportData.downloadUrl);
    
    if (!downloadResponse.ok) {
      throw new Error("Failed to download exported file");
    }

    const blob = await downloadResponse.blob();
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

  console.log(`[AutoSave] Starting periodic auto-save timer (every ${autoSaveInterval.value} minutes)`);

  // Set up periodic auto-save
  autoSaveTimer = setInterval(
    async () => {
      console.log('[AutoSave] Periodic timer triggered');
      if (saveStatus.value !== "saving") {
        await performSave();
      } else {
        console.log('[AutoSave] Already saving, skipping periodic save');
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
  message = useMessage();  // Initialize message after provider is ready
  const saved = localStorage.getItem("aislidev-autosave-interval");
  if (saved) {
    autoSaveInterval.value = parseInt(saved);
    console.log(`[AutoSave] Loaded saved interval from localStorage: ${autoSaveInterval.value} minutes`);
  } else {
    console.log(`[AutoSave] Using default interval: ${autoSaveInterval.value} minutes`);
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
