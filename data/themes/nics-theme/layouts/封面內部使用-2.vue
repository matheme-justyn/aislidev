<!--
  Layout: 封面(內部使用)_2
  
  Usage:
  ```md
  ---
  layout: 封面內部使用-2
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
  <div class="slidev-layout nics-封面內部使用-2" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-2-image-1.png'})` }"
    />
    <!-- 背景圖片 2 -->
    <div 
      class="bg-image-2" 
      :style="{ backgroundImage: `url(${props.bgImage2 || '/layout-2-image-2.png'})` }"
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
  left: -3px;
  top: 277px;
  width: 1283px;
  height: 453px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.bg-image-2 {
  position: absolute;
  left: 52px;
  top: 27px;
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
  left: 243px;
  top: 62px;
  width: 892px;
  height: 2px;
  background-color: #FFFFFF;
  pointer-events: none;
  z-index: 1;
}
.title-area {
  position: absolute;
  left: 7.82%;
  top: 28.67%;
  width: 58.40%;
  height: 13.33%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 119.80%;
  top: 5.86%;
  width: 10.71%;
  height: 3.45%;
  z-index: 2;
}

.content-area {
  position: absolute;
  left: 7.82%;
  top: 44.75%;
  width: 58.40%;
  height: 14.86%;
  z-index: 2;
}
</style>
