import type { PredefinedItem } from "@/types";

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
