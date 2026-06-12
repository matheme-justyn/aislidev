<!--
  Layout: 簡報底圖
  
  Usage:
  ```md
  ---
  layout: 簡報底圖
  ---
  
  # 主標題
  

  ```
-->

<script setup lang="ts">
const props = defineProps({
  class: { type: String },
  layoutClass: { type: String }
})
</script>

<template>
  <div class="slidev-layout nics-簡報底圖" :class="props.layoutClass">



  </div>
</template>

<style scoped>
.slidev-layout {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--slidev-theme-light, #ffffff);
}




</style>
