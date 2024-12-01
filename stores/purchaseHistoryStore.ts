import type { Database } from "~/types/database.types";

type PurchaseHistory = {
  created_at: string;
  id: string;
  item_id: string | null;
  purchase_date: string | null;
  item_name?: string | null;
};

export const usePurchaseHistoryStore = defineStore("purchaseHistory", {
  state: () => ({
    items: [] as PurchaseHistory[],
    loading: false,
  }),

  actions: {
    async fetchAndSubscribe() {
      this.loading = true;
      const supabase = useSupabaseClient<Database>();

      try {
        const { data, error } = await supabase
          .from("purchase_history")
          .select(
            `
            *,
            predefined_items (
              name
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
              purchase_date: item.purchase_date,
              item_name: item.predefined_items?.name || null,
            }))
          : [];

        const channel = supabase
          .channel("purchase_history_changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "purchase_history" },
            async (payload) => {
              try {
                switch (payload.eventType) {
                  case "INSERT":
                    if (payload.new) {
                      const { data: newItemData, error: fetchError } =
                        await supabase
                          .from("purchase_history")
                          .select(
                            `
                          *,
                          predefined_items (
                            name
                          )
                        `
                          )
                          .eq("id", payload.new.id)
                          .single();

                      if (!fetchError && newItemData) {
                        const newItem: PurchaseHistory = {
                          id: newItemData.id,
                          created_at: newItemData.created_at,
                          item_id: newItemData.item_id,
                          purchase_date: newItemData.purchase_date,
                          item_name: newItemData.predefined_items?.name || null,
                        };
                        this.items.unshift(newItem);
                      }
                    }
                    break;

                  case "UPDATE":
                    if (payload.new) {
                      const { data: updatedItemData, error: fetchError } =
                        await supabase
                          .from("purchase_history")
                          .select(
                            `
                          *,
                          predefined_items (
                            name
                          )
                        `
                          )
                          .eq("id", payload.new.id)
                          .single();

                      if (!fetchError && updatedItemData) {
                        const index = this.items.findIndex(
                          (item) => item.id === payload.new.id
                        );

                        if (index !== -1) {
                          const updatedItem: PurchaseHistory = {
                            id: updatedItemData.id,
                            created_at: updatedItemData.created_at,
                            item_id: updatedItemData.item_id,
                            purchase_date: updatedItemData.purchase_date,
                            item_name:
                              updatedItemData.predefined_items?.name || null,
                          };
                          this.items[index] = updatedItem;
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
        console.error("Error fetching purchase history:", error);
      } finally {
        this.loading = false;
      }
    },
    async addToPurchaseHistory(itemId: string) {
      const supabase = useSupabaseClient<Database>();

      try {
        const { error } = await supabase.from("purchase_history").insert({
          item_id: itemId,
          purchase_date: new Date().toISOString(),
        });

        if (error) throw error;
      } catch (error) {
        console.error("Error adding item to purchase history:", error);
        throw error;
      }
    },
  },
});
