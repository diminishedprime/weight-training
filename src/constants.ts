import backSquatImage from "./images/back_squat.png";
import benchPressImage from "./images/bench_press.png";
import deadliftImage from "./images/deadlift.png";
import dumbbellImage from "./images/dumbbell.png";
import frontSquatImage from "./images/front_squat.png";
import overheadPressImage from "./images/overhead_press.png";
import { PlateTypes } from "./types/common";
import { Weight } from "./types/Weight";
import { LiftType } from "./types/db";

export const images = {
  dumbbell: dumbbellImage
};

export const plateWeight: {
  [plate in PlateTypes]: Weight;
} = {
  [PlateTypes.FORTY_FIVE]: Weight.lbs(45),
  [PlateTypes.TWENTY_FIVE]: Weight.lbs(25),
  [PlateTypes.TEN]: Weight.lbs(10),
  [PlateTypes.FIVE]: Weight.lbs(5),
  [PlateTypes.TWO_AND_A_HALF]: Weight.lbs(2.5)
};

export const plateWeights: Weight[] = Object.values(plateWeight);

export const liftMetadata: {
  [lifttype in LiftType]: { image: string; displayText: string };
} = {
  [LiftType.DEADLIFT]: { image: deadliftImage, displayText: "Deadlift" },
  [LiftType.SQUAT]: { image: backSquatImage, displayText: "Back Squat" },
  [LiftType.FRONT_SQUAT]: {
    image: frontSquatImage,
    displayText: "Front Squat"
  },
  [LiftType.OVERHEAD_PRESS]: {
    image: overheadPressImage,
    displayText: "Overhead Press"
  },
  [LiftType.BENCH_PRESS]: {
    image: benchPressImage,
    displayText: "Bench Press"
  }
};
