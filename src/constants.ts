import * as t from "./types";
import deadliftImage from "./images/deadlift.png";
import frontSquatImage from "./images/front_squat.png";
import backSquatImage from "./images/back_squat.png";
import overheadPressImage from "./images/overhead_press.png";
import benchPressImage from "./images/bench_press.png";
import dumbbellImage from "./images/dumbbell.png";

export const images = {
  dumbbell: dumbbellImage
};

export const plateWeight: { [plate in t.PlateTypes]: number } = {
  [t.PlateTypes.FORTY_FIVE]: 45,
  [t.PlateTypes.TWENTY_FIVE]: 25,
  [t.PlateTypes.TEN]: 10,
  [t.PlateTypes.FIVE]: 5,
  [t.PlateTypes.TWO_AND_A_HALF]: 2.5
};

export const plateWeights: number[] = Object.values(plateWeight);

export const liftMetadata: {
  [lifttype in t.LiftType]: { image: string; displayText: string };
} = {
  [t.LiftType.DEADLIFT]: { image: deadliftImage, displayText: "Deadlift" },
  [t.LiftType.SQUAT]: { image: backSquatImage, displayText: "Back Squat" },
  [t.LiftType.FRONT_SQUAT]: {
    image: frontSquatImage,
    displayText: "Front Squat"
  },
  [t.LiftType.OVERHEAD_PRESS]: {
    image: overheadPressImage,
    displayText: "Overhead Press"
  },
  [t.LiftType.BENCH_PRESS]: {
    image: benchPressImage,
    displayText: "Bench Press"
  }
};
