<template>
  <div class="editor-layout">
    <Splitpanes horizontal>
      <Pane :size="50" class="editor-pane">
        <CodeMirrorEditor
          v-model="localContent"
          @update:modelValue="onContentChange"
        />
      </Pane>
      <Pane :size="50" class="preview-pane">
        <SlidevPreview :presentation-id="presentationId" />
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import CodeMirrorEditor from "./CodeMirrorEditor.vue";
import SlidevPreview from "./SlidevPreview.vue";

interface Props {
  presentationId: string;
  content: string;
}

interface Emits {
  (e: "update:content", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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

const saveContent = async (content: string) => {
  try {
    await fetch(`/api/presentations/${props.presentationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
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

.splitpanes.splitpanes--horizontal > .splitpanes__splitter {
  background-color: #2c2c2c;
  height: 6px;
  cursor: row-resize;
}

.splitpanes.splitpanes--horizontal > .splitpanes__splitter:hover {
  background-color: #42b883;
}
</style>
