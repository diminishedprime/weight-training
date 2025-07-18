-- Trigger function: update_personal_record_on_exercise_change
-- Purpose: On INSERT, if a new exercise is completed and its weight is a new PR, update PR.
--          On UPDATE, if completion_status transitions to 'completed' and its weight is a new PR, update PR.
--          Only updates 1-rep max if the new weight from higher reps exceeds the current 1RM.
CREATE OR REPLACE FUNCTION public.update_personal_record_on_exercise_change () RETURNS TRIGGER AS $$
DECLARE
  current_pr public.personal_record_row;
  one_rep_max_pr public.personal_record_row;
BEGIN
  -- Handle INSERT: NEW only, no OLD
  IF TG_OP = 'INSERT' THEN
    IF NEW.completion_status = 'completed' THEN
      -- First, update the PR for the actual rep count performed
      current_pr := get_personal_record(NEW.user_id, NEW.exercise_type, NEW.reps);
      IF current_pr.value IS NULL OR NEW.actual_weight_value > current_pr.value THEN
        
        PERFORM set_personal_record(
          p_user_id => NEW.user_id::uuid,
          p_exercise_type => NEW.exercise_type::exercise_type_enum,
          p_weight_value => NEW.actual_weight_value::numeric,
          p_weight_unit => NEW.weight_unit::weight_unit_enum,
          p_reps => NEW.reps::integer,
          p_recorded_at => NEW.performed_at::timestamptz,
          p_source => 'system'::update_source_enum,
          p_notes => NULL::text,
          p_exercise_id => NEW.id::uuid
        );
        
        -- Only update 1-rep max if this is a higher rep count (2+) and the weight exceeds current 1RM
        IF NEW.reps > 1 THEN
          one_rep_max_pr := get_personal_record(NEW.user_id, NEW.exercise_type, 1);
          IF one_rep_max_pr.value IS NULL OR NEW.actual_weight_value > one_rep_max_pr.value THEN
            
            PERFORM set_personal_record(
              p_user_id => NEW.user_id::uuid,
              p_exercise_type => NEW.exercise_type::exercise_type_enum,
              p_weight_value => NEW.actual_weight_value::numeric,
              p_weight_unit => NEW.weight_unit::weight_unit_enum,
              p_reps => 1::integer,
              p_recorded_at => NEW.performed_at::timestamptz,
              p_source => 'system'::update_source_enum,
              p_notes => format('Updated from %s-rep PR set at %s', NEW.reps, NEW.performed_at::text)::text,
              p_exercise_id => NEW.id::uuid
            );
          END IF;
        END IF;
      END IF;
    END IF;
  -- Handle UPDATE: check transition to completed (only if exercise_type unchanged)
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.completion_status = 'completed' 
       AND (OLD.completion_status IS DISTINCT FROM 'completed')
       AND NEW.exercise_type = OLD.exercise_type THEN
      -- First, update the PR for the actual rep count performed
      current_pr := get_personal_record(NEW.user_id, NEW.exercise_type, NEW.reps);
      IF current_pr.value IS NULL OR NEW.actual_weight_value > current_pr.value THEN
        
        PERFORM set_personal_record(
          p_user_id => NEW.user_id::uuid,
          p_exercise_type => NEW.exercise_type::exercise_type_enum,
          p_weight_value => NEW.actual_weight_value::numeric,
          p_weight_unit => NEW.weight_unit::weight_unit_enum,
          p_reps => NEW.reps::integer,
          p_recorded_at => NEW.performed_at::timestamptz,
          p_source => 'system'::update_source_enum,
          p_notes => NULL::text,
          p_exercise_id => NEW.id::uuid
        );
        
        -- Only update 1-rep max if this is a higher rep count (2+) and the weight exceeds current 1RM
        IF NEW.reps > 1 THEN
          one_rep_max_pr := get_personal_record(NEW.user_id, NEW.exercise_type, 1);
          IF one_rep_max_pr.value IS NULL OR NEW.actual_weight_value > one_rep_max_pr.value THEN
            
            PERFORM set_personal_record(
              p_user_id => NEW.user_id::uuid,
              p_exercise_type => NEW.exercise_type::exercise_type_enum,
              p_weight_value => NEW.actual_weight_value::numeric,
              p_weight_unit => NEW.weight_unit::weight_unit_enum,
              p_reps => 1::integer,
              p_recorded_at => NEW.performed_at::timestamptz,
              p_source => 'system'::update_source_enum,
              p_notes => format('Updated from %s-rep PR set at %s', NEW.reps, NEW.performed_at::text)::text,
              p_exercise_id => NEW.id::uuid
            );
          END IF;
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger: after insert on exercises
DROP TRIGGER IF EXISTS trg_update_personal_record_on_new_exercise ON public.exercises;

CREATE TRIGGER trg_update_personal_record_on_new_exercise
AFTER INSERT ON public.exercises FOR EACH ROW
EXECUTE FUNCTION public.update_personal_record_on_exercise_change ();

-- Trigger: after update on exercises
DROP TRIGGER IF EXISTS trg_update_personal_record_on_exercise_update ON public.exercises;

CREATE TRIGGER trg_update_personal_record_on_exercise_update
AFTER
UPDATE ON public.exercises FOR EACH ROW
EXECUTE FUNCTION public.update_personal_record_on_exercise_change ();
