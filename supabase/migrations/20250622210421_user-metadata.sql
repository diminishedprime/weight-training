-- User singleton preferences table
CREATE TABLE IF NOT EXISTS public.user_metadata
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    preferred_weight_unit weight_unit_enum DEFAULT 'pounds',
    default_rest_time_seconds integer DEFAULT 120,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    updated_at timestamp with time zone DEFAULT timezone('utc', now()),
    CONSTRAINT user_metadata_pkey PRIMARY KEY (id),
    CONSTRAINT user_metadata_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE,
    CONSTRAINT user_metadata_user_unique UNIQUE (user_id)
);

-- Junction table for user exercise weights
CREATE TABLE IF NOT EXISTS public.user_exercise_weights
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    exercise_type exercise_type_enum NOT NULL,
    one_rep_max_weight_id uuid,
    target_max_weight_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    CONSTRAINT user_exercise_weights_pkey PRIMARY KEY (id),
    CONSTRAINT user_exercise_weights_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE,
    CONSTRAINT user_exercise_weights_one_rep_max_fkey FOREIGN KEY (one_rep_max_weight_id) REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT user_exercise_weights_target_max_fkey FOREIGN KEY (target_max_weight_id) REFERENCES public.weights(id) ON DELETE CASCADE,
    -- Ensure only one row per user per exercise
    CONSTRAINT user_exercise_weights_unique UNIQUE (user_id, exercise_type)
);

-- Trigger function to auto-create user_metadata when a user is created
CREATE OR REPLACE FUNCTION public.create_user_metadata_on_user_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_metadata (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on next_auth.users to call the function after insert
DROP TRIGGER IF EXISTS trg_create_user_metadata ON next_auth.users;
CREATE TRIGGER trg_create_user_metadata
AFTER INSERT ON next_auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_user_metadata_on_user_insert();

CREATE OR REPLACE FUNCTION public.update_user_one_rep_max(
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum
) RETURNS void AS $$
DECLARE
  v_weight_id uuid;
BEGIN
  INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;

  INSERT INTO public.user_exercise_weights (user_id, exercise_type, one_rep_max_weight_id)
    VALUES (p_user_id, p_exercise_type, v_weight_id)
    ON CONFLICT (user_id, exercise_type) DO UPDATE
      SET one_rep_max_weight_id = EXCLUDED.one_rep_max_weight_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_user_target_max(
  p_user_id uuid,
  p_exercise_type exercise_type_enum,
  p_weight_value numeric,
  p_weight_unit weight_unit_enum
) RETURNS void AS $$
DECLARE
  v_weight_id uuid;
BEGIN
  INSERT INTO public.weights (weight_value, weight_unit)
    VALUES (p_weight_value, p_weight_unit)
    RETURNING id INTO v_weight_id;

  INSERT INTO public.user_exercise_weights (user_id, exercise_type, target_max_weight_id)
    VALUES (p_user_id, p_exercise_type, v_weight_id)
    ON CONFLICT (user_id, exercise_type) DO UPDATE
      SET target_max_weight_id = EXCLUDED.target_max_weight_id;
END;


$$ LANGUAGE plpgsql;

create or replace function get_user_preferences(target_user_id uuid)
returns table(
  preferred_weight_unit weight_unit_enum,
  default_rest_time_seconds integer,
  exercise_type exercise_type_enum,
  one_rep_max_value numeric,
  one_rep_max_unit weight_unit_enum,
  target_max_value numeric,
  target_max_unit weight_unit_enum
) 
language sql
as $$
  select 
    um.preferred_weight_unit,
    um.default_rest_time_seconds,
    uew.exercise_type,
    w1.weight_value as one_rep_max_value,
    w1.weight_unit as one_rep_max_unit,
    w2.weight_value as target_max_value,
    w2.weight_unit as target_max_unit
  from user_metadata um
  left join user_exercise_weights uew on uew.user_id = um.user_id
  left join weights w1 on w1.id = uew.one_rep_max_weight_id
  left join weights w2 on w2.id = uew.target_max_weight_id
  where um.user_id = target_user_id;
$$;
