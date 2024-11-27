<template>
  <div class="container mx-auto max-w-xl">
    <div v-if="isLoading">
      <p class="text-center text-gray-500 py-2">Ürünler Yükleniyor...</p>
    </div>
    <UCard
      v-else-if="groupedItems && Object.keys(groupedItems).length > 0"
      class="text-gray-600 dark:text-gray-300"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="grid">
          <UIcon
            size="40px"
            name="material-symbols:grocery-sharp"
            class="text-green-600 dark:text-green-600"
          />
          <span class="text-xs font-light pl-0.5">Ürünler</span>
        </div>

        <UButton
          square
          color="green"
          class=""
          @click="openModal"
          variant="outline"
          size="sm"
          icon="i-heroicons-plus"
        >
          Ürün Ekle
        </UButton>
      </div>
      <!-- Grouped Catergory Items -->
      <div
        v-for="(items, category) in groupedItems"
        :key="category"
        class="mb-2"
      >
        <UDivider>
          <div class="font-extralight text-sm flex items-end text-gray-400 dark:text-gray-600">
            <UIcon
              :name="getIconType(category)"
              class="mr-1 text-lg"
            />
            <span class="leading-none">{{ category }} ({{ items.length }})</span>
          </div>
        </UDivider>

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
              class="text-green-700 dark:text-green-300 bg-transparent dark:bg-transparent border-0 p-1 mr-3"
              variant="soft"
              icon="solar:cart-plus-outline"
            />
            <UButton
              size="xl"
              class="text-red-500 dark:text-red-300 bg-transparent dark:bg-transparent border-0 p-1"
              variant="soft"
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
  <AddPredefinedItemsModal
    :isOpen="isModalOpen"
    @close="closeModal"
  />
</template>

<script lang="ts" setup>
import type { _padding } from "#tailwind-config/theme";
import { _sm } from "#tailwind-config/theme/typography";
import type { PredefinedItem } from "@/types";

// Composable'dan veri çek
const { predefinedItems, fetchPredefinedItems, isLoading, errorMessage } = useFetchPredefinedItems();

const groupedItems = computed(() => {
  if (!predefinedItems.value || predefinedItems.value.length === 0) {
    return {};
  }

  return predefinedItems.value.reduce((groups: Record<string, PredefinedItem[]>, item) => {
    if (!item.category) {
      console.warn("Kategori alanı eksik olan ürün:", item);
      return groups; // Kategorisi olmayan ürünü atla
    }

    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});
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
