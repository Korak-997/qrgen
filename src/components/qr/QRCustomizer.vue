<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Palette, ImagePlus, X } from 'lucide-vue-next'
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

// Collapsible sections
const expandedSection = ref<'logo' | 'colors' | null>(null)
const showLogoSelector = ref(false)

function toggleSection(section: 'logo' | 'colors') {
  expandedSection.value = expandedSection.value === section ? null : section
}

// Current logo preview
const hasLogo = computed(() => props.styling.logo.type !== 'none' && props.styling.logo.source)

// Update handlers
function handleLogoSelect(type: LogoType, source: string) {
  emit('update:styling', {
    ...props.styling,
    logo: { ...props.styling.logo, type, source }
  })
}

function handleLogoClear() {
  emit('update:styling', {
    ...props.styling,
    logo: { type: 'none', source: null, size: 20 }
  })
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
  <div class="qr-customizer glass-panel rounded-3xl overflow-hidden">
    <!-- Header -->
    <div class="p-4 sm:p-5 border-b border-white/10">
      <h3 class="text-lg font-semibold text-white">Customize</h3>
      <p class="text-white/50 text-sm">Optional styling for your QR code</p>
    </div>

    <!-- Logo Section -->
    <div class="border-b border-white/10">
      <button
        class="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
        @click="toggleSection('logo')"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ImagePlus class="w-5 h-5 text-primary" />
          </div>
          <div class="text-left">
            <p class="text-white font-medium">Logo</p>
            <p class="text-white/50 text-sm">
              {{ hasLogo ? 'Logo added' : 'Add icon, image, or emoji' }}
            </p>
          </div>
        </div>
        <ChevronDown
          class="w-5 h-5 text-white/50 transition-transform"
          :class="{ 'rotate-180': expandedSection === 'logo' }"
        />
      </button>

      <!-- Logo content -->
      <div
        v-if="expandedSection === 'logo'"
        class="px-4 sm:px-5 pb-4 sm:pb-5"
      >
        <!-- Current logo preview -->
        <div
          v-if="hasLogo"
          class="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4"
        >
          <img
            :src="styling.logo.source!"
            alt="Current logo"
            class="w-12 h-12 rounded-lg object-contain bg-white"
          />
          <div class="flex-1">
            <p class="text-white text-sm font-medium">Current Logo</p>
            <p class="text-white/50 text-xs capitalize">{{ styling.logo.type }}</p>
          </div>
          <button
            class="btn btn-ghost btn-sm btn-circle text-error"
            @click="handleLogoClear"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Add/Change logo button -->
        <button
          class="btn w-full"
          :class="hasLogo ? 'btn-ghost' : 'btn-primary'"
          @click="showLogoSelector = true"
        >
          <ImagePlus class="w-4 h-4 mr-2" />
          {{ hasLogo ? 'Change Logo' : 'Add Logo' }}
        </button>
      </div>
    </div>

    <!-- Colors Section -->
    <div>
      <button
        class="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
        @click="toggleSection('colors')"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Palette class="w-5 h-5 text-primary" />
          </div>
          <div class="text-left">
            <p class="text-white font-medium">Colors & Style</p>
            <p class="text-white/50 text-sm">Customize colors and patterns</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Color preview -->
          <div class="flex -space-x-1">
            <div
              class="w-5 h-5 rounded-full border-2 border-white/20"
              :style="{ backgroundColor: styling.colors.foreground }"
            />
            <div
              class="w-5 h-5 rounded-full border-2 border-white/20"
              :style="{ backgroundColor: styling.colors.background }"
            />
          </div>
          <ChevronDown
            class="w-5 h-5 text-white/50 transition-transform"
            :class="{ 'rotate-180': expandedSection === 'colors' }"
          />
        </div>
      </button>

      <!-- Colors content -->
      <div
        v-if="expandedSection === 'colors'"
        class="px-4 sm:px-5 pb-4 sm:pb-5"
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
      </div>
    </div>

    <!-- Logo selector modal -->
    <QRLogoSelector
      :open="showLogoSelector"
      :selected-type="styling.logo.type"
      :selected-source="styling.logo.source"
      @update:open="showLogoSelector = $event"
      @select="handleLogoSelect"
      @clear="handleLogoClear"
    />
  </div>
</template>
