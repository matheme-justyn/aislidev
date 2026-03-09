<template>
  <div class="slidev-layout guting-default">
    <div class="layout-header">
      <div class="header-decoration"></div>
      <h2 class="slide-title">
        <slot name="title" />
      </h2>
    </div>

    <div class="layout-content">
      <slot />
    </div>

    <div class="layout-footer">
      <div class="footer-left">
        <img src="/image7.png" alt="Guting Logo" class="footer-logo" />
      </div>
      <div class="footer-right">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.guting-default {
  @apply w-full h-full flex flex-col p-12;
  background: white;
}

.layout-header {
  @apply relative mb-8;
}

.header-decoration {
  @apply absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-guting-primary to-guting-accent5;
  border-radius: 2px;
}

.slide-title {
  @apply text-4xl font-semibold text-guting-dark pl-6;
  font-family: "Poppins SemiBold", "Noto Sans TC SemiBold", sans-serif;
  color: #009594;
}

.layout-content {
  @apply flex-1 overflow-auto;
  font-family: "Poppins Light", "Noto Sans TC Light", sans-serif;
  color: #242424;
}

.layout-footer {
  @apply flex justify-between items-center mt-8 pt-4 border-t border-gray-200;
}

.footer-logo {
  @apply h-8 w-auto;
}

.footer-right {
  @apply text-sm text-gray-500;
}
</style>
