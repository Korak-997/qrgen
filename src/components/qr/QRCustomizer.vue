<script setup lang="ts">
import { ref, computed } from 'vue'
import { Palette, ImagePlus, X, ArrowRight } from 'lucide-vue-next'
import { Modal } from '@/components'
import QRColorPicker from './QRColorPicker.vue'
import QRLogoSelector from './QRLogoSelector.vue'
import type { QRStyling, LogoType, DotStyle, CornerStyle } from '@/types/qr'

interface Props {
  styling: QRStyling
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:styling': [value: QRStyling]
}>()

// Modal states
const showLogoModal = ref(false)
const showColorModal = ref(false)

// Current logo preview
const hasLogo = computed(() => props.styling.logo.type !== 'none' && props.styling.logo.source)

// Update handlers
function handleLogoSelect(type: LogoType, source: string) {
  emit('update:styling', {
    ...props.styling,
    logo: { ...props.styling.logo, type, source }
  })
  showLogoModal.value = false
}

function handleLogoClear() {
  emit('update:styling', {
    ...props.styling,
    logo: { type: 'none', source: null, size: 20 }
  })
  showLogoModal.value = false
}

function updateForeground(color: string) {
  emit('update:styling', {
    ...props.styling,
    colors: { ...props.styling.colors, foreground: color }
  })
}

function updateBackground(color: string) {
  emit('update:styling', {
    ...props.styling,
    colors: { ...props.styling.colors, background: color }
  })
}

function updateDotStyle(style: DotStyle) {
  emit('update:styling', {
    ...props.styling,
    dotStyle: style
  })
}

function updateCornerStyle(style: CornerStyle) {
  emit('update:styling', {
    ...props.styling,
    cornerStyle: style
  })
}
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <!-- Logo Trigger Card -->
    <div
      class="glass-panel rounded-3xl overflow-hidden h-fit transition-all duration-300 hover:bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer group"
      @click="showLogoModal = true"
    >
      <div class="p-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ImagePlus class="w-6 h-6 text-primary" />
          </div>
          <div class="text-left">
            <p class="text-white font-semibold text-lg">Logo Overlay</p>
            <p class="text-white/50 text-sm group-hover:text-white/70 transition-colors">
              {{ hasLogo ? 'Logo added' : 'Add brand icon or image' }}
            </p>
          </div>
        </div>

        <!-- Action Icon or Preview -->
        <div v-if="hasLogo" class="relative w-10 h-10 rounded-lg bg-white p-1 shadow-sm">
          <img
            :src="styling.logo.source!"
            alt="Current logo"
            class="w-full h-full object-contain"
          />
        </div>
        <ArrowRight
          v-else
          class="w-5 h-5 text-white/30 group-hover:text-white transition-colors"
        />
      </div>
    </div>

    <!-- Colors Trigger Card -->
    <div
      class="glass-panel rounded-3xl overflow-hidden h-fit transition-all duration-300 hover:bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer group"
      @click="showColorModal = true"
    >
      <div class="p-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Palette class="w-6 h-6 text-primary" />
          </div>
          <div class="text-left">
            <p class="text-white font-semibold text-lg">Colors & Patterns</p>
            <p class="text-white/50 text-sm group-hover:text-white/70 transition-colors">Customize dots and corners</p>
          </div>
        </div>

        <!-- Color Preview -->
        <div class="flex items-center gap-3">
          <div class="flex -space-x-2">
            <div
              class="w-6 h-6 rounded-full border-2 border-white/20 shadow-sm"
              :style="{ backgroundColor: styling.colors.foreground }"
            />
            <div
              class="w-6 h-6 rounded-full border-2 border-white/20 shadow-sm"
              :style="{ backgroundColor: styling.colors.background }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <Modal
      :open="showLogoModal"
      title="Select Logo"
      size="lg"
      @update:open="showLogoModal = $event"
    >
      <div class="min-h-[300px]">
        <!-- Reuse current preview inside modal if needed, or just the selector -->
        <div
          v-if="hasLogo"
          class="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-xl mb-6 backdrop-blur-sm"
        >
          <img
            :src="styling.logo.source!"
            alt="Current logo"
            class="w-12 h-12 rounded-lg object-contain bg-white shadow-sm"
          />
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-medium truncate">Current Logo Active</p>
            <p class="text-primary text-xs capitalize">{{ styling.logo.type }}</p>
          </div>
          <button
            class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
            @click="handleLogoClear"
            title="Remove Logo"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <QRLogoSelector
          :selected-type="styling.logo.type"
          :selected-source="styling.logo.source"
          @select="handleLogoSelect"
          @clear="handleLogoClear"
        />
      </div>
    </Modal>

    <Modal
      :open="showColorModal"
      title="Customize Colors & Style"
      size="lg"
      @update:open="showColorModal = $event"
    >
      <QRColorPicker
        :foreground="styling.colors.foreground"
        :background="styling.colors.background"
        :dot-style="styling.dotStyle"
        :corner-style="styling.cornerStyle"
        @update:foreground="updateForeground"
        @update:background="updateBackground"
        @update:dot-style="updateDotStyle"
        @update:corner-style="updateCornerStyle"
      />
    </Modal>
  </div>
</template>
