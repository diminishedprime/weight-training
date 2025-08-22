DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hydrated_home_superblock') THEN
        DROP TYPE hydrated_home_superblock;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hydrated_home') THEN
        DROP TYPE hydrated_home;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hydrated_home_personal_record') THEN
        DROP TYPE hydrated_home_personal_record;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hydrated_home_powerlifting_total') THEN
        DROP TYPE hydrated_home_powerlifting_total;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hydrated_home_powerlifting') THEN
        DROP TYPE hydrated_home_powerlifting;
    END IF;
END $$;

CREATE TYPE hydrated_home_superblock AS (
  id uuid,
  name text,
  total_volume numeric,
  total_sets integer,
  total_blocks integer,
  started_at timestamptz,
  completed_at timestamptz
);

CREATE TYPE hydrated_home_personal_record AS (
  id uuid,
  exercise_type exercise_type_enum,
  equipment_type equipment_type_enum,
  recorded_at timestamptz,
  value numeric,
  reps integer
);

CREATE TYPE hydrated_home_powerlifting_total AS (
  id uuid,
  squat_weight numeric,
  squat_time timestamptz,
  deadlift_weight numeric,
  deadlift_time timestamptz,
  bench_press_weight numeric,
  bench_press_time timestamptz,
  total_weight numeric
);

CREATE TYPE hydrated_home_powerlifting as (
  id uuid,
  recent hydrated_home_powerlifting_total,
  record hydrated_home_powerlifting_total
);

CREATE TYPE hydrated_home AS (
  user_id uuid,
  active_program_id uuid,
  recent_superblocks hydrated_home_superblock[],
  recent_records hydrated_home_personal_record[],
  powerlifting hydrated_home_powerlifting
);

CREATE OR REPLACE FUNCTION _impl.hydrate_home_get_recent_record (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS hydrated_home_personal_record LANGUAGE plpgsql AS $$
DECLARE
    rec hydrated_home_personal_record;
BEGIN
    SELECT
        ex.id,
        ex.exercise_type,
        ex.equipment_type,
        ex.performed_at AS recorded_at,
        COALESCE(ex.actual_weight_value, 0) AS value,
        ex.reps
    INTO rec
    FROM exercises ex
    WHERE ex.user_id = p_user_id
      AND ex.completion_status = 'completed'
      AND ex.performed_at >= NOW() - INTERVAL '10 weeks'
      AND ex.exercise_type = p_exercise_type
    ORDER BY ex.actual_weight_value DESC
    LIMIT 1;
    RETURN rec;
END;
$$;

CREATE OR REPLACE FUNCTION _impl.hydrate_home_recent_record (p_user_id uuid) RETURNS hydrated_home_powerlifting_total LANGUAGE plpgsql AS $$
DECLARE
    squat_rec hydrated_home_personal_record;
    deadlift_rec hydrated_home_personal_record;
    bench_rec hydrated_home_personal_record;
BEGIN
    squat_rec := _impl.hydrate_home_get_recent_record(p_user_id, 'barbell_back_squat');
    deadlift_rec := _impl.hydrate_home_get_recent_record(p_user_id, 'barbell_deadlift');
    bench_rec := _impl.hydrate_home_get_recent_record(p_user_id, 'barbell_bench_press');

    RETURN (
        uuid_generate_v5('00000000-0000-0000-0000-000000000000', concat_ws('|', squat_rec.value, squat_rec.recorded_at, deadlift_rec.value, deadlift_rec.recorded_at, bench_rec.value, bench_rec.recorded_at)),
        squat_rec.value,
        squat_rec.recorded_at,
        deadlift_rec.value,
        deadlift_rec.recorded_at,
        bench_rec.value,
        bench_rec.recorded_at,
        COALESCE(squat_rec.value, 0) + COALESCE(deadlift_rec.value, 0) + COALESCE(bench_rec.value, 0)
    );
END;
$$;

CREATE OR REPLACE FUNCTION _impl.hydrate_home_get_record (
  p_user_id uuid,
  p_exercise_type exercise_type_enum
) RETURNS hydrated_home_personal_record LANGUAGE plpgsql AS $$
DECLARE
    rec hydrated_home_personal_record;
BEGIN
    SELECT
        pr.id,
        p_exercise_type AS exercise_type,
        ex.equipment_type,
        pr.recorded_at,
        COALESCE(pr.weight_value, 0) AS value,
        pr.reps,
        pr.exercise_id
    INTO rec
    FROM public.get_personal_records_for_exercise_type(p_user_id, p_exercise_type, 1) pr
    LEFT JOIN exercises ex ON ex.id = pr.exercise_id
    ORDER BY pr.weight_value DESC, pr.recorded_at DESC
    LIMIT 1;
    RETURN rec;
END;
$$;

CREATE OR REPLACE FUNCTION _impl.hydrate_home_record (p_user_id uuid) RETURNS hydrated_home_powerlifting_total LANGUAGE plpgsql AS $$
DECLARE
    squat_rec hydrated_home_personal_record;
    deadlift_rec hydrated_home_personal_record;
    bench_rec hydrated_home_personal_record;
BEGIN
    squat_rec := _impl.hydrate_home_get_record(p_user_id, 'barbell_back_squat');
    deadlift_rec := _impl.hydrate_home_get_record(p_user_id, 'barbell_deadlift');
    bench_rec := _impl.hydrate_home_get_record(p_user_id, 'barbell_bench_press');

    RETURN (
        uuid_generate_v5('00000000-0000-0000-0000-000000000000', concat_ws('|', squat_rec.value, squat_rec.recorded_at, deadlift_rec.value, deadlift_rec.recorded_at, bench_rec.value, bench_rec.recorded_at)),
        squat_rec.value,
        squat_rec.recorded_at,
        deadlift_rec.value,
        deadlift_rec.recorded_at,
        bench_rec.value,
        bench_rec.recorded_at,
        COALESCE(squat_rec.value, 0) + COALESCE(deadlift_rec.value, 0) + COALESCE(bench_rec.value, 0)
    );
END;
$$;

CREATE OR REPLACE FUNCTION hydrate_home (p_user_id uuid) RETURNS hydrated_home LANGUAGE sql AS $$
    WITH recent_superblocks_stats AS (
        SELECT
            superblocks.id,
            superblocks.name,
            COALESCE(SUM(exercises.reps * COALESCE(exercises.actual_weight_value, 0)), 0) AS total_volume,
            COUNT(exercises.id) AS total_sets,
            COUNT(DISTINCT blocks.block_id) FILTER (WHERE block.completed_at IS NOT NULL) AS total_blocks,
            superblocks.started_at,
            superblocks.completed_at
        FROM (
            SELECT id, name, started_at, completed_at
            FROM exercise_superblock
            WHERE user_id = p_user_id AND completion_status = 'completed'
            ORDER BY started_at DESC NULLS LAST
            LIMIT 2
        ) superblocks
        JOIN exercise_superblock_blocks blocks ON blocks.superblock_id = superblocks.id
        JOIN exercise_block block ON blocks.block_id = block.id
        JOIN exercise_block_exercises block_exercises ON block.id = block_exercises.block_id
        JOIN exercises ON block_exercises.exercise_id = exercises.id AND exercises.completion_status = 'completed'
        GROUP BY superblocks.id, superblocks.name, superblocks.started_at, superblocks.completed_at
    ),
    recent_records_stats AS (
        SELECT id, exercise_type, equipment_type, recorded_at, value, reps
        FROM (
                SELECT DISTINCT ON (pr.exercise_type) pr.id, pr.exercise_type, ex.equipment_type, pr.recorded_at, pr.weight_value AS value, pr.reps
                FROM personal_record_history pr
                LEFT JOIN exercises ex ON pr.exercise_id = ex.id
                WHERE pr.user_id = p_user_id AND pr.recorded_at >= NOW() - INTERVAL '1 month'
                ORDER BY pr.exercise_type, pr.recorded_at DESC, pr.reps DESC
        ) sub
        ORDER BY recorded_at DESC
        LIMIT 4
        )
    SELECT
        p_user_id AS user_id,
        (
            SELECT id
            FROM wendler_program
            WHERE user_id = p_user_id
            ORDER BY started_at DESC NULLS LAST, program_order DESC
            LIMIT 1
        ) AS active_program_id,
        (
            SELECT array_agg(row(id, name, total_volume, total_sets, total_blocks, started_at, completed_at)::hydrated_home_superblock)
            FROM recent_superblocks_stats
        ) AS recent_superblocks,
        (
            SELECT array_agg(row(id, exercise_type, equipment_type, recorded_at, value, reps)::hydrated_home_personal_record)
            FROM recent_records_stats
        ) AS recent_records,
        (
                    SELECT row(
                        uuid_generate_v4(),
                        _impl.hydrate_home_recent_record(p_user_id),
                        _impl.hydrate_home_record(p_user_id)
                    )::hydrated_home_powerlifting
        ) AS powerlifting;
$$;
