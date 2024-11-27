// type/types.ts
export type PredefinedItem = {
  id: string; // UUID veya başka bir tür olabilir
  name: string;
  created_at: string; // ISO tarih formatı
  category: string;
};

export type ShoppingListItem = {
  predefined_items: {
    name: string;
    category: string;
  };
  item_id: string; // UUID veya başka bir tür olabilir
  id: string; // PredefinedItem'den foreign key
  created_at: string; // ISO tarih formatı
  formattedDate: string;
};

export type PurchaseHistory = {
  id: string; // UUID
  item_id: string; // PredefinedItem'den foreign key
  created_at: string; // ISO tarih formatı
  purchase_date: string; // ISO tarih formatı
};
