import type { Database } from "~/types/database.types";

type PredefinedItem = Database["public"]["Tables"]["predefined_items"]["Row"];

export const usePredefinedItemsStore = defineStore("predefinedItems", {
  state: () => ({
    items: [] as PredefinedItem[],
    loading: false,
  }),

  actions: {
    // Verileri çek ve realtime aboneliği başlat
    async fetchAndSubscribe() {
      this.loading = true;
      const supabase = useSupabaseClient<Database>();

      try {
        // Verileri Supabase'den çek
        const { data, error } = await supabase
          .from("predefined_items")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Güvenli veri dönüşümü
        this.items = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              created_at: item.created_at,
            }))
          : [];

        // Realtime değişikliklere abone ol
        const channel = supabase
          .channel("predefined_items")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "predefined_items" },
            async (payload) => {
              try {
                switch (payload.eventType) {
                  case "INSERT":
                    if (payload.new) {
                      const newItem: PredefinedItem = {
                        id: payload.new.id,
                        name: payload.new.name,
                        category: payload.new.category,
                        created_at: payload.new.created_at,
                      };
                      this.items.unshift(newItem);
                    }
                    break;
                  case "UPDATE":
                    const index = this.items.findIndex(
                      (item) => item.id === payload.new?.id
                    );
                    if (index !== -1 && payload.new) {
                      const updatedItem: PredefinedItem = {
                        id: payload.new.id,
                        name: payload.new.name,
                        category: payload.new.category,
                        created_at: payload.new.created_at,
                      };
                      this.items[index] = updatedItem;
                    }
                    break;
                  case "DELETE":
                    if (payload.old?.id) {
                      this.items = this.items.filter(
                        (item) => item.id !== payload.old.id
                      );
                    }
                    break;
                }
              } catch (error) {
                console.error("Real-time update error:", error);
              }
            }
          );

        channel.subscribe((status) => {
          console.log("Subscription status:", status);
        });
      } catch (error) {
        console.error("Error fetching predefined items:", error);
      } finally {
        this.loading = false;
      }
    },

    // Predefined Item silme işlemi
    async deleteItem(itemId: string) {
      const supabase = useSupabaseClient<Database>();

      try {
        // First delete related shopping list items
        const { error: shoppingListError } = await supabase
          .from("shopping_list_items")
          .delete()
          .eq("item_id", itemId);

        if (shoppingListError) throw shoppingListError;

        // Then delete the predefined item
        const { error } = await supabase
          .from("predefined_items")
          .delete()
          .eq("id", itemId);

        if (error) throw error;

        // Store'dan item'ı kaldır
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (err) {
        console.error("Error deleting predefined item:", err);
        throw err; // Re-throw the error so we can handle it in the component
      }
    },
  },
});
