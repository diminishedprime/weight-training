export enum LiftType {
  DEADLIFT = "deadlift",
  SQUAT = "squat"
}

export type Lift = {
  uid: string;
  date: Date;
  weight: number;
  lift: "deadlift";
};
