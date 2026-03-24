<script setup lang="ts">
// Layout: 前言_1
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-前言-1">
    <div class="bg-layer-1"></div>
    <div class="bg-layer-2"></div>
    
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-前言-1 {
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
  left: 0px;
  top: 486px;
  width: 1280px;
  height: 215px;
  background-image: url('../layout-19-image-1.png');
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
  background-image: url('../layout-19-image-2.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

</style>
