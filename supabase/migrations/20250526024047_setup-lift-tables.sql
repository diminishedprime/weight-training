--
-- Create weights table
-- 
CREATE TABLE IF NOT EXISTS public.weights
(
    -- Unique identifier for each weight entry.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- The weight value, assuming nobody weighs over 999.99 lbs.
    weight_value numeric(5, 2) NOT NULL,
    -- should be either 'pounds' or 'kilograms'
    weight_unit text NOT NULL CHECK (weight_unit IN ('pounds', 'kilograms')) DEFAULT 'pounds',

    CONSTRAINT weights_pkey PRIMARY KEY (id)
);

--
-- Create lifts table (generalized from deadlifts)
--
CREATE TABLE IF NOT EXISTS public.lifts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    lift_type text NOT NULL 
        CHECK (lift_type IN (
            'deadlift'
            , 'squat'
            , 'bench_press'
            , 'overhead_press'
            , 'row'
            , 'other'
            )),
    -- The time that the lift was performed. The timestamp can be null
    -- because sometimes lifts are "recorded" before they actually happen, for
    -- example, when you're setting up a training plan.
    time timestamp with time zone NULL,
    -- A pointer at a weight row which includes both the weight value and the unit
    weight_id uuid NOT NULL,
    -- How many repititions were performed for this lift.
    reps integer NOT NULL,
    -- Indicates if the lift is a warmup or not.
    warmup boolean NOT NULL DEFAULT false,
    -- completion_status
    completion_status text NOT NULL 
        CHECK (completion_status IN ('completed', 'not_completed', 'failed', 'skipped')) 
        DEFAULT 'not_completed',
    actually_completed boolean NOT NULL DEFAULT false,

    CONSTRAINT lifts_id_pkey PRIMARY KEY (id),
    CONSTRAINT lifts_weight_id_fkey FOREIGN KEY (weight_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT lifts_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);

--
-- Create lift_group table (generalized from deadlift_group)
--
CREATE TABLE IF NOT EXISTS public.lift_group 
(
    -- Unique identifier for each lift group.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    wendler_id uuid NULL,

    CONSTRAINT lift_group_id_pkey PRIMARY KEY (id),
    CONSTRAINT lift_group_user_id_fkey FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.wendler_metadata
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- The training max for this group. Training max is calculated as 90% of
    -- your current actual 1-rep max. It is a pointer at a weight row which
    -- includes both the weight value and the unit
    training_max_id uuid NOT NULL,
    increase_amount_id uuid NOT NULL,
    cycle_type text NOT NULL 
        CHECK (cycle_type IN ('5', '3', '1', 'deload')),
    lift_type text NOT NULL 
        CHECK (lift_type IN (
            'deadlift'
            , 'squat'
            , 'bench_press'
            , 'overhead_press'
            )),

    CONSTRAINT wendler_metadata_training_max_id_fkey FOREIGN KEY (training_max_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE,
    CONSTRAINT wendler_metadata_increase_amount_id_fkey FOREIGN KEY (increase_amount_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE
);

-- Create a junction table for lift groups.
CREATE TABLE IF NOT EXISTS public.lift_groups
(
    -- Unique identifier for each record in the junction table.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- Reference to the lift group.
    lift_group_id uuid NOT NULL,
    -- Reference to the lift.
    lift_id uuid NOT NULL,
    -- The order of the lift in the group.
    position integer,

    CONSTRAINT lift_groups_lifts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_lift_group FOREIGN KEY (lift_group_id) REFERENCES public.lift_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_lift FOREIGN KEY (lift_id) REFERENCES public.lifts(id) ON DELETE CASCADE
);