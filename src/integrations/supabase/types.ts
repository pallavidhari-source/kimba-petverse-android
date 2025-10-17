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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      allowed_emails: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          base_price: number
          booking_date: string
          created_at: string | null
          end_time: string
          handler_included: boolean | null
          id: string
          location: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          pet_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          travel_fee: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base_price: number
          booking_date: string
          created_at?: string | null
          end_time: string
          handler_included?: boolean | null
          id?: string
          location: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          pet_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          travel_fee?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base_price?: number
          booking_date?: string
          created_at?: string | null
          end_time?: string
          handler_included?: boolean | null
          id?: string
          location?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          pet_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          travel_fee?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      host_applications: {
        Row: {
          admin_notes: string | null
          available_time_slots: string[] | null
          created_at: string | null
          full_name: string
          id: string
          kyc_document_url: string | null
          pet_gender: string | null
          pet_images_urls: string[] | null
          pet_name: string | null
          pet_type: string | null
          phone: string
          selfie_url: string | null
          status: Database["public"]["Enums"]["host_status"] | null
          updated_at: string | null
          user_id: string
          vaccination_certificate_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          available_time_slots?: string[] | null
          created_at?: string | null
          full_name: string
          id?: string
          kyc_document_url?: string | null
          pet_gender?: string | null
          pet_images_urls?: string[] | null
          pet_name?: string | null
          pet_type?: string | null
          phone: string
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["host_status"] | null
          updated_at?: string | null
          user_id: string
          vaccination_certificate_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          available_time_slots?: string[] | null
          created_at?: string | null
          full_name?: string
          id?: string
          kyc_document_url?: string | null
          pet_gender?: string | null
          pet_images_urls?: string[] | null
          pet_name?: string | null
          pet_type?: string | null
          phone?: string
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["host_status"] | null
          updated_at?: string | null
          user_id?: string
          vaccination_certificate_url?: string | null
        }
        Relationships: []
      }
      pets: {
        Row: {
          age: number
          available: boolean | null
          breed: string
          created_at: string | null
          description: string | null
          host_id: string
          id: string
          image_url: string | null
          is_kid_friendly: boolean | null
          is_trained: boolean | null
          is_vaccinated: boolean | null
          location: string
          name: string
          price_per_hour: number
          rating: number | null
          reviews_count: number | null
          temperament: string
          type: Database["public"]["Enums"]["pet_type"]
          updated_at: string | null
        }
        Insert: {
          age: number
          available?: boolean | null
          breed: string
          created_at?: string | null
          description?: string | null
          host_id: string
          id?: string
          image_url?: string | null
          is_kid_friendly?: boolean | null
          is_trained?: boolean | null
          is_vaccinated?: boolean | null
          location: string
          name: string
          price_per_hour: number
          rating?: number | null
          reviews_count?: number | null
          temperament: string
          type: Database["public"]["Enums"]["pet_type"]
          updated_at?: string | null
        }
        Update: {
          age?: number
          available?: boolean | null
          breed?: string
          created_at?: string | null
          description?: string | null
          host_id?: string
          id?: string
          image_url?: string | null
          is_kid_friendly?: boolean | null
          is_trained?: boolean | null
          is_vaccinated?: boolean | null
          location?: string
          name?: string
          price_per_hour?: number
          rating?: number | null
          reviews_count?: number | null
          temperament?: string
          type?: Database["public"]["Enums"]["pet_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          location: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
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
      user_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      is_email_allowed: {
        Args: { check_email: string }
        Returns: boolean
      }
      update_wallet_balance: {
        Args: {
          _amount: number
          _description: string
          _transaction_type: string
          _user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "host" | "user"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      host_status: "pending" | "approved" | "rejected"
      payment_method: "upi" | "card" | "cod"
      pet_type: "dog" | "cat" | "bird" | "rabbit"
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
      app_role: ["admin", "host", "user"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      host_status: ["pending", "approved", "rejected"],
      payment_method: ["upi", "card", "cod"],
      pet_type: ["dog", "cat", "bird", "rabbit"],
    },
  },
} as const
