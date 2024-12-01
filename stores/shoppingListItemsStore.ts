import { defineStore } from "pinia";
import { onUnmounted } from "vue";
import type { ShoppingListItem } from "~/types";

export const useShoppingListItemsStore = defineStore("ShoppingListItems", {
  state: () => ({
    items: [] as ShoppingListItem[],
    loading: false,
  }),

  actions: {
    // Verileri çek ve realtime aboneliği başlat
    async fetchAndSubscribe() {
      this.loading = true;
      const supabase = useSupabaseClient();

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
        this.items = data || [];

        // Realtime değişikliklere abone ol
        const channel = supabase
          .channel("shopping_list_items")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "shopping_list_items" },
            (payload) => {
              console.log("Real-time payload:", payload); // Payload'ı logla, hata olup olmadığını kontrol et

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

        // Cleanup subscription when the component is destroyed
        onUnmounted(() => {
          console.log("Unsubscribing from real-time updates.");
          channel.unsubscribe();
        });
      } catch (err) {
        console.error("Error fetching shopping list items:", err);
      } finally {
        this.loading = false;
      }
    },

    // Item silme işlemi
    async deleteItem(itemId: string) {
      const supabase = useSupabaseClient();

      try {
        const { error } = await supabase
          .from("shopping_list_items")
          .delete()
          .eq("id", itemId);

        if (error) throw error;

        // Store'dan item'ı kaldır
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (err) {
        console.error("Error deleting shopping list item:", err);
      }
    },
  },
});
