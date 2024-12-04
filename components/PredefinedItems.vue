<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 mt-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <UIcon name="material-symbols-light:grocery" class="h-8 w-8 sm:h-10 sm:w-10 text-amber-500" />
        <div>
          <h2 class="text-lg sm:text-xl font-semibold">Ürünler</h2>
          <span class="text-amber-400 dark:text-amber-500 text-sm"> Toplam Ürün ({{ items?.length || 0 }}) </span>
        </div>
      </div>
      <UButton color="amber" @click="isModalOpen = true" variant="solid" size="sm" class="hidden sm:flex" icon="material-symbols:list-alt-add-outline-rounded"> Ürün Ekle </UButton>
    </div>

    <div class="space-y-4">
      <UInput v-model="searchQuery" color="white" size="md" class="w-full" variant="outline" placeholder="Ürün ara..." icon="i-heroicons-magnifying-glass-20-solid" @input="handleSearch" />

      <!-- Arama Sonuçları -->
      <div v-if="searchQuery && searchResults.length" class="border rounded-lg p-4 mb-4">
        <h3 class="text-sm font-medium mb-3">Arama Sonuçları</h3>
        <div class="space-y-2">
          <div v-for="item in searchResults" :key="item.id" class="flex items-center justify-between p-2 bg-amber-50 dark:bg-gray-900 rounded-lg">
            <span class="text-gray-800 dark:text-white text-sm">{{ item.name }}</span>
            <div class="flex space-x-2">
              <UButton square color="amber" size="sm" class="tap-button" variant="solid" icon="solar:cart-plus-outline" @click="addItemToShoppingList(item)" />
              <UButton square color="red" size="sm" class="tap-button" variant="solid" icon="solar:trash-bin-minimalistic-outline" @click="deleteFromPredefinedItems(item)" />
            </div>
          </div>
        </div>
      </div>

      <div class="sm:hidden">
        <UButton block color="amber" @click="isModalOpen = true" variant="solid" size="sm" icon="material-symbols:list-alt-add-outline-rounded"> Ürün Ekle </UButton>
      </div>

      <ClientOnly>
        <div v-if="!isLoading && items">
          <div v-if="items.length" class="px-1 rounded-xl overflow-hidden">
            <UAccordion v-for="(section, idx) in processedItems" :key="idx" color="white" variant="solid" :items="[section]" class="[&>:not(:last-child)]:border-b dark:border-gray-700">
              <template #item="{ item }">
                <div class="space-y-3 py-2">
                  <div v-for="content in item.content" :key="content.id" class="px-4 flex items-center justify-between py-2 transition-colors rounded-lg">
                    <span class="text-gray-800 dark:text-white text-sm sm:text-base">
                      {{ content.name }}
                    </span>
                    <div class="flex space-x-2">
                      <UButton square color="amber" size="sm" class="tap-button" variant="solid" icon="solar:cart-plus-outline" @click="addItemToShoppingList(content)" />
                      <UButton square color="red" size="sm" class="tap-button" variant="solid" icon="solar:trash-bin-minimalistic-outline" @click="deleteFromPredefinedItems(content)" />
                    </div>
                  </div>
                </div>
              </template>
            </UAccordion>
          </div>
          <p v-else class="text-center text-gray-500 dark:text-gray-400 py-8">Hiç ürün bulunamadı.</p>
        </div>
      </ClientOnly>
    </div>
  </div>
  <AddPredefinedItemsModal :isOpen="isModalOpen" @close="isModalOpen = false" />
</template>

<script lang="ts" setup>
import type { Database } from "~/types/database.types";
type PredefinedItem = Database["public"]["Tables"]["predefined_items"]["Row"];
import { usePredefinedItemsStore } from "~/stores/predefinedItemsStore";
import { useShoppingListItemsStore } from "~/stores/shoppingListItemsStore";
import { getIconType } from "~/composables/useGetIconType";

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

  // Format items for accordion without search filtering
  return Object.entries(groupedItems).map(([category, categoryItems]) => ({
    label: `${category} (${categoryItems.length})`,
    icon: getIconType(category),
    content: categoryItems,
  }));
});

const searchQuery = ref("");
const searchResults = ref<PredefinedItem[]>([]);

// Arama işlemi
const handleSearch = () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  searchResults.value = items.value?.filter((item) => item.name?.toLowerCase().includes(query)) || [];
};

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

<style scoped>
.tap-button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.tap-button:active {
  transform: scale(0.97);
  animation: wiggle 0.1s ease;
}

@keyframes wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-3deg);
  }
  75% {
    transform: rotate(3deg);
  }
}
</style>
