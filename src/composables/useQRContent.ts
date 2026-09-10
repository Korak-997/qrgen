import { ref, computed } from 'vue'
import { refDebounced } from '@vueuse/core'
import type { QRContentType } from '@/types/qr'
import { getQRContentEncoder, exceedsQRCapacity } from '@/utils/qrContentEncoders'

/**
 * Composable for managing QR code content state and validation.
 * Delegates per-type validation and payload encoding to
 * src/utils/qrContentEncoders.ts, and debounces updates for optimal
 * QR code generation performance.
 */
export function useQRContent(initialValue = '', initialContentType: QRContentType = 'text') {
  const contentType = ref<QRContentType>(initialContentType)
  const inputValue = ref(initialValue)

  // Debounce the value to avoid excessive QR regenerations while typing
  const debouncedValue = refDebounced(inputValue, 300)

  const validationState = computed(() => {
    const value = inputValue.value.trim()

    if (!value) {
      return {
        isValid: false,
        errorMessage: '',
        isEmpty: true
      }
    }

    const encoder = getQRContentEncoder(contentType.value)
    const { isValid, errorMessage } = encoder.validate(value)

    if (isValid && exceedsQRCapacity(encoder.buildPayload(value))) {
      return {
        isValid: false,
        errorMessage: 'Content is too long to fit in a QR code',
        isEmpty: false
      }
    }

    return { isValid, errorMessage, isEmpty: false }
  })

  const isValid = computed(() => validationState.value.isValid)
  const isEmpty = computed(() => validationState.value.isEmpty)
  const errorMessage = computed(() => validationState.value.errorMessage)

  // The encoded payload to use for QR generation (debounced + validated)
  const qrValue = computed(() => {
    if (!validationState.value.isValid) return ''
    return getQRContentEncoder(contentType.value).buildPayload(debouncedValue.value)
  })

  const qrMode = computed(() => getQRContentEncoder(contentType.value).qrMode)

  function setContentType(newContentType: QRContentType) {
    contentType.value = newContentType
  }

  function clear() {
    inputValue.value = ''
  }

  return {
    contentType,
    inputValue,
    qrValue,
    qrMode,
    isValid,
    isEmpty,
    errorMessage,
    setContentType,
    clear
  }
}
