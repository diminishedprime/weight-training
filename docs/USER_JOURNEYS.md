- [x] User can log into the app
- [ ] Users can add in a custom exercise.
  - [x] Users can add in a custom barbell exercise. [User Journey: Add Custom
        Exercise]
  - [ ] Users can add in a custom dumbbell exercise.
  - [ ] Users can add in a custom bodyweight exercise.
  - [ ] Users can add in a custom machine exercise.
  - [ ] Question: Is it valid for an exercise to be dangling, i.e. not a part of
        a block or superblock
- [ ] Users can edit an existing exercise.
- [ ] Exercise Blocks
  - [ ] Users can add in a wendler superblock for leg day.
- [ ] Users can add in a Leg Day superblock
  - [ ] This superblock contains the following blocks:
    - [ ] Wendler Squats
    - [ ] Accessories
      - [ ] Abs machine
      - [ ] Barbell Front Squats
      - [ ] Machine Leg Press
      - [ ] Machine Seated Leg Curl
      - [ ] Machine Leg Extension
      - [ ] Calf Raise
      - [ ] Machine Inner Thigh
      - [ ] Mchanie Outer Thigh
- [ ] Users can add in a Push Day superblock
  - [ ] This superblock contains the following blocks:
    - [ ] Wendler Bench Press
    - [ ] Wendler Overhead Press
      - [ ] Question: Do we want to do the alternating wendler sets thing so we
            alternate between bench and overhead press as the press day
            exercises?
    - [ ] Accessories
      - [ ] Abs machine
      - [ ] Bodyweight Situps
      - [ ] Machine Tricepts Extension
      - [ ] Shoulder Press
      - [ ] Machine Converging Chest Press
      - [ ] Machine Lateral Raise (except we hate this one so maybe not?)
      - [ ] Machine Back Extension
      - [ ] Machine Rear Delt
      - [ ] Bodyweight Pushups
- [ ] Users can add in a Pull Day superblock
  - [ ] This superblock contains the following blocks:
    - [ ] Wendler Deadlift
    - [ ] Accessories
      - [ ] Abs machine
      - [ ] Barbell Row
      - [ ] Machine Biceps Curl
      - [ ] Machine Diverging Lat Pulldown
      - [ ] Machine Divering Low Row
      - [ ] Machine Pec Fly
      - [ ] Bodyweight Pullups
      - [ ] Bodyweight Chinups
- [ ] Users can add in a custom block
- [ ] Users can add in a custom superblock
  - [ ] Custom blocks can be associated with a custom superblock
    - [ ] Question: what does ordering mean here
    - [ ] Question: how do we handle determining things like a superblock being
          "finished" or not
      - [ ] Maybe it's just saying all exercises directly tied to it are
            completed or skipped?
      - [ ] Does it needing to be calculated cause the query performance to be
            bad?
- [ ] Users can set their preferences per exercise (or equipment if that's more
      convenient) for things like which reps should be available in the rep
      selector by default & what plates are available
- [ ] Users can use a special form of making the closest weight where they
      provide exactly what plates they have available (along with a color
      picker) and that is used for determining how to "make change"
- [ ] For existing exercises, there's a database RPC that can run in seed.sql
      that will try its best to "wendlize" lifts that map to what a wendler
      exercise looks like.

[User Journey: Add Custom Exercise]: ../integration_tests/add-custom-exercise.integration.test.tsx
