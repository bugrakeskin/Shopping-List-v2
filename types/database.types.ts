export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      shopping_list_items: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          category: string;
          predefined_item_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          category: string;
          predefined_item_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          category?: string;
          predefined_item_id?: string;
        };
      };
      predefined_items: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          category: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          category: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          category?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
