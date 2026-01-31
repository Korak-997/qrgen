import { reactive, computed, toRefs } from 'vue'
import {
  type QRStyling,
  type QRColors,
  type DotStyle,
  type CornerStyle,
  type LogoType,
  DEFAULT_QR_STYLING
} from '@/types/qr'

/**
 * Composable for managing QR code styling state.
 * Provides reactive state and methods for customizing QR appearance.
 */
export function useQRStyling(initialStyling: Partial<QRStyling> = {}) {
  // Deep merge with defaults
  const state = reactive<QRStyling>({
    logo: { ...DEFAULT_QR_STYLING.logo, ...initialStyling.logo },
    colors: { ...DEFAULT_QR_STYLING.colors, ...initialStyling.colors },
    dotStyle: initialStyling.dotStyle ?? DEFAULT_QR_STYLING.dotStyle,
    cornerStyle: initialStyling.cornerStyle ?? DEFAULT_QR_STYLING.cornerStyle
  })

  // Computed properties
  const hasLogo = computed(() => state.logo.type !== 'none' && state.logo.source !== null)

  const qrCodeStylingOptions = computed(() => ({
    dotsOptions: {
      type: mapDotStyle(state.dotStyle),
      color: state.colors.foreground
    },
    cornersSquareOptions: {
      type: mapCornerStyle(state.cornerStyle),
      color: state.colors.foreground
    },
    cornersDotOptions: {
      type: 'dot' as const,
      color: state.colors.foreground
    },
    backgroundOptions: {
      color: state.colors.background
    },
    imageOptions: hasLogo.value ? {
      crossOrigin: 'anonymous',
      margin: 4,
      imageSize: state.logo.size / 100
    } : undefined,
    image: hasLogo.value ? state.logo.source : undefined
  }))

  // Logo methods
  function setLogo(type: LogoType, source: string | null) {
    state.logo.type = type
    state.logo.source = source
  }

  function setLogoSize(size: number) {
    state.logo.size = Math.min(30, Math.max(15, size))
  }

  function clearLogo() {
    state.logo = { ...DEFAULT_QR_STYLING.logo }
  }

  // Color methods
  function setForeground(color: string) {
    state.colors.foreground = color
  }

  function setBackground(color: string) {
    state.colors.background = color
  }

  function setColors(colors: Partial<QRColors>) {
    Object.assign(state.colors, colors)
  }

  function applyPreset(fg: string, bg: string) {
    state.colors.foreground = fg
    state.colors.background = bg
    state.colors.useGradient = false
  }

  // Style methods
  function setDotStyle(style: DotStyle) {
    state.dotStyle = style
  }

  function setCornerStyle(style: CornerStyle) {
    state.cornerStyle = style
  }

  // Reset
  function reset() {
    Object.assign(state, {
      logo: { ...DEFAULT_QR_STYLING.logo },
      colors: { ...DEFAULT_QR_STYLING.colors },
      dotStyle: DEFAULT_QR_STYLING.dotStyle,
      cornerStyle: DEFAULT_QR_STYLING.cornerStyle
    })
  }

  return {
    // State (reactive refs)
    ...toRefs(state),

    // Computed
    hasLogo,
    qrCodeStylingOptions,

    // Logo methods
    setLogo,
    setLogoSize,
    clearLogo,

    // Color methods
    setForeground,
    setBackground,
    setColors,
    applyPreset,

    // Style methods
    setDotStyle,
    setCornerStyle,

    // Reset
    reset
  }
}

// Helper: Map our dot style to qr-code-styling types
function mapDotStyle(style: DotStyle): 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' {
  return style
}

// Helper: Map our corner style to qr-code-styling types
function mapCornerStyle(style: CornerStyle): 'square' | 'dot' | 'extra-rounded' {
  return style
}
