// stores/predefinedItemsStore.ts
import { defineStore } from 'pinia'
import type { PredefinedItem } from '~/types'

export const usePredefinedItemsStore = defineStore('predefinedItems', {
  state: () => ({
    items: [] as PredefinedItem[],
    loading: false,
    error: null as Error | null
  }),
  actions: {
    // Realtime abonelik metodu
    subscribeToRealtimeChanges() {
      const supabase = useSupabaseClient()
      
      supabase
        .channel('predefined_items')
        .on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: 'predefined_items' },
          (payload) => {
            switch(payload.eventType) {
              case 'INSERT':
                this.handleInsert(payload.new as PredefinedItem)
                break
              case 'UPDATE':
                this.handleUpdate(payload.new as PredefinedItem)
                break
              case 'DELETE':
                this.handleDelete(payload.old.id)
                break
            }
          }
        )
        .subscribe()
    },
    
    // INSERT handling
    handleInsert(newItem: PredefinedItem) {
      // Eğer item zaten listede yoksa ekle
      if (!this.items.some(item => item.id === newItem.id)) {
        this.items.unshift(newItem)
      }
    },
    
    // UPDATE handling
    handleUpdate(updatedItem: PredefinedItem) {
      const index = this.items.findIndex(item => item.id === updatedItem.id)
      if (index !== -1) {
        this.items[index] = updatedItem
      }
    },
    
    // DELETE handling
    handleDelete(itemId: string) {
      this.items = this.items.filter(item => item.id !== itemId)
    },
    
    // Initial data fetch
    async fetchItems() {
      this.loading = true
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('predefined_items')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        this.items = data || []
        
        // Realtime aboneliğini başlat
        this.subscribeToRealtimeChanges()
      } catch (err) {
        this.error = err as Error
      } finally {
        this.loading = false
      }
    }
  }
})