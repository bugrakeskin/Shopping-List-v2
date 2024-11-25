// type/types.ts
export type PredefinedItem = {
  id: string; // UUID veya başka bir tür olabilir
  name: string;
  created_at: string; // ISO tarih formatı
  category: string;
};

export type ShoppingListItem = {
  id: string; // UUID
  item_id: string; // PredefinedItem'den foreign key
  created_at: string; // ISO tarih formatı
};
