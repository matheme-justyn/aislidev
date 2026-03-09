<template>
  <div class="slidev-layout guting-cover">
    <div class="cover-background">
      <img src="/image3.png" alt="Background" class="bg-image" />
    </div>

    <div class="cover-content">
      <div class="classification">
        <slot name="classification">內部公開</slot>
      </div>

      <div class="title-section">
        <h1 class="presentation-title">
          <slot />
        </h1>
      </div>

      <div class="meta-section">
        <slot name="presenter" />
        <slot name="department" />
        <slot name="date" />
      </div>
    </div>

    <div class="guting-logo">
      <img src="/image1.jpg" alt="Guting Logo" />
    </div>
  </div>
</template>

<style scoped>
.guting-cover {
  @apply w-full h-full relative overflow-hidden;
  background: linear-gradient(135deg, #009594 0%, #4fb9a0 100%);
}

.cover-background {
  @apply absolute inset-0 opacity-20;
}

.bg-image {
  @apply w-full h-full object-cover;
}

.cover-content {
  @apply relative z-10 h-full flex flex-col justify-between p-16;
}

.classification {
  @apply text-sm font-semibold text-white/80 px-4 py-2 bg-white/10 rounded inline-block self-start;
}

.title-section {
  @apply flex-1 flex items-center justify-center;
}

.presentation-title {
  @apply text-6xl font-bold text-white text-center leading-tight;
  font-family: "Poppins SemiBold", "Noto Sans TC SemiBold", sans-serif;
}

.meta-section {
  @apply text-white/90 space-y-2;
  font-family: "Poppins Light", "Noto Sans TC Light", sans-serif;
}

.guting-logo {
  @apply absolute bottom-8 right-8 w-32 h-32;
}

.guting-logo img {
  @apply w-full h-full object-contain;
}
</style>
