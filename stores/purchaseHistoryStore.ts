import { defineStore } from "pinia";
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
        // Fetch data from Supabase with item names
        const { data, error } = await supabase
          .from("purchase_history")
          .select(`
            *,
            predefined_items (
              name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Transform data to include item names
        this.items = (data || []).map(item => ({
          ...item,
          item_name: item.predefined_items?.name || null
        }));

        // Subscribe to realtime changes
        supabase
          .channel("purchase_history_changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "purchase_history" },
            async (payload) => {
              switch (payload.eventType) {
                case "INSERT": {
                  // Fetch item name for new record
                  const { data: itemData } = await supabase
                    .from("predefined_items")
                    .select("name")
                    .eq("id", payload.new.item_id)
                    .single();
                    
                  const newItem = {
                    ...payload.new,
                    item_name: itemData?.name || null
                  } as PurchaseHistory;
                  
                  this.items.unshift(newItem);
                  break;
                }
                case "UPDATE": {
                  const index = this.items.findIndex(
                    (item) => item.id === payload.new.id
                  );
                  if (index !== -1) {
                    // Fetch updated item name
                    const { data: itemData } = await supabase
                      .from("predefined_items")
                      .select("name")
                      .eq("id", payload.new.item_id)
                      .single();
                      
                    this.items[index] = {
                      ...payload.new,
                      item_name: itemData?.name || null
                    } as PurchaseHistory;
                  }
                  break;
                }
                case "DELETE":
                  this.items = this.items.filter(
                    (item) => item.id !== payload.old.id
                  );
                  break;
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
