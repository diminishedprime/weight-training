BEGIN;

SELECT
  plan (9);

-- round_to_nearest_5 tests
SELECT
  is (
    public.round_to_nearest_5 (0.0),
    0.0,
    'round_to_nearest_5(0) = 0'
  );

-- 2.4 should round down
SELECT
  is (
    public.round_to_nearest_5 (2.4),
    0.0,
    'round_to_nearest_5(2.4) = 0'
  );

-- 2.5 should round up
SELECT
  is (
    public.round_to_nearest_5 (2.5),
    5.0,
    'round_to_nearest_5(2.5) = 5'
  );

-- 7.4 should round down
SELECT
  is (
    public.round_to_nearest_5 (7.4),
    5.0,
    'round_to_nearest_5(7.4) = 5'
  );

-- 7.5 should round up
SELECT
  is (
    public.round_to_nearest_5 (7.5),
    10.0,
    'round_to_nearest_5(7.5) = 10'
  );

-- other confidence-boosting asserts.
SELECT
  is (
    public.round_to_nearest_5 (12.6),
    15.0,
    'round_to_nearest_5(12.6) = 15'
  );

SELECT
  is (
    public.round_to_nearest_5 (45.0),
    45.0,
    'round_to_nearest_5(45) = 45'
  );

SELECT
  is (
    public.round_to_nearest_5 (47.0),
    45.0,
    'round_to_nearest_5(47) = 45'
  );

SELECT
  is (
    public.round_to_nearest_5 (48.0),
    50.0,
    'round_to_nearest_5(48) = 50'
  );

SELECT
  *
FROM
  finish ();

ROLLBACK;
