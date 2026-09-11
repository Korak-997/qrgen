<script setup lang="ts">
import { AppInput } from '@/components'
import { User, Phone, Mail, Building2 } from 'lucide-vue-next'
import type { VCardFields } from '@/types/qr'

interface Props {
  fields: VCardFields
  fieldErrors?: Partial<Record<string, string>>
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <AppInput
      v-model="fields.name"
      label="Full Name"
      placeholder="Jane Doe"
      :icon="User"
      :error="fieldErrors?.name"
      size="lg"
    />
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppInput
        v-model="fields.phone"
        label="Phone Number"
        type="tel"
        placeholder="+1 555 123 4567"
        :icon="Phone"
        :error="fieldErrors?.phone"
      />
      <AppInput
        v-model="fields.email"
        label="Email"
        type="email"
        placeholder="jane@example.com"
        :icon="Mail"
        :error="fieldErrors?.email"
      />
    </div>
    <AppInput
      v-model="fields.org"
      label="Organization"
      placeholder="Acme Inc."
      :icon="Building2"
    />
  </div>
</template>
