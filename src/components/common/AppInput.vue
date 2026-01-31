<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: 'text' | 'url' | 'email' | 'password' | 'number'
  error?: string
  hint?: string
  disabled?: boolean
  icon?: Component
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="form-control w-full">
    <!-- Label -->
    <label v-if="label" class="label">
      <span class="label-text text-white/80 font-medium">{{ label }}</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative group">
      <!-- Icon -->
      <div
        v-if="icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors duration-200"
      >
        <component :is="icon" class="w-5 h-5" />
      </div>

      <!-- Input field -->
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input w-full transition-all duration-300"
        :class="[
          `input-${size}`,
          icon ? 'pl-12' : '',
          error ? 'input-error border-error' : 'input-bordered',
          { 'opacity-60 cursor-not-allowed': disabled },
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <!-- Focus glow effect -->
      <div
        class="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
        :class="error ? 'shadow-[0_0_20px_-5px] shadow-error/40' : 'shadow-[0_0_20px_-5px] shadow-primary/40'"
      />
    </div>

    <!-- Helper text -->
    <label v-if="error || hint" class="label">
      <span
        class="label-text-alt"
        :class="error ? 'text-error' : 'text-white/50'"
      >
        {{ error || hint }}
      </span>
    </label>
  </div>
</template>

<style scoped>
.input {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-glass);
  color: white;
  border-radius: var(--radius-xl);
  padding-right: 1rem;
}

.input:not(.pl-12) {
  padding-left: 1rem;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input:focus {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: oklch(0.6 0.2 260 / 0.5);
  outline: none;
}

.input:hover:not(:focus):not(:disabled) {
  border-color: rgba(255, 255, 255, 0.2);
}

.input-error {
  border-color: oklch(0.65 0.2 25) !important;
}

.input-error:focus {
  border-color: oklch(0.65 0.2 25) !important;
}
</style>
