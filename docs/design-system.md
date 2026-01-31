# Design System

QRGen's visual language combines glassmorphism, dark themes, and vibrant accents for a premium, modern feel.

---

## Theme

### Dark Mode Default

The application uses an elegant dark theme:

- Reduces eye strain
- Makes colors pop
- Creates a premium aesthetic

---

## Colors

### Primary Palette (OKLCH)

```css
--color-primary: oklch(0.6 0.2 260);   /* Purple */
--color-accent: oklch(0.7 0.15 320);   /* Pink/Magenta */
```

### Semantic Colors

| Token | Usage |
|-------|-------|
| `primary` | Main actions, links |
| `accent` | Highlights, CTAs |
| `info` | Informational alerts (blue) |
| `success` | Confirmations (green) |
| `warning` | Cautions (orange) |
| `error` | Errors, destructive actions (red) |

---

## Glassmorphism

The signature visual style uses translucent panels with blur:

### Glass Panel Utility

```css
.glass-panel {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### Usage

```html
<div class="glass-panel rounded-2xl p-6">
  <!-- Content -->
</div>
```

---

## Typography

### Font Stack

System fonts for fast loading:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, sans-serif;
```

### Scale

| Size | Class | Usage |
|------|-------|-------|
| XS | `text-xs` | Captions |
| SM | `text-sm` | Secondary text |
| Base | `text-base` | Body text |
| LG | `text-lg` | Subheadings |
| XL | `text-xl` | Headings |
| 2XL+ | `text-2xl` | Display |

---

## Spacing

Consistent spacing using Tailwind's scale:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem | Tight gaps |
| `space-2` | 0.5rem | Icon gaps |
| `space-4` | 1rem | Component padding |
| `space-6` | 1.5rem | Card padding |
| `space-8` | 2rem | Section gaps |

---

## Border Radius

Soft, rounded corners throughout:

```css
--radius-sm: 0.5rem;   /* Buttons, inputs */
--radius-lg: 1rem;     /* Cards */
--radius-xl: 1.5rem;   /* Large panels */
--radius-full: 9999px; /* Pills, avatars */
```

---

## Shadows

### Elevation Levels

| Level | Usage |
|-------|-------|
| `shadow-sm` | Subtle lift |
| `shadow` | Cards, dropdowns |
| `shadow-lg` | Modals, popovers |
| `shadow-2xl` | Focused elements |

### Glow Effects

For interactive elements:

```css
box-shadow: 0 0 20px oklch(0.6 0.2 260 / 0.4);
```

---

## Animation

### Transitions

Smooth state changes:

```css
transition: all 0.2s ease;
```

### Hover Effects

| Effect | Usage |
|--------|-------|
| Scale | Buttons, cards |
| Glow | Interactive elements |
| Shimmer | Premium accents |
| Lift | Clickable items |

### Example: Shimmer

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## Component Variants

### Buttons

| Variant | Style |
|---------|-------|
| `primary` | Purple gradient + glow |
| `accent` | Pink gradient + glow |
| `ghost` | Glassmorphism |
| `outline` | Transparent + border |

### Alerts

| Type | Color |
|------|-------|
| `info` | Blue |
| `success` | Green |
| `warning` | Orange |
| `error` | Red |

---

## Responsive Breakpoints

Mobile-first approach:

| Breakpoint | Width | Target |
|------------|-------|--------|
| (default) | 0+ | Mobile |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## Accessibility

### Focus States

Visible focus indicators for keyboard navigation:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Color Contrast

- Minimum WCAG AA compliance (4.5:1 for text)
- High contrast mode support

### Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Best Practices

1. **Use DaisyUI components** as the foundation
2. **Apply Tailwind utilities** for layout adjustments
3. **Reserve custom CSS** for effects only
4. **Maintain consistency** with design tokens
5. **Test across** mobile and desktop viewports
