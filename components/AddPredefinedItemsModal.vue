<!-- UProductModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90">
    <UCard class="w-11/12 md:w-96 rounded shadow-lg">
      <div class="flex items-start justify-between mb-2">
        <!--     <div class="flex items-start justify-between">
          <span class="inline-flex items-baseline mb-2">
            <UIcon name="material-symbols:list-alt-add-outline-rounded" class="self-center w-6 h-6 rounded-full mr-1 text-green-600 dark:text-green-600" />
            <span class="text-xl font-thin">Ürün Ekle</span>
          </span>
        </div> -->
        <div class="-ml-2">
          <div class="flex items-start rounded-md transition duration-500">
            <div class="w-14 p-2 shrink-0">
              <UIcon name="material-symbols-light:list-alt-add-outline" class="h-12 w-12 text-amber-500" />
            </div>
            <div class="p-2">
              <p class="font-semibold text-lg">Ürün Ekle</p>
            </div>
          </div>
        </div>

        <UIcon name="solar:close-circle-outline" class="bg-amber-500 hover:bg-black dark:bg-amber-300 dark:hover:bg-white text-2xl" @click="closeModal" />
      </div>

      <div>
        <UForm class="space-y-4" @submit="handleSubmit" :state="formState">
          <UFormGroup label="Ürün Adı" name="name">
            <UInput v-model="formState.name" placeholder="Ürün Adını Girin" />
          </UFormGroup>

          <UFormGroup label="Ürün Tipi" name="category">
            <USelectMenu 
              placeholder="Ürün Tipini Seçin" 
              v-model="formState.category" 
              :options="[
                'Gıda', 
                'Temizlik', 
                'Kişisel Bakım', 
                'İçecek', 
                'Meyve & Sebze', 
                'Kahvaltılık', 
                'Et & Tavuk', 
                'Süt & Süt Ürünleri', 
                'Atıştırmalık', 
                'Ev Bakım'
              ]" 
            />
          </UFormGroup>

          <UButton variant="solid" color="amber" size="md" block type="submit" :loading="loading">Kaydet</UButton>
        </UForm>

        <!-- Feedback Messages -->
        <UAlert v-if="showSuccessMessage" type="success" title="Başarılı!" description="Ürün başarıyla eklendi." class="mt-4" />
        <UAlert v-if="errorMessage" type="danger" title="Hata!" :description="errorMessage" class="mt-4" />
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
    const capitalizedName = formState.value.name.charAt(0).toLocaleUpperCase("tr-TR") + formState.value.name.slice(1);

    const result = await predefinedItemsStore.addItem(capitalizedName, formState.value.category);

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
