<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
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
const closeButtonRef = ref<HTMLButtonElement | null>(null)

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

function focusInitialElement() {
  nextTick(() => {
    closeButtonRef.value?.focus()
  })
}

// Sync with dialog element
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    dialogRef.value?.showModal()
    document.addEventListener('keydown', handleKeydown)
    focusInitialElement()
  } else {
    dialogRef.value?.close()
    document.removeEventListener('keydown', handleKeydown)
  }
})

onMounted(() => {
  if (props.open) {
    dialogRef.value?.showModal()
    document.addEventListener('keydown', handleKeydown)
    focusInitialElement()
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
      class="modal-box glass-panel border border-white/10 w-full max-h-[85vh] flex flex-col"
      :class="sizeClasses[size]"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? 'modal-title' : undefined"
    >
      <!-- Header -->
      <div v-if="title || closable" class="flex items-center justify-between mb-4 shrink-0">
        <h3 v-if="title" id="modal-title" class="text-lg font-bold text-white">
          {{ title }}
        </h3>
        <div v-else />
        <button
          v-if="closable"
          ref="closeButtonRef"
          type="button"
          class="btn btn-ghost btn-sm btn-circle min-h-11 min-w-11 text-white/60 hover:text-white"
          aria-label="Close dialog"
          @click="close"
        >
          <X class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content overflow-y-auto">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="modal-action mt-6 shrink-0">
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
