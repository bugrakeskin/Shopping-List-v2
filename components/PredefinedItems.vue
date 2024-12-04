<template>
  <div class="p-2">
    <div class="-ml-2">
      <div class="flex items-start rounded-md transition duration-500">
        <div class="w-14 p-2 shrink-0">
          <UIcon name="material-symbols-light:grocery" class="h-12 w-12 text-amber-500" />
        </div>
        <div class="p-2">
          <p class="font-semibold text-lg">Ürünler</p>
          <span class="text-amber-400 dark:text-amber-500 text-sm">Toplam Ürün ({{ items?.length || 0 }})</span>
        </div>
      </div>
    </div>

    <div class="py-2 flex justify-end items-center">
      <UButton block square color="amber" @click="isModalOpen = true" variant="solid" size="sm" icon="material-symbols:list-alt-add-outline-rounded"> Ürün Ekle </UButton>
    </div>

    <UInput class="w-full py-2" v-model="searchQuery" color="white" size="sm" variant="outline" placeholder="Ürün ara..." icon="i-heroicons-magnifying-glass-20-solid" />

    <ClientOnly>
      <div v-if="!isLoading && items">
        <div v-if="items.length" class="border border-gray dark:border-gray-700 font-light p-2 rounded-xl overflow-auto">
          <UAccordion v-for="(section, idx) in processedItems" :key="idx" color="gray" variant="ghost" :items="[section]">
            <template #item="{ item }">
              <div class="space-y-2">
                <div v-for="content in item.content" :key="content.id" class="pl-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <span
                    class="leading-none text-md md:text-md"
                    :class="{
                      'bg-yellow-100 dark:bg-yellow-800/50': searchQuery && content.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    }"
                  >
                    {{ content.name }}
                  </span>
                  <div class="flex">
                    <UButton size="xl" class="text-green-700 dark:text-green-300 bg-transparent dark:bg-transparent border-0 p-1" variant="soft" icon="solar:cart-plus-outline" @click="addItemToShoppingList(content)" />
                    <UButton size="xl" class="text-red-500 dark:text-red-300 bg-transparent dark:bg-transparent border-0 p-1" variant="soft" icon="solar:trash-bin-minimalistic-outline" @click="deleteFromPredefinedItems(content)" />
                  </div>
                </div>
              </div>
            </template>
          </UAccordion>
        </div>
        <p v-else class="text-center text-gray-500 py-2">Hiç ürün bulunamadı.</p>
      </div>
    </ClientOnly>
  </div>
  <AddPredefinedItemsModal :isOpen="isModalOpen" @close="isModalOpen = false" />
</template>

<script lang="ts" setup>
import type { Database } from "~/types/database.types";
type PredefinedItem = Database["public"]["Tables"]["predefined_items"]["Row"];
import { usePredefinedItemsStore } from "~/stores/predefinedItemsStore";
import { useShoppingListItemsStore } from "~/stores/shoppingListItemsStore";
import { getIconType } from "~/composables/useGetIconType";

const searchQuery = ref("");
const isModalOpen = ref(false);

// Store
const predefinedItemsStore = usePredefinedItemsStore();
const shoppingListStore = useShoppingListItemsStore();
const { items, loading: isLoading } = storeToRefs(predefinedItemsStore);
const error = ref<string | null>(null);

// Initialize data
onMounted(async () => {
  try {
    await predefinedItemsStore.fetchAndSubscribe();
  } catch (err) {
    console.error("Error initializing predefined items:", err);
    error.value = "Failed to load items. Please try refreshing the page.";
  }
});

// Unified computed property for processed items
const processedItems = computed(() => {
  if (!items.value?.length) return [];

  // Group items by category
  const groupedItems = items.value.reduce((groups: Record<string, PredefinedItem[]>, item) => {
    const category = item.category || "Diğer";
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  // Filter and format items for accordion
  return Object.entries(groupedItems)
    .map(([category, categoryItems]) => {
      const filteredItems = searchQuery.value ? categoryItems.filter((item) => item.name?.toLowerCase().includes(searchQuery.value.toLowerCase())) : categoryItems;

      if (searchQuery.value && !filteredItems.length) return null;

      return {
        label: `${category} ${searchQuery.value ? `(${filteredItems.length} sonuç)` : `(${filteredItems.length})`}`,
        icon: getIconType(category),
        content: filteredItems,
        defaultOpen: searchQuery.value ? true : false,
      };
    })
    .filter(Boolean) as { label: string; icon: string; content: PredefinedItem[]; defaultOpen: boolean }[];
});

// Action handlers
const deleteFromPredefinedItems = async (item: PredefinedItem) => {
  try {
    await predefinedItemsStore.deleteItem(item.id);
    useToast().add({
      title: "Bravo!",
      description: "Ürün başarıyla silindi",
      color: "green",
      icon: "i-heroicons-check-circle",
      timeout: 3000,
    });
  } catch (error) {
    useToast().add({
      title: "Maalesef!",
      description: "Ürün silinirken bir hata oluştu",
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
      timeout: 3000,
    });
    console.error("Failed to delete item:", error);
  }
};

const addItemToShoppingList = async (item: PredefinedItem) => {
  try {
    await shoppingListStore.addItemToShoppingList(item);
    useToast().add({
      title: "Bravo!",
      description: "Ürün alışveriş listenize eklendi.",
      color: "green",
      icon: "i-heroicons-check-circle",
      timeout: 3000,
    });
  } catch (error) {
    useToast().add({
      title: "Selam",
      description: "Ürün zaten alışveriş listenizde bulunuyor.",
      color: "yellow",
      icon: "i-heroicons-exclamation-triangle",
      timeout: 3000,
    });
    console.error("Failed to add item to shopping list:", error);
  }
};
</script>
