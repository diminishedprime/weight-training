CREATE OR REPLACE FUNCTION _trigger.update_personal_record_on_exercise_change () RETURNS TRIGGER AS $$
DECLARE
  current_pr public.personal_record_row;
  one_rep_max_pr public.personal_record_row;
  r integer;
  pr public.personal_record_row;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.completion_status = 'completed' THEN
      FOR r IN REVERSE NEW.reps..1 LOOP
        pr := get_personal_record(NEW.user_id, NEW.exercise_type, r);
        IF pr.weight_value IS NULL OR NEW.actual_weight_value > pr.weight_value THEN
          PERFORM set_personal_record(
            p_user_id => NEW.user_id::uuid,
            p_exercise_type => NEW.exercise_type::exercise_type_enum,
            p_weight_value => NEW.actual_weight_value::numeric,
            p_weight_unit => NEW.weight_unit::weight_unit_enum,
            p_reps => r::integer,
            p_recorded_at => NEW.performed_at::timestamptz,
            p_source => 'system'::update_source_enum,
            p_notes => CASE WHEN r = NEW.reps THEN NULL::text ELSE format('Updated from %s-rep PR set at %s', NEW.reps, NEW.performed_at::text)::text END,
            p_exercise_id => NEW.id::uuid
          );
        END IF;
      END LOOP;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.completion_status = 'completed'
       AND (OLD.completion_status IS DISTINCT FROM 'completed')
       AND NEW.exercise_type = OLD.exercise_type THEN
      FOR r IN REVERSE NEW.reps..1 LOOP
        pr := get_personal_record(NEW.user_id, NEW.exercise_type, r);
        IF pr.weight_value IS NULL OR NEW.actual_weight_value > pr.weight_value THEN
          PERFORM set_personal_record(
            p_user_id => NEW.user_id::uuid,
            p_exercise_type => NEW.exercise_type::exercise_type_enum,
            p_weight_value => NEW.actual_weight_value::numeric,
            p_weight_unit => NEW.weight_unit::weight_unit_enum,
            p_reps => r::integer,
            p_recorded_at => NEW.performed_at::timestamptz,
            p_source => 'system'::update_source_enum,
            p_notes => CASE WHEN r = NEW.reps THEN NULL::text ELSE format('Updated from %s-rep PR set at %s', NEW.reps, NEW.performed_at::text)::text END,
            p_exercise_id => NEW.id::uuid
          );
        END IF;
      END LOOP;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_personal_record_on_new_exercise ON public.exercises;

CREATE TRIGGER trg_update_personal_record_on_new_exercise
AFTER INSERT ON public.exercises FOR EACH ROW
EXECUTE FUNCTION _trigger.update_personal_record_on_exercise_change ();

DROP TRIGGER IF EXISTS trg_update_personal_record_on_exercise_update ON public.exercises;

CREATE TRIGGER trg_update_personal_record_on_exercise_update
AFTER
UPDATE ON public.exercises FOR EACH ROW
EXECUTE FUNCTION _trigger.update_personal_record_on_exercise_change ();
