<template>
  <div class="slidev-layout guting-cover-public">
    <div class="cover-background">
      <img src="/image1.png" alt="Background" class="bg-image" />
    </div>

    <div class="cover-content">
      <div class="classification public">公開使用</div>

      <div class="title-section">
        <h1 class="presentation-title">
          <slot />
        </h1>
      </div>

      <div class="meta-section">
        <slot name="meta" />
      </div>
    </div>

    <div class="guting-branding">
      <img src="/image2.png" alt="Guting Logo" class="logo-large" />
    </div>
  </div>
</template>

<style scoped>
.guting-cover-public {
  @apply w-full h-full relative overflow-hidden;
  background: linear-gradient(135deg, #009594 0%, #4fb9a0 100%);
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
  font-family: "Arial", "", sans-serif;
}

.classification.public {
  @apply bg-white text-guting-primary;
}

.title-section {
  @apply flex-1 flex items-center justify-center;
}

.presentation-title {
  @apply text-7xl font-bold text-white text-center leading-tight;
  font-family: "Arial", "", sans-serif;
}

.meta-section {
  @apply text-white text-xl space-y-3;
  font-family: "Arial", "", sans-serif;
}

.guting-branding {
  @apply absolute bottom-12 right-12;
}

.logo-large {
  @apply h-24 w-auto;
}
</style>
