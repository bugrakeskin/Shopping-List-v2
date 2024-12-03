<template>
  <div class="container mx-auto max-w-xl px-4 pt-2">
    <UHorizontalNavigation
      :links="links"
      :ui="{
        active: 'text-gray-900 dark:text-white after:bg-amber-400 dark:after:bg-amber-500 after:rounded-full',
      }"
      class="flex justify-center"
    />
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    label: "Alışveriş Listesi",
    icon: "material-symbols:list-alt-check-outline-rounded",

    to: "/",
  },
  {
    label: "Geçmiş",
    icon: "i-heroicons-chart-bar",
    to: "/history",
  },
];
</script>
