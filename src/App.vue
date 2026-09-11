<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { Target, Zap, Gem } from 'lucide-vue-next'
import { AppNavbar, AppAlert, QRDisplay, QRMiniPreviewBar, QRGeneratorForm, QRCustomizer, FAQSection } from '@/components'
import { useQRContent, useDownload } from '@/composables'
import { DEFAULT_QR_STYLING, type QRStyling } from '@/types/qr'

// Composables
const { contentType, fields, qrValue, qrMode, previewLabel, isValid, isEmpty, errorMessage, fieldErrors, setContentType } = useQRContent()
const { isDownloading, downloadError, downloadCanvas, clearError } = useDownload()

// Styling state
const styling = reactive<QRStyling>({
  logo: { ...DEFAULT_QR_STYLING.logo },
  colors: { ...DEFAULT_QR_STYLING.colors },
  dotStyle: DEFAULT_QR_STYLING.dotStyle,
  cornerStyle: DEFAULT_QR_STYLING.cornerStyle
})

// Template refs
const qrDisplayRef = ref<InstanceType<typeof QRDisplay> | null>(null)
const previewPanelRef = ref<HTMLElement | null>(null)

// The mini preview bar surfaces only once the full preview panel has scrolled out of view
const isPreviewPanelVisible = ref(true)
useIntersectionObserver(previewPanelRef, ([entry]) => {
  isPreviewPanelVisible.value = entry?.isIntersecting ?? true
})

const downloadSucceeded = ref(false)
let downloadSuccessTimeout: ReturnType<typeof setTimeout> | undefined

async function handleDownload() {
  const canvas = qrDisplayRef.value?.getCanvas() ?? null
  const succeeded = await downloadCanvas(canvas, 'qrcode')
  if (succeeded) {
    downloadSucceeded.value = true
    clearTimeout(downloadSuccessTimeout)
    downloadSuccessTimeout = setTimeout(() => {
      downloadSucceeded.value = false
    }, 3000)
  }
}

function handleStylingUpdate(newStyling: QRStyling) {
  Object.assign(styling, newStyling)
}

function scrollToPreview() {
  previewPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
    <AppNavbar
      brand="QRGen"
      :links="[
        { label: 'How It Works', href: '#how-it-works-heading' },
        { label: 'FAQ', href: '#faq-heading' },
      ]"
    />

    <!-- Main Content -->
    <main id="main-content" class="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 pb-24 lg:pb-12 w-full">
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
        <div
          ref="previewPanelRef"
          class="order-first lg:order-last lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 self-start space-y-6"
        >
          <div class="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <h2 class="text-xl font-semibold text-white mb-2 flex items-center gap-2 justify-center">
              <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">1</span>
              Live Preview
            </h2>
            <p class="text-white/50 text-sm mb-6">Updates instantly as you type</p>

            <QRDisplay
              ref="qrDisplayRef"
              :value="qrValue"
              :caption="previewLabel"
              :qr-mode="qrMode"
              :size="300"
              :styling="styling"
            />

            <AppAlert
              v-if="downloadError"
              type="error"
              dismissible
              class="w-full mt-6 text-left"
              @dismiss="clearError"
            >
              {{ downloadError }}
            </AppAlert>

            <!-- Download Hint -->
            <p v-else class="text-white/50 text-xs mt-6 max-w-52">
              High quality PNG with transparent background support
            </p>
          </div>
        </div>

        <div class="order-last lg:order-first lg:col-span-7 xl:col-span-8 space-y-8">
          <section aria-label="Content Configurations">
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
              Enter Content
            </h2>
            <QRGeneratorForm
              :fields="fields"
              :content-type="contentType"
              :is-valid="isValid"
              :error-message="errorMessage"
              :field-errors="fieldErrors"
              :is-downloading="isDownloading"
              :can-download="isValid && !isEmpty"
              :download-succeeded="downloadSucceeded"
              @update:content-type="setContentType"
              @download="handleDownload"
            />
          </section>

          <section aria-label="Design Customization">
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">3</span>
              Customize Design
            </h2>
            <QRCustomizer
              :styling="styling"
              @update:styling="handleStylingUpdate"
            />
          </section>
        </div>
      </section>


      <QRMiniPreviewBar
        :visible="!isPreviewPanelVisible"
        :value="qrValue"
        :caption="previewLabel"
        :qr-mode="qrMode"
        :styling="styling"
        :is-downloading="isDownloading"
        :can-download="isValid && !isEmpty"
        @jump-to-preview="scrollToPreview"
        @download="handleDownload"
      />

      <section class="mt-16 sm:mt-24 animate-fade-in-delayed" aria-labelledby="how-it-works-heading">
        <h2 id="how-it-works-heading" class="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12">
          How It Works
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
              1
            </div>
            <h3 class="font-semibold text-white mb-2">Enter Content</h3>
            <p class="text-white/50 text-sm">Add a URL, plain text, a number, or a base64 string</p>
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

      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 sm:mt-16" aria-label="Features">
        <article class="glass-panel rounded-2xl p-5 text-center hover:bg-white/10 transition-colors duration-300">
          <Target class="w-6 h-6 mx-auto mb-2 text-primary" aria-hidden="true" />
          <h3 class="font-semibold text-white mb-1">High Quality</h3>
          <p class="text-white/50 text-sm">Level H error correction for reliable scanning</p>
        </article>
        <article class="glass-panel rounded-2xl p-5 text-center hover:bg-white/10 transition-colors duration-300">
          <Zap class="w-6 h-6 mx-auto mb-2 text-primary" aria-hidden="true" />
          <h3 class="font-semibold text-white mb-1">Instant</h3>
          <p class="text-white/50 text-sm">Real-time generation as you type</p>
        </article>
        <article class="glass-panel rounded-2xl p-5 text-center hover:bg-white/10 transition-colors duration-300">
          <Gem class="w-6 h-6 mx-auto mb-2 text-primary" aria-hidden="true" />
          <h3 class="font-semibold text-white mb-1">Free Forever</h3>
          <p class="text-white/50 text-sm">No hidden fees or premium tiers</p>
        </article>
      </section>

      <FAQSection />
    </main>

    <footer class="text-center py-8 mt-auto border-t border-white/5">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
          <a href="#main-content" class="text-white/60 hover:text-white/90 text-sm transition-colors">
            Back to Top
          </a>
          <span class="hidden sm:inline text-white/20">•</span>
          <a href="https://github.com/Korak-997/qrgen" target="_blank" rel="noopener noreferrer" class="text-white/60 hover:text-white/90 text-sm transition-colors">
            GitHub
          </a>
          <span class="hidden sm:inline text-white/20">•</span>
          <span class="text-white/60 text-sm">
            100% Free & Private
          </span>
        </div>
        <p class="text-white/50 text-sm">
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
