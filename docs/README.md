# QRGen Documentation

Welcome to the QRGen documentation. This guide covers everything you need to know about the project.

## 📚 Table of Contents

| Document | Description |
|----------|-------------|
| [Getting Started](./getting-started.md) | Setup and run the project locally |
| [Architecture](./architecture.md) | Project structure and design patterns |
| [Design System](./design-system.md) | Styling guidelines and theming |
| [Components](./components.md) | UI component API reference |

---

## 🎯 Project Overview

**QRGen** is a free, ad-free QR code generator that provides instant, high-quality PNG downloads without watermarks.

### Core Values

- **Zero Cost** — Free for everyone, forever
- **No Ads** — Clean, distraction-free experience
- **Simplicity** — Instant generation with no barriers
- **Quality** — High-resolution PNG output

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| QR Generation | qrcode.vue |
| Icons | Lucide Vue Next |
| Utilities | VueUse |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/      # Reusable UI components
│   └── layout/      # App shell (Navbar, Footer)
├── assets/          # Static assets
├── App.vue          # Root component
├── main.ts          # Entry point
└── style.css        # Global styles & design tokens
```

---

## 📖 License

MIT © QRGen
