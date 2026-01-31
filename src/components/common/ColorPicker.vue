<script setup lang="ts">
import { ref, watch } from 'vue'
import { Check } from 'lucide-vue-next'
import { COLOR_PRESETS } from '@/types/qr'

interface Props {
  modelValue: string
  label?: string
  showPresets?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPresets: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Local state for input
const inputValue = ref(props.modelValue)

// Sync input with prop
watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

// Validate and emit
function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  inputValue.value = target.value
}

function handleChange() {
  // Validate hex color
  if (/^#[0-9a-fA-F]{6}$/.test(inputValue.value)) {
    emit('update:modelValue', inputValue.value)
  }
}

function selectColor(color: string) {
  inputValue.value = color
  emit('update:modelValue', color)
}

// Quick colors (subset of common colors)
const quickColors = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
]

// Is current color selected
const isSelected = (color: string) => inputValue.value.toLowerCase() === color.toLowerCase()
</script>

<template>
  <div class="space-y-3">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-white/80">
      {{ label }}
    </label>

    <!-- Color input row -->
    <div class="flex items-center gap-3">
      <!-- Color swatch picker -->
      <label class="relative cursor-pointer">
        <div
          class="w-10 h-10 rounded-xl border-2 border-white/20 transition-all hover:scale-105 hover:border-white/40"
          :style="{ backgroundColor: inputValue }"
        />
        <input
          type="color"
          :value="inputValue"
          class="absolute inset-0 opacity-0 cursor-pointer"
          @input="handleInput"
          @change="handleChange"
        />
      </label>

      <!-- Hex input -->
      <input
        v-model="inputValue"
        type="text"
        placeholder="#000000"
        maxlength="7"
        class="input input-sm bg-white/5 border-white/10 text-white font-mono flex-1"
        @blur="handleChange"
        @keydown.enter="handleChange"
      />
    </div>

    <!-- Quick colors grid -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="color in quickColors"
        :key="color"
        class="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
        :class="isSelected(color) ? 'border-primary' : 'border-white/20'"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
      >
        <Check
          v-if="isSelected(color)"
          class="w-4 h-4 mx-auto"
          :class="color === '#ffffff' ? 'text-black' : 'text-white'"
        />
      </button>
    </div>

    <!-- Presets (optional) -->
    <div v-if="showPresets" class="pt-2 border-t border-white/10">
      <p class="text-xs text-white/50 mb-2">Presets</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in COLOR_PRESETS"
          :key="preset.name"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
          :style="{
            backgroundColor: preset.bg,
            color: preset.fg,
            border: `1px solid ${preset.fg}40`
          }"
          @click="$emit('update:modelValue', preset.fg)"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
  </div>
</template>
