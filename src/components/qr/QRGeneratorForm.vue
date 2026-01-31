<script setup lang="ts">
import { Link, Download } from 'lucide-vue-next'
import { AppInput, AppButton, AppAlert } from '@/components'

interface Props {
  modelValue: string
  isValid: boolean
  errorMessage?: string
  isDownloading?: boolean
  canDownload?: boolean
}

withDefaults(defineProps<Props>(), {
  errorMessage: '',
  isDownloading: false,
  canDownload: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'download': []
}>()
</script>

<template>
  <div class="qr-form glass-panel rounded-3xl p-6 sm:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">
        Generate QR Code
      </h2>
      <p class="text-white/60 text-sm">
        Enter any URL and get a high-quality QR code instantly.
      </p>
    </div>

    <!-- Input -->
    <AppInput
      :model-value="modelValue"
      label="URL"
      type="url"
      placeholder="https://example.com"
      :icon="Link"
      :error="errorMessage"
      size="lg"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- Error Alert -->
    <AppAlert
      v-if="errorMessage"
      type="error"
      class="mt-4"
      dismissible
      @dismiss="emit('update:modelValue', '')"
    >
      {{ errorMessage }}
    </AppAlert>

    <!-- Download Button -->
    <AppButton
      variant="primary"
      size="lg"
      block
      :icon="Download"
      :loading="isDownloading"
      :disabled="!canDownload"
      class="mt-6"
      @click="emit('download')"
    >
      {{ isDownloading ? 'Downloading...' : 'Download PNG' }}
    </AppButton>

    <!-- Info text -->
    <p class="text-center text-white/40 text-xs mt-4">
      Free • No watermarks • High quality
    </p>
  </div>
</template>

<style scoped>
.qr-form {
  display: flex;
  flex-direction: column;
}
</style>
