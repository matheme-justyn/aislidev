<script setup lang="ts">
// Layout: 1_大綱_2
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-layout-1-大綱-2">
    <div class="bg-layer-1"></div>
    <div class="shape-1"></div>
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-layout-1-大綱-2 {
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
  left: -4px;
  top: 0px;
  width: 262px;
  height: 698px;
  background-image: url('../layout-18-image-1.png');
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
