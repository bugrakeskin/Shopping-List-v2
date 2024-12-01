import { defineStore } from "pinia";
import { onUnmounted } from "vue";
import type { Database } from "~/types/database.types.ts";

type PredefinedItem = Database["public"]["Tables"]["predefined_items"]["Row"];
type ShoppingListItem =
  Database["public"]["Tables"]["shopping_list_items"]["Row"];

export const useShoppingListItemsStore = defineStore("ShoppingListItems", {
  state: () => ({
    items: [] as ShoppingListItem[],
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
          .from("shopping_list_items")
          .select(
            `
            *,
            predefined_items (
              name,
              category
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        this.items = data;

        // Realtime değişikliklere abone ol
        const channel = supabase
          .channel("shopping_list_items")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "shopping_list_items" },
            (payload) => {
              console.log("Real-time payload:", payload);

              switch (payload.eventType) {
                case "INSERT":
                  this.items.unshift(payload.new as ShoppingListItem);
                  break;
                case "UPDATE":
                  const index = this.items.findIndex(
                    (item) => item.id === payload.new.id
                  );
                  if (index !== -1) {
                    this.items[index] = payload.new as ShoppingListItem;
                  }
                  break;
                case "DELETE":
                  this.items = this.items.filter(
                    (item) => item.id !== payload.old.id
                  );
                  break;
              }
            }
          )
          .subscribe();

        onUnmounted(() => {
          channel.unsubscribe();
        });
      } catch (err) {
        console.error("Error fetching shopping list items:", err);
      } finally {
        this.loading = false;
      }
    },

    // Add item to shopping list
    async addItemToShoppingList(item: PredefinedItem) {
      const supabase = useSupabaseClient<Database>();

      try {
        const { error } = await supabase.from("shopping_list_items").insert({
          item_id: item.id,
        });

        if (error) throw error;
      } catch (error) {
        console.error("Error adding item to shopping list:", error);
        throw error;
      }
    },

    // Item silme işlemi
    async deleteItem(itemId: string) {
      const supabase = useSupabaseClient<Database>();

      try {
        const { error } = await supabase
          .from("shopping_list_items")
          .delete()
          .eq("id", itemId);

        if (error) throw error;

        // Update local state
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (err) {
        console.error("Error deleting shopping list item:", err);
      }
    },
  },
});
