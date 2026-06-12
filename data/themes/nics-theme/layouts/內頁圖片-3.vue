<!--
  Layout: 內頁&圖片_3
  
  Usage:
  ```md
  ---
  layout: 內頁圖片-3
  ---
  
  # 主標題
  
  ::subtitle::
  subtitle 內容

  ::footer::
  footer 內容
  ```
-->

<script setup lang="ts">
const props = defineProps({
  class: { type: String },
  layoutClass: { type: String }
})
</script>

<template>
  <div class="slidev-layout nics-內頁圖片-3" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-14-image-1.png'})` }"
    />

    <!-- 裝飾形狀 1 -->
    <div class="shape-1" />
    <!-- 主標題區域 -->
    <div class="title-area" :class="props.class">
      <slot />
    </div>
    <!-- subtitle 區域 -->
    <div class="subtitle-area" :class="props.class">
      <slot name="subtitle" />
    </div>
    <!-- footer 區域 -->
    <div class="footer-area" :class="props.class">
      <slot name="footer" />
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

.shape-1 {
  position: absolute;
  left: 246px;
  top: 671px;
  width: 941px;
  height: 2px;
  background-color: #FFFFFF;
  pointer-events: none;
  z-index: 1;
}
.title-area {
  position: absolute;
  left: 80.48%;
  top: 25.04%;
  width: 40.48%;
  height: 8.22%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 80.48%;
  top: 43.74%;
  width: 40.48%;
  height: 28.80%;
  z-index: 2;
}

.footer-area {
  position: absolute;
  left: 80.48%;
  top: 75.96%;
  width: 42.13%;
  height: 4.49%;
  z-index: 2;
}
</style>
