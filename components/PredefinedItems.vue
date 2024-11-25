<template>
  <div class="container mx-auto max-w-2xl p-4">
    <div v-if="isLoading">
      <p class="text-center text-gray-500 py-2">Ürünler Yükleniyor...</p>
    </div>
    <UCard
      v-else-if="groupedItems && Object.keys(groupedItems).length > 0"
      class="text-gray-600 dark:text-gray-300"
    >
      <div class="flex items-center justify-between mb-4">
        <p class="font-semibold text-xl">Ürün listesi</p>
        <UButton variant="outline" size="sm" icon="i-heroicons-plus">
          Ürün Ekle
        </UButton>
      </div>
      <div
        v-for="(items, category) in groupedItems"
        :key="category"
        class="mb-2"
      >
        <div
          class="group w-full flex mb-1 justify-between items-center text-xs dark:text-gray-300 text-gray-400"
        >
          <div>
            <UIcon name="solar:cart-large-outline" class="mr-1" />
            <span> {{ category }} </span>
          </div>

          <span>{{ items.length }} ürün</span>
        </div>
        <div>
          <div
            v-for="item in items"
            :key="item.id"
            class="py-1 flex items-center justify-between"
          >
            <!-- left side -->
            <div>
              <UIcon
                name="i-heroicons-shopping-bag"
                class="mr-2 text-green-600 dark:text-green-300"
              />
              <span>{{ item.name }}</span>
            </div>
            <!-- right side -->
            <div class="flex space-x-1">
              <UButton
                class="text-green-600 dark:text-green-300"
                color="white"
                variant="solid"
                icon="solar:cart-plus-outline"
              />
              <UButton
                class="text-red-500 dark:text-red-300"
                color="white"
                variant="solid"
                icon="solar:trash-bin-minimalistic-outline"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>
    <div v-else>
      <p class="text-center text-gray-500 py-4">Hiç ürün bulunamadı.</p>
    </div>
  </div>
  <!-- main div -->
</template>

<script lang="ts" setup>
import type { PredefinedItem } from "@/types";

// Composable'dan veri çek
const { predefinedItems, fetchPredefinedItems, isLoading, errorMessage } =
  useFetchPredefinedItems();

// Başlangıçta verileri çek
/* fetchPredefinedItems(); */

const groupedItems = computed(() => {
  if (!predefinedItems.value || predefinedItems.value.length === 0) {
    return {};
  }

  return predefinedItems.value.reduce(
    (groups: Record<string, PredefinedItem[]>, item) => {
      if (!item.category) {
        console.warn("Kategori alanı eksik olan ürün:", item);
        return groups; // Kategorisi olmayan ürünü atla
      }

      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    },
    {}
  );
});
onMounted(() => {
  fetchPredefinedItems(); // Bileşen DOM'a eklendiğinde veriyi çek
});
</script>

<style></style>
