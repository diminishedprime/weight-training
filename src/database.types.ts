export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
  next_auth: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          oauth_token: string | null
          oauth_token_secret: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string | null
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId?: string | null
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string | null
        }
        Insert: {
          expires: string
          id?: string
          sessionToken: string
          userId?: string | null
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
        }
        Insert: {
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
        }
        Update: {
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          expires: string
          identifier: string | null
          token: string
        }
        Insert: {
          expires: string
          identifier?: string | null
          token: string
        }
        Update: {
          expires?: string
          identifier?: string | null
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      exercise_block: {
        Row: {
          block_order: number | null
          id: string
          lift_group_id: string
          lift_id: string
          user_id: string
          workout_session_id: string | null
        }
        Insert: {
          block_order?: number | null
          id?: string
          lift_group_id: string
          lift_id: string
          user_id: string
          workout_session_id?: string | null
        }
        Update: {
          block_order?: number | null
          id?: string
          lift_group_id?: string
          lift_id?: string
          user_id?: string
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_block_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lift"
            columns: ["lift_id"]
            isOneToOne: false
            referencedRelation: "lifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lift_group"
            columns: ["lift_group_id"]
            isOneToOne: false
            referencedRelation: "lift_group"
            referencedColumns: ["id"]
          },
        ]
      }
      lift_group: {
        Row: {
          id: string
          user_id: string
          wendler_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          wendler_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          wendler_id?: string | null
        }
        Relationships: []
      }
      lifts: {
        Row: {
          completion_status: Database["public"]["Enums"]["completion_status_enum"]
          id: string
          lift_type: Database["public"]["Enums"]["lift_type_enum"]
          notes: string | null
          performed_at: string | null
          reps: number
          user_id: string
          warmup: boolean
          weight_id: string
        }
        Insert: {
          completion_status?: Database["public"]["Enums"]["completion_status_enum"]
          id?: string
          lift_type: Database["public"]["Enums"]["lift_type_enum"]
          notes?: string | null
          performed_at?: string | null
          reps: number
          user_id: string
          warmup?: boolean
          weight_id: string
        }
        Update: {
          completion_status?: Database["public"]["Enums"]["completion_status_enum"]
          id?: string
          lift_type?: Database["public"]["Enums"]["lift_type_enum"]
          notes?: string | null
          performed_at?: string | null
          reps?: number
          user_id?: string
          warmup?: boolean
          weight_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lifts_weight_id_fkey"
            columns: ["weight_id"]
            isOneToOne: false
            referencedRelation: "weights"
            referencedColumns: ["id"]
          },
        ]
      }
      weights: {
        Row: {
          id: string
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"]
          weight_value: number
        }
        Insert: {
          id?: string
          weight_unit?: Database["public"]["Enums"]["weight_unit_enum"]
          weight_value: number
        }
        Update: {
          id?: string
          weight_unit?: Database["public"]["Enums"]["weight_unit_enum"]
          weight_value?: number
        }
        Relationships: []
      }
      wendler_metadata: {
        Row: {
          cycle_type: Database["public"]["Enums"]["cycle_type_enum"]
          id: string
          increase_amount_id: string
          lift_type: Database["public"]["Enums"]["lift_type_enum"]
          training_max_id: string
          user_id: string
        }
        Insert: {
          cycle_type: Database["public"]["Enums"]["cycle_type_enum"]
          id?: string
          increase_amount_id: string
          lift_type: Database["public"]["Enums"]["lift_type_enum"]
          training_max_id: string
          user_id: string
        }
        Update: {
          cycle_type?: Database["public"]["Enums"]["cycle_type_enum"]
          id?: string
          increase_amount_id?: string
          lift_type?: Database["public"]["Enums"]["lift_type_enum"]
          training_max_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wendler_metadata_increase_amount_id_fkey"
            columns: ["increase_amount_id"]
            isOneToOne: false
            referencedRelation: "weights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wendler_metadata_training_max_id_fkey"
            columns: ["training_max_id"]
            isOneToOne: false
            referencedRelation: "weights"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_session: {
        Row: {
          id: string
          name: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          name?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          name?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_lift: {
        Args: {
          p_user_id: string
          p_lift_type: Database["public"]["Enums"]["lift_type_enum"]
          p_weight_value: number
          p_reps: number
          p_performed_at?: string
          p_weight_unit?: Database["public"]["Enums"]["weight_unit_enum"]
          p_warmup?: boolean
          p_completion_status?: Database["public"]["Enums"]["completion_status_enum"]
        }
        Returns: string
      }
      create_wendler_lift_session_5s: {
        Args: {
          p_user_id: string
          p_training_max_lbs: number
          p_increase_amount_lbs: number
          p_lift_type: Database["public"]["Enums"]["lift_type_enum"]
        }
        Returns: string
      }
      get_lift_for_user: {
        Args: { p_user_id: string; p_lift_id: string }
        Returns: Database["public"]["CompositeTypes"]["lift_row_type"]
      }
      get_lifts_by_type_for_user: {
        Args: {
          p_user_id: string
          p_lift_type: Database["public"]["Enums"]["lift_type_enum"]
        }
        Returns: {
          lift_id: string
          user_id: string
          lift_type: Database["public"]["Enums"]["lift_type_enum"]
          performed_at: string
          weight_value: number
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"]
          reps: number
          warmup: boolean
          completion_status: Database["public"]["Enums"]["completion_status_enum"]
        }[]
      }
      get_wendler_lift_group_details: {
        Args: { p_lift_group_id: string }
        Returns: {
          lift_group_id: string
          user_id: string
          cycle_type: string
          lift_type: string
          training_max: number
          training_max_unit: string
          increase_amount: number
          increase_amount_unit: string
          lift_id: string
          performed_at: string
          reps: number
          warmup: boolean
          completion_status: string
          weight_value: number
          weight_unit: string
          block_order: number
        }[]
      }
      normalize_bar_weight: {
        Args: { p_weight: number }
        Returns: number
      }
      round_to_nearest_5: {
        Args: { p_weight: number }
        Returns: number
      }
      update_lift_for_user: {
        Args: {
          p_lift_id: string
          p_user_id: string
          p_lift_type: Database["public"]["Enums"]["lift_type_enum"]
          p_weight_value: number
          p_reps: number
          p_performed_at?: string
          p_weight_unit?: Database["public"]["Enums"]["weight_unit_enum"]
          p_warmup?: boolean
          p_completion_status?: Database["public"]["Enums"]["completion_status_enum"]
        }
        Returns: undefined
      }
    }
    Enums: {
      completion_status_enum:
        | "Completed"
        | "Not Completed"
        | "Failed"
        | "Skipped"
      cycle_type_enum: "5" | "3" | "1" | "deload"
      lift_type_enum:
        | "deadlift"
        | "squat"
        | "bench_press"
        | "overhead_press"
        | "row"
      weight_unit_enum: "pounds" | "kilograms"
    }
    CompositeTypes: {
      lift_row_type: {
        lift_id: string | null
        user_id: string | null
        lift_type: Database["public"]["Enums"]["lift_type_enum"] | null
        performed_at: string | null
        weight_value: number | null
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null
        reps: number | null
        warmup: boolean | null
        completion_status:
          | Database["public"]["Enums"]["completion_status_enum"]
          | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  next_auth: {
    Enums: {},
  },
  public: {
    Enums: {
      completion_status_enum: [
        "Completed",
        "Not Completed",
        "Failed",
        "Skipped",
      ],
      cycle_type_enum: ["5", "3", "1", "deload"],
      lift_type_enum: [
        "deadlift",
        "squat",
        "bench_press",
        "overhead_press",
        "row",
      ],
      weight_unit_enum: ["pounds", "kilograms"],
    },
  },
} as const

