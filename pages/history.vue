<template>
  <div class="container mx-auto px-4 py-4">
    <div class="-ml-2">
      <div class="flex items-start rounded-md transition duration-500">
        <div class="w-14 p-2 shrink-0">
          <UIcon name="material-symbols-light:history" class="h-12 w-12 text-amber-500" />
        </div>
        <div class="p-2">
          <p class="font-semibold text-lg">Geçmiş</p>
          <span class="text-amber-400 dark:text-amber-500 text-sm">Satın alınan ürünler </span>
        </div>
      </div>
    </div>
    <div v-if="purchaseHistoryStore.loading" class="flex justify-center items-center py-8">
      <!--       <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
 -->
      <div class="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
      <div class="text-amber-500 font-medium">Yükleniyor</div>
    </div>

    <div v-else-if="purchaseHistoryStore.items.length === 0" class="text-center py-8 text-gray-500">Henüz geçmiş kayıt bulunmuyor</div>

    <div v-else class="grid gap-4 max-h-[calc(100vh-12rem)] overflow-auto p-2">
      <!-- <div>
				<span class="inline-flex items-baseline mb-2">
					<UIcon name="ic:round-history" class="self-center w-6 h-6 rounded-full mr-1 text-green-600 dark:text-green-600" />
					<span class="text-xl font-thin">Geçmiş</span>
				</span>
			</div> -->

      <div class="overflow-y-auto">
        <div v-for="item in purchaseHistoryStore.items" :key="item.id" class="rounded-lg p-2 flex items-center justify-between">
          <div>
            <h3 class="font-medium">{{ item.item_name || "Silinmiş Ürün" }}</h3>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-300">
            {{
              new Date(item.created_at).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePurchaseHistoryStore } from "~/stores/purchaseHistoryStore";
import { onMounted } from "vue";

const purchaseHistoryStore = usePurchaseHistoryStore();

// Fetch items when component mounts
onMounted(() => {
  purchaseHistoryStore.fetchAndSubscribe();
});
</script>

<style></style>
