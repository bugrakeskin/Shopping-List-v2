<template>
  <div class="container max-w-xl mx-auto flex items-center justify-between dark:text-gray-500 text-xs text-gray-400 py-4 px-6">
    <div>
      <span>&copy; 2024 BK - {{ getVersion() }}</span>
    </div>
    <div>
      <span>Powered by 🤍 MS</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getVersion } = useVersion();
</script>

<style></style>
