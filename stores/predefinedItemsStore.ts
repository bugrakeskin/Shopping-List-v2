import { defineStore } from 'pinia';
import type { PredefinedItem } from '~/types';

export const usePredefinedItemsStore = defineStore('predefinedItems', {
  state: () => ({
    items: [] as PredefinedItem[],
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
          .from('predefined_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        this.items = data || [];

        // Realtime değişikliklere abone ol
        supabase
          .channel('predefined_items')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'predefined_items' },
            (payload) => {
              switch (payload.eventType) {
                case 'INSERT':
                  this.items.unshift(payload.new as PredefinedItem);
                  break;
                case 'UPDATE':
                  const index = this.items.findIndex(
                    (item) => item.id === payload.new.id
                  );
                  if (index !== -1) {
                    this.items[index] = payload.new as PredefinedItem;
                  }
                  break;
                case 'DELETE':
                  this.items = this.items.filter(
                    (item) => item.id !== payload.old.id
                  );
                  break;
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.error('Error fetching predefined items:', err);
      } finally {
        this.loading = false;
      }
    },

    // Predefined Item silme işlemi
    async deleteItem(itemId: string) {
      const supabase = useSupabaseClient();

      try {
        const { error } = await supabase
          .from('predefined_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;

        // Store'dan item'ı kaldır
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (err) {
        console.error('Error deleting predefined item:', err);
      }
    },
  },
}); 