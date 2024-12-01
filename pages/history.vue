<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Alışveriş Geçmişi</h1>
    
    <div v-if="purchaseHistoryStore.loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
    
    <div v-else-if="purchaseHistoryStore.items.length === 0" class="text-center py-8 text-gray-500">
      Henüz geçmiş kayıt bulunmuyor
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="item in purchaseHistoryStore.items" :key="item.id" 
           class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <div>
          <h3 class="font-medium">{{ item.item_name || 'Silinmiş Ürün' }}</h3>
          <p class="text-sm text-gray-500">
            {{ new Date(item.created_at).toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePurchaseHistoryStore } from '~/stores/purchaseHistoryStore';
import { onMounted } from 'vue';

const purchaseHistoryStore = usePurchaseHistoryStore();

// Fetch items when component mounts
onMounted(() => {
  purchaseHistoryStore.fetchAndSubscribe();
});
</script>

<style></style>