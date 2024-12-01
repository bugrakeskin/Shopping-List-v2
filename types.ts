// type/types.ts
export type PredefinedItem = {
  id: string;
  name: string;
  created_at: string;
  category: string;
};

export type ShoppingListItem = {
  id: string;
  name: string;
  category: string;
  predefined_item_id: string;
  created_at: string;
};

export type PurchaseHistory = {
  id: string;
  item_id: string;
  purchased_at: string;
  quantity: number;
};
