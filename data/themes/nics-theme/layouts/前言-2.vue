<script setup lang="ts">
// Layout: 前言_2
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-前言-2">
    <div class="bg-layer-1"></div>
    <div class="bg-layer-2"></div>
    <div class="shape-1"></div>
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-前言-2 {
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
  left: 919px;
  top: 0px;
  width: 361px;
  height: 698px;
  background-image: url('/layout-20-image-1.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.bg-layer-2 {
  position: absolute;
  left: 71px;
  top: 20px;
  width: 313px;
  height: 92px;
  background-image: url('/layout-20-image-2.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.shape-1 {
  position: absolute;
  left: 0px;
  top: 698px;
  width: 1280px;
  height: 22px;
  background-color: #009694;
  pointer-events: none;
}
</style>
