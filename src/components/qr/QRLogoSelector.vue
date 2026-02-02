<script setup lang="ts">
import { ref } from 'vue'
import {
  Image as ImageIcon,
  Smile,
  Share2,
  Sparkles,
  Upload,
  X,
  Link,
  Star,
  Heart,
  Zap,
  Shield,
  Gift,
  Music,
  Camera,
  Coffee,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Check,
  Award,
  Bookmark
} from 'lucide-vue-next'
import { ImageCropper } from '@/components'
import IconGrid, { type IconItem } from '@/components/common/IconGrid.vue'
import { socialIcons } from '@/assets/social'
import { SOCIAL_PLATFORMS, type LogoType } from '@/types/qr'

interface Props {
  selectedType?: LogoType
  selectedSource?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedType: 'none',
  selectedSource: null
})

const emit = defineEmits<{
  select: [type: LogoType, source: string]
  clear: []
}>()

// Tabs
type TabId = 'icons' | 'upload' | 'emoji' | 'social'
const activeTab = ref<TabId>('icons')

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: 'icons', label: 'Icons', icon: Sparkles },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'emoji', label: 'Emoji', icon: Smile },
  { id: 'social', label: 'Social', icon: Share2 }
]

// Icon items from Lucide
const lucideIcons: IconItem[] = [
  { id: 'link', name: 'Link', icon: Link },
  { id: 'star', name: 'Star', icon: Star },
  { id: 'heart', name: 'Heart', icon: Heart },
  { id: 'zap', name: 'Zap', icon: Zap },
  { id: 'shield', name: 'Shield', icon: Shield },
  { id: 'gift', name: 'Gift', icon: Gift },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'camera', name: 'Camera', icon: Camera },
  { id: 'coffee', name: 'Coffee', icon: Coffee },
  { id: 'globe', name: 'Globe', icon: Globe },
  { id: 'mail', name: 'Mail', icon: Mail },
  { id: 'phone', name: 'Phone', icon: Phone },
  { id: 'map-pin', name: 'Location', icon: MapPin },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'clock', name: 'Clock', icon: Clock },
  { id: 'check', name: 'Check', icon: Check },
  { id: 'award', name: 'Award', icon: Award },
  { id: 'bookmark', name: 'Bookmark', icon: Bookmark }
]

// Dynamic import of social icons from src/assets/social-icons
const socialIconModules = import.meta.glob('@/assets/social-icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default'
})

const fileSocialItems: IconItem[] = Object.entries(socialIconModules).map(([path, url]) => {
  // Extract filename from path (e.g., /src/assets/social-icons/discord-1.svg -> discord-1)
  const filename = path.split('/').pop()?.replace('.svg', '') || ''
  // Format name: discord-1 -> Discord
  const name = filename.split('-')[0].charAt(0).toUpperCase() + filename.split('-')[0].slice(1)

  return {
    id: filename,
    name: name,
    imageUrl: url as string
  }
})

const socialItems: IconItem[] = [
  ...SOCIAL_PLATFORMS.map(p => ({
    id: p.id,
    name: p.name,
    svg: socialIcons[p.id],
    color: p.color
  })),
  ...fileSocialItems
]

// Popular emojis for quick selection
const popularEmojis = [
  '⭐', '❤️', '🔥', '✨', '💎', '🎯', '🚀', '💡',
  '🎁', '🏆', '💪', '👍', '✅', '🎉', '💰', '🔗',
  '📱', '💻', '🎵', '📸', '☕', '🌍', '📧', '📞'
]

// Upload state
const uploadedImage = ref<string | null>(null)
const showCropper = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    uploadedImage.value = event.target?.result as string
    showCropper.value = true
  }
  reader.readAsDataURL(file)
  target.value = '' // Reset for re-selection
}

function handleCrop(dataUrl: string) {
  showCropper.value = false
  emit('select', 'image', dataUrl)
}

function handleCropCancel() {
  showCropper.value = false
  uploadedImage.value = null
}

// Selection handlers
function handleIconSelect(item: IconItem) {
  // For Lucide icons, we render to SVG data URI
  const svgString = renderLucideToSvg(item.id)
  emit('select', 'icon', svgString)
}

function handleSocialSelect(item: IconItem) {
  // Handle file-based icons
  if (item.imageUrl) {
    emit('select', 'social', item.imageUrl)
    return
  }

  // Create colored SVG data URI
  const svg = socialIcons[item.id]
  if (!svg) return
  const colored = svg.replace('currentColor', item.color || '#000000')
  const dataUri = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${colored.match(/<path[^>]*\/>/)? colored.match(/<path[^>]*\/>/)?.[0] : ''}</svg>`)}`
  emit('select', 'social', dataUri)
}

function handleEmojiSelect(emoji: string) {
  // Convert emoji to image via canvas
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.font = '96px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, 64, 72)

  const dataUri = canvas.toDataURL('image/png')
  emit('select', 'emoji', dataUri)
}

function handleClear() {
  emit('clear')
}

// Helper to render Lucide icon to SVG data URI
function renderLucideToSvg(iconId: string): string {
  const iconData: Record<string, string> = {
    'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 10 12 10 13 2"/>', // Simplified path for space
    'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    'music': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    'camera': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    'coffee': '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'calendar': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'award': '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    'bookmark': '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>'
  }

  const paths = iconData[iconId] || ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="qr-logo-selector">
    <!-- Cropper view -->
    <template v-if="showCropper && uploadedImage">
      <div class="aspect-square w-full rounded-xl overflow-hidden bg-black mb-4">
        <ImageCropper
          :image-src="uploadedImage"
          :aspect-ratio="1"
          @crop="handleCrop"
          @cancel="handleCropCancel"
        />
      </div>
    </template>

    <!-- Main selector view -->
    <template v-else>
      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-white/5 rounded-xl mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id
            ? 'bg-primary text-white shadow-lg'
            : 'text-white/60 hover:text-white hover:bg-white/10'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab content -->
      <div class="min-h-[250px] relative">
        <!-- Icons tab -->
        <div v-if="activeTab === 'icons'">
          <IconGrid
            :items="lucideIcons"
            searchable
            search-placeholder="Search icons..."
            @select="handleIconSelect"
          />
        </div>

        <!-- Upload tab -->
        <div v-if="activeTab === 'upload'" class="space-y-4">
          <div
            class="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-white/40 hover:bg-white/5 group"
            @click="fileInputRef?.click()"
          >
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon class="w-8 h-8 text-white/60 group-hover:text-primary transition-colors" />
            </div>
            <p class="text-white/80 font-medium mb-1">Click to upload image</p>
            <p class="text-white/50 text-sm">PNG, JPG, or WebP (max 5MB)</p>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <!-- Emoji tab -->
        <div v-if="activeTab === 'emoji'">
          <div class="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-2">
            <button
              v-for="emoji in popularEmojis"
              :key="emoji"
              class="aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
              @click="handleEmojiSelect(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <!-- Social tab -->
        <div v-if="activeTab === 'social'">
          <IconGrid
            :items="socialItems"
            @select="handleSocialSelect"
          />
        </div>
      </div>
    </template>
  </div>
</template>
