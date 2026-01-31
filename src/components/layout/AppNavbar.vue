<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, QrCode } from 'lucide-vue-next'

interface NavLink {
  label: string
  href: string
  active?: boolean
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
            class="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
            :class="link.active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'"
          >
            {{ link.label }}
            <!-- Active indicator -->
            <span
              v-if="link.active"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]"
            />
          </a>
        </div>

        <!-- CTA Button (Desktop) -->
        <div class="hidden md:block">
          <slot name="cta">
            <button class="btn btn-sm btn-primary">
              Get Started
            </button>
          </slot>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          @click="toggleMobileMenu"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
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
            class="block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            :class="link.active ? 'bg-[var(--color-primary)]/20 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile CTA -->
        <div class="px-4 mt-4">
          <slot name="cta">
            <button class="btn btn-primary btn-block">
              Get Started
            </button>
          </slot>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- Spacer to prevent content from being hidden behind fixed navbar -->
  <div class="h-16" />
</template>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border: none;
  box-shadow: 0 4px 15px -3px color-mix(in srgb, var(--color-primary), transparent 60%);
  color: #1a1a1a;
  font-weight: 600;
}

.btn-primary:hover {
  box-shadow: 0 6px 20px -3px color-mix(in srgb, var(--color-primary), transparent 50%);
  transform: translateY(-1px);
}
</style>
