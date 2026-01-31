<script setup lang="ts">
import { ref } from 'vue'
import { AppNavbar, QRDisplay, QRGeneratorForm } from '@/components'
import { useQRCode, useDownload } from '@/composables'

// Composables
const { inputValue, qrValue, isValid, isEmpty, errorMessage } = useQRCode()
const { isDownloading, downloadCanvas } = useDownload()

// Template ref for QR display
const qrDisplayRef = ref<InstanceType<typeof QRDisplay> | null>(null)

async function handleDownload() {
  const canvas = qrDisplayRef.value?.getCanvas()
  await downloadCanvas(canvas, 'qrcode')
}
</script>

<template>
  <div class="min-h-screen text-white">
    <!-- Navigation -->
    <AppNavbar brand="QRGen">
      <template #cta>
        <!-- Empty slot to hide default CTA -->
        <span />
      </template>
    </AppNavbar>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <!-- Hero Text -->
      <div class="text-center mb-10 sm:mb-14">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-primary bg-clip-text text-transparent">
          Free QR Code Generator
        </h1>
        <p class="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
          Generate beautiful QR codes instantly. No ads, no watermarks, no sign-up required.
        </p>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        <!-- Form Panel -->
        <QRGeneratorForm
          v-model="inputValue"
          :is-valid="isValid"
          :error-message="errorMessage"
          :is-downloading="isDownloading"
          :can-download="isValid && !isEmpty"
          @download="handleDownload"
        />

        <!-- QR Display Panel -->
        <QRDisplay
          ref="qrDisplayRef"
          :value="qrValue"
          :size="300"
        />
      </div>

      <!-- Features Section -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 sm:mt-16">
        <div class="glass-panel rounded-2xl p-5 text-center">
          <div class="text-2xl mb-2">🎯</div>
          <h3 class="font-semibold text-white mb-1">High Quality</h3>
          <p class="text-white/50 text-sm">Level H error correction for reliable scanning</p>
        </div>
        <div class="glass-panel rounded-2xl p-5 text-center">
          <div class="text-2xl mb-2">⚡</div>
          <h3 class="font-semibold text-white mb-1">Instant</h3>
          <p class="text-white/50 text-sm">Real-time generation as you type</p>
        </div>
        <div class="glass-panel rounded-2xl p-5 text-center">
          <div class="text-2xl mb-2">💎</div>
          <h3 class="font-semibold text-white mb-1">Free Forever</h3>
          <p class="text-white/50 text-sm">No hidden fees or premium tiers</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-white/30 text-sm py-8 mt-auto">
      <p>Made with ❤️ • Open Source</p>
    </footer>
  </div>
</template>

<style scoped>
h1 {
  line-height: 1.2;
}
</style>
