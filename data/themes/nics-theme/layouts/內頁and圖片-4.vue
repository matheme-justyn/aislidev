<script setup lang="ts">
// Layout: 內頁&圖片_4
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-內頁and圖片-4">
    <div class="bg-layer-1"></div>
    <div class="shape-1"></div>
    <div class="shape-2"></div>
    <div class="shape-3"></div>
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-內頁and圖片-4 {
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
  left: 67px;
  top: 662px;
  width: 166px;
  height: 33px;
  background-image: url('../layout-7-image-1.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.shape-1 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1280px;
  height: 723px;
  background-color: #2E2E2E;
  pointer-events: none;
}

.shape-2 {
  position: absolute;
  left: 246px;
  top: 670px;
  width: 941px;
  height: 2px;
  background-color: #FFFFFF;
  pointer-events: none;
}

.shape-3 {
  position: absolute;
  left: 262px;
  top: 686px;
  width: 941px;
  height: 2px;
  background-color: #FFFFFF;
  pointer-events: none;
}
</style>
