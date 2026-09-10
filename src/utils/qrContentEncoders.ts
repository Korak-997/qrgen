/**
 * Per-content-type validation and payload encoding for QR generation.
 * Each QRContentType owns exactly one entry here, keeping validation
 * and payload-building logic isolated and independently testable.
 */
import type { QRContentType } from '@/types/qr'

export interface QRContentValidationResult {
  isValid: boolean
  errorMessage: string
}

export interface QRContentEncoder {
  validate: (rawValue: string) => QRContentValidationResult
  buildPayload: (rawValue: string) => string
  qrMode: 'Numeric' | 'Byte'
}

const URL_PATTERN = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\/\w\-.~:?#[\]@!$&'()*+,;=]*)?$/i
const NUMERIC_PATTERN = /^\d+$/
const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/

function encodeUrl(rawValue: string): string {
  const trimmedValue = rawValue.trim()
  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`
}

const passthroughEncoder: QRContentEncoder = {
  validate: (rawValue) => {
    const trimmedValue = rawValue.trim()
    return trimmedValue
      ? { isValid: true, errorMessage: '' }
      : { isValid: false, errorMessage: 'Please enter some text' }
  },
  buildPayload: (rawValue) => rawValue.trim(),
  qrMode: 'Byte'
}

const QR_CONTENT_ENCODERS: Record<QRContentType, QRContentEncoder> = {
  text: passthroughEncoder,
  url: {
    validate: (rawValue) => {
      const trimmedValue = rawValue.trim()
      if (!trimmedValue) return { isValid: false, errorMessage: 'Please enter a URL' }
      return URL_PATTERN.test(trimmedValue)
        ? { isValid: true, errorMessage: '' }
        : { isValid: false, errorMessage: 'Please enter a valid URL' }
    },
    buildPayload: encodeUrl,
    qrMode: 'Byte'
  },
  number: {
    validate: (rawValue) => {
      const trimmedValue = rawValue.trim()
      if (!trimmedValue) return { isValid: false, errorMessage: 'Please enter a number' }
      return NUMERIC_PATTERN.test(trimmedValue)
        ? { isValid: true, errorMessage: '' }
        : { isValid: false, errorMessage: 'Digits only (0-9), no spaces or symbols' }
    },
    buildPayload: (rawValue) => rawValue.trim(),
    qrMode: 'Numeric'
  },
  base64: {
    validate: (rawValue) => {
      const trimmedValue = rawValue.trim()
      if (!trimmedValue) return { isValid: false, errorMessage: 'Please enter a base64 string' }
      if (trimmedValue.length % 4 !== 0 || !BASE64_PATTERN.test(trimmedValue)) {
        return { isValid: false, errorMessage: 'Please enter a valid base64 string' }
      }
      return { isValid: true, errorMessage: '' }
    },
    buildPayload: (rawValue) => rawValue.trim(),
    qrMode: 'Byte'
  }
}

export function getQRContentEncoder(contentType: QRContentType): QRContentEncoder {
  return QR_CONTENT_ENCODERS[contentType]
}

// QR error-correction level H tops out near this many bytes at the largest
// symbol version; beyond it qr-code-styling throws instead of rendering.
export const QR_MAX_PAYLOAD_LENGTH = 1273

export function exceedsQRCapacity(payload: string): boolean {
  return payload.length > QR_MAX_PAYLOAD_LENGTH
}
