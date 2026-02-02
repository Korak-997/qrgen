<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'

export interface IconItem {
  id: string
  name: string
  icon?: any  // Component or string
  svg?: string  // Raw SVG string
  imageUrl?: string // URL to image file
  color?: string
}

interface Props {
  items: IconItem[]
  selected?: string | null
  searchable?: boolean
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  selected: null,
  searchable: false,
  searchPlaceholder: 'Search...'
})

const emit = defineEmits<{
  select: [item: IconItem]
}>()

const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.id.toLowerCase().includes(query)
  )
})

function handleSelect(item: IconItem) {
  emit('select', item)
}
</script>

<template>
  <div class="icon-grid">
    <!-- Search -->
    <div v-if="searchable" class="relative mb-3">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="input input-sm w-full bg-white/5 border-white/10 text-white pl-10 focus:border-primary/50"
      />
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-2">
      <button
        v-for="item in filteredItems"
        :key="item.id"
        class="aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        :class="[
          selected === item.id
            ? 'bg-primary/20 border-2 border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]'
            : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
        ]"
        :title="item.name"
        @click="handleSelect(item)"
      >
        <!-- Component icon -->
        <component
          v-if="item.icon"
          :is="item.icon"
          class="w-5 h-5 transition-transform"
          :style="item.color ? { color: item.color } : {}"
        />
        <!-- Image URL -->
        <img
          v-else-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.name"
          class="w-5 h-5 object-contain"
        />
        <!-- SVG string -->
        <span
          v-else-if="item.svg"
          class="w-5 h-5 flex items-center justify-center"
          v-html="item.svg"
        />
        <!-- Fallback text -->
        <span v-else class="text-sm font-medium opacity-70">
          {{ item.name.charAt(0) }}
        </span>
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredItems.length === 0"
      class="text-center py-8 text-white/40 text-sm italic"
    >
      No items found
    </div>
  </div>
</template>

<style scoped>
.icon-grid :deep(svg) {
  display: block;
}
</style>
