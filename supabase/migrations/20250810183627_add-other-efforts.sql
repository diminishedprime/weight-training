-- Add the new value 'meh' to the perceived_effort_enum after 'okay'
ALTER TYPE public.perceived_effort_enum
ADD VALUE IF NOT EXISTS 'meh'
AFTER 'okay';

ALTER TYPE public.perceived_effort_enum
ADD VALUE IF NOT EXISTS 'very_hard'
AFTER 'hard';
