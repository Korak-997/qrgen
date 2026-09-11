<script setup lang="ts">
import { AppInput } from '@/components'
import { Wifi, Lock } from 'lucide-vue-next'
import type { WifiFields, WifiSecurity } from '@/types/qr'

interface Props {
  fields: WifiFields
  fieldErrors?: Partial<Record<string, string>>
}

defineProps<Props>()

const SECURITY_OPTIONS: { id: WifiSecurity; label: string }[] = [
  { id: 'WPA', label: 'WPA / WPA2' },
  { id: 'WEP', label: 'WEP' },
  { id: 'nopass', label: 'None (open network)' }
]
</script>

<template>
  <div class="space-y-4">
    <AppInput
      v-model="fields.ssid"
      label="Network Name (SSID)"
      placeholder="My WiFi Network"
      :icon="Wifi"
      :error="fieldErrors?.ssid"
      size="lg"
    />

    <div class="form-control w-full">
      <label class="label" for="wifi-security">
        <span class="label-text text-white/80 font-medium">Security</span>
      </label>
      <select
        id="wifi-security"
        v-model="fields.security"
        class="wifi-select select w-full"
      >
        <option v-for="option in SECURITY_OPTIONS" :key="option.id" :value="option.id">
          {{ option.label }}
        </option>
      </select>
    </div>

    <AppInput
      v-if="fields.security !== 'nopass'"
      v-model="fields.password"
      label="Password"
      type="password"
      placeholder="Enter WiFi password"
      :icon="Lock"
      :error="fieldErrors?.password"
    />

    <label class="flex items-center justify-between gap-3 cursor-pointer w-fit">
      <span class="text-sm font-medium text-white/80">Hidden network</span>
      <input
        v-model="fields.hidden"
        type="checkbox"
        class="wifi-toggle toggle"
      />
    </label>
  </div>
</template>

<style scoped>
.wifi-select {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-glass);
  color: white;
  border-radius: var(--radius-glass);
}

.wifi-select:hover:not(:focus) {
  border-color: rgba(255, 255, 255, 0.2);
}

.wifi-select:focus {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: oklch(0.6 0.2 260 / 0.5);
  outline: none;
}

.wifi-select:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.wifi-select option {
  background-color: #1a1a1a;
  color: white;
}

.wifi-toggle {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
}

.wifi-toggle:checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.wifi-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
