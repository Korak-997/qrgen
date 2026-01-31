import { ref, computed } from 'vue'
import { refDebounced } from '@vueuse/core'

/**
 * Composable for managing QR code state and validation.
 * Provides reactive input handling with debounced updates
 * for optimal QR code generation performance.
 */
export function useQRCode(initialValue = '') {
  const inputValue = ref(initialValue)

  // Debounce the value to avoid excessive QR regenerations while typing
  const debouncedValue = refDebounced(inputValue, 300)

  // URL validation regex - matches common URL patterns
  const urlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\/\w\-.~:?#[\]@!$&'()*+,;=]*)?$/i

  const validationState = computed(() => {
    const value = inputValue.value.trim()

    if (!value) {
      return {
        isValid: false,
        errorMessage: '',
        isEmpty: true
      }
    }

    // Check if it's a valid URL-like string
    if (!urlPattern.test(value)) {
      return {
        isValid: false,
        errorMessage: 'Please enter a valid URL',
        isEmpty: false
      }
    }

    return {
      isValid: true,
      errorMessage: '',
      isEmpty: false
    }
  })

  const isValid = computed(() => validationState.value.isValid)
  const isEmpty = computed(() => validationState.value.isEmpty)
  const errorMessage = computed(() => validationState.value.errorMessage)

  // The actual value to use for QR generation (debounced + validated)
  const qrValue = computed(() => {
    if (!validationState.value.isValid) return ''
    return debouncedValue.value.trim()
  })

  function clear() {
    inputValue.value = ''
  }

  return {
    inputValue,
    qrValue,
    isValid,
    isEmpty,
    errorMessage,
    clear
  }
}
