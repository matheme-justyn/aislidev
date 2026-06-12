<!--
  Layout: 章節頁_2
  
  Usage:
  ```md
  ---
  layout: 章節頁-2
  ---
  
  # 主標題
  
  ::subtitle::
  subtitle 內容

  ::content::
  content 內容
  ```
-->

<script setup lang="ts">
const props = defineProps({
  class: { type: String },
  layoutClass: { type: String }
})
</script>

<template>
  <div class="slidev-layout nics-章節頁-2" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-8-image-1.png'})` }"
    />
    <!-- 背景圖片 2 -->
    <div 
      class="bg-image-2" 
      :style="{ backgroundImage: `url(${props.bgImage2 || '/layout-8-image-2.png'})` }"
    />

    <!-- 主標題區域 -->
    <div class="title-area" :class="props.class">
      <slot />
    </div>
    <!-- subtitle 區域 -->
    <div class="subtitle-area" :class="props.class">
      <slot name="subtitle" />
    </div>
    <!-- content 區域 -->
    <div class="content-area" :class="props.class">
      <slot name="content" />
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
  left: 779px;
  top: 9px;
  width: 473px;
  height: 708px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.bg-image-2 {
  position: absolute;
  left: 71px;
  top: 20px;
  width: 313px;
  height: 92px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.title-area {
  position: absolute;
  left: 8.65%;
  top: 37.43%;
  width: 58.40%;
  height: 12.79%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 9.34%;
  top: 52.13%;
  width: 57.33%;
  height: 14.83%;
  z-index: 2;
}

.content-area {
  position: absolute;
  left: 9.34%;
  top: 30.14%;
  width: 58.48%;
  height: 5.30%;
  z-index: 2;
}
</style>
