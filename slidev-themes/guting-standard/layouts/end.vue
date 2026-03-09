<template>
  <div class="slidev-layout guting-end">
    <div class="end-background">
      <img src="/image1.png" alt="Background" class="bg-image" />
    </div>

    <div class="end-content">
      <div class="end-message">
        <h1 class="end-title">
          <slot>謝謝聆聽</slot>
        </h1>

        <div class="contact-info">
          <slot name="contact" />
        </div>
      </div>
    </div>

    <div class="guting-branding-end">
      <img src="/image2.png" alt="Guting Logo" class="logo-large" />
    </div>
  </div>
</template>

<style scoped>
.guting-end {
  @apply w-full h-full relative overflow-hidden;
  background: linear-gradient(135deg, #4fb9a0 0%, #368ea5 100%);
}

.end-background {
  @apply absolute inset-0 opacity-10;
}

.bg-image {
  @apply w-full h-full object-cover;
}

.end-content {
  @apply relative z-10 h-full flex items-center justify-center p-16;
}

.end-message {
  @apply text-center space-y-12;
}

.end-title {
  @apply text-8xl font-bold text-white;
  font-family: "Poppins SemiBold", "Noto Sans TC SemiBold", sans-serif;
}

.contact-info {
  @apply text-2xl text-white/90;
  font-family: "Poppins Light", "Noto Sans TC Light", sans-serif;
}

.guting-branding-end {
  @apply absolute bottom-12 right-12;
}

.logo-large {
  @apply h-24 w-auto;
}
</style>
