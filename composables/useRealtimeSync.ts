// composables/useRealtimeSync.ts
export const useRealtimeSync = () => {
  const predefinedItemsStore = usePredefinedItemsStore()
/*   const purchaseHistoryStore = usePurchaseHistoryStore() */
  const shoppingListItemsStore = useShoppingListItemsStore()

  const initializeRealtimeSync = () => {
    predefinedItemsStore.fetchItems()
/*     purchaseHistoryStore.fetchItems() */
    shoppingListItemsStore.fetchItems()
  }

  return {
    initializeRealtimeSync
  }
}