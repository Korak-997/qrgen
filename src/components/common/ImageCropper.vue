<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { ZoomIn, ZoomOut, RotateCw, Check, X } from 'lucide-vue-next'

interface Props {
  imageSrc: string
  aspectRatio?: number
  minWidth?: number
  maxWidth?: number
  outputFormat?: 'png' | 'jpeg' | 'webp'
  outputQuality?: number
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 1,
  minWidth: 64,
  maxWidth: 256,
  outputFormat: 'png',
  outputQuality: 0.92
})

const emit = defineEmits<{
  crop: [dataUrl: string]
  cancel: []
}>()

const cropperRef = ref()
const zoom = ref(1)

// Get cropped result
async function handleCrop() {
  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  // Create output canvas at target size
  const outputCanvas = document.createElement('canvas')
  const ctx = outputCanvas.getContext('2d')
  if (!ctx) return

  // Determine output size (clamped)
  const size = Math.min(props.maxWidth, Math.max(props.minWidth, canvas.width))
  outputCanvas.width = size
  outputCanvas.height = size

  // Draw scaled image
  ctx.drawImage(canvas, 0, 0, size, size)

  // Convert to data URL
  const mimeType = `image/${props.outputFormat}`
  const dataUrl = outputCanvas.toDataURL(mimeType, props.outputQuality)

  emit('crop', dataUrl)
}

function handleCancel() {
  emit('cancel')
}

function adjustZoom(delta: number) {
  zoom.value = Math.max(0.5, Math.min(3, zoom.value + delta))
  cropperRef.value?.zoom(delta > 0 ? 1.2 : 0.8)
}

function rotate() {
  cropperRef.value?.rotate(90)
}
</script>

<template>
  <div class="image-cropper">
    <!-- Cropper -->
    <div class="relative bg-black/50 rounded-xl overflow-hidden aspect-square">
      <Cropper
        ref="cropperRef"
        :src="imageSrc"
        :stencil-props="{
          aspectRatio: aspectRatio
        }"
        :default-size="{
          width: 200,
          height: 200
        }"
        class="cropper"
      />
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-2 mt-4">
      <button
        class="btn btn-ghost btn-sm btn-circle"
        title="Zoom out"
        @click="adjustZoom(-0.2)"
      >
        <ZoomOut class="w-4 h-4" />
      </button>

      <button
        class="btn btn-ghost btn-sm btn-circle"
        title="Zoom in"
        @click="adjustZoom(0.2)"
      >
        <ZoomIn class="w-4 h-4" />
      </button>

      <button
        class="btn btn-ghost btn-sm btn-circle"
        title="Rotate"
        @click="rotate"
      >
        <RotateCw class="w-4 h-4" />
      </button>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-3 mt-4">
      <button
        class="btn btn-ghost flex-1"
        @click="handleCancel"
      >
        <X class="w-4 h-4 mr-2" />
        Cancel
      </button>
      <button
        class="btn btn-primary flex-1"
        @click="handleCrop"
      >
        <Check class="w-4 h-4 mr-2" />
        Apply
      </button>
    </div>
  </div>
</template>

<style scoped>
.cropper {
  height: 100%;
  width: 100%;
}

:deep(.vue-advanced-cropper__background) {
  background: #0a0a0a;
}

:deep(.vue-advanced-cropper__foreground) {
  background: transparent;
}
</style>
