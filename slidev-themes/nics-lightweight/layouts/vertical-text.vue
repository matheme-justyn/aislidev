<template>
  <div class="slidev-layout nics-vertical-text">
    <div class="layout-header">
      <div class="header-decoration"></div>
      <h2 class="slide-title vertical-title">
        <slot name="title" />
      </h2>
    </div>

    <div class="layout-content vertical-content">
      <slot />
    </div>

    <div class="layout-footer">
      <div class="footer-left">
        <img src="/image7.png" alt="NICS Logo" class="footer-logo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nics-vertical-text {
  @apply w-full h-full flex flex-row p-12;
  background: white;
}

.layout-header {
  @apply relative mr-8 flex items-center;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.header-decoration {
  @apply absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-nics-primary to-nics-accent5;
  border-radius: 2px;
}

.vertical-title {
  @apply text-4xl font-semibold text-nics-dark pt-6;
  font-family: "Noto Sans TC SemiBold", "Poppins SemiBold", sans-serif;
  color: #009594;
}

.layout-content {
  @apply flex-1 overflow-auto;
}

.vertical-content {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: "Noto Sans TC Light", "Poppins Light", sans-serif;
  color: #242424;
}

.layout-footer {
  @apply absolute bottom-8 left-8;
}

.footer-logo {
  @apply h-8 w-auto;
}
</style>
