import type { Database } from "~/types/database.types";

type PredefinedItem = Database["public"]["Tables"]["predefined_items"]["Row"];

export const usePredefinedItemsStore = defineStore("predefinedItems", {
  state: () => ({
    items: null as PredefinedItem[] | null,
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
          : null;

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
                      if (this.items) {
                        this.items = [newItem, ...this.items];
                      } else {
                        this.items = [newItem];
                      }
                    }
                    break;
                  case "UPDATE":
                    if (payload.new) {
                      const index = this.items?.findIndex(
                        (item) => item.id === payload.new?.id
                      );
                      if (this.items && index !== undefined && index !== -1) {
                        const updatedItem: PredefinedItem = {
                          id: payload.new.id,
                          name: payload.new.name,
                          category: payload.new.category,
                          created_at: payload.new.created_at,
                        };
                        this.items = this.items.map((item, i) =>
                          i === index ? updatedItem : item
                        );
                      }
                    }
                    break;
                  case "DELETE":
                    if (payload.old?.id && this.items) {
                      this.items = this.items.filter(
                        (item) => item.id !== payload.old!.id
                      );
                    }
                    break;
                }
              } catch (error) {
                console.error("Real-time update error:", error);
              }
            }
          );

        channel.subscribe();
        this.loading = false;
      } catch (error) {
        console.error("Error fetching predefined items:", error);
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
        if (this.items) {
          this.items = this.items.filter((item) => item.id !== itemId);
        }
      } catch (err) {
        console.error("Error deleting predefined item:", err);
        throw err; // Re-throw the error so we can handle it in the component
      }
    },

    // Yeni ürün ekleme işlemi
    async addItem(name: string, category: string) {
      const supabase = useSupabaseClient<Database>();

      try {
        // Önce aynı isimde ürün var mı kontrol et (case-insensitive)
        const { data: existingItems, error: searchError } = await supabase
          .from("predefined_items")
          .select()
          .ilike("name", name);

        if (searchError) throw searchError;

        if (existingItems && existingItems.length > 0) {
          return { error: "Bu ürün zaten mevcut!" };
        }

        // Yeni ürünü ekle
        const { data, error } = await supabase
          .from("predefined_items")
          .insert([{ name, category }])
          .select()
          .single();

        if (error) throw error;

        return { data, error: null };
      } catch (error) {
        console.error("Error adding predefined item:", error);
        return { error: "Ürün eklenirken bir hata oluştu" };
      }
    },
  },
});
