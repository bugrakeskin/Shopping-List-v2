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
    <div v-else-if="purchaseHistoryStore.items.length === 0" class="text-center py-12">
      <UIcon name="material-symbols:history" class="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400">Henüz geçmiş kayıt bulunmuyor</p>
    </div>

    <!-- Items List -->
    <div v-else class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div class="max-h-[calc(100vh-16rem)] md:max-h-[calc(100vh-20rem)] overflow-auto">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="item in purchaseHistoryStore.items" :key="item.id" class="p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div class="flex items-center gap-3">
              <UIcon name="material-symbols:check-circle-outline" class="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <span class="text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                {{ item.item_name || "Silinmiş Ürün" }}
              </span>
            </div>
            <time :datetime="item.created_at" class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {{ formatDate(item.created_at) }}
            </time>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePurchaseHistoryStore } from "~/stores/purchaseHistoryStore";
import { onMounted } from "vue";

const purchaseHistoryStore = usePurchaseHistoryStore();

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fetch items when component mounts
onMounted(() => {
  purchaseHistoryStore.fetchAndSubscribe();
});
</script>

<style></style>
