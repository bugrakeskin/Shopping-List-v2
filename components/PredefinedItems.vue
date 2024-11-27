<template>
  <div class="container mx-auto max-w-xl">
    <div v-if="isLoading">
      <UCard class="space-y-4 p-2">
        <!-- Header skeleton -->
        <div class="flex items-start justify-between mb-6">
          <div class="grid space-y-2">
            <USkeleton class="h-10 w-10 rounded-full" />
            <USkeleton class="h-4 w-16" />
          </div>
          <USkeleton class="h-8 w-24 rounded" />
        </div>

        <!-- List item skeletons -->
        <div class="space-y-3">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center justify-between"
          >
            <USkeleton class="h-6 w-6 rounded-full" />
            <USkeleton class="h-4 w-[70%]" />
            <USkeleton class="h-4 w-12" />
          </div>
        </div>
      </UCard>
    </div>
    <UCard v-else-if="groupedItems && Object.keys(groupedItems).length > 0">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center space-x-2">
          <UIcon
            size="30px"
            name="material-symbols:grocery-sharp"
            class="text-green-600 dark:text-green-600"
          />
          <span class="text-xs font-light">Ürünler</span>
        </div>

        <UButton
          square
          color="gray"
          @click="openModal"
          variant="solid"
          size="xs"
          icon="material-symbols:list-alt-add-outline-rounded"
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
          class="pl-2 flex items-center justify-between cursor-pointer"
        >
          <!-- left side -->
          <div>
            <span class="leading-none text-md md:text-md">{{ item.name }}</span>
          </div>
          <!-- right side -->
          <div class="flex">
            <UButton
              size="xl"
              class="text-green-700 dark:text-green-300 bg-transparent dark:bg-transparent border-0"
              variant="soft"
              icon="solar:cart-plus-outline"
            />
            <UButton
              size="xl"
              class="text-red-500 dark:text-red-300 bg-transparent dark:bg-transparent border-0 p-0"
              variant="soft"
              icon="solar:trash-bin-minimalistic-outline"
            />
          </div>
        </div>
      </div>
    </UCard>
    <div v-else>
      <p class="text-center text-gray-500 py-2">Hiç ürün bulunamadı.</p>
    </div>
    <!-- main div -->
  </div>
  <AddPredefinedItemsModal
    :isOpen="isModalOpen"
    @close="closeModal"
  />
</template>

<script lang="ts" setup>
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
