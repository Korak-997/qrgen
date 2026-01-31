<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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
const containerRef = ref<HTMLElement>()
const zoom = ref(1)

// Overlay positioning using 4 rectangles (top, bottom, left, right)
const overlayTop = ref({ height: '0px' })
const overlayBottom = ref({ top: '0px', height: '0px' })
const overlayLeft = ref({ top: '0px', height: '0px', width: '0px' })
const overlayRight = ref({ top: '0px', height: '0px', left: '0px', width: '0px' })

// Handle cropper change to track stencil position
function handleCropperChange() {
  nextTick(updateOverlay)
}

function updateOverlay() {
  if (!cropperRef.value || !containerRef.value) return

  const cropperEl = cropperRef.value.$el
  if (!cropperEl) return

  const containerWidth = cropperEl.clientWidth
  const containerHeight = cropperEl.clientHeight

  const result = cropperRef.value.getResult()
  if (!result?.coordinates || !result?.visibleArea) return

  const { coordinates, visibleArea } = result
  const scale = containerWidth / visibleArea.width

  // Calculate stencil position in container coordinates
  const left = (coordinates.left - visibleArea.left) * scale
  const top = (coordinates.top - visibleArea.top) * scale
  const width = coordinates.width * scale
  const height = coordinates.height * scale

  // Update overlays - 4 rectangles surrounding the stencil
  overlayTop.value = {
    height: `${Math.max(0, top)}px`
  }

  overlayBottom.value = {
    top: `${top + height}px`,
    height: `${Math.max(0, containerHeight - top - height)}px`
  }

  overlayLeft.value = {
    top: `${top}px`,
    height: `${height}px`,
    width: `${Math.max(0, left)}px`
  }

  overlayRight.value = {
    top: `${top}px`,
    height: `${height}px`,
    left: `${left + width}px`,
    width: `${Math.max(0, containerWidth - left - width)}px`
  }
}

// Get cropped result
async function handleCrop() {
  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  const outputCanvas = document.createElement('canvas')
  const ctx = outputCanvas.getContext('2d')
  if (!ctx) return

  const size = Math.min(props.maxWidth, Math.max(props.minWidth, canvas.width))
  outputCanvas.width = size
  outputCanvas.height = size

  ctx.drawImage(canvas, 0, 0, size, size)

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

// Update overlay on resize
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(updateOverlay)
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="image-cropper">
    <!-- Cropper -->
    <div ref="containerRef" class="cropper-container">
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
        @change="handleCropperChange"
      />

      <!-- Overlay rectangles - 4 pieces that surround the stencil -->
      <div class="crop-overlay overlay-top" :style="overlayTop" />
      <div class="crop-overlay overlay-bottom" :style="overlayBottom" />
      <div class="crop-overlay overlay-left" :style="overlayLeft" />
      <div class="crop-overlay overlay-right" :style="overlayRight" />
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
.cropper-container {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 1;
  background: #0a0a0a;
}

.cropper {
  height: 100%;
  width: 100%;
}

/* Overlay pieces that cover area outside crop */
.crop-overlay {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: grayscale(100%) brightness(0.7);
  pointer-events: none;
  z-index: 10;
}

.overlay-top {
  top: 0;
  left: 0;
  right: 0;
}

.overlay-bottom {
  left: 0;
  right: 0;
  bottom: 0;
}

.overlay-left {
  left: 0;
}

.overlay-right {
  right: 0;
}

:deep(.vue-advanced-cropper__background) {
  background: #0a0a0a;
}

:deep(.vue-advanced-cropper__foreground) {
  background: transparent;
}

/* Stencil border - dashed style matching app's primary blue */
:deep(.vue-simple-line) {
  border-style: dashed !important;
  border-color: var(--color-primary) !important;
  border-width: 2px !important;
}

/* Corner handles - matching app's primary color */
:deep(.vue-simple-handler) {
  background: var(--color-primary) !important;
  border: none !important;
  width: 12px !important;
  height: 12px !important;
  border-radius: 2px !important;
}
</style>
