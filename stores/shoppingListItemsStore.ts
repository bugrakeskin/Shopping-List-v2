import type { Database } from "~/types/database.types.ts";

type PredefinedItem = Database["public"]["Tables"]["predefined_items"]["Row"];
type ShoppingListItem =
  Database["public"]["Tables"]["shopping_list_items"]["Row"] & {
    predefined_items: {
      name: string | null;
      category: string | null;
    } | null;
    formattedDate?: string;
  };

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

        this.items = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              created_at: item.created_at,
              item_id: item.item_id,
              predefined_items: item.predefined_items
                ? {
                    name: item.predefined_items.name,
                    category: item.predefined_items.category,
                  }
                : null,
              formattedDate: item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : "",
            }))
          : [];

        const channel = supabase
          .channel("shopping_list_items")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "shopping_list_items" },
            async (payload) => {
              try {
                switch (payload.eventType) {
                  case "INSERT":
                    if (payload.new) {
                      const { data: newItemData, error: fetchError } =
                        await supabase
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
                          .eq("id", payload.new.id)
                          .single();

                      if (!fetchError && newItemData) {
                        const newItem: ShoppingListItem = {
                          id: newItemData.id,
                          created_at: newItemData.created_at,
                          item_id: newItemData.item_id,
                          predefined_items: newItemData.predefined_items
                            ? {
                                name: newItemData.predefined_items.name,
                                category: newItemData.predefined_items.category,
                              }
                            : null,
                          formattedDate: newItemData.created_at
                            ? new Date(
                                newItemData.created_at
                              ).toLocaleDateString()
                            : "",
                        };
                        this.items.unshift(newItem);
                      }
                    }
                    break;

                  case "UPDATE":
                    if (payload.new) {
                      const { data: updatedItemData, error: fetchError } =
                        await supabase
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
                          .eq("id", payload.new.id)
                          .single();

                      if (!fetchError && updatedItemData) {
                        const updateIndex = this.items.findIndex(
                          (item) => item.id === payload.new.id
                        );

                        if (updateIndex !== -1) {
                          const updatedItem: ShoppingListItem = {
                            id: updatedItemData.id,
                            created_at: updatedItemData.created_at,
                            item_id: updatedItemData.item_id,
                            predefined_items: updatedItemData.predefined_items
                              ? {
                                  name: updatedItemData.predefined_items.name,
                                  category:
                                    updatedItemData.predefined_items.category,
                                }
                              : null,
                            formattedDate: updatedItemData.created_at
                              ? new Date(
                                  updatedItemData.created_at
                                ).toLocaleDateString()
                              : "",
                          };
                          this.items[updateIndex] = updatedItem;
                        }
                      }
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
        console.error("Error fetching shopping list items:", error);
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
      const purchaseHistoryStore = usePurchaseHistoryStore();

      try {
        // First find the item to get its item_id
        const item = this.items.find((item) => item.id === itemId);
        if (!item || !item.item_id) throw new Error("Item not found");

        // Add to purchase history
        await purchaseHistoryStore.addToPurchaseHistory(item.item_id);

        // Then delete from shopping list
        const { error } = await supabase
          .from("shopping_list_items")
          .delete()
          .eq("id", itemId);

        if (error) throw error;

        // Update local state
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (err) {
        console.error("Error deleting shopping list item:", err);
        throw err;
      }
    },
  },
});
