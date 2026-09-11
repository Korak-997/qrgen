import { reactive, computed } from 'vue'
import { refDebounced } from '@vueuse/core'
import type { QRContentType } from '@/types/qr'
import {
  DEFAULT_WIFI_FIELDS,
  DEFAULT_PHONE_FIELDS,
  DEFAULT_VCARD_FIELDS
} from '@/types/qr'
import { getQRContentEncoder, exceedsQRCapacity } from '@/utils/qrContentEncoders'

const FIELDS_BY_CONTENT_TYPE = {
  text: { value: '' },
  url: { value: '' },
  number: { value: '' },
  base64: { value: '' },
  wifi: { ...DEFAULT_WIFI_FIELDS },
  phone: { ...DEFAULT_PHONE_FIELDS },
  vcard: { ...DEFAULT_VCARD_FIELDS }
} satisfies Record<QRContentType, object>

type FieldsFor<T extends QRContentType> = typeof FIELDS_BY_CONTENT_TYPE[T]

function createDefaultFields<T extends QRContentType>(contentType: T): FieldsFor<T> {

  return structuredClone(FIELDS_BY_CONTENT_TYPE[contentType])
}


export function useQRContent(initialContentType: QRContentType = 'text') {
  const contentType = reactive({ current: initialContentType })
  const fields = reactive(createDefaultFields(initialContentType)) as Record<string, unknown>

  const validationState = computed(() => {
    const encoder = getQRContentEncoder(contentType.current)
    const isEmpty = Object.values(fields).every(
      (fieldValue) => typeof fieldValue !== 'string' || fieldValue.trim() === ''
    )

    if (isEmpty) {
      return { isValid: false, errorMessage: '', fieldErrors: undefined, isEmpty: true }
    }

    const { isValid, errorMessage, fieldErrors } = encoder.validate(fields as never)

    if (isValid && exceedsQRCapacity(encoder.buildPayload(fields as never))) {
      return {
        isValid: false,
        errorMessage: 'Content is too long to fit in a QR code',
        fieldErrors: undefined,
        isEmpty: false
      }
    }

    return { isValid, errorMessage, fieldErrors, isEmpty: false }
  })

  const isValid = computed(() => validationState.value.isValid)
  const isEmpty = computed(() => validationState.value.isEmpty)
  const errorMessage = computed(() => validationState.value.errorMessage)
  const fieldErrors = computed(() => validationState.value.fieldErrors)

  const rawPayload = computed(() => {
    if (!validationState.value.isValid) return ''
    return getQRContentEncoder(contentType.current).buildPayload(fields as never)
  })
  const debouncedPayload = refDebounced(rawPayload, 300)

  const qrValue = computed(() => debouncedPayload.value)
  const qrMode = computed(() => getQRContentEncoder(contentType.current).qrMode)

  const previewLabel = computed(() => {
    if (!validationState.value.isValid) return ''
    return getQRContentEncoder(contentType.current).previewLabel(fields as never)
  })

  function setContentType(newContentType: QRContentType) {
    contentType.current = newContentType
    const freshFields = createDefaultFields(newContentType)
    Object.keys(fields).forEach((key) => delete fields[key])
    Object.assign(fields, freshFields)
  }

  function clear() {
    setContentType(contentType.current)
  }

  return {
    contentType: computed(() => contentType.current),
    fields,
    qrValue,
    qrMode,
    previewLabel,
    isValid,
    isEmpty,
    errorMessage,
    fieldErrors,
    setContentType,
    clear
  }
}
