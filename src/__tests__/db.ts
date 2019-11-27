import * as sut from "../db";
import * as t from "../types";
import * as firebase from "@firebase/testing";
import * as fs from "fs";

const projectId = "weight-training-8a1ac";

const rules = fs.readFileSync("firestore.rules", "utf8");

const authedApp = (auth?: object) => {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
};

describe("for the db", () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
  });

  describe("for the lift operations", () => {
    const userUid = "matt";
    const lift: t.Lift = {
      weight: 200,
      reps: 3,
      type: t.LiftType.DEADLIFT,
      date: new Date()
    };

    test("adding a new lift puts it in the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const actual = await sut.addLift(firestore, userUid, lift);
      const newLift = (await actual.get()).data();
      // Change date to be a Date object instead of a firestore timestamp.
      newLift!.date = newLift!.date.toDate();
      expect(newLift).toEqual(lift);
    });

    test("an added lift can be retrieved from the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const addedLift = await sut.addLift(firestore, userUid, lift);
      const liftUid = (await addedLift.get()).id;
      const actual = await sut.getLift(firestore, userUid, liftUid);
      expect(actual.exists).toBeTruthy();
    });

    test("an added lift can be updated.", async () => {
      const firestore = authedApp({ uid: userUid });
      const addedLift = await sut.addLift(firestore, userUid, lift);
      const liftUid = (await addedLift.get()).id;
      const firstValue = await sut.getLift(firestore, userUid, liftUid);
      expect(firstValue.exists).toBeTruthy();
      await sut.updateLift(firestore, userUid, liftUid, {
        reps: lift.reps + 3
      });
      const actualAfterUpdate = (
        await sut.getLift(firestore, userUid, liftUid)
      ).data();
      expect(actualAfterUpdate!.reps).toBe(6);
    });

    test("a non-added lift cannot be retrieved from the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const actual = await sut.getLift(firestore, userUid, "made up lift id");
      expect(actual.exists).toBeFalsy();
    });

    test("deleting an added lift removes it from the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const addedLift = await sut.addLift(firestore, userUid, lift);
      const liftUid = (await addedLift.get()).id;
      // Exists in this part of the test.
      expect(
        (await sut.getLift(firestore, userUid, liftUid)).exists
      ).toBeTruthy();
      await sut.deleteLift(firestore, userUid, liftUid);
      // Is removed by this part.
      expect(
        (await sut.getLift(firestore, userUid, liftUid)).exists
      ).toBeFalsy();
    });
  });
});
