<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  open: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

// Size classes
const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}

function close() {
  emit('update:open', false)
  emit('close')
}

function handleBackdropClick(e: MouseEvent) {
  if (props.closeOnBackdrop && e.target === dialogRef.value) {
    close()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (props.closeOnEscape && e.key === 'Escape') {
    close()
  }
}

// Sync with dialog element
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    dialogRef.value?.showModal()
    document.addEventListener('keydown', handleKeydown)
  } else {
    dialogRef.value?.close()
    document.removeEventListener('keydown', handleKeydown)
  }
})

onMounted(() => {
  if (props.open) {
    dialogRef.value?.showModal()
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="modal"
    @click="handleBackdropClick"
  >
    <div
      class="modal-box glass-panel border border-white/10 w-full"
      :class="sizeClasses[size]"
    >
      <!-- Header -->
      <div v-if="title || closable" class="flex items-center justify-between mb-4">
        <h3 v-if="title" class="text-lg font-bold text-white">
          {{ title }}
        </h3>
        <div v-else />
        <button
          v-if="closable"
          class="btn btn-ghost btn-sm btn-circle text-white/60 hover:text-white"
          @click="close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="modal-action mt-6">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.modal::backdrop {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.modal-box {
  background: rgba(30, 30, 40, 0.95);
  backdrop-filter: blur(20px);
}
</style>
