<template>
  <div class="container mx-auto max-w-xl p-4">
    <div v-if="isLoading">
      <p class="text-center text-gray-500 py-2">Ürünler Yükleniyor...</p>
    </div>
    <UCard
      v-else-if="groupedItems && Object.keys(groupedItems).length > 0"
      class="text-gray-600 dark:text-gray-300"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <p class="font-semibold text-xl">Ürünler</p>
        <UButton
          @click="openModal"
          variant="outline"
          q
          size="xs"
          icon="i-heroicons-plus"
        >
          Ürün Ekle
        </UButton>
      </div>
      <!-- Grouped Items -->
      <div
        v-for="(items, category) in groupedItems"
        :key="category"
        class="mb-2"
      >
        <!-- Category -->
        <div
          class="flex items-center mb-1 justify-between dark:text-gray-00 text-gray-400"
        >
          <!-- Left Side -->
          <div class="flex space-x-1">
            <UIcon
              size="15px"
              :name="getIconType(category)"
              class="text-green-600 dark:text-green-300"
            />
            <span class="leading-none">{{ category }}</span>
          </div>

          <!-- Right Side -->
          <span class="text-xs">{{ items.length }} ürün</span>
        </div>

        <!-- item list -->
        <div
          v-for="item in items"
          :key="item.id"
          class="py-1 pl-2 flex items-center justify-between cursor-pointer"
        >
          <!-- left side -->
          <div>
            <span class="leading-none text-lg md:text-md">{{ item.name }}</span>
          </div>
          <!-- right side -->
          <div class="flex">
            <UButton
              size="xl"
              class="text-green-600 dark:text-green-300 bg-transparent border-0 p-0 mr-3"
              color="white"
              variant="ghost"
              icon="solar:cart-plus-outline"
            />
            <UButton
              size="xl"
              class="text-red-500 dark:text-red-300 border-0 p-0"
              color="white"
              variant="ghost"
              icon="solar:trash-bin-minimalistic-outline"
            />
          </div>
        </div>
      </div>
    </UCard>
    <div v-else>
      <p class="text-center text-gray-500 py-4">Hiç ürün bulunamadı.</p>
    </div>
    <!-- main div -->
  </div>
  <AddPredefinedItemsModal :isOpen="isModalOpen" @close="closeModal" />
</template>

<script lang="ts" setup>
import type { _padding } from "#tailwind-config/theme";
import { _sm } from "#tailwind-config/theme/typography";
import type { PredefinedItem } from "@/types";

// Composable'dan veri çek
const { predefinedItems, fetchPredefinedItems, isLoading, errorMessage } =
  useFetchPredefinedItems();

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
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};
onMounted(() => {
  fetchPredefinedItems(); // Bileşen DOM'a eklendiğinde veriyi çek
});
</script>

<style></style>
