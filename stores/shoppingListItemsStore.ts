// stores/shoppingListItemsStore.ts
import { defineStore } from "pinia";
import type { ShoppingListItem } from "~/types";

export const useShoppingListItemsStore = defineStore("shoppingListItems", {
  state: () => ({
    items: [] as ShoppingListItem[],
    loading: false,
    error: null as Error | null,
  }),
  actions: {
    // Realtime abonelik metodu
    subscribeToRealtimeChanges() {
      const supabase = useSupabaseClient();

      supabase
        .channel("shopping_list_items")
        .on("postgres_changes", { event: "*", schema: "public", table: "shopping_list_items" }, (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              this.handleInsert(payload.new as ShoppingListItem);
              break;
            case "UPDATE":
              this.handleUpdate(payload.new as ShoppingListItem);
              break;
            case "DELETE":
              this.handleDelete(payload.old.id);
              break;
          }
        })
        .subscribe();
    },

    // INSERT handling
    async handleInsert(newItem: ShoppingListItem) {
      const supabase = useSupabaseClient();

      try {
        // Supabase'den predefined_item ilişkisini çek
        const { data: predefinedItem, error } = await supabase
          .from("predefined_items")
          .select("name, category")
          .eq("id", newItem.item_id) // Burada ilişkili `item_id`ye göre sorgu yap
          .single();

        if (error) {
          console.error("Predefined item fetch error:", error);
          // Eğer hata varsa varsayılan değer ata
          newItem.predefined_items = {
            name: "Bilinmeyen Ürün",
            category: "default-category",
          };
        } else if (predefinedItem) {
          // Eğer başarıyla ilişki çekildiyse
          newItem.predefined_items = predefinedItem;
        }

        // Yeni öğeyi mevcut listeye ekle
        const existingItemIndex = this.items.findIndex((item) => item.id === newItem.id);
        if (existingItemIndex === -1) {
          this.items = [newItem, ...this.items];
        }
      } catch (err) {
        console.error("Error in handleInsert:", err);
      }
    },

    // UPDATE handling
    handleUpdate(updatedItem: ShoppingListItem) {
      const index = this.items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        this.items[index] = updatedItem; // Array'i yeniden atama
      }
    },

    // DELETE handling
    handleDelete(itemId: string) {
      this.items = this.items.filter((item) => item.id !== itemId); // Array'i yeniden atama
    },

    // Initial data fetch
    async fetchItems() {
      this.loading = true;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase
          .from("shopping_list_items")
          .select("*, predefined_items(name, category)") // predefined_items ilişkisini ekle
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.items = data || [];
        this.subscribeToRealtimeChanges();
      } catch (err) {
        this.error = err as Error;
        console.error("Error fetching items:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
