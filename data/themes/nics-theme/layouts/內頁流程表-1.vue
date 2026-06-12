<!--
  Layout: 內頁&流程表_1
  
  Usage:
  ```md
  ---
  layout: 內頁流程表-1
  ---
  
  # 主標題
  
  ::subtitle::
  subtitle 內容

  ::content::
  content 內容

  ::footer::
  footer 內容

  ::extra::
  extra 內容

  ::body-5::
  body-5 內容

  ::body-6::
  body-6 內容
  ```
-->

<script setup lang="ts">
const props = defineProps({
  class: { type: String },
  layoutClass: { type: String }
})
</script>

<template>
  <div class="slidev-layout nics-內頁流程表-1" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-20-image-1.png'})` }"
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
    <!-- extra 區域 -->
    <div class="extra-area" :class="props.class">
      <slot name="extra" />
    </div>
    <!-- body-5 區域 -->
    <div class="body-5-area" :class="props.class">
      <slot name="body-5" />
    </div>
    <!-- body-6 區域 -->
    <div class="body-6-area" :class="props.class">
      <slot name="body-6" />
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
  left: 9.16%;
  top: 11.90%;
  width: 109.42%;
  height: 8.22%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 53.14%;
  top: 55.25%;
  width: 22.84%;
  height: 29.50%;
  z-index: 2;
}

.content-area {
  position: absolute;
  left: 95.75%;
  top: 55.25%;
  width: 22.84%;
  height: 29.50%;
  z-index: 2;
}

.footer-area {
  position: absolute;
  left: 11.09%;
  top: 55.25%;
  width: 22.84%;
  height: 29.50%;
  z-index: 2;
}

.extra-area {
  position: absolute;
  left: 10.83%;
  top: 46.37%;
  width: 24.95%;
  height: 7.27%;
  z-index: 2;
}

.body-5-area {
  position: absolute;
  left: 52.89%;
  top: 46.37%;
  width: 24.95%;
  height: 7.27%;
  z-index: 2;
}

.body-6-area {
  position: absolute;
  left: 95.49%;
  top: 46.37%;
  width: 24.95%;
  height: 7.27%;
  z-index: 2;
}
</style>
