import firebase from "firebase/app";
import { PlateTypes } from "../types/common";
import { Weight } from "../types/Weight";

export * from "./plates";

// TODO - put this into the timestamp class as a static method.
export const ZERO_TIME = () => firebase.firestore.Timestamp.fromMillis(0);

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
