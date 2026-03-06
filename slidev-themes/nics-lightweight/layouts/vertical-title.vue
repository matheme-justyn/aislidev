<template>
  <div class="slidev-layout nics-vertical-title">
    <div class="layout-wrapper">
      <div class="layout-header">
        <div class="header-decoration"></div>
        <h2 class="slide-title vertical-title">
          <slot name="title" />
        </h2>
      </div>

      <div class="layout-content">
        <slot />
      </div>
    </div>

    <div class="layout-footer">
      <img src="/image7.png" alt="NICS Logo" class="footer-logo" />
    </div>
  </div>
</template>

<style scoped>
.nics-vertical-title {
  @apply w-full h-full flex flex-col p-12;
  background: white;
}

.layout-wrapper {
  @apply flex-1 flex flex-row;
}

.layout-header {
  @apply relative mr-8 flex items-start;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-width: 80px;
}

.header-decoration {
  @apply absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-nics-primary to-nics-accent5;
  border-radius: 2px;
}

.vertical-title {
  @apply text-3xl font-semibold text-nics-dark pt-6;
  font-family: "Noto Sans TC SemiBold", "Poppins SemiBold", sans-serif;
  color: #009594;
}

.layout-content {
  @apply flex-1 overflow-auto;
  font-family: "Poppins Light", "Noto Sans TC Light", sans-serif;
  color: #242424;
}

.layout-footer {
  @apply flex justify-start items-center mt-8 pt-4 border-t border-gray-200;
}

.footer-logo {
  @apply h-8 w-auto;
}
</style>
