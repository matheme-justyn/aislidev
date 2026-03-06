<template>
  <div class="slidev-layout nics-section-3">
    <div class="section-background"></div>
    
    <div class="section-content">
      <div class="section-number">
        <slot name="number">03</slot>
      </div>
      
      <h1 class="section-title">
        <slot />
      </h1>
      
      <div class="section-subtitle">
        <slot name="subtitle" />
      </div>
    </div>
    
    <div class="decoration-line"></div>
  </div>
</template>

<style scoped>
.nics-section-3 {
  @apply w-full h-full relative overflow-hidden;
  background: linear-gradient(135deg, #8BC560 0%, #8BC560dd 100%);
}

.section-background {
  @apply absolute inset-0 opacity-10;
  background-image: url('/image1.png');
  background-size: cover;
}

.section-content {
  @apply relative z-10 h-full flex flex-col items-center justify-center p-16 text-center;
}

.section-number {
  @apply text-9xl font-bold text-white/30 mb-4;
  font-family: 'Arial', sans-serif;
}

.section-title {
  @apply text-7xl font-bold text-white mb-8;
  font-family: 'Arial', '', sans-serif;
}

.section-subtitle {
  @apply text-2xl text-white/90;
  font-family: 'Arial', '', sans-serif;
}

.decoration-line {
  @apply absolute bottom-0 left-0 right-0 h-2 bg-white/20;
}
</style>
