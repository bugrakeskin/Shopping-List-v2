<template>
  <div class="container mx-auto max-w-2xl">
    <div v-if="groupedItems && Object.keys(groupedItems).length > 0">
      <div
        v-for="(items, category) in groupedItems"
        :key="category"
        class="mb-4"
      >
        <button
          class="group w-full flex justify-between items-center py-2 px-4"
        >
          <span class="text-lg font-semibold">{{ category }}</span>
          <span class="text-sm text-gray-500">{{ items.length }} items</span>
        </button>
        <div class="pl-4">
          <div
            v-for="item in items"
            :key="item.id"
            class="py-1 flex items-center"
          >
            <UIcon name="i-heroicons-shopping-bag" class="text-blue-500 mr-2" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PredefinedItem } from "@/types";

// Composable'dan veri çek
const { predefinedItems, fetchItems, isLoading, errorMessage } =
  useFetchPredefinedItems();

// Başlangıçta verileri çek
fetchItems();

const groupedItems = computed(() => {
  return predefinedItems.value.reduce(
    (groups: Record<string, PredefinedItem[]>, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    },
    {}
  );
});
</script>

<style></style>
