<script setup lang="ts">
// Layout: 內頁&圖片_2
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-內頁and圖片-2">
    <div class="bg-layer-1"></div>
    <div class="shape-1"></div>
    <div class="shape-2"></div>
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-內頁and圖片-2 {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--slidev-theme-light, #FFFFFF);
}

.content-area {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2rem;
  z-index: 10;
}

.bg-layer-1 {
  position: absolute;
  left: 46px;
  top: 637px;
  width: 180px;
  height: 53px;
  background-image: url('/layout-5-image-1.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.shape-1 {
  position: absolute;
  left: 246px;
  top: 671px;
  width: 941px;
  height: 2px;
  background-color: #FFFFFF;
  pointer-events: none;
}

.shape-2 {
  position: absolute;
  left: 0px;
  top: 698px;
  width: 1280px;
  height: 22px;
  background-color: #009694;
  pointer-events: none;
}
</style>
