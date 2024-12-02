<!-- ShoppingList.vue -->
<template>
  <div class="container mx-auto max-w-xl mb-4 gap-4 grid">
    <!-- Loading State -->
    <div v-if="isLoading">
      <UCard class="space-y-4 p-4">
        <!-- Header Skeleton -->
        <div class="flex items-start justify-between mb-4">
          <div class="grid space-y-2">
            <USkeleton class="h-10 w-10 rounded-full" />
            <USkeleton class="h-4 w-16" />
          </div>
        </div>

        <!-- Items Skeleton -->
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
    <!-- No Items State -->
    <div v-else-if="items.length === 0">
      <p class="text-center text-gray-500 py-4">Hiç ürün bulunamadı.</p>
    </div>
    <!-- Items Loaded State -->
    <UCard v-else>

      <div>
        <span class="inline-flex items-baseline mb-2">
          <UIcon
            name="material-symbols:check-box-outline"
            class="self-center w-6 h-6 rounded-full mr-1 text-green-600 dark:text-green-600"
          />
          <span class="text-xl font-thin">Liste</span>
        </span>
      </div>

      <!-- show items list -->
      <div
        v-for="item in items"
        :key="item.id"
        class="pl-2 py-1 flex items-center justify-between cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <UCheckbox
            class="scale-100"
            :modelValue="!!selectedItems[item.id]"
            @update:modelValue="(checked) => handleItemCheck(checked, item)"
            name="notifications"
          />
          <span
            :class="{ 'line-through': selectedItems[item.id] }"
            class="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
            @click="() => handleItemCheck(true, item)"
          >
            {{ item.predefined_items?.name ?? 'Unnamed Item' }}
          </span>
        </div>

        <div
          v-if="item.predefined_items"
          class="flex text-gray-500 dark:text-gray-300 items-center rounded-xl px-2 py-1 space-x-1 md:space-x-2"
        >
          <span class="text-xs font-light">{{ formatTimeAgo(item.created_at) }}</span>
          <UIcon
            :name="getIconType(item.predefined_items?.category || 'default-category')"
            class=""
          />
        </div>
        <div
          v-else
          class="flex text-gray-500 dark:text-gray-300 items-center"
        >
          <span class="text-xs font-light">{{ formatTimeAgo(item.created_at) }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

// State and Refs
const selectedItems = ref<Record<string, boolean>>({});

// Store
const shoppingListItemsStore = useShoppingListItemsStore();
const { items, loading: isLoading } = storeToRefs(shoppingListItemsStore);

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
    [item.id]: checked
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
        console.error('Error deleting item:', error);
        // Revert the checkbox state if deletion fails
        selectedItems.value = {
          ...selectedItems.value,
          [item.id]: false
        };
      }
    }, 500);
  }
};

// Real-time synchronization
onMounted(() => {
  shoppingListItemsStore.fetchAndSubscribe();  // This ensures that data is fetched and real-time sync starts
});

</script>
