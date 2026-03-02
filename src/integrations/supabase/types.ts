export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean | null
          label: string | null
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone?: string
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_discount: number | null
          min_order_amount: number | null
          usage_limit: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
          variant_info: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
          variant_info?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
          variant_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          coupon_id: string | null
          created_at: string
          delivered_at: string | null
          discount_amount: number | null
          estimated_delivery: string | null
          gst_amount: number | null
          gst_number: string | null
          guest_email: string | null
          guest_phone: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          shipping_address: Json
          shipping_charge: number | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address?: Json | null
          coupon_id?: string | null
          created_at?: string
          delivered_at?: string | null
          discount_amount?: number | null
          estimated_delivery?: string | null
          gst_amount?: number | null
          gst_number?: string | null
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipping_address: Json
          shipping_charge?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: Json | null
          coupon_id?: string | null
          created_at?: string
          delivered_at?: string | null
          discount_amount?: number | null
          estimated_delivery?: string | null
          gst_amount?: number | null
          gst_number?: string | null
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipping_address?: Json
          shipping_charge?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      pincodes: {
        Row: {
          city: string | null
          cod_available: boolean | null
          delivery_days: number | null
          id: string
          is_serviceable: boolean | null
          pincode: string
          shipping_charge: number | null
          state: string | null
        }
        Insert: {
          city?: string | null
          cod_available?: boolean | null
          delivery_days?: number | null
          id?: string
          is_serviceable?: boolean | null
          pincode: string
          shipping_charge?: number | null
          state?: string | null
        }
        Update: {
          city?: string | null
          cod_available?: boolean | null
          delivery_days?: number | null
          id?: string
          is_serviceable?: boolean | null
          pincode?: string
          shipping_charge?: number | null
          state?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          id: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          id?: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
          url: string
        }
        Update: {
          alt_text?: string | null
          id?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          id: string
          name: string
          price_adjustment: number | null
          product_id: string
          sku: string | null
          stock: number | null
          value: string
        }
        Insert: {
          id?: string
          name: string
          price_adjustment?: number | null
          product_id: string
          sku?: string | null
          stock?: number | null
          value: string
        }
        Update: {
          id?: string
          name?: string
          price_adjustment?: number | null
          product_id?: string
          sku?: string | null
          stock?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          low_stock_threshold: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          original_price: number | null
          price: number
          sku: string | null
          slug: string
          stock: number | null
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          original_price?: number | null
          price: number
          sku?: string | null
          slug: string
          stock?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          original_price?: number | null
          price?: number
          sku?: string | null
          slug?: string
          stock?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_blocked: boolean | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_blocked?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_blocked?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      returns: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          order_id: string
          reason: string
          refund_amount: number | null
          status: Database["public"]["Enums"]["return_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          order_id: string
          reason: string
          refund_amount?: number | null
          status?: Database["public"]["Enums"]["return_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          order_id?: string
          reason?: string
          refund_amount?: number | null
          status?: Database["public"]["Enums"]["return_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          product_id: string
          rating: number
          title: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          product_id: string
          rating: number
          title?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          product_id?: string
          rating?: number
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned"
      payment_method: "razorpay" | "upi" | "card" | "netbanking" | "cod"
      payment_status: "pending" | "paid" | "failed" | "refunded" | "cod"
      return_status:
        | "requested"
        | "approved"
        | "rejected"
        | "picked_up"
        | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      payment_method: ["razorpay", "upi", "card", "netbanking", "cod"],
      payment_status: ["pending", "paid", "failed", "refunded", "cod"],
      return_status: [
        "requested",
        "approved",
        "rejected",
        "picked_up",
        "refunded",
      ],
    },
  },
} as const
