<script setup lang="ts">
import { computed } from 'vue'
import { Link, Type, Hash, Binary, Wifi, Phone, Contact, Download } from 'lucide-vue-next'
import { AppInput, AppButton, AppAlert, WifiFields, PhoneFields, VCardFields } from '@/components'
import { QR_CONTENT_TYPES, type QRContentType } from '@/types/qr'

interface Props {
  fields: Record<string, unknown>
  contentType: QRContentType
  isValid: boolean
  errorMessage?: string
  fieldErrors?: Partial<Record<string, string>>
  isDownloading?: boolean
  canDownload?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  errorMessage: '',
  isDownloading: false,
  canDownload: false
})

const emit = defineEmits<{
  'update:contentType': [contentType: QRContentType]
  'download': []
}>()

const CONTENT_TYPE_ICONS: Record<QRContentType, typeof Link> = {
  text: Type,
  url: Link,
  number: Hash,
  base64: Binary,
  wifi: Wifi,
  phone: Phone,
  vcard: Contact
}

const SIMPLE_CONTENT_TYPES: readonly QRContentType[] = ['text', 'url', 'number', 'base64']

const activeContentType = computed(() =>
  QR_CONTENT_TYPES.find((option) => option.id === props.contentType) ?? QR_CONTENT_TYPES[0]
)

const isSimpleContentType = computed(() => SIMPLE_CONTENT_TYPES.includes(props.contentType))
const inputType = computed(() => (props.contentType === 'url' ? 'url' : 'text'))
</script>

<template>
  <div class="qr-form glass-panel rounded-3xl p-6 sm:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">
        Generate QR Code
      </h2>
      <p class="text-white/60 text-sm">
        Choose a content type and get a high-quality QR code instantly.
      </p>
    </div>

    <!-- Content Type Selector -->
    <div class="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="QR content type">
      <button
        v-for="option in QR_CONTENT_TYPES"
        :key="option.id"
        type="button"
        role="tab"
        :aria-selected="option.id === contentType"
        class="flex items-center gap-2 px-4 py-2 min-h-11 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        :class="option.id === contentType
          ? 'bg-primary/20 border border-primary text-white'
          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'"
        @click="emit('update:contentType', option.id)"
      >
        <component :is="CONTENT_TYPE_ICONS[option.id]" class="w-4 h-4" />
        {{ option.label }}
      </button>
    </div>

    <!-- Simple single-field types -->
    <AppInput
      v-if="isSimpleContentType"
      v-model="(fields.value as string)"
      :label="activeContentType.label"
      :type="inputType"
      :placeholder="activeContentType.placeholder"
      :icon="CONTENT_TYPE_ICONS[contentType]"
      :error="errorMessage"
      size="lg"
    />

    <!-- Structured multi-field types -->
    <WifiFields
      v-else-if="contentType === 'wifi'"
      :fields="(fields as any)"
      :field-errors="fieldErrors"
    />
    <PhoneFields
      v-else-if="contentType === 'phone'"
      :fields="(fields as any)"
      :field-errors="fieldErrors"
    />
    <VCardFields
      v-else-if="contentType === 'vcard'"
      :fields="(fields as any)"
      :field-errors="fieldErrors"
    />

    <!-- Error Alert (structured types show per-field errors inline instead) -->
    <AppAlert
      v-if="errorMessage && isSimpleContentType"
      type="error"
      class="mt-4"
      dismissible
      @dismiss="fields.value = ''"
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
