<script setup lang="ts">
// Layout: 封面(內部使用)_2
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-封面內部使用-2">
    <div class="bg-layer-1"></div>
    <div class="bg-layer-2"></div>
    <div class="shape-1"></div>
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-封面內部使用-2 {
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
  left: -3px;
  top: 277px;
  width: 1283px;
  height: 453px;
  background-image: url('/layout-12-image-1.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.bg-layer-2 {
  position: absolute;
  left: 52px;
  top: 27px;
  width: 180px;
  height: 53px;
  background-image: url('/layout-12-image-2.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.shape-1 {
  position: absolute;
  left: 243px;
  top: 62px;
  width: 892px;
  height: 2px;
  background-color: #FFFFFF;
  pointer-events: none;
}
</style>
