<template>
  <div class="">
    <div v-if="isLoading" class="flex flex-col items-center justify-center space-y-4 p-10">
      <div class="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
      <div class="text-amber-500 font-medium">Yükleniyor</div>
    </div>
    <template v-else>
      <ErrorBoundary can-retry>
        <div>
          <ShoppingList />
        </div>
      </ErrorBoundary>
      <ErrorBoundary can-retry>
        <PredefinedItems />
      </ErrorBoundary>
    </template>
  </div>
</template>

<script lang="ts" setup>
import ErrorBoundary from "~/components/ErrorBoundary.vue";
import { ref, onMounted } from "vue";

const isLoading = ref(true);

onMounted(() => {
  // Simüle edilmiş yükleme süresi (isteğe bağlı olarak değiştirilebilir)
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});
</script>

<style></style>
