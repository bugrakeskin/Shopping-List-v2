<template>
  <div class="container mx-auto max-w-xl gap-4 grid">
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
      <!--   <UDivider :ui="{ border: { base: 'border-gray-100 dark:border-gray-600' } }">
        <div class="flex items-center justify-center space-x-1 mb-4">
          <UIcon
            size="30px"
            name="material-symbols:grocery-sharp"
            class="text-green-600 dark:text-green-600"
          />
          <span class="text-xl font-light">Ürünler</span>
        </div>
      </UDivider> -->
      <!--   <div class="flex items-center space-x-1 mb-4">
        <div>
          <UIcon
            size="25px"
            name="material-symbols:grocery-sharp"
            class="text-green-600 dark:text-green-600"
          />
        </div>
        <div>
          <span class="text-lg leading-none font-light">Ürünler</span>
        </div>
      </div> -->

      <div>
        <span class="inline-flex items-baseline mb-2">
          <UIcon
            name="material-symbols:grocery-sharp"
            class="self-center w-6 h-6 rounded-full mr-1 text-green-600 dark:text-green-600"
          />
          <span class="text-xl font-thin">Ürünler</span>
        </span>
      </div>

      <!-- Grouped Catergory Items -->
      <div
        v-for="(items, category) in groupedItems"
        :key="category"
        class=""
      >
        <UDivider
          class="pl-2"
          :ui="{ border: { base: 'border-gray-200 dark:border-gray-800' } }"
        >
          <div class="font-extralight text-sm flex items-end text-gray-400 dark:text-gray-600">
            <!--  <UIcon
              :name="getIconType(category)"
              class="self-center  w-5 h-5  "
            /> -->
            <span class="self-center">{{ category }} ({{ items.length }})</span>
            <!--   <span class="inline-flex items-baseline ">
            <UIcon
              :name="getIconType(category)"
              class="self-center rounded-full w-4 h-5  "
            />
            <span class="text-sm text-gray-400 dark:text-gray-600 font-light mr-1 w-16">{{ category }}</span>
          </span> -->
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
              class="text-green-700 dark:text-green-300 bg-transparent dark:bg-transparent border-0 p-1"
              variant="soft"
              icon="solar:cart-plus-outline"
               @click="addItemToShoppingList(item)"
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
      <div class="flex items-start justify-end mt-4">
        <UButton
          block
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

const groupedItems = computed(() => {
  if (!items.value || items.value.length === 0) {
    return {};
  }

  return items.value.reduce((groups: Record<string, PredefinedItem[]>, item) => {
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

//real time
import { storeToRefs } from "pinia";
import { usePredefinedItemsStore } from "~~/stores/predefinedItemsStore";

const predefinedItemsStore = usePredefinedItemsStore();
const { items, loading: isLoading } = storeToRefs(predefinedItemsStore);

const { initializeRealtimeSync } = useRealtimeSync();

onMounted(() => {
  initializeRealtimeSync();
});
</script>

<style></style>
