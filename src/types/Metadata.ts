import backSquatImage from "../images/back_squat.png";
import benchPressImage from "../images/bench_press.png";
import deadliftImage from "../images/deadlift.png";
import dumbbellImage from "../images/dumbbell.png";
import frontSquatImage from "../images/front_squat.png";
import overheadPressImage from "../images/overhead_press.png";
import { LiftType } from "./db/LiftType";

export class Metadata {
  public static images = () => {
    return {
      dumbbell: dumbbellImage,
      backsquat: backSquatImage,
      benchPress: benchPressImage,
      deadlift: deadliftImage,
      frontSquat: frontSquatImage,
      overheadPress: overheadPressImage
    };
  };

  public static forLiftType = (liftType: LiftType) => {
    switch (liftType) {
      case LiftType.CleanAndJerk:
        return {
          image: dumbbellImage,
          displayText: "Clean And Jerk"
        };
      case LiftType.Snatch:
        return { image: dumbbellImage, displayText: "Snatch" };
      case LiftType.Deadlift:
        return { image: deadliftImage, displayText: "Deadlift" };
      case LiftType.Squat:
        return { image: backSquatImage, displayText: "Back Squat" };
      case LiftType.FrontSquat:
        return {
          image: frontSquatImage,
          displayText: "Front Squat"
        };
      case LiftType.OverheadPress:
        return {
          image: overheadPressImage,
          displayText: "Overhead Press"
        };
      case LiftType.BenchPress:
        return {
          image: benchPressImage,
          displayText: "Bench Press"
        };
    }
  };
}
