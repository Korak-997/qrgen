# Architecture

This document outlines QRGen's architectural decisions, code organization, and design patterns.

---

## Design Philosophy

### Mobile-First & Responsive

The application is designed for mobile devices first:

- Touch-friendly targets
- Fluid layouts that scale from mobile to desktop
- 100% responsiveness across all breakpoints

### Minimalist UX

- **Clutter-free**: Content has room to breathe
- **Instant feedback**: Users see results immediately
- **Zero friction**: No sign-ups, no ads, no barriers

---

## Code Organization

```
src/
├── components/
│   ├── common/         # Atomic UI elements
│   │   ├── AppButton.vue
│   │   ├── AppInput.vue
│   │   ├── AppAlert.vue
│   │   ├── ImageCard.vue
│   │   └── UploadZone.vue
│   ├── layout/         # Application shell
│   │   └── AppNavbar.vue
│   └── index.ts        # Central exports
├── assets/             # Static files
├── App.vue             # Root component
├── main.ts             # Application entry
└── style.css           # Global styles
```

---

## Architectural Principles

### 1. DRY (Don't Repeat Yourself)

Shared logic is extracted into reusable units:

- **Components** for UI patterns
- **Composables** for stateful logic (planned: `useQRCode`, `useDownload`)
- **Utilities** for pure helper functions

### 2. Single Responsibility

Each component has one clear purpose:

| Component | Responsibility |
|-----------|---------------|
| `AppButton` | Trigger actions |
| `AppInput` | Collect user input |
| `AppAlert` | Display notifications |
| `ImageCard` | Display images with overlay |
| `UploadZone` | Handle file uploads |
| `AppNavbar` | Navigation and branding |

### 3. Extensibility

The architecture supports future features without core refactoring:

- **Wi-Fi QR codes** — Add new input type
- **vCard QR codes** — Add contact form component
- **Color customization** — Extend QR display component

---

## Component Hierarchy

```
App.vue
└── AppNavbar
└── MainContent
    ├── QRGeneratorForm
    │   └── AppInput
    ├── QRDisplay
    │   └── ImageCard
    └── ControlBar
        └── AppButton (Download)
```

---

## Styling Strategy

Layered approach for maintainable styles:

| Layer | Usage | Priority |
|-------|-------|----------|
| **DaisyUI** | Base components | Primary |
| **Tailwind** | Layout & spacing | Secondary |
| **Custom CSS** | Complex effects | Tertiary |

### When to Use Custom CSS

Only when Tailwind utilities cannot achieve the effect:

- Complex gradients
- Custom animations
- Glassmorphism effects

---

## State Management

### Current Approach

Local component state using Vue's Composition API:

```typescript
const url = ref('')
const qrValue = computed(() => url.value || 'https://example.com')
```

### Future Considerations

For complex state (history, settings):

- Pinia store for global state
- LocalStorage for persistence

---

## Data Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  AppInput   │───▶│   QRDisplay  │───▶│  Download   │
│  (URL)      │    │   (Canvas)   │    │  (PNG)      │
└─────────────┘    └──────────────┘    └─────────────┘
     │                    │                   │
     └────────────────────┴───────────────────┘
                    Reactive binding
```

---

## Performance Considerations

1. **Lazy loading** — Components loaded on demand
2. **Debounced input** — QR generation throttled
3. **Canvas rendering** — Efficient QR drawing
4. **Minimal bundle** — Tree-shaking unused code

---

## Future Roadmap

### Planned Composables

| Composable | Purpose |
|------------|---------|
| `useQRCode` | Reactive QR data state |
| `useDownload` | Canvas → Blob → File download |
| `useHistory` | Recently generated codes |

### Planned Features

- Custom QR colors (foreground/background)
- Logo embedding in QR center
- Batch generation
- URL shortening integration
