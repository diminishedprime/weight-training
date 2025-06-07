BEGIN;
SELECT plan(7);

-- Insert a dummy user so the foreign key constraint is satisfied
INSERT INTO next_auth.users (id) VALUES ('00000000-0000-0000-0000-000000000001');

-- Insert a lift using create_lift
SELECT ok(
    public.create_lift(
        '00000000-0000-0000-0000-000000000001'::uuid,      -- user_id
        'deadlift'::lift_type_enum,                        -- lift_type
        315.0,                                             -- weight_value
        5,                                                 -- reps
        '2024-06-04T10:00:00Z'::timestamptz,               -- performed_at
        'pounds'::weight_unit_enum,                        -- weight_unit
        false,                                             -- warmup
        'completed'::completion_status_enum                -- completion_status
    ) IS NOT NULL,
    'create_lift returns a lift id'
);

-- Check that the lift exists and has correct values
SELECT is(
    (SELECT reps FROM public.lifts WHERE user_id = '00000000-0000-0000-0000-000000000001' AND lift_type = 'deadlift' AND reps = 5 ORDER BY performed_at DESC LIMIT 1),
    5,
    'Lift created with correct reps'
);

SELECT is(
    (SELECT weight_value FROM public.lifts l JOIN public.weights w ON l.weight_id = w.id WHERE l.user_id = '00000000-0000-0000-0000-000000000001' AND l.lift_type = 'deadlift' AND w.weight_value = 315.0 ORDER BY l.performed_at DESC LIMIT 1),
    315.0,
    'Lift created with correct weight'
);

-- Insert a lift using create_lift with all defaults except required
SELECT ok(
    public.create_lift(
        '00000000-0000-0000-0000-000000000001'::uuid,   -- user_id
        'deadlift'::lift_type_enum,                     -- lift_type
        135.0,                                          -- weight_value
        10                                              -- reps
        -- performed_at, weight_unit, warmup, completion_status omitted (use defaults)
    ) IS NOT NULL,
    'create_lift with defaults (new user) returns a lift id'
);

-- Check that the lift exists and has correct values (defaults)
SELECT is(
    (SELECT reps FROM public.lifts WHERE user_id = '00000000-0000-0000-0000-000000000001' AND lift_type = 'deadlift' AND reps = 10 ORDER BY performed_at DESC LIMIT 1),
    10,
    'Lift with defaults (new user) created with correct reps'
);

SELECT is(
    (SELECT weight_value FROM public.lifts l JOIN public.weights w ON l.weight_id = w.id WHERE l.user_id = '00000000-0000-0000-0000-000000000001' AND l.lift_type = 'deadlift' AND w.weight_value = 135.0 ORDER BY l.performed_at DESC LIMIT 1),
    135.0,
    'Lift with defaults (new user) created with correct weight'
);

-- Test get_lifts_by_type_for_user returns correct lifts
SELECT results_eq(
    $$
    SELECT reps FROM public.get_lifts_by_type_for_user(
        '00000000-0000-0000-0000-000000000001'::uuid,
        'deadlift'::lift_type_enum
    ) ORDER BY reps
    $$,
    ARRAY[5, 10],
    'get_lifts_by_type_for_user returns correct reps for user and lift_type'
);

SELECT * FROM finish();
ROLLBACK;
