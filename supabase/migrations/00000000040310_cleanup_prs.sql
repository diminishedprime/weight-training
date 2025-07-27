CREATE OR REPLACE FUNCTION _system.cleanup_prs (p_user_id uuid) RETURNS void AS $$
DECLARE
  v_rec RECORD;
  v_r integer;
  v_pr public.personal_record_row;
BEGIN
  -- Clear out the user's personal_record_history before replaying PR logic
  DELETE FROM public.personal_record_history WHERE user_id = p_user_id;
  -- Iterate through all completed exercises for the user, ordered by performed_at
  FOR v_rec IN
    SELECT * FROM public.exercises
    WHERE user_id = p_user_id
      AND completion_status = 'completed'
      AND performed_at IS NOT NULL
    ORDER BY performed_at ASC, id ASC
  LOOP
    -- For each rep count from this set down to 1
    FOR v_r IN REVERSE v_rec.reps..1 LOOP
      v_pr := get_personal_record(v_rec.user_id, v_rec.exercise_type, v_r);
      IF v_pr.weight_value IS NULL OR v_rec.actual_weight_value > v_pr.weight_value THEN
        PERFORM set_personal_record(
          p_user_id => v_rec.user_id::uuid,
          p_exercise_type => v_rec.exercise_type::exercise_type_enum,
          p_weight_value => v_rec.actual_weight_value::numeric,
          p_weight_unit => v_rec.weight_unit::weight_unit_enum,
          p_reps => v_r::integer,
          p_recorded_at => v_rec.performed_at::timestamptz,
          p_source => 'system'::update_source_enum,
          p_notes => CASE WHEN v_r = v_rec.reps THEN NULL::text ELSE format('Updated from %s-rep PR set at %s', v_rec.reps, v_rec.performed_at::text)::text END,
          p_exercise_id => v_rec.id::uuid
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
