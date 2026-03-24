<script setup lang="ts">
// Layout: 封面(公開使用)_1
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-封面公開使用-1">
    <div class="bg-layer-1"></div>
    <div class="bg-layer-2"></div>
    <div class="shape-1"></div>
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-封面公開使用-1 {
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
  left: 71px;
  top: 20px;
  width: 313px;
  height: 92px;
  background-image: url('../layout-1-image-1.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.bg-layer-2 {
  position: absolute;
  left: 873px;
  top: 0px;
  width: 408px;
  height: 720px;
  background-image: url('../layout-1-image-2.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.shape-1 {
  position: absolute;
  left: 238px;
  top: 379px;
  width: 303px;
  height: 4px;
  background-color: #FFFFFF;
  pointer-events: none;
}
</style>
