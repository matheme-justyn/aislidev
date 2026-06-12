<!--
  Layout: 1_大綱_2
  
  Usage:
  ```md
  ---
  layout: 1-大綱-2
  ---
  
  # 主標題
  
  ::subtitle::
  subtitle 內容
  ```
-->

<script setup lang="ts">
const props = defineProps({
  class: { type: String },
  layoutClass: { type: String }
})
</script>

<template>
  <div class="slidev-layout nics-1-大綱-2" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-4-image-1.png'})` }"
    />

    <!-- 主標題區域 -->
    <div class="title-area" :class="props.class">
      <slot />
    </div>
    <!-- subtitle 區域 -->
    <div class="subtitle-area" :class="props.class">
      <slot name="subtitle" />
    </div>
  </div>
</template>

<style scoped>
.slidev-layout {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--slidev-theme-light, #ffffff);
}

.bg-image-1 {
  position: absolute;
  left: -4px;
  top: 0px;
  width: 262px;
  height: 698px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.title-area {
  position: absolute;
  left: 40.64%;
  top: 14.99%;
  width: 75.25%;
  height: 7.52%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 40.64%;
  top: 26.73%;
  width: 75.25%;
  height: 59.39%;
  z-index: 2;
}
</style>
