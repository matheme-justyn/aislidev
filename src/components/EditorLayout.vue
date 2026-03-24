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
          @click="showTutorial = true"
          class="toolbar-btn"
          title="使用教學"
        >
          📚 Tutorial
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
          選擇主題來改變視覺樣式。您的內容將保持不變。
        </p>
        
        <!-- Loading state -->
        <div v-if="loadingThemes" class="theme-loading">
          <div class="theme-loading-spinner">⏳</div>
          <div>載入主題中...</div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="themeLoadError" class="theme-error">
          <div class="theme-error-icon">⚠️</div>
          <div>{{ themeLoadError }}</div>
        </div>
        
        <!-- Theme grid -->
        <div v-else-if="availableThemes.length > 0" class="theme-grid">
          <div
            v-for="theme in availableThemes"
            :key="theme.name"
            class="theme-card"
            :class="{ 'theme-card-active': currentTheme === theme.name }"
            @click="selectTheme(theme)"
          >
            <div class="theme-card-header">
              <span class="theme-name">{{ theme.display }}</span>
              <span v-if="theme.type === 'npm'" class="theme-badge theme-badge-npm">NPM</span>
              <span v-else-if="theme.type === 'local-slidev'" class="theme-badge theme-badge-local">Local</span>
              <span v-else-if="theme.type === 'custom'" class="theme-badge theme-badge-custom">Custom</span>
              <span v-if="currentTheme === theme.name" class="theme-active-mark">✓</span>
            </div>
            <div class="theme-description">{{ theme.description }}</div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else class="theme-empty">
          <div class="theme-empty-icon">📦</div>
          <div>沒有可用的主題</div>
        </div>
      </div>
      <template #footer>
        <div class="modal-footer">
          <n-button @click="showThemeSwitcher = false">Close</n-button>
        </div>
      </template>
    </n-modal>

    <!-- Tutorial Modal -->
    <TutorialModal
      :is-open="showTutorial"
      @close="showTutorial = false"
      @open-detail="onOpenTutorialDetail"
    />

    <!-- Tutorial Detail -->
    <TutorialDetail
      :is-open="showTutorialDetail"
      :section="currentTutorialSection"
      @close="closeTutorialDetail"
      @back="backToTutorialList"
    />
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
import TutorialModal from "./TutorialModal.vue";
import TutorialDetail from "./TutorialDetail.vue";
import { ThemeSwitcher } from "../client/services/ThemeSwitcher";
import type { TutorialSection } from "../client/data/tutorialContent";
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

// Tutorial state
const showTutorial = ref(false);
const showTutorialDetail = ref(false);
const currentTutorialSection = ref<TutorialSection | null>(null);
// Theme Switcher state
const availableThemes = ref<Array<{ name: string; display: string; description: string; type: string; themePath?: string }>>([]);
const loadingThemes = ref(false);
const themeLoadError = ref<string | null>(null);
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


// Load available themes from server
const loadThemes = async () => {
  loadingThemes.value = true;
  themeLoadError.value = null;
  
  try {
    const themes = await ThemeSwitcher.getAvailableThemes();
    availableThemes.value = themes;
  } catch (error) {
    console.error('Failed to load themes:', error);
    themeLoadError.value = 'Failed to load themes';
    // Fallback to built-in themes
    availableThemes.value = [
      { name: 'default', display: 'Default', description: 'Slidev default theme', type: 'builtin' },
      { name: 'seriph', display: 'Seriph', description: 'Elegant serif theme', type: 'builtin' }
    ];
  } finally {
    loadingThemes.value = false;
  }
};
// Select theme and apply to current content
const selectTheme = async (theme: { name: string; display: string; description: string; type: string; themePath?: string }) => {
  try {
    // Determine the theme path to use in frontmatter
    let themePathForFrontmatter: string;
    
    if (theme.type === 'npm') {
      // NPM theme: use the NPM package name
      themePathForFrontmatter = theme.themePath || theme.name;
    } else if (theme.type === 'local-slidev') {
      // Local Slidev theme: use relative path
      themePathForFrontmatter = theme.themePath || `../themes/${theme.name}`;
    } else {
      // v1 custom theme: just use name (fallback, shouldn't happen)
      themePathForFrontmatter = theme.name;
    }
    
    // Apply theme to current markdown (only changes theme in frontmatter)
    const newContent = ThemeSwitcher.applyTheme(localContent.value, themePathForFrontmatter);
    
    // Update local content
    localContent.value = newContent;
    emit('update:content', newContent);
    
    // Save immediately
    await performSave();
    
    message.success(`Theme changed to: ${theme.display}`);
    
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
onMounted(async () => {
  const saved = localStorage.getItem("aislidev-autosave-interval");
  if (saved) {
    autoSaveInterval.value = parseInt(saved);
  }
  startAutoSaveTimer();
  
  // Load available themes from server
  await loadThemes();
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

// Tutorial methods
function onOpenTutorialDetail(section: TutorialSection) {
  currentTutorialSection.value = section;
  showTutorial.value = false;
  showTutorialDetail.value = true;
}

function closeTutorialDetail() {
  showTutorialDetail.value = false;
  currentTutorialSection.value = null;
}

function backToTutorialList() {
  showTutorialDetail.value = false;
  showTutorial.value = true;
}
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

.theme-card-active {
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

/* Loading, Error, Empty states */
.theme-loading,
.theme-error,
.theme-empty {
  padding: 3rem 2rem;
  text-align: center;
  color: #64748b;
}

.theme-loading-spinner,
.theme-error-icon,
.theme-empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.theme-error {
  color: #ef4444;
}

/* Theme card elements */
.theme-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.theme-badge {
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.theme-badge-npm {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.theme-badge-local {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
}

.theme-badge-custom {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.theme-active-mark {
  color: #18a058;
  font-size: 20px;
  font-weight: bold;
}
</style>
