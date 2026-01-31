/**
 * QR Code Customization Types
 * Centralized type definitions for QR styling options
 */

export type LogoType = 'none' | 'icon' | 'image' | 'emoji' | 'social'
export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded'
export type CornerStyle = 'square' | 'dot' | 'extra-rounded'

export interface QRLogo {
  type: LogoType
  source: string | null  // URL, data URI, emoji character, or icon name
  size: number           // Percentage of QR width (15-30)
}

export interface QRGradient {
  type: 'linear' | 'radial'
  rotation?: number      // For linear gradient (0-360)
  colorStops: Array<{
    offset: number       // 0-1
    color: string
  }>
}

export interface QRColors {
  foreground: string
  background: string
  useGradient: boolean
  gradient?: QRGradient
}

export interface QRStyling {
  logo: QRLogo
  colors: QRColors
  dotStyle: DotStyle
  cornerStyle: CornerStyle
}

// Default styling configuration
export const DEFAULT_QR_LOGO: QRLogo = {
  type: 'none',
  source: null,
  size: 20
}

export const DEFAULT_QR_COLORS: QRColors = {
  foreground: '#000000',
  background: '#ffffff',
  useGradient: false
}

export const DEFAULT_QR_STYLING: QRStyling = {
  logo: DEFAULT_QR_LOGO,
  colors: DEFAULT_QR_COLORS,
  dotStyle: 'square',
  cornerStyle: 'square'
}

// Color presets for quick selection
export const COLOR_PRESETS = [
  { name: 'Classic', fg: '#000000', bg: '#ffffff' },
  { name: 'Navy', fg: '#1e3a5f', bg: '#ffffff' },
  { name: 'Forest', fg: '#1a472a', bg: '#ffffff' },
  { name: 'Berry', fg: '#6b2d5c', bg: '#ffffff' },
  { name: 'Sunset', fg: '#c2410c', bg: '#ffffff' },
  { name: 'Ocean', fg: '#0369a1', bg: '#ffffff' },
  { name: 'Dark Mode', fg: '#ffffff', bg: '#1a1a1a' },
  { name: 'Purple Haze', fg: '#7c3aed', bg: '#ffffff' }
] as const

// Social platforms with their brand colors
export const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', color: '#1877f2' },
  { id: 'instagram', name: 'Instagram', color: '#e4405f' },
  { id: 'twitter', name: 'X / Twitter', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0a66c2' },
  { id: 'youtube', name: 'YouTube', color: '#ff0000' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25d366' },
  { id: 'telegram', name: 'Telegram', color: '#0088cc' },
  { id: 'github', name: 'GitHub', color: '#181717' },
  { id: 'discord', name: 'Discord', color: '#5865f2' }
] as const

export type SocialPlatformId = typeof SOCIAL_PLATFORMS[number]['id']
