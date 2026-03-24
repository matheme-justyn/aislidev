<script setup lang="ts">
// Layout: 封底_1
// Generated from PPTX theme analysis
</script>

<template>
  <div class="slidev-layout nics-封底-1">
    <div class="bg-layer-1"></div>
    <div class="bg-layer-2"></div>
    
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nics-封底-1 {
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
  left: 890px;
  top: 0px;
  width: 394px;
  height: 720px;
  background-image: url('../layout-16-image-1.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.bg-layer-2 {
  position: absolute;
  left: 62px;
  top: 20px;
  width: 346px;
  height: 96px;
  background-image: url('../layout-16-image-2.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

</style>
