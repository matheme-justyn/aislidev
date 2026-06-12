<!--
  Layout: 大綱_1
  
  Usage:
  ```md
  ---
  layout: 大綱-1
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

  ::body-7::
  body-7 內容

  ::body-8::
  body-8 內容

  ::body-9::
  body-9 內容

  ::body-10::
  body-10 內容

  ::body-11::
  body-11 內容

  ::body-12::
  body-12 內容
  ```
-->

<script setup lang="ts">
const props = defineProps({
  class: { type: String },
  layoutClass: { type: String }
})
</script>

<template>
  <div class="slidev-layout nics-大綱-1" :class="props.layoutClass">
    <!-- 背景圖片 1 -->
    <div 
      class="bg-image-1" 
      :style="{ backgroundImage: `url(${props.bgImage1 || '/layout-3-image-1.png'})` }"
    />
    <!-- 背景圖片 2 -->
    <div 
      class="bg-image-2" 
      :style="{ backgroundImage: `url(${props.bgImage2 || '/layout-3-image-2.png'})` }"
    />
    <!-- 背景圖片 3 -->
    <div 
      class="bg-image-3" 
      :style="{ backgroundImage: `url(${props.bgImage3 || '/layout-3-image-3.png'})` }"
    />
    <!-- 背景圖片 4 -->
    <div 
      class="bg-image-4" 
      :style="{ backgroundImage: `url(${props.bgImage4 || '/layout-3-image-4.png'})` }"
    />
    <!-- 背景圖片 5 -->
    <div 
      class="bg-image-5" 
      :style="{ backgroundImage: `url(${props.bgImage5 || '/layout-3-image-5.png'})` }"
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
    <!-- body-7 區域 -->
    <div class="body-7-area" :class="props.class">
      <slot name="body-7" />
    </div>
    <!-- body-8 區域 -->
    <div class="body-8-area" :class="props.class">
      <slot name="body-8" />
    </div>
    <!-- body-9 區域 -->
    <div class="body-9-area" :class="props.class">
      <slot name="body-9" />
    </div>
    <!-- body-10 區域 -->
    <div class="body-10-area" :class="props.class">
      <slot name="body-10" />
    </div>
    <!-- body-11 區域 -->
    <div class="body-11-area" :class="props.class">
      <slot name="body-11" />
    </div>
    <!-- body-12 區域 -->
    <div class="body-12-area" :class="props.class">
      <slot name="body-12" />
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
  left: 821px;
  top: 221px;
  width: 64px;
  height: 79px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.bg-image-2 {
  position: absolute;
  left: 821px;
  top: 413px;
  width: 64px;
  height: 79px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.bg-image-3 {
  position: absolute;
  left: 393px;
  top: 413px;
  width: 64px;
  height: 79px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.bg-image-4 {
  position: absolute;
  left: 391px;
  top: 221px;
  width: 64px;
  height: 79px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.bg-image-5 {
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
  top: 15.42%;
  width: 46.13%;
  height: 8.22%;
  z-index: 2;
}

.subtitle-area {
  position: absolute;
  left: 93.44%;
  top: 68.01%;
  width: 30.63%;
  height: 13.80%;
  z-index: 2;
}

.content-area {
  position: absolute;
  left: 93.44%;
  top: 40.33%;
  width: 30.63%;
  height: 13.80%;
  z-index: 2;
}

.footer-area {
  position: absolute;
  left: 49.11%;
  top: 40.33%;
  width: 30.63%;
  height: 13.80%;
  z-index: 2;
}

.extra-area {
  position: absolute;
  left: 49.03%;
  top: 60.77%;
  width: 28.68%;
  height: 5.68%;
  z-index: 2;
}

.body-5-area {
  position: absolute;
  left: 93.50%;
  top: 60.77%;
  width: 28.68%;
  height: 5.68%;
  z-index: 2;
}

.body-6-area {
  position: absolute;
  left: 93.50%;
  top: 33.38%;
  width: 28.68%;
  height: 5.68%;
  z-index: 2;
}

.body-7-area {
  position: absolute;
  left: 49.11%;
  top: 68.01%;
  width: 30.63%;
  height: 13.80%;
  z-index: 2;
}

.body-8-area {
  position: absolute;
  left: 40.79%;
  top: 32.97%;
  width: 6.96%;
  height: 5.06%;
  z-index: 2;
}

.body-9-area {
  position: absolute;
  left: 85.42%;
  top: 32.88%;
  width: 6.81%;
  height: 5.14%;
  z-index: 2;
}

.body-10-area {
  position: absolute;
  left: 85.42%;
  top: 60.32%;
  width: 6.81%;
  height: 5.14%;
  z-index: 2;
}

.body-11-area {
  position: absolute;
  left: 40.60%;
  top: 60.32%;
  width: 6.81%;
  height: 5.14%;
  z-index: 2;
}

.body-12-area {
  position: absolute;
  left: 49.03%;
  top: 33.38%;
  width: 28.68%;
  height: 5.68%;
  z-index: 2;
}
</style>
