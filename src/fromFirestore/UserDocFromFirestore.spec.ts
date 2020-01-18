import firebase from "firebase";
import "firebase/analytics";
import * as t from "../types";
import * as sut from "./UserDocFromFirestore";

// For some fucking reason, this makes my tests pass???
// tslint:disable-next-line no-unused-expression
firebase.firestore;

describe("for migrating UserDoc from firestore", () => {
  test("Can parse V1 into UserDoc object", () => {
    const jsonObject: sut.V1Db = {
      "version": "1",
      "deadlift": {},
      "squat": {},
      "front-squat": {},
      "bench-press": {},
      "overhead-press": {}
    };
    const actual = sut.userDocFromFirestore(jsonObject);
    expect(actual.asJSON()).toEqual(t.UserDoc.empty().asJSON());
  });

  test("Can parse V2 into UserDoc object", () => {
    const pr1 = {
      [t.ONE_REP_MAX]: {
        weight: { value: 10, unit: t.WeightUnit.POUND, version: "1" as "1" },
        time: { seconds: 0, nanoseconds: 10 }
      }
    };
    const pr2 = {
      [t.ONE_REP_MAX]: {
        weight: { value: 30, unit: t.WeightUnit.KILOGRAM, version: "1" as "1" },
        time: { seconds: 10, nanoseconds: 0 }
      }
    };
    const jsonObject: sut.V2Db = {
      "deadlift": pr1,
      "squat": pr1,
      "front-squat": pr1,
      "bench-press": pr1,
      "overhead-press": pr1,
      "clean-and-jerk": pr1,
      "snatch": pr2,
      "version": "2"
    };
    const actual = sut.userDocFromFirestore(jsonObject);
    const expected = t.UserDoc.empty();
    const ten = t.Weight.lbs(10);
    const tenNano = new firebase.firestore.Timestamp(0, 10);
    expected.setORM(t.LiftType.DEADLIFT, ten, tenNano);
    expected.setORM(t.LiftType.SQUAT, ten, tenNano);
    expected.setORM(t.LiftType.FRONT_SQUAT, ten, tenNano);
    expected.setORM(t.LiftType.BENCH_PRESS, ten, tenNano);
    expected.setORM(t.LiftType.OVERHEAD_PRESS, ten, tenNano);
    expected.setORM(t.LiftType.CLEAN_AND_JERK, ten, tenNano);
    expected.setORM(
      t.LiftType.SNATCH,
      t.Weight.kilo(30),
      new firebase.firestore.Timestamp(10, 0)
    );
    expect(actual.asFirestore()).toEqual(expected.asFirestore());
  });
});
