<!-- UProductModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90"
  >
    <UCard class="w-11/12 md:w-96 rounded shadow-lg">
      <div class="flex items-start justify-between mb-6">
        <div class="grid">
          <UIcon
            size="40px"
            name="material-symbols:list-alt-add-outline-rounded"
            class="text-green-600 dark:text-green-600"
          />
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
        <UForm class="space-y-4" @submit="handleSubmit" :state="formState">
          <UFormGroup label="Ürün Adı" name="name">
            <UInput v-model="formState.name" placeholder="Ürün Adını Girin" />
          </UFormGroup>

          <UFormGroup label="Ürün Tipi" name="category">
            <USelectMenu
              placeholder="Ürün Tipini Seçin"
              v-model="formState.category"
              :options="['Gıda', 'Temizlik', 'Kişisel Bakım', 'İçecek']"
            />
          </UFormGroup>

          <UButton block type="submit" :loading="loading">Kaydet</UButton>
        </UForm>

        <!-- Feedback Messages -->
        <UAlert
          v-if="showSuccessMessage"
          type="success"
          title="Başarılı!"
          description="Ürün başarıyla eklendi."
          class="mt-4"
        />
        <UAlert
          v-if="errorMessage"
          type="danger"
          title="Hata!"
          :description="errorMessage"
          class="mt-4"
        />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { usePredefinedItemsStore } from "~/stores/predefinedItemsStore";

const predefinedItemsStore = usePredefinedItemsStore();

const formState = ref({
  name: "",
  category: "",
});

const loading = ref(false);
const showSuccessMessage = ref(false);
const errorMessage = ref("");

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  // Reset form state
  formState.value = {
    name: "",
    category: "",
  };
  showSuccessMessage.value = false;
  errorMessage.value = "";
  emit("close");
};

const handleSubmit = async () => {
  if (!formState.value.name || !formState.value.category) {
    errorMessage.value = "Lütfen tüm alanları doldurun";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  showSuccessMessage.value = false;

  try {
    // Capitalize the first letter of the product name
    const capitalizedName = formState.value.name.charAt(0).toLocaleUpperCase('tr-TR') + formState.value.name.slice(1);
    
    const result = await predefinedItemsStore.addItem(
      capitalizedName,
      formState.value.category
    );

    if (result.error) {
      errorMessage.value = result.error;
    } else {
      showSuccessMessage.value = true;
      // Reset form after successful submission
      formState.value = {
        name: "",
        category: "",
      };
      // Close modal after a short delay
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  } catch (error) {
    errorMessage.value = "Bir hata oluştu";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Modal stilleri */
</style>
