-- ========================================================================== --
--
-- Migration: 00000000000040_weights.sql
-- Purpose: All weight-related enums, tables, functions, and indexes for the
--          fitness domain.
--
-- This migration defines the core enum for weight units, the canonical weights
-- table, and supporting functions and indexes for deduplication, normalization,
-- and efficient lookup of weight values. All objects are created in the public
-- schema.
--
-- Philosophy: The schema is designed to be domain-driven, composable, and
--             testable, reflecting real-world fitness concepts and supporting
--             robust analytics and user flows.  See
--             DATABASE_DOCUMENTATION_STRATEGY.md for documentation standards
--             and rationale.
--
-- ========================================================================== --
-- Enum: weight_unit_enum
--
-- Purpose: Represents the unit of measurement for a weight value (either pounds
--          or kilograms).
--
-- Why: Weight units are a core domain concept in fitness tracking. Using an
--      enum ensures type safety and prevents invalid units from being stored.
--      Only 'pounds' and 'kilograms' are supported to match real-world gym
--      equipment and user expectations. This avoids ambiguity and enforces
--      consistency across the application. It also allows for proper
--      internationalization since other countries tend to use kilograms.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weight_unit_enum') THEN
    CREATE TYPE public.weight_unit_enum AS ENUM (
      'pounds',
      'kilograms'
    );
  END IF;
END$$;

-- Table: weights
--
-- Purpose: Stores canonical weight values and their units for reference
--          throughout the application.
--
-- Notable Details: These weights entries are shared across all users. 
--
-- Why: The weights table normalizes weight values, ensuring that each unique
--      (value, unit) pair is stored only once. This enables efficient joins,
--      deduplication, and referential integrity for all weight-related data
--      (e.g., sets, equipment, user preferences). The unique constraint
--      prevents duplicate entries, and the use of a separate table (rather than
--      embedding weights directly) supports typing the entire weight value
--      rather than needing to always store value & units separately.
--
-- Columns:
--   id (uuid): Primary key. Unique identifier for the weight entry.
--   weight_value (numeric(5,1)): The numeric value of the weight (e.g., 45.0).
--   weight_unit (weight_unit_enum): The unit of measurement ('pounds' or 'kilograms').
CREATE TABLE IF NOT EXISTS public.weights (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  weight_value numeric(5, 1) NOT NULL,
  weight_unit weight_unit_enum NOT NULL DEFAULT 'pounds',
  CONSTRAINT weights_pkey PRIMARY KEY (id),
  CONSTRAINT weights_value_unit_unique UNIQUE (weight_value, weight_unit)
);

-- Function: round_weight_value
--
-- Purpose: Ensures all weight_value entries are rounded to one decimal place
--          before insert or update.
--
-- Why: Rounding weight values prevents floating-point precision errors and
--      enforces consistency in stored data. This is important for accurate
--      comparisons, analytics, and UI display. The trigger ensures that all
--      inserts/updates are normalized at the database level, regardless of
--      application logic. 
--
--      Additionally, I don't know of any use case currently to be more accurate
--      than one decimal place (and at that, technically only .5 or .0). By
--      supporting an entire decimal place, though, we are probably able to be
--      accurate enough for basically every user. I would love to find out later
--      this was a bad assumption because I would be really interested to hear
--      of a reason why more precision is needed.
--
-- Arguments: (trigger function; operates on NEW row)
--   NEW.weight_value (numeric): The weight value to be rounded.
--
-- Returns: The modified NEW row with weight_value rounded to one decimal place.
CREATE OR REPLACE FUNCTION public.round_weight_value () RETURNS TRIGGER AS $$
BEGIN
  NEW.weight_value := ROUND(NEW.weight_value::numeric, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Index: idx_weights_value_unit
--
-- Purpose: Provides fast lookup for (weight_value, weight_unit) pairs.
--
-- Why: This index supports efficient queries for finding or joining on specific
--      weights, which is an extremely common operation for this application.
CREATE INDEX IF NOT EXISTS idx_weights_value_unit ON public.weights (weight_value, weight_unit);

-- Function: get_weight
--
-- Purpose: Retrieves the id of a canonical weight (by value and unit),
--          inserting it if it does not exist.
--
-- Why: This function centralizes the logic for weight lookup and creation,
--      ensuring that all references to weights are deduplicated and consistent.
--      It rounds the input value for consistency, and uses UPSERT to avoid race
--      conditions. This approach supports composability (other tables can
--      simply reference weights by id) and testability (logic is encapsulated
--      in a single function). Alternatives like embedding weights directly in
--      referencing tables were rejected to avoid duplication and inconsistency.
--
-- Arguments:
--   p_weight_value (numeric): The weight value to look up or insert (will be rounded to 1 decimal place).
--   p_weight_unit (weight_unit_enum): The unit of measurement.
--
-- Returns:
--   uuid: The id of the canonical weight entry.
CREATE OR REPLACE FUNCTION public.get_weight (
  p_weight_value numeric,
  p_weight_unit weight_unit_enum
) RETURNS uuid AS $$
DECLARE
    v_id uuid;
BEGIN
    p_weight_value := ROUND(p_weight_value::numeric, 1);
    SELECT id INTO v_id FROM public.weights WHERE weight_value = p_weight_value AND weight_unit = p_weight_unit;
    IF v_id IS NOT NULL THEN
        RETURN v_id;
    END IF;
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    ON CONFLICT (weight_value, weight_unit) DO UPDATE SET weight_value = EXCLUDED.weight_value
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;
