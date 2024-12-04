<template>
  <div class="w-full flex items-center justify-between dark:text-gray-500 text-xs text-gray-400 py-4">
    <div>
      <span>&copy; 2024 BK</span>
    </div>
    <div class="text-center">
      <span>v.{{ getVersion() }}</span>
    </div>
    <div>
      <span>Powered by MS</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getVersion } = useVersion();
</script>

<style></style>
