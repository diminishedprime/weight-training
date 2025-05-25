export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      deadlift_group: {
        Row: {
          id: string
          training_max_id: string
        }
        Insert: {
          id?: string
          training_max_id: string
        }
        Update: {
          id?: string
          training_max_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadlift_group_training_max_id_fkey"
            columns: ["training_max_id"]
            isOneToOne: false
            referencedRelation: "weights"
            referencedColumns: ["id"]
          },
        ]
      }
      deadlift_groups: {
        Row: {
          deadlift_group_id: string
          deadlift_id: string
          id: string
          position: number | null
        }
        Insert: {
          deadlift_group_id: string
          deadlift_id: string
          id?: string
          position?: number | null
        }
        Update: {
          deadlift_group_id?: string
          deadlift_id?: string
          id?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_deadlift"
            columns: ["deadlift_id"]
            isOneToOne: false
            referencedRelation: "deadlifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_deadlift_group"
            columns: ["deadlift_group_id"]
            isOneToOne: false
            referencedRelation: "deadlift_group"
            referencedColumns: ["id"]
          },
        ]
      }
      deadlifts: {
        Row: {
          actually_completed: boolean
          completion_status: string
          id: string
          reps: number
          time: string | null
          warmup: boolean
          weight_id: string
        }
        Insert: {
          actually_completed?: boolean
          completion_status?: string
          id?: string
          reps: number
          time?: string | null
          warmup?: boolean
          weight_id: string
        }
        Update: {
          actually_completed?: boolean
          completion_status?: string
          id?: string
          reps?: number
          time?: string | null
          warmup?: boolean
          weight_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadlift_weight_id_fkey"
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
          weight_unit: string
          weight_value: number
        }
        Insert: {
          id?: string
          weight_unit?: string
          weight_value: number
        }
        Update: {
          id?: string
          weight_unit?: string
          weight_value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
