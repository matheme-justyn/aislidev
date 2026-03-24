<template>
  <n-message-provider>
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
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NMessageProvider } from "naive-ui";
import EditorLayout from "./components/EditorLayout.vue";

const presentationId = ref<string>("");
const content = ref("");
const presentations = ref<any[]>([]);

// Load presentations list on mount
onMounted(async () => {
  try {
    const response = await fetch("/api/files/presentations");
    if (response.ok) {
      const data = await response.json();
      presentations.value = data.presentations || [];

      const demoPresentation = presentations.value.find((p) => p.id === "demo");
      if (demoPresentation && demoPresentation.valid) {
        await loadPresentation("demo");
      } else if (
        presentations.value.length > 0 &&
        presentations.value[0].valid
      ) {
        await loadPresentation(presentations.value[0].id);
      }
    }
  } catch (error) {
    console.error("Failed to load presentations:", error);
  }

  window.addEventListener("select-presentation", (event: Event) => {
    const customEvent = event as CustomEvent;
    loadPresentation(customEvent.detail.id);
  });
});

const loadPresentation = async (id: string) => {
  console.log("[App] Loading presentation:", id);
  try {
    const response = await fetch(`/api/files/presentations/${id}`);
    if (response.ok) {
      const data = await response.json();
      presentationId.value = id;
      content.value = data.content || "";
      console.log("[App] Presentation loaded successfully:", {
        id,
        contentLength: content.value.length,
      });
    } else {
      console.error("[App] Failed to fetch presentation:", response.status);
    }
  } catch (error) {
    console.error("[App] Failed to load presentation:", error);
    content.value = "# Error\n\nFailed to load presentation";
  }
};

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

html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

#aislidev-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
header {
  background: #42b883;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
