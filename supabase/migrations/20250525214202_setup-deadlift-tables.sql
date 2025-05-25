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
-- Create deadlift table
--
CREATE TABLE IF NOT EXISTS public.deadlifts
(
    -- Unique identifier for each deadlift.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- The time that the deadlift was performed. The timestamp can be null
    -- because sometimes lifts are "recorded" before they actually happen, for
    -- example, when you're setting up a training plan.
    time timestamp with time zone NULL,
    -- A pointer at a weight row which includes both the weight value and the unit
    weight_id uuid NOT NULL,
    -- How many repitations were performed for this deadlift.
    reps integer NOT NULL,
    -- Indicates if the deadlift is a warmup or not.
    warmup boolean NOT NULL DEFAULT false,
    -- completion_status
    completion_status text NOT NULL 
        CHECK (completion_status IN ('completed', 'not_completed', 'failed', 'skipped')) 
        DEFAULT 'not_completed',
    actually_completed boolean NOT NULL DEFAULT false,

    CONSTRAINT deadlift_id_pkey PRIMARY KEY (id),
    CONSTRAINT deadlift_weight_id_fkey FOREIGN KEY (weight_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.deadlift_group 
(
    -- Unique identifier for each deadlift group.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- The training max for this group. Training max is calculated as 90% of
    -- your current actual 1-red max. It is a pointer at a weight row which
    -- includes both the weight value and the unit
    training_max_id uuid NOT NULL,

    CONSTRAINT deadlift_group_id_pkey PRIMARY KEY (id),
    CONSTRAINT deadlift_group_training_max_id_fkey FOREIGN KEY (training_max_id) 
        REFERENCES public.weights(id) ON DELETE CASCADE
);

-- Create a junction table for deadlift groups.
CREATE TABLE IF NOT EXISTS public.deadlift_groups
(
    -- Unique identifier for each record in the junction table.
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    -- Reference to the deadlift group.
    deadlift_group_id uuid NOT NULL,
    -- Reference to the deadlift.
    deadlift_id uuid NOT NULL,
    -- Optionally, the order of the deadlift in the group.
    position integer,

    CONSTRAINT deadlift_groups_deadlifts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_deadlift_group FOREIGN KEY (deadlift_group_id) REFERENCES public.deadlift_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_deadlift FOREIGN KEY (deadlift_id) REFERENCES public.deadlifts(id) ON DELETE CASCADE
);