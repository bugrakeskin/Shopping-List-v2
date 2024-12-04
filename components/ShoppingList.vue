<!-- ShoppingList.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
    <div class="flex items-center space-x-4 mb-6">
      <UIcon name="material-symbols-light:select-check-box" class="h-8 w-8 sm:h-10 sm:w-10 text-amber-500" />
      <div>
        <h2 class="text-lg sm:text-xl font-semibold">Liste</h2>
        <span class="text-amber-400 dark:text-amber-500 text-sm"> ({{ items?.length || 0 }}) adet ürün listede </span>
      </div>
    </div>

    <!-- No Items State -->
    <div v-if="items && items.length === 0" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">Hiç ürün bulunamadı.</p>
    </div>

    <!-- Items Loaded State -->
    <ClientOnly>
      <div v-if="items && items.length > 0" class="max-h-[43vh] sm:max-h-[50vh] border border-gray-200 dark:border-gray-700 rounded-xl overflow-auto">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="item in items" :key="item.id" class="p-3 sm:p-4 flex items-center justify-between transition-colors">
            <div class="flex items-center gap-3">
              <UCheckbox class="scale-100" :modelValue="!!selectedItems[item.id]" @update:modelValue="(checked) => handleItemCheck(checked, item)" name="notifications" />
              <span :class="{ 'line-through text-gray-400': selectedItems[item.id] }" class="cursor-pointer text-sm sm:text-base" @click="() => handleItemCheck(true, item)">
                {{ item.predefined_items?.name ?? "Unnamed Item" }}
              </span>
            </div>

            <div class="flex items-center space-x-2 sm:space-x-3">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTimeAgo(item.created_at) }}
              </span>
              <UIcon v-if="item.predefined_items" :name="getIconType(item.predefined_items?.category || 'default-category')" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
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

// Constants
const STORAGE_KEY = "selectedItems";

// Safe localStorage operations with debugging
const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      const value = localStorage.getItem(key);
      console.debug(`[SafeLocalStorage] Getting ${key}:`, value);
      return value;
    } catch (e) {
      console.error("[SafeLocalStorage] Error reading:", e);
      return null;
    }
  },
  setItem(key: string, value: string): boolean {
    try {
      // Validate JSON before setting
      JSON.parse(value); // Will throw if invalid JSON
      console.debug(`[SafeLocalStorage] Setting ${key}:`, value);
      localStorage.setItem(key, value);

      // Verify the value was set correctly
      const storedValue = localStorage.getItem(key);
      if (storedValue !== value) {
        console.error("[SafeLocalStorage] Verification failed:", { attempted: value, stored: storedValue });
        return false;
      }
      return true;
    } catch (e) {
      console.error("[SafeLocalStorage] Error writing:", e);
      return false;
    }
  },
  removeItem(key: string): void {
    try {
      console.debug(`[SafeLocalStorage] Removing ${key}`);
      localStorage.removeItem(key);
    } catch (e) {
      console.error("[SafeLocalStorage] Error removing:", e);
    }
  },
};

// Validate data structure
const isValidSelectedItems = (data: unknown): data is Record<string, boolean> => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    console.debug("[Validation] Invalid data structure:", data);
    return false;
  }

  const isValid = Object.entries(data).every(([key, value]) => typeof key === "string" && typeof value === "boolean");

  console.debug("[Validation] Data validation result:", { isValid, data });
  return isValid;
};

// Safe JSON operations
const safeJSON = {
  stringify(data: unknown): string | null {
    try {
      const str = JSON.stringify(data);
      // Verify the result can be parsed back
      JSON.parse(str);
      return str;
    } catch (e) {
      console.error("[SafeJSON] Stringify error:", e);
      return null;
    }
  },
  parse(str: string): unknown {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error("[SafeJSON] Parse error:", e);
      return null;
    }
  },
};

// Initialize from localStorage on client-side only
onMounted(() => {
  onNuxtReady(async () => {
    try {
      isClient.value = true;
      const stored = safeLocalStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsedData = safeJSON.parse(stored);
        if (parsedData && isValidSelectedItems(parsedData)) {
          selectedItems.value = parsedData;
        } else {
          console.warn("[Init] Invalid stored data, resetting");
          safeLocalStorage.removeItem(STORAGE_KEY);
          selectedItems.value = {};
        }
      }

      await shoppingListItemsStore.fetchAndSubscribe();
    } catch (err) {
      console.error("[Init] Error:", err);
      error.value = "Failed to initialize shopping list. Please try refreshing the page.";
    }
  });
});

// Watch selectedItems changes and update localStorage
watch(
  selectedItems,
  (newValue) => {
    if (nuxtApp.isHydrating || !isClient.value) {
      console.debug("[Watch] Skipping update during hydration or non-client state");
      return;
    }

    try {
      if (!isValidSelectedItems(newValue)) {
        console.error("[Watch] Invalid data structure detected");
        safeLocalStorage.removeItem(STORAGE_KEY);
        return;
      }

      const serializedData = safeJSON.stringify(newValue);
      if (!serializedData) {
        console.error("[Watch] Failed to serialize data");
        safeLocalStorage.removeItem(STORAGE_KEY);
        return;
      }

      if (!safeLocalStorage.setItem(STORAGE_KEY, serializedData)) {
        console.error("[Watch] Failed to save to localStorage");
        safeLocalStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("[Watch] Error:", error);
      safeLocalStorage.removeItem(STORAGE_KEY);
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
