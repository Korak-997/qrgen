# QRGen - Project Plan

## 1. Scope and Goal
**Mission:** To democratize QR code generation by providing a free, easy-to-use, and ad-free tool for everyone.

**Core Value Proposition:**
- **Zero Cost:** Free for everyone, forever.
- **No Ads:** A clean, distraction-free user experience.
- **Simplicity:** Instant generation with no barriers to entry.
- **Output:** High-quality PNG downloads without watermarks.

## 2. Design Philosophy
### A. Mobile-First & Responsive
- **Principle:** The application is designed for mobile devices first, ensuring touch targets are accessible and layouts are fluid.
- **Execution:** 100% responsiveness. The UI will adapt seamlessly from mobile portrait modes to wide desktop screens without breaking layout or losing aesthetic appeal.

### B. Aesthetic Direction
- **Theme:** Elegant, **Dark Mode** default.
- **Style:** "Super Fancy" yet intuitive. We will aim for a premium, modern feel using:
  - **Glassmorphism:** Translucent panels with blur effects (leveraging existing `glass-panel` utility).
  - **Vibrant Accents:** Using the defined OKLCH colors for high contrast and visual interest.
  - **Clutter-Free:** Minimalist UI where content breathes.

### C. Technical Styling Strategy
1.  **DaisyUI (Primary):** We effectively leverage DaisyUI components (Inputs, Buttons, Cards) as the foundation to speed up development and ensure consistency.
2.  **Tailwind CSS (Secondary):** Used for layout (Flexbox/Grid), spacing, and typography utilities to fine-tune DaisyUI components.
3.  **Custom CSS (Tertiary):** Strictly limited fallback. Only used when utility classes cannot achieve a specific visual effect (e.g., complex specific gradients or advanced animations).

## 3. App Structure and Code Quality
### A. Architectural Guidelines
- **DRY (Don't Repeat Yourself):** strict adherence to avoiding code duplication. Shared logic must be extracted.
- **Modularity:** Components will be small, atomic, and single-responsibility.
  - *Example:* The "Download Button" is a separate component/composable, not hardcoded into the view.
- **Extensibility:** The code structure will support adding future features (like Wi-Fi QR, Contact VCards, Color customization) without refactoring the core logic.

### B. Code Organization
```text
src/
├── components/
│   ├── common/         # Atomic UI elements (Card, Button, TextInput) - Wrappers around DaisyUI
│   ├── qr/             # Domain-specific components (QRDisplay, QRGeneratorForm)
│   └── layout/         # Application shell (Header, Footer, MainLayout)
├── composables/        # Shared Vue Logic
│   ├── useQRCode.ts    # Reactive state for QR data
│   └── useDownload.ts  # Logic to convert Canvas -> Blob -> File Download
├── types/              # TS Interfaces
└── utils/              # Pure helper functions
```

## 4. MVP Roadmap
**Objective:** A functional Single Page Application (SPA) where a user enters a URL and downloads the Result.

### Phase 1: Foundation & Layout
- Establish the Global Layout (Dark Theme, Glass backgrounds).
- Set up a responsive grid container for the app.

### Phase 2: Core Components
- **QR Display:** Implementation of `qrcode.vue` wrapped in a responsive container.
- **Input Form:** A stylish text input for the URL with validation (checking for empty strings).
- **Control Bar:** A primary action area for the "Download" button.

### Phase 3: Logic Implementation
- Bind Input State to QR Component updates.
- Implement the `download` function to extract the image from the DOM/Canvas and save as PNG.

### Phase 4: Polish & Review
- Verify mobile responsiveness.
- Ensure "Fancy" aesthetic requirements are met.
- Code audit for DRY compliance.
