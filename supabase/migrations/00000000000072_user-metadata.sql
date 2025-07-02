-- Trigger function: update_personal_record_on_exercise_change
-- Purpose: On INSERT, if a new exercise is completed and its weight is a new PR, update PR.
--          On UPDATE, if completion_status transitions to 'completed' and its weight is a new PR, update PR.
CREATE OR REPLACE FUNCTION public.update_personal_record_on_exercise_change () RETURNS TRIGGER AS $$
DECLARE
  current_pr public.personal_record_row;
BEGIN
  -- Handle INSERT: NEW only, no OLD
  IF TG_OP = 'INSERT' THEN
    IF NEW.completion_status = 'completed' THEN
      current_pr := get_personal_record(NEW.user_id, NEW.exercise_type);
      IF current_pr.value IS NULL OR NEW.weight_value > current_pr.value THEN
        PERFORM set_personal_record(NEW.user_id, NEW.exercise_type, NEW.weight_value, NEW.weight_unit, NEW.performed_at, 'system', NULL, NEW.id);
      END IF;
    END IF;
  -- Handle UPDATE: check transition to completed
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.completion_status = 'completed' AND (OLD.completion_status IS DISTINCT FROM 'completed') THEN
      current_pr := get_personal_record(NEW.user_id, NEW.exercise_type);
      IF current_pr.value IS NULL OR NEW.weight_value > current_pr.value THEN
        PERFORM set_personal_record(NEW.user_id, NEW.exercise_type, NEW.weight_value, NEW.weight_unit, NEW.performed_at, 'system', NULL, NEW.id);
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
