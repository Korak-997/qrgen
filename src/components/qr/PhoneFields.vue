<script setup lang="ts">
import { AppInput } from '@/components'
import { Phone } from 'lucide-vue-next'
import type { PhoneFields } from '@/types/qr'

interface Props {
  fields: PhoneFields
  fieldErrors?: Partial<Record<string, string>>
}

defineProps<Props>()
</script>

<template>
  <AppInput
    v-model="fields.phone"
    label="Phone Number"
    type="tel"
    placeholder="+1 555 123 4567"
    :icon="Phone"
    :error="fieldErrors?.phone"
    size="lg"
  />
</template>
