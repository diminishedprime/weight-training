-- Enum: weight_unit_enum
-- Purpose: Represents the unit of measurement for weights (pounds or kilograms).
-- Usage: Used in the weights table and related logic to distinguish between weight units.
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
-- Purpose: Stores unique weight values (rounded to 1 decimal place) and their units for use in exercises and user data.
-- Columns:
--   id (uuid): Primary key for the weight record.
--   weight_value (numeric(5,1)): The numeric value of the weight, rounded to 1 decimal place.
--   weight_unit (weight_unit_enum): The unit of the weight (pounds or kilograms).
-- Usage: Referenced by exercises and user metadata to track weights in a normalized way.
CREATE TABLE IF NOT EXISTS public.weights
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    weight_value numeric(5, 1) NOT NULL,
    weight_unit weight_unit_enum NOT NULL DEFAULT 'pounds',
    CONSTRAINT weights_pkey PRIMARY KEY (id),
    CONSTRAINT weights_value_unit_unique UNIQUE (weight_value, weight_unit)
);

-- Trigger function to round weight_value to 1 decimal place
-- Ensures all weights are stored consistently for uniqueness and lookup.
CREATE OR REPLACE FUNCTION public.round_weight_value()
RETURNS TRIGGER AS $$
BEGIN
  NEW.weight_value := ROUND(NEW.weight_value::numeric, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to weights table
DROP TRIGGER IF EXISTS trg_round_weight_value ON public.weights;
CREATE TRIGGER trg_round_weight_value
BEFORE INSERT OR UPDATE ON public.weights
FOR EACH ROW EXECUTE FUNCTION public.round_weight_value();

-- Index for fast lookup by (weight_value, weight_unit)
-- This supports extremely frequent get-or-insert operations.
CREATE INDEX IF NOT EXISTS idx_weights_value_unit ON public.weights (weight_value, weight_unit);

-- Function: get_weight
-- Purpose: Returns the id for a given (weight_value, weight_unit) combination, inserting a new row if it does not exist.
-- Arguments:
--   p_weight_value (numeric): The weight value to look up (will be rounded to 1 decimal place).
--   p_weight_unit (weight_unit_enum): The unit of the weight.
-- Returns:
--   uuid: The id of the weight row for the given value/unit.
-- Usage: Used by application logic and other stored procedures to ensure a single canonical row for each unique weight/unit combination.
CREATE OR REPLACE FUNCTION public.get_weight(
    p_weight_value numeric,
    p_weight_unit weight_unit_enum
) RETURNS uuid AS $$
DECLARE
    v_id uuid;
BEGIN
    -- Round the value to 1 decimal place for consistency
    p_weight_value := ROUND(p_weight_value::numeric, 1);
    -- Try to find an existing row
    SELECT id INTO v_id FROM public.weights WHERE weight_value = p_weight_value AND weight_unit = p_weight_unit;
    IF v_id IS NOT NULL THEN
        RETURN v_id;
    END IF;
    -- Insert if not found
    INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    ON CONFLICT (weight_value, weight_unit) DO UPDATE SET weight_value = EXCLUDED.weight_value
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;
