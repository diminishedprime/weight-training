BEGIN;
SELECT plan(8);

-- Should never return less than 45
SELECT is(public.normalize_bar_weight_pounds(0.0), 45.0, 'normalize_bar_weight_pounds(0) = 45');
SELECT is(public.normalize_bar_weight_pounds(2.4), 45.0, 'normalize_bar_weight_pounds(2.4) = 45');
SELECT is(public.normalize_bar_weight_pounds(44.9), 45.0, 'normalize_bar_weight_pounds(44.9) = 45');
SELECT is(public.normalize_bar_weight_pounds(45.0), 45.0, 'normalize_bar_weight_pounds(45) = 45');
SELECT is(public.normalize_bar_weight_pounds(47.0), 45.0, 'normalize_bar_weight_pounds(47) = 45');
-- Should round up when above the 2.5 threshold
SELECT is(public.normalize_bar_weight_pounds(48.0), 50.0, 'normalize_bar_weight_pounds(48) = 50');
-- should round down when below the 2.5 threshold
SELECT is(public.normalize_bar_weight_pounds(52.0), 50.0, 'normalize_bar_weight_pounds(52) = 50');
-- sanity check with a large number
SELECT is(public.normalize_bar_weight_pounds(222.2), 220.0, 'normalize_bar_weight_pounds(100) = 100');

SELECT * FROM finish();
ROLLBACK;
