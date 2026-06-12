<!--
  Layout: 內頁&圖表_1
  
  Usage:
  ```md
  ---
  layout: 內頁圖表-1
  ---
  
  # 主標題
  
  ::subtitle::
  subtitle 內容

  ::content::
  content 內容

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
  <div class="slidev-layout nics-內頁圖表-1" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-16-image-1.png'})` }"
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
    <!-- content 區域 -->
    <div class="content-area" :class="props.class">
      <slot name="content" />
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
  left: 9.39%;
  top: 18.62%;
  width: 41.73%;
  height: 8.22%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 56.99%;
  top: 82.50%;
  width: 42.13%;
  height: 4.49%;
  z-index: 2;
}

.content-area {
  position: absolute;
  left: 57.95%;
  top: 22.36%;
  width: 64.56%;
  height: 55.29%;
  z-index: 2;
}

.footer-area {
  position: absolute;
  left: 9.39%;
  top: 29.52%;
  width: 41.73%;
  height: 49.24%;
  z-index: 2;
}
</style>
