<!-- UProductModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
  >
    <UCard class="sm:w-80 md:w-96 text-black p-4 rounded shadow-lg">
      <!-- <h2 class="text-xl mb-4">Ürün Ekle</h2> -->
      <!-- Modal içeriği buraya gelecek -->
      <div>
        <div class="flex justify-between items-start">
          <h1 class="text-xl mb-4 text-green-600 dark:text-green-300">
            Ürün Ekleyin
          </h1>
          <UIcon
            name="i-heroicons-x-mark"
            class="text-gray-600 dark:text-gray-300 text-xl"
            @click="closeModal"
          />
        </div>

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
