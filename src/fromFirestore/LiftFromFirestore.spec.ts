import firebase from "firebase";
import * as t from "../types";
import * as sut from "./LiftFromFirestore";
import { LiftDoc as LiftDocV1 } from "../types/db/LiftDoc/v1";

describe("for migrating lift from firestore", () => {
  test("Can parse V1 into Lift object", () => {
    const now = firebase.firestore.Timestamp.now();
    const jsonObject: LiftDocV1 = {
      date: now,
      type: t.LiftType.BENCH_PRESS,
      weight: { value: 30, unit: t.WeightUnit.KILOGRAM, version: "1" },
      reps: 3,
      warmup: true,
      version: "1"
    };
    const actual = sut.liftFromFirestore(jsonObject);
    expect(actual.asFirestore()).toEqual(
      t.Lift.fromDb({
        date: now,
        weight: t.Weight.kilo(30),
        type: t.LiftType.BENCH_PRESS,
        reps: 3,
        warmup: true,
        version: "1",
        liftDocType: t.LiftDocType.BARBELL,
        liftDocVersion: "1"
      }).asFirestore()
    );
  });
});
