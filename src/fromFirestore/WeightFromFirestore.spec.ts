import firebase from "firebase";
import * as t from "../types";
import * as sut from "./WeightFromFirestore";

describe("for migrating lift from firestore", () => {
  beforeEach(() => {
    expect.extend({
      toEqual(received: t.Weight, expected: t.Weight) {
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

  test("Can parse V1 into Weight object", () => {
    const now = firebase.firestore.Timestamp.now();
    const jsonObject: sut.V1Db = {
      version: "1",
      value: 22,
      unit: t.WeightUnit.KILOGRAM
    };
    const actual = sut.weightFromFirestore(jsonObject);
    expect(actual).toEqual(t.Weight.kilo(22));
  });
});
