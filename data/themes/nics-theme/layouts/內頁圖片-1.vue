<!--
  Layout: 內頁&圖片_1
  
  Usage:
  ```md
  ---
  layout: 內頁圖片-1
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
  <div class="slidev-layout nics-內頁圖片-1" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-12-image-1.png'})` }"
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
  left: 46px;
  top: 637px;
  width: 180px;
  height: 53px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.title-area {
  position: absolute;
  left: 9.16%;
  top: 18.20%;
  width: 35.80%;
  height: 8.22%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 9.16%;
  top: 29.29%;
  width: 35.80%;
  height: 30.93%;
  z-index: 2;
}
</style>
