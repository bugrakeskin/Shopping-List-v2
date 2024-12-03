<!-- ErrorBoundary.vue -->
<template>
  <div>
    <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
        <p class="text-red-700 dark:text-red-300">{{ error }}</p>
      </div>
      <UButton
        v-if="canRetry"
        class="mt-2"
        color="red"
        variant="soft"
        size="sm"
        @click="retry"
      >
        Tekrar Dene
      </UButton>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, onErrorCaptured } from 'vue'

const props = defineProps<{
  canRetry?: boolean
}>()

const error = ref<string | null>(null)

// Retry function that will reset the error and re-render the slot
const retry = () => {
  error.value = null
}

// Error handler
onErrorCaptured((err: Error) => {
  error.value = err.message
  return false // Prevent error from propagating
})
</script>
