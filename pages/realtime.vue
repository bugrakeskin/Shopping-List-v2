<template>
  <div>
    <div v-if="isLoading">Yükleniyor...</div>
    <div v-else>
      <div
        v-for="item in items"
        :key="item.id"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePredefinedItemsStore } from "~~/stores/predefinedItemsStore";

const predefinedItemsStore = usePredefinedItemsStore();
const { items, loading: isLoading } = storeToRefs(predefinedItemsStore);

const { initializeRealtimeSync } = useRealtimeSync();

onMounted(() => {
  initializeRealtimeSync();
});
</script>
