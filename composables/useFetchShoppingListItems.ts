import type { Database } from "~/types/database.types";

type ShoppingListItem = Database['public']['Tables']['shopping_list_items']['Row'];

export const useFetchShoppingListItems = () => {
  const shoppingListItems = ref<ShoppingListItem[]>([]);
  const isLoading = ref(true);
  const errorMessage = ref<string | null>(null);

  const fetchShoppingListItems = async () => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const client = useSupabaseClient();

      const { data, error } = await client.from("shopping_list_items").select("created_at,id,item_id, predefined_items(name, category)").order("created_at", { ascending: false });

      /* console.log(typeof data); // Verilerin tipini kontrol etmek için
      console.log(Array.isArray(data)); // Verilerin bir dizi olup olmadığını kontrol etmek için
      console.log(JSON.parse(JSON.stringify(data))); // Verilerin JSON olarak parse edilebilir olup olmadığını kontrol etmek için
 */
      if (error) throw error;

      shoppingListItems.value = data || [];
    } catch (err) {
      console.error("Error fetching predefined items:", err);
      errorMessage.value = "Failed to load items. Please try again later.";
    } finally {
      isLoading.value = false;
    }
  };

  return { shoppingListItems, fetchShoppingListItems, isLoading, errorMessage };
};
