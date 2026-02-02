<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import { QrCode } from 'lucide-vue-next'
import type { QRStyling } from '@/types/qr'
import { DEFAULT_QR_STYLING } from '@/types/qr'

interface Props {
  value: string
  size?: number
  styling?: Partial<QRStyling>
}

const props = withDefaults(defineProps<Props>(), {
  size: 280,
  styling: () => ({})
})

// Merge styling with defaults
const mergedStyling = computed(() => ({
  logo: { ...DEFAULT_QR_STYLING.logo, ...props.styling?.logo },
  colors: { ...DEFAULT_QR_STYLING.colors, ...props.styling?.colors },
  dotStyle: props.styling?.dotStyle ?? DEFAULT_QR_STYLING.dotStyle,
  cornerStyle: props.styling?.cornerStyle ?? DEFAULT_QR_STYLING.cornerStyle
}))

const hasValue = computed(() => props.value.length > 0)

// Add protocol if missing for better QR scanning
const normalizedValue = computed(() => {
  const val = props.value.trim()
  if (!val) return ''
  if (!/^https?:\/\//i.test(val)) {
    return `https://${val}`
  }
  return val
})

// QR Code instance and container ref
const containerRef = ref<HTMLDivElement | null>(null)
let qrCode: QRCodeStyling | null = null

// Map dot style to library format
function mapDotStyle(style: string) {
  const map: Record<string, 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded'> = {
    'square': 'square',
    'rounded': 'rounded',
    'dots': 'dots',
    'classy': 'classy',
    'classy-rounded': 'classy-rounded'
  }
  return map[style] || 'square'
}

// Map corner style to library format
function mapCornerStyle(style: string) {
  const map: Record<string, 'square' | 'dot' | 'extra-rounded'> = {
    'square': 'square',
    'dot': 'dot',
    'extra-rounded': 'extra-rounded'
  }
  return map[style] || 'square'
}

// Create QR code options
function createOptions() {
  const s = mergedStyling.value
  const hasLogo = s.logo.type !== 'none' && s.logo.source

  return {
    width: props.size,
    height: props.size,
    data: normalizedValue.value || 'https://example.com',
    margin: 8,
    qrOptions: {
      typeNumber: 0 as const,
      mode: 'Byte' as const,
      errorCorrectionLevel: 'H' as const
    },
    dotsOptions: {
      type: mapDotStyle(s.dotStyle),
      color: s.colors.foreground
    },
    cornersSquareOptions: {
      type: mapCornerStyle(s.cornerStyle),
      color: s.colors.foreground
    },
    cornersDotOptions: {
      type: 'dot' as const,
      color: s.colors.foreground
    },
    backgroundOptions: {
      color: s.colors.background
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 6,
      imageSize: hasLogo ? s.logo.size / 100 : 0,
      hideBackgroundDots: hasLogo
    },
    image: hasLogo ? s.logo.source : undefined
  }
}

// Initialize QR code
function initQRCode() {
  if (!containerRef.value) return

  // Clear previous instance
  containerRef.value.innerHTML = ''

  qrCode = new QRCodeStyling(createOptions() as any)
  qrCode.append(containerRef.value)
}

// Update QR code when props change
function updateQRCode() {
  if (!qrCode) {
    initQRCode()
    return
  }
  qrCode.update(createOptions() as any)
}

// Watch for changes to styling and data
watch([() => props.value, () => props.size, mergedStyling], () => {
  if (hasValue.value) {
    nextTick(() => {
      updateQRCode()
    })
  }
}, { deep: true })

// Watch for when hasValue becomes true (container becomes available)
watch(hasValue, (newValue) => {
  if (newValue) {
    // Use nextTick to ensure the v-if has rendered the container
    nextTick(() => {
      initQRCode()
    })
  } else {
    // Clean up when container is hidden
    qrCode = null
  }
})

// Lifecycle
onMounted(() => {
  // Only init if container is already visible
  if (hasValue.value && containerRef.value) {
    initQRCode()
  }
})

onUnmounted(() => {
  qrCode = null
})

// Expose canvas getter for download
defineExpose({
  getCanvas: () => containerRef.value?.querySelector('canvas') as HTMLCanvasElement | null,
  getRawData: async () => {
    if (!qrCode) return null
    return await qrCode.getRawData('png')
  }
})
</script>

<template>
  <div class="qr-display w-full">
    <!-- QR Code Container -->
    <div
      class="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-2xl overflow-hidden transition-all duration-500"
      :class="hasValue ? '' : 'bg-white/5'"
    >
      <!-- Active QR Code -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div
          v-if="hasValue"
          ref="containerRef"
          class="qr-container absolute inset-0 flex items-center justify-center"
        />
      </Transition>

      <!-- Placeholder State -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!hasValue"
          class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/40"
        >
          <QrCode class="w-16 h-16 sm:w-20 sm:h-20" />
          <p class="text-sm font-medium">Enter a URL to generate</p>
        </div>
      </Transition>
    </div>

    <!-- Caption -->
    <p
      v-if="hasValue"
      class="text-center text-white/50 text-sm mt-4 truncate px-2"
    >
      {{ value }}
    </p>
  </div>
</template>

<style scoped>
.qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Ensure QR code container scales properly */
.qr-container :deep(canvas),
.qr-container :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  border-radius: 0.75rem;
}
</style>
