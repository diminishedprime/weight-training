import firebase from "firebase";
import * as t from "../types";
import * as sut from "./LiftFromFirestore";

describe("for migrating lift from firestore", () => {
  beforeEach(() => {
    expect.extend({
      toEqual(received: t.Lift, expected: t.Lift) {
        const pass = received.equals(expected);
        if (pass) {
          return {
            message: () =>
              `expected ${received.asJSON()} not to equal ${expected.asJSON()}`,
            pass: true
          };
        }
        return {
          message: () =>
            `expected ${received.asJSON} to equal ${received.asJSON()}`,
          pass: false
        };

        // return message
      }
    });
  });

  test("Can parse V1 into Lift object", () => {
    const now = firebase.firestore.Timestamp.now();
    const jsonObject: sut.V1Db = {
      date: now,
      type: t.LiftType.BENCH_PRESS,
      weight: { value: 30, unit: t.WeightUnit.KILOGRAM, version: "1" },
      reps: 3,
      warmup: true,
      version: "1"
    };
    const actual = sut.liftFromFirestore(jsonObject);
    expect(actual).toEqual(
      new t.Lift({
        date: now,
        weight: t.Weight.kilo(30),
        type: t.LiftType.BENCH_PRESS,
        reps: 3,
        warmup: true,
        version: "1"
      })
    );
  });
});
