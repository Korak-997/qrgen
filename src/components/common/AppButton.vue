<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: Component
  iconPosition?: 'left' | 'right'
  block?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  iconPosition: 'left',
  block: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="btn group relative overflow-hidden transition-all duration-300"
    :class="[
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-block': block },
      { 'opacity-70 pointer-events-none': disabled || loading },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- Shimmer effect overlay -->
    <span
      class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out"
    />

    <!-- Loading spinner -->
    <span
      v-if="loading"
      class="loading loading-spinner loading-sm"
    />

    <!-- Left icon -->
    <component
      v-if="icon && iconPosition === 'left' && !loading"
      :is="icon"
      class="w-4 h-4"
    />

    <!-- Button text -->
    <span class="relative z-10">
      <slot />
    </span>

    <!-- Right icon -->
    <component
      v-if="icon && iconPosition === 'right' && !loading"
      :is="icon"
      class="w-4 h-4"
    />
  </button>
</template>

<style scoped>
.btn {
  font-weight: 500;
  letter-spacing: 0.025em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border: none;
  box-shadow:
    0 4px 15px -3px color-mix(in srgb, var(--color-primary), transparent 60%),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  color: #1a1a1a;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary), white 10%) 0%, color-mix(in srgb, var(--color-accent), white 10%) 100%);
  box-shadow:
    0 6px 20px -3px color-mix(in srgb, var(--color-primary), transparent 50%),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.btn-accent {
  background: linear-gradient(135deg, var(--color-accent) 0%, oklch(0.6 0.18 340) 100%);
  border: none;
  box-shadow:
    0 4px 15px -3px color-mix(in srgb, var(--color-accent), transparent 60%),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  color: #1a1a1a;
}

.btn-accent:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 6px 20px -3px color-mix(in srgb, var(--color-accent), transparent 50%),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-ghost {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-glass);
  color: rgba(255, 255, 255, 0.9);
}

.btn-ghost:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.btn-outline:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
