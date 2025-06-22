-- Create new_leg_day function
-- This function will create a new leg day workout based on wendler methodology

CREATE OR REPLACE FUNCTION public.new_leg_day(
    target_max numeric(6,2),
    target_max_weight_unit weight_unit_enum,
    user_id uuid,
    wendler_type wendler_cycle_type_enum
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    -- Function implementation deferred
    result_id uuid;
BEGIN
    -- TODO: Implement the new_leg_day function logic
    -- This function should:
    -- 1. Create wendler metadata with the provided parameters
    -- 2. Create exercise blocks for leg day exercises which will include:
    --     - barbell_back_squat with a warmup
    --       - This is the main exercise and the ratios of target max will be as follows:
    --         - for deload, the working weight is .4, .5, and .6
    --         - for 5, the working weight is .65, .75, and .85
    --         - for 3, the working weight is .7, .8, and .9
    --         - for 1, the working weight is .75, .85, and .95
    --        - The warmup should be 3 sets of 8, 5, and then 3 reps at a
    --          reasonable % based on where the rest of the workout will be.
    --     - and then accessory exercises
    --       - barbell_front_squat
    --       - machine_leg_press
    --       - machine_leg_extension
    --       - machine_abdominal
    --       - machine_seated_leg_curl
    --       - plate_stack_calf_raise
    -- 2.a For the accessory exercises, they should have notes that suggest higher
    --     reps with lower weight for deload weeks, aiming towards lower reps with higher
    --     reps for the 1 day. Since this part is so variable, but we will want
    --     the user to change the weight manually in the UI instead of trying to
    --     get it right here.
    -- 3. Return the created exercise block or superblock ID
    
    RAISE EXCEPTION 'Function implementation deferred';
    
    RETURN result_id;
END;
$$;
