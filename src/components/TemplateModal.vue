<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="Choose a Template"
    style="width: 600px"
    :mask-closable="false"
  >
    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <n-gi v-for="template in templates" :key="template.id">
        <n-card
          hoverable
          :title="template.name"
          class="template-card"
          @click="selectTemplate(template)"
        >
          <p class="template-description">{{ template.description }}</p>
        </n-card>
      </n-gi>
    </n-grid>

    <template #footer>
      <div class="footer-actions">
        <n-button @click="visible = false">Cancel</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NModal, NGrid, NGi, NCard, NButton } from "naive-ui";
import { templates, type PresentationTemplate } from "../constants/templates";

interface Props {
  show: boolean;
}

interface Emits {
  (e: "update:show", value: boolean): void;
  (e: "created", presentationId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = computed({
  get: () => props.show,
  set: (value) => emit("update:show", value),
});

const selectTemplate = async (template: PresentationTemplate) => {
  try {
    const response = await fetch("/api/presentations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: template.name,
        content: template.content,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      visible.value = false;
      emit("created", result.id);
    }
  } catch (error) {
    console.error("Failed to create presentation:", error);
  }
};
</script>

<style scoped>
.template-card {
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.template-description {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
