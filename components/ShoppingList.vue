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
      <!-- Header -->
      <!--     <UDivider :ui="{ border: { base: 'border-gray-100 dark:border-gray-600' } }">
      <div class="flex items-center justify-center space-x-1">
        <UIcon
          size="30px"
          name="material-symbols:check-box-outline-rounded"
          class="text-green-600 dark:text-green-600"
        />
        <span class="text-xl font-light">Alışveriş Listesi</span>
      </div>
    </UDivider> -->

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
        <UCheckbox
          class="scale-100"
          v-model="selected"
          name="notifications"
          :label="item.predefined_items.name"
        />

        <div class="flex text-gray-500 dark:text-gray-300 items-center  px-2 py-1 space-x-1 md:space-x-2">
          <span class="text-xs font-light">{{ item.formattedDate }}</span>
          <UIcon
            :name="getIconType(item.predefined_items.category)"
            class=""
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { Base } from "#build/components";
import type { ShoppingListItem } from "@/types";

const items = ref<ShoppingListItem[]>([]);
const selected = ref(false);

const { shoppingListItems, fetchShoppingListItems, isLoading, errorMessage } = useFetchShoppingListItems();
const { formatDateDifference } = useDateDifference(); // Composable'dan fonksiyonu al

onMounted(async () => {
  await fetchShoppingListItems();

  // Veriyi işlerken created_at verisini formatla
  items.value = shoppingListItems.value.map((item) => ({
    ...item,
    formattedDate: formatDateDifference(item.created_at), // Yeni bir alan ekle
  }));
});
</script>
