<!--
  Layout: 前言_2
  
  Usage:
  ```md
  ---
  layout: 前言-2
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
  <div class="slidev-layout nics-前言-2" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-6-image-1.png'})` }"
    />
    <!-- 背景圖片 2 -->
    <div 
      class="bg-image-2" 
      :style="{ backgroundImage: `url(${props.bgImage2 || '/layout-6-image-2.png'})` }"
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
  left: 919px;
  top: 0px;
  width: 361px;
  height: 698px;
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
  left: 9.17%;
  top: 20.37%;
  width: 75.87%;
  height: 8.15%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 8.99%;
  top: 84.18%;
  width: 56.80%;
  height: 4.49%;
  z-index: 2;
}

.content-area {
  position: absolute;
  left: 9.46%;
  top: 33.49%;
  width: 41.65%;
  height: 5.68%;
  z-index: 2;
}

.footer-area {
  position: absolute;
  left: 9.46%;
  top: 41.24%;
  width: 75.58%;
  height: 40.36%;
  z-index: 2;
}
</style>
