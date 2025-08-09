-- Add cycle_order column to wendler_program_cycle table
ALTER TABLE public.wendler_program_cycle
ADD COLUMN cycle_order integer;

-- Update existing cycles with proper order based on cycle_type
-- 5s = 1, 3s = 2, 1s = 3, deload = 4
UPDATE public.wendler_program_cycle
SET
  cycle_order = CASE cycle_type
    WHEN '5' THEN 1
    WHEN '3' THEN 2
    WHEN '1' THEN 3
    WHEN 'deload' THEN 4
  END;

-- Make cycle_order NOT NULL after setting values
ALTER TABLE public.wendler_program_cycle
ALTER COLUMN cycle_order
SET NOT NULL;

-- Add unique constraint to ensure no duplicate orders within a program
ALTER TABLE public.wendler_program_cycle
ADD CONSTRAINT wendler_program_cycle_program_order_unique UNIQUE (wendler_program_id, cycle_order);
