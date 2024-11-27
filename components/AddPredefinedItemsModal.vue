<!-- @format -->

<!-- UProductModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90">
    <UCard class="w-11/12 md:w-96 rounded shadow-lg">
      <div class="flex items-start justify-between mb-6">
        <div class="grid">
          <UIcon size="40px" name="material-symbols:list-alt-add-outline-rounded" class="text-green-600 dark:text-green-600" />
          <span class="text-xs font-light pl-1">Ürün Ekleyin</span>
        </div>
        <UIcon
          name="solar:close-circle-outline"
          class="bg-red-500 hover:bg-black dark:bg-red-300 dark:hover:bg-white text-2xl"
          @click="closeModal"
        />
      </div>

      <!-- Modal içeriği buraya gelecek -->
      <div>
        <UForm class="space-y-4" @submit.prevent="" :state="{}">
          <UFormGroup label="Ürün Adı" name="product">
            <UInput v-model="def" placeholder="Ürün Adını Girin" />
          </UFormGroup>

          <UFormGroup label="Ürün Tipi" name="type">
            <USelectMenu placeholder="Ürün Tipini Seçin" v-model="def" :options="['Gıda', 'Temizlik', 'Kişisel Bakım']" />
          </UFormGroup>

          <UButton block type="submit">Kaydet</UButton>
        </UForm>
        <!-- Success Message -->
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const def = ref("");
const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
/* Modal stilleri */
</style>
