
import type {
  QRContentType,
  SimpleFields,
  WifiFields,
  PhoneFields,
  VCardFields
} from '@/types/qr'

export interface QRContentValidationResult {
  isValid: boolean
  errorMessage: string
  fieldErrors?: Partial<Record<string, string>>
}

export interface QRContentEncoder<TFields = SimpleFields> {
  validate: (fields: TFields) => QRContentValidationResult
  buildPayload: (fields: TFields) => string
  qrMode: 'Numeric' | 'Byte'

  previewLabel: (fields: TFields) => string
}

const URL_PATTERN = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\/\w\-.~:?#[\]@!$&'()*+,;=]*)?$/i
const NUMERIC_PATTERN = /^\d+$/
const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/
const PHONE_PATTERN = /^\+?[\d\s()-]{6,20}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WIFI_SSID_MAX_LENGTH = 32
const WIFI_WPA_PASSWORD_MIN_LENGTH = 8
const WIFI_WPA_PASSWORD_MAX_LENGTH = 63

function encodeUrl(rawValue: string): string {
  const trimmedValue = rawValue.trim()
  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`
}

function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length
}

function normalizePhoneForTel(phone: string): string {
  const trimmedPhone = phone.trim()
  const hasLeadingPlus = trimmedPhone.startsWith('+')
  const digitsOnly = trimmedPhone.replace(/\D/g, '')
  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly
}

function validatePhoneNumber(phone: string): string {
  const trimmedPhone = phone.trim()
  if (!trimmedPhone) return 'Please enter a phone number'
  if (!PHONE_PATTERN.test(trimmedPhone) || countPhoneDigits(trimmedPhone) < 6) {
    return 'Please enter a valid phone number'
  }
  return ''
}

function escapeWifiSpecialChars(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"')
}

function encodeWifi(fields: WifiFields): string {
  const escapedSsid = escapeWifiSpecialChars(fields.ssid.trim())
  const passwordSegment = fields.security === 'nopass'
    ? ''
    : `P:${escapeWifiSpecialChars(fields.password.trim())};`
  const hiddenSegment = fields.hidden ? 'H:true;' : ''
  return `WIFI:T:${fields.security};S:${escapedSsid};${passwordSegment}${hiddenSegment};`
}

function escapeVCardSpecialChars(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function encodeVCard(fields: VCardFields): string {
  const escapedName = escapeVCardSpecialChars(fields.name.trim())
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapedName};;;;`,
    `FN:${escapedName}`
  ]
  if (fields.org.trim()) lines.push(`ORG:${escapeVCardSpecialChars(fields.org.trim())}`)
  if (fields.phone.trim()) lines.push(`TEL;TYPE=CELL:${normalizePhoneForTel(fields.phone)}`)
  if (fields.email.trim()) lines.push(`EMAIL:${fields.email.trim()}`)
  lines.push('END:VCARD')
  return lines.join('\n')
}

const passthroughEncoder: QRContentEncoder<SimpleFields> = {
  validate: (fields) => {
    const trimmedValue = fields.value.trim()
    return trimmedValue
      ? { isValid: true, errorMessage: '' }
      : { isValid: false, errorMessage: 'Please enter some text' }
  },
  buildPayload: (fields) => fields.value.trim(),
  previewLabel: (fields) => fields.value.trim(),
  qrMode: 'Byte'
}

const urlEncoder: QRContentEncoder<SimpleFields> = {
  validate: (fields) => {
    const trimmedValue = fields.value.trim()
    if (!trimmedValue) return { isValid: false, errorMessage: 'Please enter a URL' }
    return URL_PATTERN.test(trimmedValue)
      ? { isValid: true, errorMessage: '' }
      : { isValid: false, errorMessage: 'Please enter a valid URL' }
  },
  buildPayload: (fields) => encodeUrl(fields.value),
  previewLabel: (fields) => encodeUrl(fields.value),
  qrMode: 'Byte'
}

const numberEncoder: QRContentEncoder<SimpleFields> = {
  validate: (fields) => {
    const trimmedValue = fields.value.trim()
    if (!trimmedValue) return { isValid: false, errorMessage: 'Please enter a number' }
    return NUMERIC_PATTERN.test(trimmedValue)
      ? { isValid: true, errorMessage: '' }
      : { isValid: false, errorMessage: 'Digits only (0-9), no spaces or symbols' }
  },
  buildPayload: (fields) => fields.value.trim(),
  previewLabel: (fields) => fields.value.trim(),
  qrMode: 'Numeric'
}

const base64Encoder: QRContentEncoder<SimpleFields> = {
  validate: (fields) => {
    const trimmedValue = fields.value.trim()
    if (!trimmedValue) return { isValid: false, errorMessage: 'Please enter a base64 string' }
    if (trimmedValue.length % 4 !== 0 || !BASE64_PATTERN.test(trimmedValue)) {
      return { isValid: false, errorMessage: 'Please enter a valid base64 string' }
    }
    return { isValid: true, errorMessage: '' }
  },
  buildPayload: (fields) => fields.value.trim(),
  previewLabel: (fields) => fields.value.trim(),
  qrMode: 'Byte'
}

const wifiEncoder: QRContentEncoder<WifiFields> = {
  validate: (fields) => {
    const fieldErrors: Partial<Record<string, string>> = {}

    const trimmedSsid = fields.ssid.trim()
    if (!trimmedSsid) {
      fieldErrors.ssid = 'Please enter a network name'
    } else if (trimmedSsid.length > WIFI_SSID_MAX_LENGTH) {
      fieldErrors.ssid = `Network name must be ${WIFI_SSID_MAX_LENGTH} characters or fewer`
    }

    if (fields.security !== 'nopass') {
      const trimmedPassword = fields.password.trim()
      if (!trimmedPassword) {
        fieldErrors.password = 'Please enter a password'
      } else if (
        fields.security === 'WPA' &&
        (trimmedPassword.length < WIFI_WPA_PASSWORD_MIN_LENGTH || trimmedPassword.length > WIFI_WPA_PASSWORD_MAX_LENGTH)
      ) {
        fieldErrors.password = `WPA passwords must be ${WIFI_WPA_PASSWORD_MIN_LENGTH}-${WIFI_WPA_PASSWORD_MAX_LENGTH} characters`
      }
    }

    const hasErrors = Object.keys(fieldErrors).length > 0
    return hasErrors
      ? { isValid: false, errorMessage: 'Please fix the highlighted fields', fieldErrors }
      : { isValid: true, errorMessage: '' }
  },
  buildPayload: encodeWifi,
  previewLabel: (fields) => `WiFi: ${fields.ssid.trim()}`,
  qrMode: 'Byte'
}

const phoneEncoder: QRContentEncoder<PhoneFields> = {
  validate: (fields) => {
    const errorMessage = validatePhoneNumber(fields.phone)
    return errorMessage
      ? { isValid: false, errorMessage, fieldErrors: { phone: errorMessage } }
      : { isValid: true, errorMessage: '' }
  },
  buildPayload: (fields) => `tel:${normalizePhoneForTel(fields.phone)}`,
  previewLabel: (fields) => fields.phone.trim(),
  qrMode: 'Byte'
}

const vcardEncoder: QRContentEncoder<VCardFields> = {
  validate: (fields) => {
    const fieldErrors: Partial<Record<string, string>> = {}

    if (!fields.name.trim()) {
      fieldErrors.name = 'Please enter a name'
    }

    if (fields.phone.trim()) {
      const phoneError = validatePhoneNumber(fields.phone)
      if (phoneError) fieldErrors.phone = phoneError
    }

    if (fields.email.trim() && !EMAIL_PATTERN.test(fields.email.trim())) {
      fieldErrors.email = 'Please enter a valid email address'
    }

    const hasErrors = Object.keys(fieldErrors).length > 0
    return hasErrors
      ? { isValid: false, errorMessage: 'Please fix the highlighted fields', fieldErrors }
      : { isValid: true, errorMessage: '' }
  },
  buildPayload: encodeVCard,
  previewLabel: (fields) => fields.name.trim(),
  qrMode: 'Byte'
}

const QR_CONTENT_ENCODERS = {
  text: passthroughEncoder,
  url: urlEncoder,
  number: numberEncoder,
  base64: base64Encoder,
  wifi: wifiEncoder,
  phone: phoneEncoder,
  vcard: vcardEncoder
} as const satisfies Record<QRContentType, QRContentEncoder<any>>

export function getQRContentEncoder<T extends QRContentType>(contentType: T): typeof QR_CONTENT_ENCODERS[T] {
  return QR_CONTENT_ENCODERS[contentType]
}

// QR error-correction level H tops out near this many bytes at the largest
// symbol version; beyond it qr-code-styling throws instead of rendering.
export const QR_MAX_PAYLOAD_LENGTH = 1273

export function exceedsQRCapacity(payload: string): boolean {
  return payload.length > QR_MAX_PAYLOAD_LENGTH
}
