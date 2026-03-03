<template>
  <div class="editor-layout">
    <div class="toolbar">
      <n-button
        size="small"
        :type="leftPanelMode === 'explorer' ? 'primary' : 'tertiary'"
        @click="toggleLeftPanel"
        class="panel-toggle-btn"
      >
        {{ leftPanelMode === 'explorer' ? '✏️ Editor' : '📁 Explorer' }}
      </n-button>
    </div>
    <Splitpanes>
      <Pane :size="50" class="editor-pane">
        <CodeMirrorEditor
          v-if="leftPanelMode === 'editor'"
          v-model="localContent"
          @update:modelValue="onContentChange"
        />
        <FileExplorer
          v-else
          @select="onFileSelect"
        />
      </Pane>
      <Pane :size="50" class="preview-pane">
        <SlidevPreview ref="previewRef" :presentation-id="presentationId" />
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { NButton } from 'naive-ui';
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import CodeMirrorEditor from "./CodeMirrorEditor.vue";
import SlidevPreview from "./SlidevPreview.vue";
import FileExplorer from "./FileExplorer.vue";

interface Props {
  presentationId: string;
  content: string;
}

interface Emits {
  (e: "update:content", value: string): void;
}

type LeftPanelMode = 'editor' | 'explorer';


const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const leftPanelMode = ref<LeftPanelMode>('editor');

const localContent = ref(props.content);

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

const onContentChange = (newContent: string) => {
  localContent.value = newContent;
  emit("update:content", newContent);

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    await saveContent(newContent);
  }, 1000);
};

const previewRef = ref<InstanceType<typeof SlidevPreview> | null>(null);

const saveContent = async (content: string) => {
  try {
    const response = await fetch(`/api/presentations/${props.presentationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    
    if (response.ok) {
      // Wait a bit for Slidev to detect file change, then reload iframe
      setTimeout(() => {
        previewRef.value?.reload();
      }, 1500);
    }
  } catch (error) {
    console.error("Failed to save content:", error);
  }
};

watch(
  () => props.content,
  (newContent) => {
    if (newContent !== localContent.value) {
      localContent.value = newContent;
    }
  },
);

const toggleLeftPanel = () => {
  leftPanelMode.value = leftPanelMode.value === 'editor' ? 'explorer' : 'editor';
};

const onFileSelect = (presentationId: string) => {
  // Switch to editor mode and notify parent
  leftPanelMode.value = 'editor';
  // Parent (App.vue) will handle loading the selected presentation
  window.dispatchEvent(new CustomEvent('select-presentation', { detail: { id: presentationId } }));
};

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
  gap: 8px;
}

/* Ensure button is visible on dark background */
.panel-toggle-btn :deep(.n-button__border),
.panel-toggle-btn :deep(.n-button__state-border) {
  border-color: #4a4a4a !important;
}

.panel-toggle-btn :deep(.n-button__content) {
  color: #cccccc !important;
}
</style>
