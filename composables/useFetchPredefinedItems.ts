import type { Database } from "~/types/database.types";

type PredefinedItem = Database['public']['Tables']['predefined_items']['Row'];

export const useFetchPredefinedItems = () => {
  const predefinedItems = ref<PredefinedItem[]>([]);
  const isLoading = ref(true);
  const errorMessage = ref<string | null>(null);

  
  const fetchPredefinedItems = async () => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const client = useSupabaseClient();

      const { data, error } = await client
        .from("predefined_items")
        .select("id, created_at, name, category")
        .order("created_at", { ascending: false });

      /* console.log(typeof data); // Verilerin tipini kontrol etmek için
      console.log(Array.isArray(data)); // Verilerin bir dizi olup olmadığını kontrol etmek için
      console.log(JSON.parse(JSON.stringify(data))); // Verilerin JSON olarak parse edilebilir olup olmadığını kontrol etmek için
 */
      if (error) throw error;

      predefinedItems.value = data || [];
    } catch (err) {
      console.error("Error fetching predefined items:", err);
      errorMessage.value = "Failed to load items. Please try again later.";
    } finally {
      isLoading.value = false;
    }
  };

  return { predefinedItems, fetchPredefinedItems, isLoading, errorMessage };
};
