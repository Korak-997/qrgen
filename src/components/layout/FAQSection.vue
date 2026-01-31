<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Is QRGen really free?",
    answer: "Yes, 100% free forever. No hidden fees, no premium tiers, no subscriptions. We believe QR code generation should be accessible to everyone."
  },
  {
    question: "Do you store my data or QR codes?",
    answer: "No. All QR code generation happens directly in your browser. We don't send your data to any server, and nothing is stored. Your privacy is guaranteed."
  },
  {
    question: "What's the maximum URL length for a QR code?",
    answer: "QR codes can technically hold up to ~4,000 characters, but we recommend keeping URLs under 500 characters for optimal scanning reliability."
  },
  {
    question: "Can I add my logo to the QR code?",
    answer: "Absolutely! Click on the 'Customize' panel to add your own logo, icon, or emoji. You can also change colors and dot patterns."
  },
  {
    question: "What format are the QR codes?",
    answer: "QR codes are downloaded as high-quality PNG files at 300x300 pixels with maximum error correction (Level H), ensuring reliable scanning."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account required! Just enter your URL and download your QR code. It's that simple."
  }
]

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="faq-section mt-16 sm:mt-24" aria-labelledby="faq-heading">
    <h2
      id="faq-heading"
      class="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12"
    >
      Frequently Asked Questions
    </h2>

    <div class="max-w-3xl mx-auto space-y-3">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
        :class="{ 'ring-1 ring-primary/30': openIndex === index }"
      >
        <button
          class="w-full p-5 sm:p-6 flex items-start justify-between gap-4 text-left hover:bg-white/5 transition-colors"
          :aria-expanded="openIndex === index"
          :aria-controls="`faq-answer-${index}`"
          @click="toggle(index)"
        >
          <span class="font-medium text-white">{{ faq.question }}</span>
          <ChevronDown
            class="w-5 h-5 text-white/50 flex-shrink-0 transition-transform duration-300 mt-0.5"
            :class="{ 'rotate-180': openIndex === index }"
          />
        </button>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-48"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-48"
          leave-to-class="opacity-0 max-h-0"
        >
          <div
            v-if="openIndex === index"
            :id="`faq-answer-${index}`"
            class="px-5 sm:px-6 pb-5 sm:pb-6 overflow-hidden"
          >
            <p class="text-white/60 text-sm leading-relaxed">
              {{ faq.answer }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
