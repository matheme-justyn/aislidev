<template>
  <div class="slidev-layout guting-default">
    <div class="layout-header">
      <h2 class="slide-title">
        <slot name="title" />
      </h2>
    </div>
    
    <div class="layout-content">
      <slot />
    </div>
    
    <div class="layout-footer">
      <img src="/image19.png" alt="Guting" class="footer-logo" />
    </div>
  </div>
</template>

<style scoped>
.guting-default {
  @apply w-full h-full flex flex-col p-12 bg-white;
}

.layout-header {
  @apply mb-8 border-l-4 border-guting-primary pl-6;
}

.slide-title {
  @apply text-4xl font-semibold text-guting-primary;
  font-family: 'Arial', '', sans-serif;
}

.layout-content {
  @apply flex-1 overflow-auto;
  font-family: 'Arial', '', sans-serif;
  color: #242424;
}

.layout-footer {
  @apply mt-8 pt-4 border-t border-gray-200;
}

.footer-logo {
  @apply h-6 w-auto;
}
</style>
