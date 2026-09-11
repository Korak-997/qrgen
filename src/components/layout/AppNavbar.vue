<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, Github } from 'lucide-vue-next'

interface NavLink {
  label: string
  href: string
}

interface Props {
  brand?: string
  links?: NavLink[]
}

withDefaults(defineProps<Props>(), {
  brand: 'QRGen',
  links: () => [],
})

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50">
    <!-- Glassmorphism background -->
    <div class="absolute inset-0 glass-panel border-t-0 border-x-0 rounded-none" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand -->
        <a href="/" class="flex items-center gap-3 group">
          <div class="h-10 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
             <img src="/branding/logo-source.png" alt="QRGen Logo" class="h-full w-auto object-contain" />
          </div>
          <span class="text-xl font-bold text-white tracking-tight">
            {{ brand }}
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200 rounded-lg"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- CTA Link (Desktop) -->
        <div class="hidden md:block">
          <slot name="cta">
            <a
              href="https://github.com/Korak-997/qrgen"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-cta inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              <Github class="w-4 h-4" aria-hidden="true" />
              GitHub
            </a>
          </slot>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          aria-haspopup="true"
          :aria-expanded="isMobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" aria-hidden="true" />
          <X v-else class="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 glass-panel border-t-0 rounded-t-none pb-4"
      >
        <div class="px-4 pt-2 space-y-1">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="block px-4 py-3 min-h-11 rounded-xl text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile CTA -->
        <div class="px-4 mt-4">
          <slot name="cta">
            <a
              href="https://github.com/Korak-997/qrgen"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-cta flex items-center justify-center gap-2 px-4 py-3 min-h-11 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              <Github class="w-4 h-4" aria-hidden="true" />
              GitHub
            </a>
          </slot>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- Spacer to prevent content from being hidden behind fixed navbar -->
  <div class="h-16" />
</template>

<style scoped>
.nav-cta {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  box-shadow: var(--shadow-glass);
  color: #1a1a1a;
}

.nav-cta:hover {
  transform: translateY(-1px);
}
</style>
