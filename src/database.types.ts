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
          block_order: number
          created_at: string | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string
          wendler_metadata_id: string | null
        }
        Insert: {
          block_order: number
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
          wendler_metadata_id?: string | null
        }
        Update: {
          block_order?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          wendler_metadata_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_block_wendler_metadata_id_fkey"
            columns: ["wendler_metadata_id"]
            isOneToOne: false
            referencedRelation: "wendler_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_block_exercises: {
        Row: {
          block_id: string
          exercise_id: string
          exercise_order: number
        }
        Insert: {
          block_id: string
          exercise_id: string
          exercise_order: number
        }
        Update: {
          block_id?: string
          exercise_id?: string
          exercise_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_block"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "exercise_block"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_exercise"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_superblock: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exercise_superblock_blocks: {
        Row: {
          block_id: string
          superblock_id: string
          superblock_order: number
        }
        Insert: {
          block_id: string
          superblock_id: string
          superblock_order: number
        }
        Update: {
          block_id?: string
          superblock_id?: string
          superblock_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_block"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "exercise_block"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_superblock"
            columns: ["superblock_id"]
            isOneToOne: false
            referencedRelation: "exercise_superblock"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          completion_status: Database["public"]["Enums"]["completion_status_enum"]
          equipment_type: Database["public"]["Enums"]["equipment_type_enum"]
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          id: string
          notes: string | null
          performed_at: string | null
          relative_effort:
            | Database["public"]["Enums"]["relative_effort_enum"]
            | null
          reps: number
          user_id: string
          warmup: boolean
          weight_id: string
        }
        Insert: {
          completion_status?: Database["public"]["Enums"]["completion_status_enum"]
          equipment_type?: Database["public"]["Enums"]["equipment_type_enum"]
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          id?: string
          notes?: string | null
          performed_at?: string | null
          relative_effort?:
            | Database["public"]["Enums"]["relative_effort_enum"]
            | null
          reps: number
          user_id: string
          warmup?: boolean
          weight_id: string
        }
        Update: {
          completion_status?: Database["public"]["Enums"]["completion_status_enum"]
          equipment_type?: Database["public"]["Enums"]["equipment_type_enum"]
          exercise_type?: Database["public"]["Enums"]["exercise_type_enum"]
          id?: string
          notes?: string | null
          performed_at?: string | null
          relative_effort?:
            | Database["public"]["Enums"]["relative_effort_enum"]
            | null
          reps?: number
          user_id?: string
          warmup?: boolean
          weight_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_weight_id_fkey"
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
          created_at: string | null
          cycle_type: Database["public"]["Enums"]["wendler_cycle_type_enum"]
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          id: string
          increase_amount: number
          training_max: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cycle_type: Database["public"]["Enums"]["wendler_cycle_type_enum"]
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          id?: string
          increase_amount: number
          training_max: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cycle_type?: Database["public"]["Enums"]["wendler_cycle_type_enum"]
          exercise_type?: Database["public"]["Enums"]["exercise_type_enum"]
          id?: string
          increase_amount?: number
          training_max?: number
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
      add_exercise_block: {
        Args: {
          p_user_id: string
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          p_equipment_type: Database["public"]["Enums"]["equipment_type_enum"]
          p_weight: number
          p_sets: number
          p_reps: number
        }
        Returns: string
      }
      add_leg_day_superblock: {
        Args: {
          p_user_id: string
          p_training_max: number
          p_wendler_cycle: Database["public"]["Enums"]["wendler_cycle_type_enum"]
        }
        Returns: string
      }
      create_exercise: {
        Args: {
          p_user_id: string
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          p_equipment_type: Database["public"]["Enums"]["equipment_type_enum"]
          p_weight_value: number
          p_reps: number
          p_performed_at?: string
          p_weight_unit?: Database["public"]["Enums"]["weight_unit_enum"]
          p_warmup?: boolean
          p_completion_status?: Database["public"]["Enums"]["completion_status_enum"]
          p_relative_effort?: Database["public"]["Enums"]["relative_effort_enum"]
        }
        Returns: string
      }
      get_exercise_for_user: {
        Args: { p_user_id: string; p_exercise_id: string }
        Returns: Database["public"]["CompositeTypes"]["exercise_row_type"]
      }
      get_exercises_by_type_for_user: {
        Args: {
          p_user_id: string
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
        }
        Returns: {
          exercise_id: string
          user_id: string
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          equipment_type: Database["public"]["Enums"]["equipment_type_enum"]
          performed_at: string
          weight_value: number
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"]
          reps: number
          warmup: boolean
          completion_status: Database["public"]["Enums"]["completion_status_enum"]
          notes: string
          relative_effort: Database["public"]["Enums"]["relative_effort_enum"]
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
      update_exercise_for_user: {
        Args: {
          p_exercise_id: string
          p_user_id: string
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          p_weight_value: number
          p_reps: number
          p_performed_at?: string
          p_weight_unit?: Database["public"]["Enums"]["weight_unit_enum"]
          p_warmup?: boolean
          p_completion_status?: Database["public"]["Enums"]["completion_status_enum"]
          p_notes?: string
          p_relative_effort?: Database["public"]["Enums"]["relative_effort_enum"]
        }
        Returns: undefined
      }
      wendler_exercise_block: {
        Args: {
          p_user_id: string
          p_training_max: number
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"]
          p_cycle_type: Database["public"]["Enums"]["wendler_cycle_type_enum"]
          p_increase_amount?: number
        }
        Returns: string
      }
    }
    Enums: {
      completion_status_enum:
        | "completed"
        | "not_completed"
        | "failed"
        | "skipped"
      equipment_type_enum:
        | "barbell"
        | "dumbbell"
        | "kettlebell"
        | "machine"
        | "bodyweight"
        | "plate_stack"
      exercise_type_enum:
        | "barbell_deadlift"
        | "barbell_squat"
        | "barbell_bench_press"
        | "barbell_overhead_press"
        | "barbell_row"
        | "dumbbell_row"
        | "machine_converging_chest_press"
        | "machine_diverging_lat_pulldown"
        | "machine_diverging_low_row"
        | "machine_converging_shoulder_press"
        | "machine_lateral_raise"
        | "machine_abdominal"
        | "machine_back_extension"
        | "machine_seated_leg_curl"
        | "machine_leg_extension"
        | "machine_leg_press"
        | "machine_inner_thigh"
        | "machine_outer_thigh"
        | "machine_triceps_extension"
        | "machine_biceps_curl"
        | "machine_rear_delt"
        | "machine_pec_fly"
        | "pushup"
        | "situp"
        | "pullup"
        | "chinup"
        | "plate_stack_calf_raise"
      relative_effort_enum: "easy" | "okay" | "hard"
      weight_unit_enum: "pounds" | "kilograms"
      wendler_cycle_type_enum: "5" | "3" | "1" | "deload"
    }
    CompositeTypes: {
      exercise_row_type: {
        exercise_id: string | null
        user_id: string | null
        exercise_type: Database["public"]["Enums"]["exercise_type_enum"] | null
        equipment_type:
          | Database["public"]["Enums"]["equipment_type_enum"]
          | null
        performed_at: string | null
        weight_value: number | null
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null
        reps: number | null
        warmup: boolean | null
        completion_status:
          | Database["public"]["Enums"]["completion_status_enum"]
          | null
        notes: string | null
        relative_effort:
          | Database["public"]["Enums"]["relative_effort_enum"]
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
        "completed",
        "not_completed",
        "failed",
        "skipped",
      ],
      equipment_type_enum: [
        "barbell",
        "dumbbell",
        "kettlebell",
        "machine",
        "bodyweight",
        "plate_stack",
      ],
      exercise_type_enum: [
        "barbell_deadlift",
        "barbell_squat",
        "barbell_bench_press",
        "barbell_overhead_press",
        "barbell_row",
        "dumbbell_row",
        "machine_converging_chest_press",
        "machine_diverging_lat_pulldown",
        "machine_diverging_low_row",
        "machine_converging_shoulder_press",
        "machine_lateral_raise",
        "machine_abdominal",
        "machine_back_extension",
        "machine_seated_leg_curl",
        "machine_leg_extension",
        "machine_leg_press",
        "machine_inner_thigh",
        "machine_outer_thigh",
        "machine_triceps_extension",
        "machine_biceps_curl",
        "machine_rear_delt",
        "machine_pec_fly",
        "pushup",
        "situp",
        "pullup",
        "chinup",
        "plate_stack_calf_raise",
      ],
      relative_effort_enum: ["easy", "okay", "hard"],
      weight_unit_enum: ["pounds", "kilograms"],
      wendler_cycle_type_enum: ["5", "3", "1", "deload"],
    },
  },
} as const

