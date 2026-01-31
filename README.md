<p align="center">
  <img src="public/branding/logo-source.png" alt="QRGen Logo" width="180" height="180" />
</p>

<h1 align="center">QRGen</h1>

<p align="center">
  <strong>🚀 A free, fast, and beautifully crafted QR code generator</strong>
</p>

<p align="center">
  <a href="https://github.com/Korak-997/qrgen/stargazers">
    <img src="https://img.shields.io/github/stars/Korak-997/qrgen?style=for-the-badge&logo=github&color=f59e0b" alt="Stars" />
  </a>
  <a href="https://github.com/Korak-997/qrgen/network/members">
    <img src="https://img.shields.io/github/forks/Korak-997/qrgen?style=for-the-badge&logo=github&color=3b82f6" alt="Forks" />
  </a>
  <a href="https://github.com/Korak-997/qrgen/issues">
    <img src="https://img.shields.io/github/issues/Korak-997/qrgen?style=for-the-badge&logo=github&color=ef4444" alt="Issues" />
  </a>
  <a href="https://github.com/Korak-997/qrgen/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Korak-997/qrgen?style=for-the-badge&color=22c55e" alt="License" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Why QRGen?

Say goodbye to cluttered, ad-ridden QR code generators. **QRGen** is built with one mission: to provide a **free**, **simple**, and **elegant** solution for creating QR codes—without distractions.

<table>
  <tr>
    <td>✅</td>
    <td><strong>100% Free</strong> — No hidden fees, no premium tiers</td>
  </tr>
  <tr>
    <td>🚫</td>
    <td><strong>Zero Ads</strong> — Clean, distraction-free experience</td>
  </tr>
  <tr>
    <td>⚡</td>
    <td><strong>Instant Generation</strong> — Real-time QR code preview</td>
  </tr>
  <tr>
    <td>🎨</td>
    <td><strong>Fully Customizable</strong> — Colors, styles, and logo embedding</td>
  </tr>
  <tr>
    <td>📱</td>
    <td><strong>Mobile-First</strong> — Perfect experience on any device</td>
  </tr>
  <tr>
    <td>🔒</td>
    <td><strong>Privacy-Focused</strong> — No data stored, no tracking</td>
  </tr>
</table>

---

## 🎯 Features

### Core Functionality
- **🔗 URL QR Codes** — Convert any URL into a scannable QR code instantly
- **📥 High-Quality Downloads** — Export as PNG with no watermarks
- **👁️ Live Preview** — See changes in real-time as you type

### Customization Options
- **🎨 Color Schemes** — Customize QR code colors to match your brand
- **📐 Corner Styles** — Choose from square, rounded, or extra-rounded corners
- **✨ Dot Patterns** — Multiple dot style options (square, rounded, dots, etc.)
- **🖼️ Logo Embedding** — Add your logo or image to the center of the QR code
- **😊 Emoji Support** — Embed emojis in your QR codes
- **📱 Social Icons** — Pre-built social media brand icons

### User Experience
- **🌙 Dark Mode** — Elegant dark theme that's easy on the eyes
- **💨 Glassmorphism** — Modern frosted glass visual effects
- **📱 Responsive Design** — Seamless experience from mobile to desktop
- **⚡ Blazing Fast** — Built with Vite for optimal performance

---

## 🚀 Demo

Experience QRGen live: **[QRgen](https://qrgen.korak-dev.uk/)**

<p align="center">
  <em>Generate beautiful QR codes in seconds</em>
</p>

---

## 🏁 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn** / **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Korak-997/qrgen.git
   cd qrgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173` to see QRGen in action!

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="100">
      <img src="https://vuejs.org/images/logo.svg" width="48" height="48" alt="Vue.js" />
      <br /><strong>Vue 3</strong>
      <br /><sub>UI Framework</sub>
    </td>
    <td align="center" width="100">
      <img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
      <br /><strong>Vite</strong>
      <br /><sub>Build Tool</sub>
    </td>
    <td align="center" width="100">
      <img src="https://www.typescriptlang.org/icons/icon-48x48.png" width="48" height="48" alt="TypeScript" />
      <br /><strong>TypeScript</strong>
      <br /><sub>Type Safety</sub>
    </td>
    <td align="center" width="100">
      <img src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190e4f1e5b3b8a94b1e3f3.svg" width="48" height="48" alt="Tailwind CSS" />
      <br /><strong>Tailwind</strong>
      <br /><sub>Styling</sub>
    </td>
    <td align="center" width="100">
      <img src="https://raw.githubusercontent.com/saadeghi/daisyui/master/src/docs/static/images/daisyui-logo/daisyui-logomark.svg" width="48" height="48" alt="DaisyUI" />
      <br /><strong>DaisyUI</strong>
      <br /><sub>Components</sub>
    </td>
  </tr>
</table>

### Key Dependencies

- **[qr-code-styling](https://github.com/nicklasryskin/qr-code-styling)** — Advanced QR code generation with styling options
- **[vue-advanced-cropper](https://advanced-cropper.github.io/vue-advanced-cropper/)** — Image cropping for logo uploads
- **[lucide-vue-next](https://lucide.dev/)** — Beautiful open-source icons
- **[@vueuse/core](https://vueuse.org/)** — Essential Vue composition utilities

---

## 📁 Project Structure

```
qrgen/
├── 📂 public/
│   ├── 📂 branding/          # Logo and branding assets
│   ├── 📂 icons/             # App icons for PWA
│   ├── 📄 manifest.json      # PWA manifest
│   └── 📄 robots.txt         # SEO configuration
├── 📂 src/
│   ├── 📂 assets/            # Static assets
│   ├── 📂 components/
│   │   ├── 📂 common/        # Reusable UI components
│   │   ├── 📂 icons/         # Icon components
│   │   └── 📂 qr/            # QR-specific components
│   ├── 📂 composables/       # Vue composables
│   ├── 📂 types/             # TypeScript type definitions
│   ├── 📄 App.vue            # Root component
│   ├── 📄 main.ts            # Application entry point
│   └── 📄 style.css          # Global styles
├── 📂 docs/                  # Documentation
├── 📄 index.html             # HTML entry point
├── 📄 package.json           # Dependencies and scripts
├── 📄 vite.config.ts         # Vite configuration
└── 📄 vercel.json            # Vercel deployment config
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork the Project**
   ```bash
   git fork https://github.com/Korak-997/qrgen.git
   ```

2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Reporting Issues

Found a bug or have a feature request? Please check our [issue templates](https://github.com/Korak-997/qrgen/issues/new/choose):

- 🐛 **[Bug Report](https://github.com/Korak-997/qrgen/issues/new?template=bug_report.yml)** — Report unexpected behavior
- ✨ **[Feature Request](https://github.com/Korak-997/qrgen/issues/new?template=feature_request.yml)** — Suggest new features

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgments

- [qr-code-styling](https://github.com/nicklasryskin/qr-code-styling) for the powerful QR generation library
- [DaisyUI](https://daisyui.com/) for beautiful, themeable components
- [Lucide Icons](https://lucide.dev/) for the beautiful icon set
- The amazing Vue.js and Vite communities

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/Korak-997">Korak-997</a></strong>
</p>

<p align="center">
  <a href="https://github.com/Korak-997/qrgen">
    ⭐ Star this repository if you find it helpful!
  </a>
</p>
