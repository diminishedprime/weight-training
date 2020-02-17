import firebase from "firebase";
import * as t from "../../../types";
import { LiftType as LiftTypeV1 } from "../LiftType/v1";
import * as sut from "./index";
import { LiftDoc as V1 } from "./v1";

describe("for migrating lift from firestore", () => {
  test("Can parse V1 into Lift object", () => {
    const now = firebase.firestore.Timestamp.now();
    const jsonObject: V1 = {
      date: now,
      type: LiftTypeV1.BENCH_PRESS,
      weight: { value: 30, unit: t.WeightUnit.KILOGRAM, version: "1" },
      reps: 3,
      warmup: true,
      version: "1"
    };
    const actual = sut.toLift(jsonObject);
    expect(actual.asFirestore()).toEqual(
      t.Lift.fromDb({
        date: now,
        weight: t.Weight.kilo(30),
        type: t.LiftType.BenchPress,
        reps: 3,
        warmup: true,
        version: "3"
      }).asFirestore()
    );
  });
});
