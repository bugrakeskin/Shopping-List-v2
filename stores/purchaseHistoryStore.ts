import type { Database } from "~/types/database.types";

type PurchaseHistory = Database["public"]["Tables"]["purchase_history"]["Row"] & {
  predefined_items?: Database["public"]["Tables"]["predefined_items"]["Row"] | null;
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
              *
            )
          `
          )
          .order("created_at", { ascending: false })
          .limit(45);

        if (error) throw error;

        this.items = Array.isArray(data) ? data : [];

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
                            *
                          )
                        `
                          )
                          .eq("id", payload.new.id)
                          .single();

                      if (!fetchError && newItemData) {
                        this.items.unshift(newItemData);
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
                            *
                          )
                        `
                          )
                          .eq("id", payload.new.id)
                          .single();

                      if (!fetchError && updatedItemData) {
                        const index = this.items.findIndex(
                          (item) => item.id === updatedItemData.id
                        );
                        if (index !== -1) {
                          this.items[index] = updatedItemData;
                        }
                      }
                    }
                    break;

                  case "DELETE":
                    if (payload.old) {
                      const index = this.items.findIndex(
                        (item) => item.id === payload.old.id
                      );
                      if (index !== -1) {
                        this.items.splice(index, 1);
                      }
                    }
                    break;
                }
              } catch (error) {
                console.error("Error handling realtime update:", error);
              }
            }
          )
          .subscribe();

        return () => {
          channel.unsubscribe();
        };
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
