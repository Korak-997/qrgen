<script setup lang="ts">
import { ref, reactive } from 'vue'
import { AppNavbar, QRDisplay, QRGeneratorForm, QRCustomizer, FAQSection } from '@/components'
import { useQRCode, useDownload } from '@/composables'
import { DEFAULT_QR_STYLING, type QRStyling } from '@/types/qr'

// Composables
const { inputValue, qrValue, isValid, isEmpty, errorMessage } = useQRCode()
const { isDownloading, downloadCanvas } = useDownload()

// Styling state
const styling = reactive<QRStyling>({
  logo: { ...DEFAULT_QR_STYLING.logo },
  colors: { ...DEFAULT_QR_STYLING.colors },
  dotStyle: DEFAULT_QR_STYLING.dotStyle,
  cornerStyle: DEFAULT_QR_STYLING.cornerStyle
})

// Template ref for QR display
const qrDisplayRef = ref<InstanceType<typeof QRDisplay> | null>(null)

async function handleDownload() {
  const canvas = qrDisplayRef.value?.getCanvas() ?? null
  await downloadCanvas(canvas, 'qrcode')
}

function handleStylingUpdate(newStyling: QRStyling) {
  Object.assign(styling, newStyling)
}
</script>

<template>
  <div class="min-h-screen text-white flex flex-col">
    <!-- Skip to main content (accessibility) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:rounded-lg focus:font-medium"
    >
      Skip to main content
    </a>

    <!-- Navigation -->
    <AppNavbar brand="QRGen">
      <template #cta>
        <!-- Empty slot to hide default CTA -->
        <span />
      </template>
    </AppNavbar>

    <!-- Main Content -->
    <main id="main-content" class="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
      <!-- Hero Text -->
      <header class="text-center mb-10 sm:mb-14 animate-fade-in">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-primary bg-clip-text text-transparent">
          Free QR Code Generator
        </h1>
        <p class="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
          Generate beautiful QR codes instantly. No ads, no watermarks, no sign-up required.
        </p>
      </header>

      <!-- Dashboard Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start animate-slide-up" aria-label="QR Code Generator">
        <!-- Left Column: Editor (Form + Settings) -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-8">
          <!-- Form Panel -->
          <section aria-label="Content Configurations">
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
              Enter Content
            </h2>
            <QRGeneratorForm
              v-model="inputValue"
              :is-valid="isValid"
              :error-message="errorMessage"
              :is-downloading="isDownloading"
              :can-download="isValid && !isEmpty"
              @download="handleDownload"
            />
          </section>

          <!-- Customizer Panel -->
          <section aria-label="Design Customization">
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
              Customize Design
            </h2>
            <QRCustomizer
              :styling="styling"
              @update:styling="handleStylingUpdate"
            />
          </section>
        </div>

        <!-- Right Column: Sticky Preview -->
        <div class="lg:col-span-5 xl:col-span-4 sticky top-8 self-start space-y-6">
          <div class="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <h2 class="text-xl font-semibold text-white mb-2">Live Preview</h2>
            <p class="text-white/50 text-sm mb-6">Updates instantly as you type</p>

            <QRDisplay
              ref="qrDisplayRef"
              :value="qrValue"
              :size="300"
              :styling="styling"
            />

            <!-- Download Hint -->
            <p class="text-white/30 text-xs mt-6 max-w-[200px]">
              High quality PNG with transparent background support
            </p>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="mt-16 sm:mt-24 animate-fade-in-delayed" aria-labelledby="how-it-works-heading">
        <h2 id="how-it-works-heading" class="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12">
          How It Works
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
              1
            </div>
            <h3 class="font-semibold text-white mb-2">Enter URL</h3>
            <p class="text-white/50 text-sm">Paste any website link, social profile, or custom URL</p>
          </div>
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
              2
            </div>
            <h3 class="font-semibold text-white mb-2">Customize</h3>
            <p class="text-white/50 text-sm">Add your logo, change colors, and pick a style</p>
          </div>
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
              3
            </div>
            <h3 class="font-semibold text-white mb-2">Download</h3>
            <p class="text-white/50 text-sm">Get a high-quality PNG ready to use anywhere</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 sm:mt-16" aria-label="Features">
        <article class="glass-panel rounded-2xl p-5 text-center hover:bg-white/10 transition-colors duration-300">
          <div class="text-2xl mb-2">🎯</div>
          <h3 class="font-semibold text-white mb-1">High Quality</h3>
          <p class="text-white/50 text-sm">Level H error correction for reliable scanning</p>
        </article>
        <article class="glass-panel rounded-2xl p-5 text-center hover:bg-white/10 transition-colors duration-300">
          <div class="text-2xl mb-2">⚡</div>
          <h3 class="font-semibold text-white mb-1">Instant</h3>
          <p class="text-white/50 text-sm">Real-time generation as you type</p>
        </article>
        <article class="glass-panel rounded-2xl p-5 text-center hover:bg-white/10 transition-colors duration-300">
          <div class="text-2xl mb-2">💎</div>
          <h3 class="font-semibold text-white mb-1">Free Forever</h3>
          <p class="text-white/50 text-sm">No hidden fees or premium tiers</p>
        </article>
      </section>

      <!-- FAQ Section -->
      <FAQSection />
    </main>

    <!-- Footer -->
    <footer class="text-center py-8 mt-auto border-t border-white/5">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
          <a href="#main-content" class="text-white/40 hover:text-white/70 text-sm transition-colors">
            Back to Top
          </a>
          <span class="hidden sm:inline text-white/20">•</span>
          <a href="https://github.com/Korak-997/qrgen" target="_blank" rel="noopener noreferrer" class="text-white/40 hover:text-white/70 text-sm transition-colors">
            GitHub
          </a>
          <span class="hidden sm:inline text-white/20">•</span>
          <span class="text-white/40 text-sm">
            100% Free & Private
          </span>
        </div>
        <p class="text-white/30 text-sm">
          Made with ❤️ • Open Source • © 2026 QRGen
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
h1 {
  line-height: 1.2;
}

/* Entrance animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out 0.1s forwards;
  opacity: 0;
}

.animate-fade-in-delayed {
  animation: fade-in 0.6s ease-out 0.2s forwards;
  opacity: 0;
}
</style>
