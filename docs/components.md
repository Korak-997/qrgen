# QRGen UI Components

A collection of beautiful, responsive Vue 3 components built with Tailwind CSS v4 and DaisyUI v5, following the glassmorphism design system.

## Table of Contents

- [Installation](#installation)
- [Components](#components)
  - [AppNavbar](#appnavbar)
  - [AppButton](#appbutton)
  - [AppInput](#appinput)
  - [AppAlert](#appalert)
  - [ImageCard](#imagecard)
  - [UploadZone](#uploadzone)

---

## Installation

All components are located in `src/components/` and can be imported from the central export file:

```typescript
import {
  AppNavbar,
  AppButton,
  AppInput,
  AppAlert,
  ImageCard,
  UploadZone,
} from '@/components'
```

> [!NOTE]
> Ensure your `tsconfig.json` has the `@` alias configured to point to `src/`.

---

## Components

### AppNavbar

A responsive navigation bar with glassmorphism styling, mobile hamburger menu, and smooth transitions.

**Location:** `src/components/layout/AppNavbar.vue`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `brand` | `string` | `'QRGen'` | Brand name displayed in the navbar |
| `links` | `NavLink[]` | `[]` | Array of navigation links |

#### NavLink Interface

```typescript
interface NavLink {
  label: string    // Display text
  href: string     // Link URL
  active?: boolean // Highlight as current page
}
```

#### Slots

| Slot | Description |
|------|-------------|
| `cta` | Custom call-to-action button (defaults to "Get Started" button) |

#### Usage

```vue
<script setup lang="ts">
import { AppNavbar } from '@/components'

const links = [
  { label: 'Home', href: '/', active: true },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
]
</script>

<template>
  <AppNavbar :links="links" brand="MyApp">
    <template #cta>
      <button class="btn btn-accent">Sign Up</button>
    </template>
  </AppNavbar>
</template>
```

#### Features

- ✅ Fixed positioning with glassmorphism backdrop
- ✅ Responsive mobile menu with smooth slide animation
- ✅ Active link indicator
- ✅ Hover effects on brand logo
- ✅ Automatic spacer to prevent content overlap

---

### AppButton

A versatile button component with multiple variants, sizes, loading states, and icon support.

**Location:** `src/components/common/AppButton.vue`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'outline' \| 'accent'` | `'primary'` | Visual style of the button |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Size of the button |
| `loading` | `boolean` | `false` | Shows loading spinner and disables button |
| `disabled` | `boolean` | `false` | Disables the button |
| `icon` | `Component` | `undefined` | Vue component to render as icon |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of the icon |
| `block` | `boolean` | `false` | Makes button full-width |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when button is clicked |

#### Usage

```vue
<script setup lang="ts">
import { AppButton } from '@/components'
import { Download, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <!-- Basic variants -->
  <AppButton variant="primary">Primary</AppButton>
  <AppButton variant="accent">Accent</AppButton>
  <AppButton variant="ghost">Ghost</AppButton>
  <AppButton variant="outline">Outline</AppButton>

  <!-- With icon -->
  <AppButton :icon="Download">Download</AppButton>
  <AppButton :icon="ArrowRight" icon-position="right">Next</AppButton>

  <!-- States -->
  <AppButton loading>Saving...</AppButton>
  <AppButton disabled>Disabled</AppButton>

  <!-- Sizes -->
  <AppButton size="sm">Small</AppButton>
  <AppButton size="lg">Large</AppButton>

  <!-- Full width -->
  <AppButton block>Full Width Button</AppButton>
</template>
```

#### Variant Styles

| Variant | Description |
|---------|-------------|
| `primary` | Purple gradient with glow effect |
| `accent` | Pink/magenta gradient with glow |
| `ghost` | Glassmorphism transparent style |
| `outline` | Transparent with border |
| `secondary` | Default DaisyUI secondary |

#### Features

- ✅ Shimmer hover effect animation
- ✅ Gradient backgrounds with box-shadow glow
- ✅ Loading spinner integration
- ✅ Icon support (left/right positioning)
- ✅ Lift effect on hover

---

### AppInput

A styled input field with label, icon, validation states, and focus effects.

**Location:** `src/components/common/AppInput.vue`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | **Required** | v-model binding value |
| `label` | `string` | `undefined` | Label text above input |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `type` | `'text' \| 'url' \| 'email' \| 'password' \| 'number'` | `'text'` | Input type |
| `error` | `string` | `undefined` | Error message (shows red styling) |
| `hint` | `string` | `undefined` | Helper text below input |
| `disabled` | `boolean` | `false` | Disables the input |
| `icon` | `Component` | `undefined` | Icon component for left side |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Input size |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when input value changes |

#### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppInput } from '@/components'
import { Link, Mail, Lock } from 'lucide-vue-next'

const url = ref('')
const email = ref('')
const password = ref('')
</script>

<template>
  <!-- Basic input with label -->
  <AppInput
    v-model="url"
    label="Website URL"
    placeholder="https://example.com"
    hint="Enter the URL you want to convert"
  />

  <!-- With icon -->
  <AppInput
    v-model="url"
    label="URL"
    :icon="Link"
    placeholder="Enter URL..."
  />

  <!-- Error state -->
  <AppInput
    v-model="email"
    label="Email"
    type="email"
    :icon="Mail"
    error="Please enter a valid email address"
  />

  <!-- Password input -->
  <AppInput
    v-model="password"
    label="Password"
    type="password"
    :icon="Lock"
  />

  <!-- Disabled -->
  <AppInput
    v-model="url"
    label="Locked Field"
    disabled
  />
</template>
```

#### Features

- ✅ Glassmorphism styling with blur
- ✅ Focus glow effect (primary color)
- ✅ Error state with red glow
- ✅ Icon color transition on focus
- ✅ Smooth border hover effects

---

### AppAlert

A notification component with multiple types, icons, and dismiss functionality.

**Location:** `src/components/common/AppAlert.vue`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Alert type (determines color and icon) |
| `title` | `string` | `undefined` | Bold title text |
| `dismissible` | `boolean` | `false` | Shows close button |
| `show` | `boolean` | `true` | Controls visibility |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | none | Emitted when dismiss button is clicked |

#### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppAlert } from '@/components'

const showError = ref(true)
</script>

<template>
  <!-- Info alert -->
  <AppAlert type="info" title="Did you know?">
    You can customize your QR code colors!
  </AppAlert>

  <!-- Success alert -->
  <AppAlert type="success" title="Success!">
    Your QR code has been generated.
  </AppAlert>

  <!-- Warning alert -->
  <AppAlert type="warning">
    Please verify the URL before downloading.
  </AppAlert>

  <!-- Dismissible error -->
  <AppAlert
    type="error"
    title="Error"
    dismissible
    :show="showError"
    @dismiss="showError = false"
  >
    Failed to generate QR code. Please try again.
  </AppAlert>
</template>
```

#### Alert Types

| Type | Color | Icon |
|------|-------|------|
| `info` | Blue | ℹ️ Info circle |
| `success` | Green | ✓ Check circle |
| `warning` | Orange/Yellow | ⚠️ Warning triangle |
| `error` | Red | ⊗ Alert circle |

#### Features

- ✅ Automatic icon based on type
- ✅ Smooth enter/leave transitions (scale + fade)
- ✅ Gradient overlay for depth
- ✅ Backdrop blur effect
- ✅ Dismissible with X button

---

### ImageCard

A card component for displaying images with hover effects, overlays, and action buttons.

**Location:** `src/components/common/ImageCard.vue`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **Required** | Image source URL |
| `alt` | `string` | `'Image'` | Alt text for accessibility |
| `title` | `string` | `undefined` | Title displayed on overlay |
| `description` | `string` | `undefined` | Description text (max 2 lines) |
| `aspectRatio` | `'square' \| 'video' \| 'portrait'` | `'square'` | Image aspect ratio |
| `hoverable` | `boolean` | `true` | Enable hover effects |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Additional content below title/description |
| `actions` | Action buttons (top-right, visible on hover) |

#### Usage

```vue
<script setup lang="ts">
import { ImageCard, AppButton } from '@/components'
import { Download, Heart, Share2 } from 'lucide-vue-next'
</script>

<template>
  <!-- Basic card -->
  <ImageCard
    src="/images/qr-code.png"
    title="My QR Code"
    description="Generated on Jan 31, 2026"
  />

  <!-- With action buttons -->
  <ImageCard
    src="/images/qr-code.png"
    title="QR Code"
    aspect-ratio="square"
  >
    <template #actions>
      <AppButton variant="ghost" size="sm" :icon="Heart" />
      <AppButton variant="ghost" size="sm" :icon="Share2" />
      <AppButton variant="ghost" size="sm" :icon="Download" />
    </template>
  </ImageCard>

  <!-- Video aspect ratio -->
  <ImageCard
    src="/images/banner.jpg"
    title="Wide Banner"
    aspect-ratio="video"
  />

  <!-- Portrait -->
  <ImageCard
    src="/images/portrait.jpg"
    aspect-ratio="portrait"
  />

  <!-- Non-hoverable (static) -->
  <ImageCard
    src="/images/static.png"
    :hoverable="false"
  />
</template>
```

#### Aspect Ratios

| Value | Ratio | Use Case |
|-------|-------|----------|
| `square` | 1:1 | QR codes, avatars |
| `video` | 16:9 | Banners, thumbnails |
| `portrait` | 3:4 | Portraits, cards |

#### Features

- ✅ Image zoom on hover (scale 1.1)
- ✅ Shine/shimmer effect on hover
- ✅ Gradient overlay (bottom to top)
- ✅ Action buttons with fade-in
- ✅ Text truncation (2 lines max)

---

### UploadZone

A drag-and-drop file upload component with validation, previews, and animations.

**Location:** `src/components/common/UploadZone.vue`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accept` | `string` | `'image/*'` | Accepted file types (MIME) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `maxSize` | `number` | `5` | Maximum file size in MB |
| `disabled` | `boolean` | `false` | Disable upload functionality |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `upload` | `File[]` | Emitted when valid files are added |
| `error` | `string` | Emitted when validation fails |

#### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UploadZone } from '@/components'

const files = ref<File[]>([])

function handleUpload(uploadedFiles: File[]) {
  files.value = uploadedFiles
  console.log('Files ready:', uploadedFiles)
}

function handleError(message: string) {
  console.error('Upload error:', message)
}
</script>

<template>
  <!-- Basic image upload -->
  <UploadZone
    @upload="handleUpload"
    @error="handleError"
  />

  <!-- Multiple files with larger size limit -->
  <UploadZone
    accept="image/*"
    :max-size="20"
    multiple
    @upload="handleUpload"
    @error="handleError"
  />

  <!-- Accept specific file types -->
  <UploadZone
    accept="image/png,image/jpeg"
    :max-size="10"
    @upload="handleUpload"
  />

  <!-- Disabled state -->
  <UploadZone disabled />
</template>
```

#### File Preview

When files are uploaded, a preview list appears showing:
- File icon (image or document)
- File name (truncated if long)
- File size (formatted: KB/MB)
- Remove button (X)

#### Features

- ✅ Drag-and-drop with visual feedback
- ✅ Click to browse files
- ✅ File type validation
- ✅ File size validation
- ✅ Preview list with remove option
- ✅ Smooth enter/leave animations
- ✅ Pulse animation while dragging

---

## Design System

All components follow the QRGen design system defined in `src/style.css`:

### Colors (OKLCH)

```css
--color-primary: oklch(0.6 0.2 260);   /* Purple */
--color-accent: oklch(0.7 0.15 320);   /* Pink/Magenta */
```

### Glass Panel Utility

```css
.glass-panel {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### Border Radius

```css
--radius-xl: 1.5rem;  /* Used for cards, inputs */
```

---

## Best Practices

1. **Always use v-model** with `AppInput` for two-way binding
2. **Handle upload errors** by listening to the `@error` event on `UploadZone`
3. **Use semantic variants** - `success` for confirmations, `error` for failures
4. **Provide alt text** for `ImageCard` for accessibility
5. **Keep navbar links minimal** - 3-5 items maximum for best UX

---

## TypeScript Support

All components are fully typed. Import types when needed:

```typescript
// NavLink interface for AppNavbar
interface NavLink {
  label: string
  href: string
  active?: boolean
}

// Props are inferred from component definitions
```
