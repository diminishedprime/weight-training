- [x] User can log into the app
- [ ] Users can add in a custom exercise.
  - [x] Users can add in a custom barbell exercise. [User Journey: Add Custom
        Exercise]
  - [x] Users can add in a custom dumbbell exercise.
  - [ ] Users can add in a custom bodyweight exercise.
  - [x] Users can add in a custom machine exercise.
  - [ ] Users can add in a custom kettlebell exercise.
- [ ] Users can edit an existing exercise.
  - [x] Users can edit an existing barbell exercise.
  - [x] Users can edit an existing dumbbell exercise.
  - [ ] Users can edit a custom bodyweight exercise.
  - [x] Users can edit a custom machine exercise.
  - [ ] Users can edit a custom kettlebell exercise.
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
- [ ] Create a \_system database function that does its best to try and "block"
      exercises together based on some sort of threshold from the seeded data.
- [ ] Get icons or gifs or images or something for all the exercises.
- [ ] Support custom dark & light mode themes for the app.
- [ ] there is a customed home page for the user that shows recent lifts or
      superblocks or maybe PRs so they can easily see their progress. Maybe also
      have in some huerstic based buttons that show up based on what they've
      been doing.
- [ ] Non Obvious controls have an info icon button that can be clicked to show
      additional context. For example, the rep selector wolud explain what AMRAP
      is.
- [ ] There's a generic weight selector that has +- 5 and +-25 buttons so it's
      really fast to choose weights.

[User Journey: Add Custom Exercise]: ../integration_tests/add-custom-exercise.integration.test.tsx
