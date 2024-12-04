<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-center space-x-4 mb-6">
      <UIcon name="material-symbols-light:history" class="h-8 w-8 sm:h-10 sm:w-10 text-amber-500" />
      <div>
        <h2 class="text-lg sm:text-xl font-semibold">Geçmiş</h2>
        <span class="text-amber-400 dark:text-amber-500 text-sm">Satın alınan ürünler</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="purchaseHistoryStore.loading" class="flex items-center justify-center gap-3 py-8">
      <div class="w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
      <span class="text-amber-500 text-sm font-medium">Yükleniyor...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!purchaseHistoryStore.items?.length" class="text-center py-12">
      <UIcon name="material-symbols:history" class="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400">Henüz geçmiş kayıt bulunmuyor</p>
    </div>

    <!-- Items List -->
    <div v-else class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div class="max-h-[calc(100vh-16rem)] md:max-h-[calc(100vh-20rem)] overflow-auto">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <template v-for="(items, date) in groupedItems" :key="date">
            <div class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <div class="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ date }}</span>
              </div>
              <template v-for="item in items" :key="item.id">
                <div class="p-3 sm:p-4 flex items-center justify-between transition-colors">
                  <div class="flex items-center gap-3">
                    <UIcon name="material-symbols:check-circle-outline" class="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span class="text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {{ item.predefined_items?.name || "Silinmiş Ürün" }}
                    </span>
                  </div>
                  <time :datetime="item.created_at" class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {{ formatTime(item.created_at) }}
                  </time>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePurchaseHistoryStore } from "~/stores/purchaseHistoryStore";
import { onMounted, computed } from "vue";
import type { Database } from "~/types/database.types";

type PurchaseHistoryItem = Database["public"]["Tables"]["purchase_history"]["Row"] & {
  predefined_items?: Database["public"]["Tables"]["predefined_items"]["Row"] | null;
};

interface GroupedItems {
  [key: string]: PurchaseHistoryItem[];
}

const purchaseHistoryStore = usePurchaseHistoryStore();

// Group items by date
const groupedItems = computed<GroupedItems>(() => {
  const groups: GroupedItems = {};

  purchaseHistoryStore.items.forEach((item) => {
    if (!item.created_at) return;

    // Use purchase_date if available, otherwise use created_at
    const dateToUse = item.purchase_date || item.created_at;
    const dateObj = new Date(dateToUse);

    if (isNaN(dateObj.getTime())) return;

    // Format date for grouping (without time)
    const date = dateObj.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  });

  // Sort dates in descending order (newest first)
  const sortedGroups: GroupedItems = {};
  Object.keys(groups)
    .sort((a, b) => {
      const dateA = new Date(groups[a][0].created_at);
      const dateB = new Date(groups[b][0].created_at);
      return dateB.getTime() - dateA.getTime();
    })
    .forEach((date) => {
      // Sort items within each group by time (newest first)
      sortedGroups[date] = groups[date].sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeB - timeA;
      });
    });

  return sortedGroups;
});

// Format time only
const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

// Fetch items when component mounts
onMounted(() => {
  purchaseHistoryStore.fetchAndSubscribe();
});
</script>

<style></style>
