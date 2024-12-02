<template>
  <div class="container mx-auto max-w-xl py-4">

    <UHorizontalNavigation
      :links="links"
      class="flex justify-center border-b border-gray-200 dark:border-gray-800"
    />
  </div>
</template>

<script setup lang="ts">
const links = [{
  label: 'Alışveriş Listesi',
  icon: 'material-symbols:list-alt-check-outline-rounded',
  to: '/'
}, {
  label: 'Geçmiş',
  icon: 'i-heroicons-chart-bar',
  to: '/history'
}]
</script>
