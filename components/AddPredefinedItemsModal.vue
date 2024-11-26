<!-- UProductModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80"
  >
    <UCard class="sm:w-80 md:w-96 rounded shadow-lg">
      <div class="flex justify-between items-start mb-4">
        <p class="font-semibold text-xl">Ürün Ekleyin</p>
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
            <UInput v-model="def" />
          </UFormGroup>

          <UFormGroup label="Ürün Tipi" name="type">
            <USelectMenu
              v-model="def"
              :options="['Gıda', 'Temizlik', 'Kişisel Bakım']"
            />
          </UFormGroup>

          <UButton block type="submit"> Kaydet </UButton>
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
