<template>
  <div>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <NavBar2 class="mb-4" />
        <NuxtPage class="flex-grow" />
        <Footer class="mt-8" />
        <UNotifications />
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
});
</script>
