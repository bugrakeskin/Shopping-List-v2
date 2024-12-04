<!-- ShoppingList.vue -->
<template>
  <div class="gap-1 grid pt-2 px-2">
    <div class="-ml-3">
      <div class="flex items-start rounded-md transition duration-500">
        <div class="w-14 p-2 shrink-0">
          <UIcon name="material-symbols-light:select-check-box" class="h-12 w-12 text-amber-500" />
        </div>
        <div class="p-2">
          <p class="font-semibold text-lg">Liste</p>
          <span class="text-amber-400 dark:text-amber-500 text-sm">({{ items?.length || 0 }}) adet ürün listede</span>
        </div>
      </div>
    </div>

    <!-- No Items State -->
    <div v-if="items && items.length === 0">
      <p class="text-center text-gray-500 py-4">Hiç ürün bulunamadı.</p>
    </div>

    <!-- Items Loaded State -->
    <ClientOnly>
      <div v-if="items && items.length > 0" class="max-h-[32vh] border border-gray dark:border-gray-700 font-light p-1 rounded-xl overflow-auto">
        <!-- show items list -->
        <div v-for="item in items" :key="item.id" class="pl-2 py-1 flex items-center justify-between cursor-pointer">
          <div class="flex items-center gap-2">
            <UCheckbox class="scale-100" :modelValue="!!selectedItems[item.id]" @update:modelValue="(checked) => handleItemCheck(checked, item)" name="notifications" />
            <span :class="{ 'line-through': selectedItems[item.id] }" class="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" @click="() => handleItemCheck(true, item)">
              {{ item.predefined_items?.name ?? "Unnamed Item" }}
            </span>
          </div>

          <div v-if="item.predefined_items" class="flex text-gray-500 dark:text-gray-300 items-center rounded-xl px-2 py-1 space-x-1 md:space-x-2">
            <span class="text-xs font-light">{{ formatTimeAgo(item.created_at) }}</span>
            <UIcon :name="getIconType(item.predefined_items?.category || 'default-category')" class="" />
          </div>
          <div v-else class="flex text-gray-500 dark:text-gray-300 items-center">
            <span class="text-xs font-light">{{ formatTimeAgo(item.created_at) }}</span>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>

  <!--   <div class="p-2">
    <div class="flex items-center rounded-md transition duration-500">
      <div class="w-16 p-2 shrink-0">
        <UIcon name="material-symbols:check-box-outline" class="h-12 w-12 text-green-300" />
      </div>
      <div class="p-2">
        <p class="font-semibold text-lg">Liste</p>
        <span class="text-gray-300">Alışveriş listesindeki ürünler</span>
      </div>
    </div>
  </div> -->
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

// State and Refs
const selectedItems = ref<Record<string, boolean>>({});
const error = ref<string | null>(null);
const isClient = ref(false);

// Store
const shoppingListItemsStore = useShoppingListItemsStore();
const { items, loading: isLoading } = storeToRefs(shoppingListItemsStore);
const nuxtApp = useNuxtApp();

// Initialize from localStorage on client-side only
onMounted(() => {
  onNuxtReady(async () => {
    try {
      isClient.value = true;
      const stored = localStorage.getItem("selectedItems");
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          if (typeof parsedData === "object" && parsedData !== null && !Array.isArray(parsedData)) {
            // Validate each item
            const validatedData: Record<string, boolean> = {};
            for (const [key, value] of Object.entries(parsedData)) {
              if (typeof key === "string" && typeof value === "boolean") {
                validatedData[key] = value;
              }
            }
            selectedItems.value = validatedData;
          } else {
            localStorage.removeItem("selectedItems");
            selectedItems.value = {};
          }
        } catch (parseError) {
          console.error("Error parsing stored data:", parseError);
          localStorage.removeItem("selectedItems");
          selectedItems.value = {};
        }
      }

      await shoppingListItemsStore.fetchAndSubscribe();
    } catch (err) {
      console.error("Error initializing shopping list:", err);
      error.value = "Failed to initialize shopping list. Please try refreshing the page.";
    }
  });
});

// Watch selectedItems changes and update localStorage
watch(
  selectedItems,
  (newValue) => {
    if (nuxtApp.isHydrating || !isClient.value) return;

    try {
      // Validate data before saving
      const validatedData: Record<string, boolean> = {};
      let hasValidData = false;

      for (const [key, value] of Object.entries(newValue)) {
        if (typeof key === "string" && typeof value === "boolean") {
          validatedData[key] = value;
          hasValidData = true;
        }
      }

      if (hasValidData) {
        localStorage.setItem("selectedItems", JSON.stringify(validatedData));
      } else {
        localStorage.removeItem("selectedItems");
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      // If there's an error, clear localStorage to prevent invalid data
      localStorage.removeItem("selectedItems");
    }
  },
  { deep: true }
);

// Format time ago function
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

  return diffInDays === 0 ? "Bugün" : diffInDays === 1 ? "Dün" : `${diffInDays} gün önce`;
};

// Handle checkbox changes
const handleItemCheck = async (checked: boolean, item: any) => {
  if (!item.id) return;

  // Update the local state immediately for UI feedback
  selectedItems.value = {
    ...selectedItems.value,
    [item.id]: checked,
  };

  if (checked) {
    // Delete the item after a short delay to show the strikethrough effect
    setTimeout(async () => {
      try {
        await shoppingListItemsStore.deleteItem(item.id);
        // Remove the item from selectedItems after successful deletion
        const newSelectedItems = { ...selectedItems.value };
        delete newSelectedItems[item.id];
        selectedItems.value = newSelectedItems;
      } catch (error) {
        console.error("Error deleting item:", error);
        // Revert the checkbox state if deletion fails
        selectedItems.value = {
          ...selectedItems.value,
          [item.id]: false,
        };
      }
    }, 500);
  }
};

// Real-time synchronization
// onMounted(() => {
// 	shoppingListItemsStore.fetchAndSubscribe(); // This ensures that data is fetched and real-time sync starts
// });
</script>
