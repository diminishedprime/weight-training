-- Enums used by weights table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weight_unit_enum') THEN
    CREATE TYPE public.weight_unit_enum AS ENUM (
      'pounds',
      'kilograms'
    );
  END IF;
END$$;

-- Create weights table
CREATE TABLE IF NOT EXISTS public.weights
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    weight_value numeric(5, 2) NOT NULL,
    weight_unit weight_unit_enum NOT NULL DEFAULT 'pounds',
    CONSTRAINT weights_pkey PRIMARY KEY (id)
);
