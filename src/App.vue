<template>
  <div id="aislidev-editor">
    <header>
      <h1>AISliDev Editor</h1>
      <p>AI-Powered Slidev Presentation Platform</p>
    </header>
    <main class="editor-container">
      <EditorLayout
        :presentation-id="presentationId"
        :content="content"
        @update:content="onContentUpdate"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EditorLayout from './components/EditorLayout.vue';

const presentationId = ref('demo-presentation');
const content = ref('Loading...');

// Load presentation content from API on mount
onMounted(async () => {
  try {
    const response = await fetch(`/api/presentations/${presentationId.value}`);
    const data = await response.json();
    content.value = data.content || '';
  } catch (error) {
    console.error('Failed to load presentation:', error);
    content.value = '# Error\n\nFailed to load presentation';
  }
});

const onContentUpdate = (newContent: string) => {
  content.value = newContent;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  overflow: hidden;
}

#aislidev-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
header {
  background: #42b883;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.editor-container {
  flex: 1;
  overflow: hidden;
}
</style>
