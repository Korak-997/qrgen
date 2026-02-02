# Getting Started

This guide will help you set up QRGen for local development.

---

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** v9+ or **pnpm**

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Korak-997/qrgen.git
cd qrgen
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

---

## IDE Setup

### Recommended: VS Code

Install these extensions for the best experience:

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Volar)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

### Configuration

The project uses `<script setup>` SFCs. Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Project Configuration

### Vite Config

Located at `vite.config.ts`:

- Vue plugin enabled
- Path aliases configured (`@` → `src/`)

### TypeScript

Three config files:

| File | Purpose |
|------|---------|
| `tsconfig.json` | Base configuration |
| `tsconfig.app.json` | App-specific settings |
| `tsconfig.node.json` | Node/build tooling |

---

## Troubleshooting

### Port Already in Use

If port 5173 is busy:

```bash
npm run dev -- --port 3000
```

### Module Not Found

Clear the cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

- Read the [Architecture Guide](./architecture.md) to understand the codebase
- Check the [Design System](./design-system.md) for styling guidelines
- Explore the [Components API](./components.md) for UI reference
