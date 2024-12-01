// composables/useRealtimeSync.ts
export const useRealtimeSync = () => {
  const predefinedItemsStore = usePredefinedItemsStore()
/*   const purchaseHistoryStore = usePurchaseHistoryStore() */
  const shoppingListItemsStore = useShoppingListItemsStore()

  const initializeRealtimeSync = () => {
    predefinedItemsStore.fetchAndSubscribe()
/*     purchaseHistoryStore.fetchItems() */
    shoppingListItemsStore.fetchAndSubscribe()
  }

  return {
    initializeRealtimeSync
  }
}