<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  title?: string
  description?: string
  aspectRatio?: 'square' | 'video' | 'portrait'
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  alt: 'Image',
  aspectRatio: 'square',
  hoverable: true,
})
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl"
    :class="{ 'cursor-pointer': hoverable }"
  >
    <!-- Glass panel background -->
    <div class="glass-panel absolute inset-0 z-0" />

    <!-- Image container -->
    <div
      class="relative overflow-hidden"
      :class="{
        'aspect-square': aspectRatio === 'square',
        'aspect-video': aspectRatio === 'video',
        'aspect-[3/4]': aspectRatio === 'portrait',
      }"
    >
      <img
        :src="src"
        :alt="alt"
        class="w-full h-full object-cover transition-transform duration-500 ease-out"
        :class="{ 'group-hover:scale-110': hoverable }"
      />

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity duration-300"
        :class="{ 'group-hover:opacity-80': hoverable }"
      />

      <!-- Shine effect on hover -->
      <div
        v-if="hoverable"
        class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
      />
    </div>

    <!-- Content overlay -->
    <div
      v-if="title || description || $slots.default"
      class="absolute bottom-0 left-0 right-0 p-4 z-10 transform transition-transform duration-300"
      :class="{ 'translate-y-2 group-hover:translate-y-0': hoverable }"
    >
      <h3
        v-if="title"
        class="text-white font-semibold text-lg mb-1 drop-shadow-lg"
      >
        {{ title }}
      </h3>
      <p
        v-if="description"
        class="text-white/70 text-sm line-clamp-2"
      >
        {{ description }}
      </p>
      <slot />
    </div>

    <!-- Action buttons slot -->
    <div
      v-if="$slots.actions"
      class="absolute top-3 right-3 z-10 flex gap-2 opacity-0 transform translate-y-2 transition-all duration-300"
      :class="{ 'group-hover:opacity-100 group-hover:translate-y-0': hoverable }"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  border-radius: inherit;
}
</style>
