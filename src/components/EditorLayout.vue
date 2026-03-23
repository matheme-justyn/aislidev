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
          📄 Template
        </n-button>
        <n-button
          size="small"
          type="tertiary"
          @click="showThemeSwitcher = true"
          class="toolbar-btn"
        >
          🎨 Theme
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

    <!-- Export PPTX Options Modal -->
    <n-modal
      v-model:show="showExportOptions"
      preset="card"
      title="Export to PPTX"
      style="width: 450px"
      :mask-closable="true"
    >
      <div class="export-options-content">
        <div class="option-item">
          <n-checkbox v-model:checked="separateVClicks">
            將 v-click 分離為多頁
          </n-checkbox>
          <p class="option-hint">
            預設：所有 v-click 內容顯示在同一頁<br />
            勾選：每個 v-click 步驟匯出為獨立頁面
          </p>
        </div>
        <div class="export-estimate">
          <p class="estimate-text">
            ⏱️ 預估時間：每頁約 6-7 秒
          </p>
        </div>
      </div>
      <template #footer>
        <div class="modal-footer">
          <n-button @click="showExportOptions = false">取消</n-button>
          <n-button type="primary" @click="confirmExport">確定匯出</n-button>
        </div>
      </template>
    </n-modal>

    <!-- Theme Switcher Modal -->
    <n-modal
      v-model:show="showThemeSwitcher"
      preset="card"
      title="Switch Theme"
      style="width: 600px"
      :mask-closable="true"
    >
      <div class="theme-switcher-content">
        <p class="theme-hint">
          Choose a theme to change the visual style. Your content will remain unchanged.
        </p>
        <div class="theme-grid">
          <div
            v-for="theme in availableThemes"
            :key="theme.name"
            class="theme-card"
            :class="{ active: currentTheme === theme.name }"
            @click="selectTheme(theme.name)"
          >
            <div class="theme-card-header">
              <h3>{{ theme.display }}</h3>
              <span v-if="currentTheme === theme.name" class="active-badge">✓</span>
            </div>
            <p class="theme-description">{{ theme.description }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="modal-footer">
          <n-button @click="showThemeSwitcher = false">Close</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { NButton, NModal, NInputNumber, NCheckbox, useMessage } from "naive-ui";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import CodeMirrorEditor from "./CodeMirrorEditor.vue";
import SlidevPreview from "./SlidevPreview.vue";
import FileBrowser from "./FileBrowser.vue";
import { ThemeSwitcher } from "../client/services/ThemeSwitcher";

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
const showThemeSwitcher = ref(false);
const previewRef = ref();
const localContent = ref(props.content);

// Auto-save state
const autoSaveInterval = ref(3); // minutes
const saveStatus = ref<"idle" | "saving" | "saved">("idle");
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

// Export PPTX state
const exportStatus = ref<"idle" | "exporting" | "exported">("idle");
const showExportOptions = ref(false);
const separateVClicks = ref(false);

// Theme Switcher state
const availableThemes = ThemeSwitcher.getAvailableThemes();
const currentTheme = computed(() => ThemeSwitcher.getCurrentTheme(localContent.value));

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

    // Save immediately to persist changes
    await performSave();

    // Wait for Slidev to detect file change and recompile
    setTimeout(() => {
      previewRef.value?.reload();
    }, 2000);  // Increased timeout to allow Slidev to recompile
  } catch (error) {
    console.error('Failed to load template:', error);
    message.error('Failed to load template');
  }
};

// Select theme and apply to current content
const selectTheme = async (themeName: string) => {
  try {
    // Apply theme to current markdown (only changes theme in frontmatter)
    const newContent = ThemeSwitcher.applyTheme(localContent.value, themeName);
    
    // Update local content
    localContent.value = newContent;
    emit('update:content', newContent);
    
    // Save immediately
    await performSave();
    
    message.success(`Theme changed to: ${themeName.split('/').pop()}`);
    
    // Close modal
    showThemeSwitcher.value = false;
    
    // Wait for Slidev to recompile with new theme
    setTimeout(() => {
      previewRef.value?.reload();
    }, 2000);
  } catch (error) {
    console.error('Failed to switch theme:', error);
    message.error('Failed to switch theme');
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

const exportPPTX = () => {
  if (exportStatus.value === "exporting") return;
  if (!props.presentationId) {
    message.error("No presentation selected");
    return;
  }
  showExportOptions.value = true;
};

const confirmExport = async () => {
  showExportOptions.value = false;
  exportStatus.value = "exporting";
  message.info("Exporting to PPTX...");

  try {
    const response = await fetch(`/api/presentations/${props.presentationId}/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        separateVClicks: separateVClicks.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Export failed");
    }

    const data = await response.json();
    const fileResponse = await fetch(data.downloadUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to download exported file");
    }

    const blob = await fileResponse.blob();
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

/* Export Options Modal */
.export-options-content {
  padding: 8px 0;
}

.option-item {
  margin-bottom: 20px;
}

.option-hint {
  margin-top: 8px;
  margin-left: 24px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.export-estimate {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
  margin-top: 8px;
}

.estimate-text {
  margin: 0;
  font-size: 14px;
  color: #555;
}

/* Theme Switcher Modal */
.theme-switcher-content {
  padding: 12px 0;
}

.theme-hint {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.theme-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.theme-card {
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9f9f9;
}

.theme-card:hover {
  border-color: #18a058;
  background: #f0f9f4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-card.active {
  border-color: #18a058;
  background: #e6f4ea;
  box-shadow: 0 2px 8px rgba(24, 160, 88, 0.2);
}

.theme-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.theme-card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.active-badge {
  color: #18a058;
  font-size: 20px;
  font-weight: bold;
}

.theme-description {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
</style>
