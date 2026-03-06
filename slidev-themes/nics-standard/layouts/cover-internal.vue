<template>
  <div class="slidev-layout nics-cover-internal">
    <div class="cover-background">
      <img src="/image1.png" alt="Background" class="bg-image" />
    </div>

    <div class="cover-content">
      <div class="classification internal">內部使用</div>

      <div class="title-section">
        <h1 class="presentation-title">
          <slot />
        </h1>
      </div>

      <div class="meta-section">
        <slot name="meta" />
      </div>
    </div>

    <div class="nics-branding">
      <img src="/image2.png" alt="NICS Logo" class="logo-large" />
    </div>
  </div>
</template>

<style scoped>
.nics-cover-internal {
  @apply w-full h-full relative overflow-hidden;
  background: linear-gradient(135deg, #368ea5 0%, #009594 100%);
}

.cover-background {
  @apply absolute inset-0 opacity-15;
}

.bg-image {
  @apply w-full h-full object-cover;
}

.cover-content {
  @apply relative z-10 h-full flex flex-col justify-between p-16;
}

.classification {
  @apply text-sm font-bold px-6 py-3 rounded-lg inline-block self-start;
  font-family: "Poppins SemiBold", "Noto Sans TC SemiBold", sans-serif;
}

.classification.internal {
  @apply bg-nics-accent1 text-nics-dark;
}

.title-section {
  @apply flex-1 flex items-center justify-center;
}

.presentation-title {
  @apply text-7xl font-bold text-white text-center leading-tight;
  font-family: "Poppins SemiBold", "Noto Sans TC SemiBold", sans-serif;
}

.meta-section {
  @apply text-white text-xl space-y-3;
  font-family: "Poppins Light", "Noto Sans TC Light", sans-serif;
}

.nics-branding {
  @apply absolute bottom-12 right-12;
}

.logo-large {
  @apply h-24 w-auto;
}
</style>
