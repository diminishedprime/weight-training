import firebase from "firebase/app";
import backSquatImage from "./images/back_squat.png";
import benchPressImage from "./images/bench_press.png";
import deadliftImage from "./images/deadlift.png";
import dumbbellImage from "./images/dumbbell.png";
import frontSquatImage from "./images/front_squat.png";
import overheadPressImage from "./images/overhead_press.png";
import { PlateTypes } from "./types/common";
import { LiftType } from "./types/db";
import { Weight } from "./types/Weight";

// TODO - put this into the timestamp class as a static method.
export const ZERO_TIME = () => firebase.firestore.Timestamp.fromMillis(0);

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
  [LiftType.CleanAndJerk]: {
    image: dumbbellImage,
    displayText: "Clean And Jerk"
  },
  [LiftType.Snatch]: { image: dumbbellImage, displayText: "Snatch" },
  [LiftType.Deadlift]: { image: deadliftImage, displayText: "Deadlift" },
  [LiftType.Squat]: { image: backSquatImage, displayText: "Back Squat" },
  [LiftType.FrontSquat]: {
    image: frontSquatImage,
    displayText: "Front Squat"
  },
  [LiftType.OverheadPress]: {
    image: overheadPressImage,
    displayText: "Overhead Press"
  },
  [LiftType.BenchPress]: {
    image: benchPressImage,
    displayText: "Bench Press"
  }
};
