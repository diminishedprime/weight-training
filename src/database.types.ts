export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      exercise_block: {
        Row: {
          active_exercise_id: string | null;
          completion_status: Database["public"]["Enums"]["completion_status_enum"];
          created_at: string | null;
          id: string;
          name: string | null;
          notes: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          active_exercise_id?: string | null;
          completion_status?: Database["public"]["Enums"]["completion_status_enum"];
          created_at?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          active_exercise_id?: string | null;
          completion_status?: Database["public"]["Enums"]["completion_status_enum"];
          created_at?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_block_active_exercise_id_fkey";
            columns: ["active_exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_block_exercises: {
        Row: {
          block_id: string;
          exercise_id: string;
          exercise_order: number;
        };
        Insert: {
          block_id: string;
          exercise_id: string;
          exercise_order: number;
        };
        Update: {
          block_id?: string;
          exercise_id?: string;
          exercise_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_block";
            columns: ["block_id"];
            isOneToOne: false;
            referencedRelation: "exercise_block";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_exercise";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_superblock: {
        Row: {
          created_at: string | null;
          id: string;
          name: string | null;
          notes: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      exercise_superblock_blocks: {
        Row: {
          block_id: string;
          superblock_id: string;
          superblock_order: number;
        };
        Insert: {
          block_id: string;
          superblock_id: string;
          superblock_order: number;
        };
        Update: {
          block_id?: string;
          superblock_id?: string;
          superblock_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_block";
            columns: ["block_id"];
            isOneToOne: false;
            referencedRelation: "exercise_block";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_superblock";
            columns: ["superblock_id"];
            isOneToOne: false;
            referencedRelation: "exercise_superblock";
            referencedColumns: ["id"];
          },
        ];
      };
      exercises: {
        Row: {
          actual_weight_value: number | null;
          completion_status: Database["public"]["Enums"]["completion_status_enum"];
          equipment_type: Database["public"]["Enums"]["equipment_type_enum"];
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id: string;
          insert_order: number;
          insert_time: string;
          is_amrap: boolean;
          notes: string | null;
          perceived_effort:
            | Database["public"]["Enums"]["perceived_effort_enum"]
            | null;
          performed_at: string | null;
          reps: number;
          target_weight_value: number;
          user_id: string;
          warmup: boolean;
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
        };
        Insert: {
          actual_weight_value?: number | null;
          completion_status?: Database["public"]["Enums"]["completion_status_enum"];
          equipment_type?: Database["public"]["Enums"]["equipment_type_enum"];
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          insert_order?: number;
          insert_time?: string;
          is_amrap?: boolean;
          notes?: string | null;
          perceived_effort?:
            | Database["public"]["Enums"]["perceived_effort_enum"]
            | null;
          performed_at?: string | null;
          reps: number;
          target_weight_value: number;
          user_id: string;
          warmup?: boolean;
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
        };
        Update: {
          actual_weight_value?: number | null;
          completion_status?: Database["public"]["Enums"]["completion_status_enum"];
          equipment_type?: Database["public"]["Enums"]["equipment_type_enum"];
          exercise_type?: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          insert_order?: number;
          insert_time?: string;
          is_amrap?: boolean;
          notes?: string | null;
          perceived_effort?:
            | Database["public"]["Enums"]["perceived_effort_enum"]
            | null;
          performed_at?: string | null;
          reps?: number;
          target_weight_value?: number;
          user_id?: string;
          warmup?: boolean;
          weight_unit?: Database["public"]["Enums"]["weight_unit_enum"];
        };
        Relationships: [];
      };
      form_drafts: {
        Row: {
          created_at: string;
          expires_at: string;
          form_data: Json;
          id: string;
          page_path: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string;
          form_data: Json;
          id?: string;
          page_path: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          form_data?: Json;
          id?: string;
          page_path?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      personal_record_history: {
        Row: {
          exercise_id: string | null;
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id: string;
          notes: string | null;
          recorded_at: string;
          reps: number;
          source: Database["public"]["Enums"]["update_source_enum"];
          user_id: string;
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
          weight_value: number;
        };
        Insert: {
          exercise_id?: string | null;
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          notes?: string | null;
          recorded_at?: string;
          reps: number;
          source?: Database["public"]["Enums"]["update_source_enum"];
          user_id: string;
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
          weight_value: number;
        };
        Update: {
          exercise_id?: string | null;
          exercise_type?: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          notes?: string | null;
          recorded_at?: string;
          reps?: number;
          source?: Database["public"]["Enums"]["update_source_enum"];
          user_id?: string;
          weight_unit?: Database["public"]["Enums"]["weight_unit_enum"];
          weight_value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "personal_record_history_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      target_max_history: {
        Row: {
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id: string;
          notes: string | null;
          recorded_at: string;
          source: Database["public"]["Enums"]["update_source_enum"];
          user_id: string;
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
          weight_value: number;
        };
        Insert: {
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          notes?: string | null;
          recorded_at?: string;
          source?: Database["public"]["Enums"]["update_source_enum"];
          user_id: string;
          weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
          weight_value: number;
        };
        Update: {
          exercise_type?: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          notes?: string | null;
          recorded_at?: string;
          source?: Database["public"]["Enums"]["update_source_enum"];
          user_id?: string;
          weight_unit?: Database["public"]["Enums"]["weight_unit_enum"];
          weight_value?: number;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          available_dumbbells_lbs: number[] | null;
          available_plates_lbs: number[] | null;
          created_at: string | null;
          default_rest_time: number | null;
          id: string;
          preferred_weight_unit:
            | Database["public"]["Enums"]["weight_unit_enum"]
            | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          available_dumbbells_lbs?: number[] | null;
          available_plates_lbs?: number[] | null;
          created_at?: string | null;
          default_rest_time?: number | null;
          id?: string;
          preferred_weight_unit?:
            | Database["public"]["Enums"]["weight_unit_enum"]
            | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          available_dumbbells_lbs?: number[] | null;
          available_plates_lbs?: number[] | null;
          created_at?: string | null;
          default_rest_time?: number | null;
          id?: string;
          preferred_weight_unit?:
            | Database["public"]["Enums"]["weight_unit_enum"]
            | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      wendler_metadata: {
        Row: {
          block_id: string;
          created_at: string | null;
          cycle_type: Database["public"]["Enums"]["wendler_cycle_type_enum"];
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id: string;
          increase_amount_unit:
            | Database["public"]["Enums"]["weight_unit_enum"]
            | null;
          increase_amount_value: number | null;
          training_max_unit: Database["public"]["Enums"]["weight_unit_enum"];
          training_max_value: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          block_id: string;
          created_at?: string | null;
          cycle_type: Database["public"]["Enums"]["wendler_cycle_type_enum"];
          exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          increase_amount_unit?:
            | Database["public"]["Enums"]["weight_unit_enum"]
            | null;
          increase_amount_value?: number | null;
          training_max_unit: Database["public"]["Enums"]["weight_unit_enum"];
          training_max_value: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          block_id?: string;
          created_at?: string | null;
          cycle_type?: Database["public"]["Enums"]["wendler_cycle_type_enum"];
          exercise_type?: Database["public"]["Enums"]["exercise_type_enum"];
          id?: string;
          increase_amount_unit?:
            | Database["public"]["Enums"]["weight_unit_enum"]
            | null;
          increase_amount_value?: number | null;
          training_max_unit?: Database["public"]["Enums"]["weight_unit_enum"];
          training_max_value?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wendler_metadata_block_id_fkey";
            columns: ["block_id"];
            isOneToOne: true;
            referencedRelation: "exercise_block";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_wendler_block_prereqs: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
        };
        Returns: Database["public"]["CompositeTypes"]["wendler_block_prereqs_row"];
      };
      clear_form_draft: {
        Args: { p_user_id: string; p_page_path: string };
        Returns: undefined;
      };
      create_exercise: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_equipment_type: Database["public"]["Enums"]["equipment_type_enum"];
          p_target_weight_value: number;
          p_reps: number;
          p_actual_weight_value?: number;
          p_weight_unit?: Database["public"]["Enums"]["weight_unit_enum"];
          p_performed_at?: string;
          p_warmup?: boolean;
          p_is_amrap?: boolean;
          p_completion_status?: Database["public"]["Enums"]["completion_status_enum"];
          p_perceived_effort?: Database["public"]["Enums"]["perceived_effort_enum"];
          p_notes?: string;
        };
        Returns: string;
      };
      create_wendler_exercise_block: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_cycle_type: Database["public"]["Enums"]["wendler_cycle_type_enum"];
          p_block_name: string;
        };
        Returns: string;
      };
      fail_block_row: {
        Args: {
          p_user_id: string;
          p_block_id: string;
          p_exercise_id: string;
          p_reps?: number;
          p_actual_weight_value?: number;
          p_notes?: string;
        };
        Returns: undefined;
      };
      finish_block_row: {
        Args: {
          p_user_id: string;
          p_block_id: string;
          p_exercise_id: string;
          p_reps?: number;
          p_actual_weight_value?: number;
          p_perceived_effort?: Database["public"]["Enums"]["perceived_effort_enum"];
          p_notes?: string;
        };
        Returns: undefined;
      };
      get_exercise_blocks_for_user: {
        Args: { p_user_id: string; p_page?: number };
        Returns: Database["public"]["CompositeTypes"]["exercise_block_with_wendler_row"][];
      };
      get_exercise_for_user: {
        Args: { p_user_id: string; p_exercise_id: string };
        Returns: Database["public"]["CompositeTypes"]["exercise_row_type"];
      };
      get_exercises_by_type: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_page_num: number;
          p_start_exercise_id?: string;
        };
        Returns: Database["public"]["CompositeTypes"]["get_exercises_by_type_result"];
      };
      get_form_draft: {
        Args: { p_user_id: string; p_page_path: string };
        Returns: Json;
      };
      get_next_exercise_in_block: {
        Args: { p_block_id: string; p_exercise_id: string };
        Returns: string;
      };
      get_personal_record: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_reps: number;
        };
        Returns: Database["public"]["CompositeTypes"]["personal_record_row"];
      };
      get_personal_record_exercise_types: {
        Args: { p_user_id: string };
        Returns: Database["public"]["Enums"]["exercise_type_enum"][];
      };
      get_personal_records_for_exercise_type: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_reps?: number;
          p_end_time?: string;
        };
        Returns: Database["public"]["CompositeTypes"]["personal_record_history_row"][];
      };
      get_target_max: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
        };
        Returns: Database["public"]["CompositeTypes"]["target_max_row"];
      };
      get_user_preferences: {
        Args: { p_user_id: string };
        Returns: Database["public"]["CompositeTypes"]["user_preferences_row"];
      };
      get_wendler_block: {
        Args: { p_block_id: string; p_user_id: string };
        Returns: Database["public"]["CompositeTypes"]["wendler_block_exercise_row"][];
      };
      get_wendler_maxes: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
        };
        Returns: Database["public"]["CompositeTypes"]["wendler_maxes_row"];
      };
      get_wendler_metadata: {
        Args: { p_block_id: string; p_user_id: string };
        Returns: Database["public"]["CompositeTypes"]["wendler_metadata_row"];
      };
      save_form_draft: {
        Args: {
          p_user_id: string;
          p_page_path: string;
          p_form_data: Json;
          p_ttl_days?: number;
        };
        Returns: undefined;
      };
      set_active_exercise_or_complete_block: {
        Args: {
          p_block_id: string;
          p_user_id: string;
          p_current_exercise_id: string;
        };
        Returns: undefined;
      };
      set_personal_record: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_weight_value: number;
          p_weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
          p_reps: number;
          p_recorded_at?: string;
          p_source?: Database["public"]["Enums"]["update_source_enum"];
          p_notes?: string;
          p_exercise_id?: string;
        };
        Returns: undefined;
      };
      set_target_max: {
        Args: {
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_value: number;
          p_unit: Database["public"]["Enums"]["weight_unit_enum"];
          p_recorded_at?: string;
          p_source?: Database["public"]["Enums"]["update_source_enum"];
        };
        Returns: undefined;
      };
      set_user_preferences: {
        Args: {
          p_user_id: string;
          p_preferred_weight_unit: Database["public"]["Enums"]["weight_unit_enum"];
          p_default_rest_time: number;
          p_available_plates_lbs: number[];
          p_available_dumbbells_lbs: number[];
        };
        Returns: undefined;
      };
      skip_block_row: {
        Args: {
          p_user_id: string;
          p_block_id: string;
          p_exercise_id: string;
          p_notes?: string;
        };
        Returns: undefined;
      };
      update_exercise_for_user: {
        Args: {
          p_exercise_id: string;
          p_user_id: string;
          p_exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
          p_target_weight_value: number;
          p_reps: number;
          p_actual_weight_value?: number;
          p_weight_unit?: Database["public"]["Enums"]["weight_unit_enum"];
          p_performed_at?: string;
          p_warmup?: boolean;
          p_is_amrap?: boolean;
          p_completion_status?: Database["public"]["Enums"]["completion_status_enum"];
          p_notes?: string;
          p_perceived_effort?: Database["public"]["Enums"]["perceived_effort_enum"];
        };
        Returns: undefined;
      };
    };
    Enums: {
      completion_status_enum:
        | "completed"
        | "not_completed"
        | "failed"
        | "skipped";
      equipment_type_enum:
        | "barbell"
        | "dumbbell"
        | "kettlebell"
        | "machine"
        | "bodyweight"
        | "plate_stack";
      exercise_type_enum:
        | "barbell_deadlift"
        | "barbell_romanian_deadlift"
        | "barbell_back_squat"
        | "barbell_front_squat"
        | "barbell_bench_press"
        | "barbell_incline_bench_press"
        | "barbell_overhead_press"
        | "barbell_row"
        | "barbell_hip_thrust"
        | "barbell_single_leg_squat"
        | "barbell_snatch"
        | "barbell_clean_and_jerk"
        | "dumbbell_row"
        | "dumbbell_bench_press"
        | "dumbbell_incline_bench_press"
        | "dumbbell_overhead_press"
        | "dumbbell_bicep_curl"
        | "dumbbell_hammer_curl"
        | "dumbbell_wrist_curl"
        | "dumbbell_fly"
        | "dumbbell_lateral_raise"
        | "dumbbell_skull_crusher"
        | "dumbbell_preacher_curl"
        | "dumbbell_front_raise"
        | "dumbbell_shoulder_press"
        | "dumbbell_split_squat"
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
        | "machine_assissted_chinup"
        | "machine_assissted_pullup"
        | "machine_assissted_dip"
        | "machine_cable_triceps_pushdown"
        | "bodyweight_pushup"
        | "bodyweight_situp"
        | "bodyweight_pullup"
        | "bodyweight_chinup"
        | "bodyweight_dip"
        | "kettlebell_swings"
        | "kettlebell_front_squat"
        | "kettlebell_row"
        | "plate_stack_calf_raise";
      perceived_effort_enum: "easy" | "okay" | "hard";
      update_source_enum: "manual" | "system";
      weight_unit_enum: "pounds" | "kilograms";
      wendler_block_prereq_error_enum: "no_target_max" | "unit_mismatch";
      wendler_cycle_type_enum: "5" | "3" | "1" | "deload";
    };
    CompositeTypes: {
      exercise_block_with_wendler_row: {
        id: string | null;
        user_id: string | null;
        name: string | null;
        notes: string | null;
        active_exercise_id: string | null;
        created_at: string | null;
        updated_at: string | null;
        total_exercises: number | null;
        current_exercise_index: number | null;
        wendler_id: string | null;
        training_max_value: number | null;
        training_max_unit:
          | Database["public"]["Enums"]["weight_unit_enum"]
          | null;
        increase_amount_value: number | null;
        increase_amount_unit:
          | Database["public"]["Enums"]["weight_unit_enum"]
          | null;
        cycle_type:
          | Database["public"]["Enums"]["wendler_cycle_type_enum"]
          | null;
        exercise_type: Database["public"]["Enums"]["exercise_type_enum"] | null;
      };
      exercise_row_type: {
        exercise_id: string | null;
        user_id: string | null;
        exercise_type: Database["public"]["Enums"]["exercise_type_enum"] | null;
        equipment_type:
          | Database["public"]["Enums"]["equipment_type_enum"]
          | null;
        performed_at: string | null;
        actual_weight_value: number | null;
        target_weight_value: number | null;
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        reps: number | null;
        warmup: boolean | null;
        completion_status:
          | Database["public"]["Enums"]["completion_status_enum"]
          | null;
        notes: string | null;
        perceived_effort:
          | Database["public"]["Enums"]["perceived_effort_enum"]
          | null;
      };
      get_exercises_by_type_result: {
        rows:
          | Database["public"]["CompositeTypes"]["get_exercises_by_type_row"][]
          | null;
        day_start_exercise_id: string | null;
        page_size: number | null;
        page_count: number | null;
      };
      get_exercises_by_type_row: {
        exercise_id: string | null;
        user_id: string | null;
        exercise_type: Database["public"]["Enums"]["exercise_type_enum"] | null;
        equipment_type:
          | Database["public"]["Enums"]["equipment_type_enum"]
          | null;
        performed_at: string | null;
        actual_weight_value: number | null;
        target_weight_value: number | null;
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        reps: number | null;
        warmup: boolean | null;
        completion_status:
          | Database["public"]["Enums"]["completion_status_enum"]
          | null;
        notes: string | null;
        perceived_effort:
          | Database["public"]["Enums"]["perceived_effort_enum"]
          | null;
        personal_record: boolean | null;
      };
      personal_record_history_row: {
        id: string | null;
        weight_value: number | null;
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        reps: number | null;
        recorded_at: string | null;
        source: Database["public"]["Enums"]["update_source_enum"] | null;
        notes: string | null;
        exercise_id: string | null;
        previous_recorded_at: string | null;
        increase_weight_value: number | null;
      };
      personal_record_row: {
        weight_value: number | null;
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        reps: number | null;
        recorded_at: string | null;
        exercise_id: string | null;
      };
      target_max_row: {
        weight_value: number | null;
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        recorded_at: string | null;
      };
      user_preferences_row: {
        preferred_weight_unit:
          | Database["public"]["Enums"]["weight_unit_enum"]
          | null;
        default_rest_time: number | null;
        available_plates_lbs: number[] | null;
        available_dumbbells_lbs: number[] | null;
        user_id: string | null;
        created_at: string | null;
        updated_at: string | null;
      };
      wendler_block_exercise_row: {
        block_id: string | null;
        exercise_id: string | null;
        user_id: string | null;
        exercise_type: Database["public"]["Enums"]["exercise_type_enum"] | null;
        equipment_type:
          | Database["public"]["Enums"]["equipment_type_enum"]
          | null;
        performed_at: string | null;
        actual_weight_value: number | null;
        target_weight_value: number | null;
        weight_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        reps: number | null;
        warmup: boolean | null;
        is_amrap: boolean | null;
        completion_status:
          | Database["public"]["Enums"]["completion_status_enum"]
          | null;
        notes: string | null;
        perceived_effort:
          | Database["public"]["Enums"]["perceived_effort_enum"]
          | null;
      };
      wendler_block_prereqs_row: {
        is_target_max_set: boolean | null;
        is_prev_cycle_unit_match: boolean | null;
        has_no_target_max: boolean | null;
        has_unit_mismatch: boolean | null;
        prev_cycle_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        current_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        prev_training_max: number | null;
        current_training_max: number | null;
      };
      wendler_maxes_row: {
        target_max_value: number | null;
        target_max_unit: Database["public"]["Enums"]["weight_unit_enum"] | null;
        target_max_recorded_at: string | null;
        personal_record_value: number | null;
        personal_record_unit:
          | Database["public"]["Enums"]["weight_unit_enum"]
          | null;
        personal_record_reps: number | null;
        personal_record_recorded_at: string | null;
      };
      wendler_metadata_row: {
        id: string | null;
        user_id: string | null;
        training_max_value: number | null;
        training_max_unit:
          | Database["public"]["Enums"]["weight_unit_enum"]
          | null;
        increase_amount_value: number | null;
        increase_amount_unit:
          | Database["public"]["Enums"]["weight_unit_enum"]
          | null;
        cycle_type:
          | Database["public"]["Enums"]["wendler_cycle_type_enum"]
          | null;
        exercise_type: Database["public"]["Enums"]["exercise_type_enum"] | null;
        created_at: string | null;
        updated_at: string | null;
        block_id: string | null;
        block_name: string | null;
        block_notes: string | null;
        block_created_at: string | null;
        block_updated_at: string | null;
        active_exercise_id: string | null;
      };
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
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
        "barbell_romanian_deadlift",
        "barbell_back_squat",
        "barbell_front_squat",
        "barbell_bench_press",
        "barbell_incline_bench_press",
        "barbell_overhead_press",
        "barbell_row",
        "barbell_hip_thrust",
        "barbell_single_leg_squat",
        "barbell_snatch",
        "barbell_clean_and_jerk",
        "dumbbell_row",
        "dumbbell_bench_press",
        "dumbbell_incline_bench_press",
        "dumbbell_overhead_press",
        "dumbbell_bicep_curl",
        "dumbbell_hammer_curl",
        "dumbbell_wrist_curl",
        "dumbbell_fly",
        "dumbbell_lateral_raise",
        "dumbbell_skull_crusher",
        "dumbbell_preacher_curl",
        "dumbbell_front_raise",
        "dumbbell_shoulder_press",
        "dumbbell_split_squat",
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
        "machine_assissted_chinup",
        "machine_assissted_pullup",
        "machine_assissted_dip",
        "machine_cable_triceps_pushdown",
        "bodyweight_pushup",
        "bodyweight_situp",
        "bodyweight_pullup",
        "bodyweight_chinup",
        "bodyweight_dip",
        "kettlebell_swings",
        "kettlebell_front_squat",
        "kettlebell_row",
        "plate_stack_calf_raise",
      ],
      perceived_effort_enum: ["easy", "okay", "hard"],
      update_source_enum: ["manual", "system"],
      weight_unit_enum: ["pounds", "kilograms"],
      wendler_block_prereq_error_enum: ["no_target_max", "unit_mismatch"],
      wendler_cycle_type_enum: ["5", "3", "1", "deload"],
    },
  },
} as const;
