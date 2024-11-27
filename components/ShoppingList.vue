<template>
  <div class="container mx-auto max-w-xl mb-4">
    <!-- Loading State -->
    <div v-if="isLoading">
      <p class="text-center text-gray-500 py-2">Ürünler Yükleniyor...</p>
    </div>
    <!-- No Items State -->
    <div v-else-if="items.length === 0">
      <p class="text-center text-gray-500 py-4">Hiç ürün bulunamadı.</p>
    </div>
    <!-- Items Loaded State -->
    <UCard v-else>
      <div class="flex items-start justify-between mb-6">
        <div class="grid">
          <UIcon
            size="40px"
            name="material-symbols:check-box-outline-rounded"
            class="text-green-600 dark:text-green-600"
          />
          <span class="text-xs font-light pl-1.5">Liste</span>
        </div>
      </div>

      <!-- show items list -->
      <div
        v-for="item in items"
        :key="item.id"
        class="py-1 pl-2 flex items-center justify-between cursor-pointer"
      >
        <div>checkbox</div>
        <div>{{ item.predefined_items.name }}</div>
        <span>days ago</span>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { ShoppingListItem } from "@/types";
const items = ref<ShoppingListItem[]>([]);

const { shoppingListItems, fetchShoppingListItems, isLoading, errorMessage } = useFetchShoppingListItems();

onMounted(async () => {
  await fetchShoppingListItems();
  items.value = shoppingListItems.value;
});
</script>

<style></style>
