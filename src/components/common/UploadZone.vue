<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, Image, FileText, X } from 'lucide-vue-next'

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  multiple: false,
  maxSize: 5,
  disabled: false,
})

const emit = defineEmits<{
  upload: [files: File[]]
  error: [message: string]
}>()

const isDragging = ref(false)
const files = ref<File[]>([])
const inputRef = ref<HTMLInputElement>()

const acceptedTypes = computed(() => {
  if (props.accept === 'image/*') return ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return props.accept.split(',').map((t) => t.trim())
})

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  if (!props.disabled) isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  if (props.disabled) return

  const droppedFiles = Array.from(e.dataTransfer?.files || [])
  processFiles(droppedFiles)
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const selectedFiles = Array.from(target.files || [])
  processFiles(selectedFiles)
  target.value = '' // Reset for re-selection
}

function processFiles(newFiles: File[]) {
  const validFiles: File[] = []

  for (const file of newFiles) {
    // Check file type
    const isValidType = acceptedTypes.value.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''))
      }
      return file.type === type
    })

    if (!isValidType) {
      emit('error', `Invalid file type: ${file.name}`)
      continue
    }

    // Check file size
    if (file.size > props.maxSize * 1024 * 1024) {
      emit('error', `File too large: ${file.name} (max ${props.maxSize}MB)`)
      continue
    }

    validFiles.push(file)
  }

  if (validFiles.length > 0) {
    if (props.multiple) {
      files.value = [...files.value, ...validFiles]
    } else {
      const firstFile = validFiles[0]
      if (firstFile) files.value = [firstFile]
    }
    emit('upload', files.value)
  }
}

function removeFile(index: number) {
  files.value.splice(index, 1)
  emit('upload', files.value)
}

function triggerInput() {
  if (!props.disabled) inputRef.value?.click()
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="w-full">
    <!-- Drop zone -->
    <div
      class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer"
      :class="[
        isDragging
          ? 'border-primary bg-primary/10 scale-[1.02]'
          : 'border-white/20 hover:border-white/40 hover:bg-white/5',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @dragenter="handleDragEnter"
      @dragover.prevent
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="triggerInput"
    >
      <!-- Background pulse animation when dragging -->
      <div
        v-if="isDragging"
        class="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse"
      />

      <!-- Icon -->
      <div
        class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300"
        :class="isDragging ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/60'"
      >
        <Upload class="w-8 h-8" />
      </div>

      <!-- Text -->
      <p class="text-white/80 font-medium mb-1">
        <span v-if="isDragging">Drop files here</span>
        <span v-else>Drag & drop files here</span>
      </p>
      <p class="text-white/50 text-sm">
        or click to browse
      </p>
      <p class="text-white/40 text-xs mt-2">
        Max file size: {{ maxSize }}MB
      </p>

      <!-- Hidden input -->
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- File preview list -->
    <div v-if="files.length > 0" class="mt-4 space-y-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="(file, index) in files"
          :key="file.name + file.size"
          class="glass-panel rounded-xl p-3 flex items-center gap-3"
        >
          <!-- File icon -->
          <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
            <Image v-if="file.type.startsWith('image/')" class="w-5 h-5" />
            <FileText v-else class="w-5 h-5" />
          </div>

          <!-- File info -->
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-medium truncate">{{ file.name }}</p>
            <p class="text-white/50 text-xs">{{ formatFileSize(file.size) }}</p>
          </div>

          <!-- Remove button -->
          <button
            class="btn btn-ghost btn-sm btn-circle text-white/50 hover:text-error hover:bg-error/10"
            @click.stop="removeFile(index)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
