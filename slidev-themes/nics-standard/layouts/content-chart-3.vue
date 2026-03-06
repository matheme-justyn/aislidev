<template>
  <div class="slidev-layout nics-content-chart-3">
    <div class="layout-header">
      <h2 class="slide-title">
        <slot name="title" />
      </h2>
    </div>
    
    <div class="layout-body">
      <div class="content-area">
        <slot />
      </div>
      
      <div class="chart-area"><slot name="chart" /></div>
    </div>
    
    <div class="layout-footer">
      <img src="/image19.png" alt="NICS" class="footer-logo" />
    </div>
  </div>
</template>

<style scoped>
.nics-content-chart-3 {
  @apply w-full h-full flex flex-col p-12 bg-white;
}

.layout-header {
  @apply mb-8 border-l-4 border-nics-primary pl-6;
}

.slide-title {
  @apply text-4xl font-semibold text-nics-primary;
  font-family: 'Poppins SemiBold', 'Noto Sans TC SemiBold', sans-serif;
}

.layout-body {
  @apply flex-1 flex gap-8 overflow-hidden;
}

.content-area {
  @apply flex-1;
  font-family: 'Poppins Light', 'Noto Sans TC Light', sans-serif;
}





.chart-area {
@apply flex-1 flex items-center justify-center;
}

.layout-footer {
  @apply mt-8 pt-4 border-t border-gray-200;
}

.footer-logo {
  @apply h-6 w-auto;
}
</style>
