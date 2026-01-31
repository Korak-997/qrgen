<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-vue-next'

interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  dismissible?: boolean
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false,
  show: true,
})

const emit = defineEmits<{
  dismiss: []
}>()

const iconComponent = computed(() => {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  }
  return icons[props.type]
})

const alertClasses = computed(() => {
  const baseClasses = {
    info: 'border-info/30 bg-info/10 text-info',
    success: 'border-success/30 bg-success/10 text-success',
    warning: 'border-warning/30 bg-warning/10 text-warning',
    error: 'border-error/30 bg-error/10 text-error',
  }
  return baseClasses[props.type]
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95"
  >
    <div
      v-if="show"
      role="alert"
      class="alert relative overflow-hidden border backdrop-blur-md rounded-2xl p-4"
      :class="alertClasses"
    >
      <!-- Subtle gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <!-- Icon -->
      <component :is="iconComponent" class="w-5 h-5 shrink-0 relative z-10" />

      <!-- Content -->
      <div class="relative z-10 flex-1">
        <h3 v-if="title" class="font-semibold text-sm">{{ title }}</h3>
        <div class="text-sm opacity-90">
          <slot />
        </div>
      </div>

      <!-- Dismiss button -->
      <button
        v-if="dismissible"
        class="btn btn-ghost btn-sm btn-circle relative z-10 hover:bg-white/10"
        @click="emit('dismiss')"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.alert {
  box-shadow: var(--shadow-glass);
}
</style>
