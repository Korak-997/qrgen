<script setup lang="ts">
import { ColorPicker } from '@/components'
import { COLOR_PRESETS, type DotStyle, type CornerStyle } from '@/types/qr'
import { Circle, Square, Grip } from 'lucide-vue-next'

interface Props {
  foreground: string
  background: string
  dotStyle: DotStyle
  cornerStyle: CornerStyle
}

defineProps<Props>()

const emit = defineEmits<{
  'update:foreground': [value: string]
  'update:background': [value: string]
  'update:dotStyle': [value: DotStyle]
  'update:cornerStyle': [value: CornerStyle]
}>()

// Dot style options
const dotStyles: { id: DotStyle; label: string; icon: any }[] = [
  { id: 'square', label: 'Square', icon: Square },
  { id: 'rounded', label: 'Rounded', icon: Circle },
  { id: 'dots', label: 'Dots', icon: Grip }
]

// Corner style options
const cornerStyles: { id: CornerStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Round' },
  { id: 'extra-rounded', label: 'Soft' }
]

// Apply a preset
function applyPreset(preset: typeof COLOR_PRESETS[number]) {
  emit('update:foreground', preset.fg)
  emit('update:background', preset.bg)
}
</script>

<template>
  <div class="qr-color-picker space-y-6">
    <!-- Color presets -->
    <div>
      <p class="text-sm font-medium text-white/80 mb-3">Quick Presets</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in COLOR_PRESETS"
          :key="preset.name"
          class="group relative w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
          :class="foreground === preset.fg && background === preset.bg
            ? 'border-primary'
            : 'border-white/20'"
          :title="preset.name"
          @click="applyPreset(preset)"
        >
          <div class="absolute inset-0.5 rounded-md overflow-hidden">
            <div class="absolute inset-0" :style="{ backgroundColor: preset.bg }" />
            <div
              class="absolute inset-1 rounded-sm"
              :style="{ backgroundColor: preset.fg }"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Foreground color -->
    <ColorPicker
      :model-value="foreground"
      label="QR Code Color"
      @update:model-value="emit('update:foreground', $event)"
    />

    <!-- Background color -->
    <ColorPicker
      :model-value="background"
      label="Background Color"
      @update:model-value="emit('update:background', $event)"
    />

    <!-- Dot style -->
    <div>
      <p class="text-sm font-medium text-white/80 mb-3">Dot Style</p>
      <div class="flex gap-2">
        <button
          v-for="style in dotStyles"
          :key="style.id"
          class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all"
          :class="dotStyle === style.id
            ? 'bg-primary text-white'
            : 'bg-white/5 text-white/60 hover:bg-white/10'"
          @click="emit('update:dotStyle', style.id)"
        >
          <component :is="style.icon" class="w-4 h-4" />
          <span class="text-sm">{{ style.label }}</span>
        </button>
      </div>
    </div>

    <!-- Corner style -->
    <div>
      <p class="text-sm font-medium text-white/80 mb-3">Corner Style</p>
      <div class="flex gap-2">
        <button
          v-for="style in cornerStyles"
          :key="style.id"
          class="flex-1 px-3 py-2 rounded-xl text-sm transition-all"
          :class="cornerStyle === style.id
            ? 'bg-primary text-white'
            : 'bg-white/5 text-white/60 hover:bg-white/10'"
          @click="emit('update:cornerStyle', style.id)"
        >
          {{ style.label }}
        </button>
      </div>
    </div>
  </div>
</template>
