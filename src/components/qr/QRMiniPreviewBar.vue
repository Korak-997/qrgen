<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import QRDisplay from './QRDisplay.vue'
import type { QRStyling } from '@/types/qr'

interface Props {
  visible: boolean
  value: string
  caption?: string
  qrMode?: 'Numeric' | 'Byte'
  styling: QRStyling
  isDownloading?: boolean
  canDownload?: boolean
}

withDefaults(defineProps<Props>(), {
  caption: '',
  qrMode: 'Byte',
  isDownloading: false,
  canDownload: false
})

const emit = defineEmits<{
  'jump-to-preview': []
  download: []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full"
  >
    <div
      v-if="visible"
      class="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <div class="glass-panel border-x-0 border-b-0 rounded-none px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          class="flex items-center gap-3 flex-1 min-w-0 text-left"
          aria-label="Scroll to full QR code preview"
          @click="emit('jump-to-preview')"
        >
          <div class="w-11 h-11 rounded-lg bg-white shrink-0 overflow-hidden">
            <QRDisplay
              :value="value"
              :qr-mode="qrMode"
              :size="88"
              :styling="styling"
              compact
            />
          </div>
          <span class="text-sm text-white/80 truncate">
            {{ caption || 'Live preview' }}
          </span>
        </button>

        <button
          type="button"
          class="btn btn-primary btn-sm min-h-11 min-w-11 shrink-0"
          :disabled="!canDownload || isDownloading"
          aria-label="Download QR code as PNG"
          @click="emit('download')"
        >
          <Download class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Transition>
</template>
