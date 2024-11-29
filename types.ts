// type/types.ts
export type PredefinedItem = {
  id: string; // UUID veya başka bir tür olabilir
  name: string;
  created_at: string; // ISO tarih formatı
  category: string;
};

export type ShoppingListItem = {
  item_id: string;
  id: string;
  created_at: string;
  formattedDate: string;
  predefined_items: {
    name: string;
    category: string;
  };
};

export type PurchaseHistory = {
  id: string; // UUID
  item_id: string; // PredefinedItem'den foreign key
  created_at: string; // ISO tarih formatı
  purchase_date: string; // ISO tarih formatı
};
