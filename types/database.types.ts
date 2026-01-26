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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_coach_waitlist: {
        Row: {
          coach_expectations: string | null
          contacted_at: string | null
          created_at: string
          email: string
          id: string
          notes: string | null
          source: string | null
          why_running: string | null
        }
        Insert: {
          coach_expectations?: string | null
          contacted_at?: string | null
          created_at?: string
          email: string
          id?: string
          notes?: string | null
          source?: string | null
          why_running?: string | null
        }
        Update: {
          coach_expectations?: string | null
          contacted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          notes?: string | null
          source?: string | null
          why_running?: string | null
        }
        Relationships: []
      }
      club_contributions: {
        Row: {
          body: string | null
          club_id: string
          contributor_name: string | null
          created_at: string
          event_reference: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_featured: boolean
          media_url: string | null
          metadata: Json | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_status: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
          visibility: string
        }
        Insert: {
          body?: string | null
          club_id: string
          contributor_name?: string | null
          created_at?: string
          event_reference?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_featured?: boolean
          media_url?: string | null
          metadata?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          user_id: string | null
          visibility?: string
        }
        Update: {
          body?: string | null
          club_id?: string
          contributor_name?: string | null
          created_at?: string
          event_reference?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_featured?: boolean
          media_url?: string | null
          metadata?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_contributions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_contributions_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_memberships: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_public: boolean
          manifesto: Json | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          manifesto?: Json | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          manifesto?: Json | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      expression_events: {
        Row: {
          content: string | null
          content_long: string | null
          created_at: string
          id: string
          media_url: string | null
          metadata: Json | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_status: string
          type: string
          updated_at: string
          user_id: string | null
          vibe_tags: string[] | null
          visibility: string
        }
        Insert: {
          content?: string | null
          content_long?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          metadata?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          type: string
          updated_at?: string
          user_id?: string | null
          vibe_tags?: string[] | null
          visibility?: string
        }
        Update: {
          content?: string | null
          content_long?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          metadata?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          type?: string
          updated_at?: string
          user_id?: string | null
          vibe_tags?: string[] | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "expression_events_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expression_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          id: string
          items: Json
          metadata: Json | null
          shipped_at: string | null
          shipping_address: Json | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_cents: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          items: Json
          metadata?: Json | null
          shipped_at?: string | null
          shipping_address?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_cents: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          items?: Json
          metadata?: Json | null
          shipped_at?: string | null
          shipping_address?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_cents?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean
          is_featured: boolean
          low_stock_threshold: number | null
          metadata: Json | null
          name: string
          price_cents: number
          slug: string
          stock_quantity: number | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          low_stock_threshold?: number | null
          metadata?: Json | null
          name: string
          price_cents: number
          slug: string
          stock_quantity?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          low_stock_threshold?: number | null
          metadata?: Json | null
          name?: string
          price_cents?: number
          slug?: string
          stock_quantity?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          expression_data: Json | null
          full_name: string | null
          id: string
          is_active: boolean
          trust_score: number
          trust_level: 'newcomer' | 'regular' | 'trusted' | 'pillar'
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          expression_data?: Json | null
          full_name?: string | null
          id: string
          is_active?: boolean
          trust_score?: number
          trust_level?: 'newcomer' | 'regular' | 'trusted' | 'pillar'
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          expression_data?: Json | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          trust_score?: number
          trust_level?: 'newcomer' | 'regular' | 'trusted' | 'pillar'
          updated_at?: string
        }
        Relationships: []
      }
      trust_score_events: {
        Row: {
          id: string
          user_id: string
          event_type: 'flow_post_approved' | 'flow_post_rejected' | 'contribution_approved' | 'contribution_rejected' | 'received_like' | 'membership_verified' | 'daily_login' | 'moderation_action'
          points: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: 'flow_post_approved' | 'flow_post_rejected' | 'contribution_approved' | 'contribution_rejected' | 'received_like' | 'membership_verified' | 'daily_login' | 'moderation_action'
          points: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: 'flow_post_approved' | 'flow_post_rejected' | 'contribution_approved' | 'contribution_rejected' | 'received_like' | 'membership_verified' | 'daily_login' | 'moderation_action'
          points?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_score_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      moderation_queue: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          media_url: string | null
          source: string | null
          type: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          vibe_tags: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_club_stats: { Args: { p_club_id: string }; Returns: Json }
      get_recent_flow_entries: {
        Args: { p_limit?: number }
        Returns: {
          content: string | null
          content_long: string | null
          created_at: string
          id: string
          media_url: string | null
          metadata: Json | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_status: string
          type: string
          updated_at: string
          user_id: string | null
          vibe_tags: string[] | null
          visibility: string
        }[]
        SetofOptions: {
          from: "*"
          to: "expression_events"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_trust_score: { Args: { p_user_id: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
