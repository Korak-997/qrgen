<script setup lang="ts">
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { QrCode } from 'lucide-vue-next'

interface Props {
  value: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 256
})

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

defineExpose({
  getCanvas: () => document.querySelector('.qr-display canvas') as HTMLCanvasElement | null
})
</script>

<template>
  <div class="qr-display glass-panel rounded-3xl p-6 sm:p-8">
    <!-- QR Code Container -->
    <div
      class="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-2xl overflow-hidden transition-all duration-500"
      :class="hasValue ? 'bg-white' : 'bg-white/5'"
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
          class="absolute inset-0 flex items-center justify-center p-4"
        >
          <QrcodeVue
            :value="normalizedValue"
            :size="size"
            level="H"
            render-as="canvas"
            class="w-full h-full"
          />
        </div>
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

/* Ensure canvas scales properly */
:deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
