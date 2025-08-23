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
            ORDER BY program_order DESC
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
