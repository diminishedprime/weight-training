import firebase from "firebase";
import "firebase/analytics";
import * as t from "../types";
import * as sut from "./UserDocFromFirestore";

// For some fucking reason, this makes my tests pass???
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
});
