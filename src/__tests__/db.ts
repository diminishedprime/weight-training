import * as sut from "../db";
import * as t from "../types";
import * as firebase from "@firebase/testing";
import * as fs from "fs";

const DEADLIFT = t.LiftType.DEADLIFT;
const SQUAT = t.LiftType.SQUAT;

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

  describe("for the user operations", () => {
    const userUid = "matt2";

    test("one rep max is initially undefined", async () => {
      const firestore = authedApp({ uid: userUid });
      const oneRepMaxes = await Promise.all(
        Object.values(t.LiftType).map(async liftType => {
          return sut.getOneRepMax(firestore, userUid, liftType);
        })
      );
      oneRepMaxes.forEach(oneRepMax => {
        expect(oneRepMax).toBeUndefined();
      });
    });

    test("can set one rep max when not defined", async () => {
      const firestore = authedApp({ uid: userUid });

      for (const liftType of Object.values(t.LiftType)) {
        await sut.setOneRepMax(firestore, userUid, liftType, 100);
      }

      const oneRepMaxes = await Promise.all(
        Object.values(t.LiftType).map(async liftType => {
          return sut.getOneRepMax(firestore, userUid, liftType);
        })
      );
      oneRepMaxes.forEach(oneRepMax => {
        expect(oneRepMax).not.toBeUndefined();
      });
    });

    test("can override an existing one rep max", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(firestore, userUid, DEADLIFT, 100);
      const oldDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
      await sut.setOneRepMax(firestore, userUid, DEADLIFT, 110);
      const newDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
      expect(oldDeadlift).toEqual(100);
      expect(oldDeadlift).not.toEqual(newDeadlift);
      expect(newDeadlift).toEqual(110);
    });

    describe("when using the options flag", () => {
      test("checkPrevious: true overwrites when value is larger", async () => {
        const firestore = authedApp({ uid: userUid });
        await sut.setOneRepMax(firestore, userUid, DEADLIFT, 100);
        await sut.setOneRepMax(firestore, userUid, DEADLIFT, 90, {
          checkPrevious: true
        });

        const actual = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
        expect(actual).toEqual(100);
      });
      test("checkPrevious: false overwrites when value is larger", async () => {
        const firestore = authedApp({ uid: userUid });
        await sut.setOneRepMax(firestore, userUid, DEADLIFT, 100);
        await sut.setOneRepMax(firestore, userUid, DEADLIFT, 90, {
          checkPrevious: false
        });

        const actual = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
        expect(actual).toEqual(90);
      });
    });

    test("setting a one rep max does not clear out others", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(firestore, userUid, DEADLIFT, 100);
      const oldDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);

      await sut.setOneRepMax(firestore, userUid, SQUAT, 110);
      const newSquat = await sut.getOneRepMax(firestore, userUid, SQUAT);
      const newDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
      expect(oldDeadlift).toEqual(100);
      expect(oldDeadlift).toEqual(newDeadlift);
      expect(newSquat).toEqual(110);
    });
  });

  describe("for the lift operations", () => {
    const userUid = "matt";
    const lift: t.Lift = {
      weight: 200,
      reps: 3,
      type: DEADLIFT,
      date: firebase.firestore.Timestamp.now(),
      warmup: false
    };

    test("adding a new lift puts it in the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const actual = await sut.addLift(firestore, userUid, lift);
      delete actual.uid;
      expect(actual).toEqual(lift);
    });

    test("adding a new lift sets the one-rep-max if unset.", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.addLift(firestore, userUid, lift);

      const actual = await sut.getOneRepMax(firestore, userUid, lift.type);
      expect(actual).toEqual(lift.weight);
    });

    test("adding a new lift updates the one-rep-max if larger.", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(firestore, userUid, lift.type, lift.weight - 10);
      await sut.addLift(firestore, userUid, lift);

      const actual = await sut.getOneRepMax(firestore, userUid, lift.type);
      expect(actual).toEqual(lift.weight);
    });

    test("adding a new lift does not update the one-rep-max if smaller.", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(firestore, userUid, lift.type, lift.weight + 10);
      await sut.addLift(firestore, userUid, lift);

      const actual = await sut.getOneRepMax(firestore, userUid, lift.type);
      expect(actual).toEqual(lift.weight + 10);
    });

    test("an added lift can be retrieved from the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const addedLift = await sut.addLift(firestore, userUid, lift);
      const liftUid = addedLift.uid;
      const actual = await sut.getLift(firestore, userUid, liftUid);
      expect(actual).not.toBeUndefined();
    });

    test("an added lift can be updated.", async () => {
      const firestore = authedApp({ uid: userUid });
      const addedLift = await sut.addLift(firestore, userUid, lift);
      const liftUid = addedLift.uid;
      const firstValue = await sut.getLift(firestore, userUid, liftUid);
      expect(firstValue).not.toBeUndefined();
      await sut.updateLift(firestore, userUid, liftUid, {
        reps: lift.reps + 3
      });
      const actualAfterUpdate = await sut.getLift(firestore, userUid, liftUid);
      expect(actualAfterUpdate!.reps).toBe(6);
    });

    test("a non-added lift cannot be retrieved from the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const actual = await sut.getLift(firestore, userUid, "made up lift id");
      expect(actual).toBeUndefined();
    });

    test("deleting an added lift removes it from the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const addedLift = await sut.addLift(firestore, userUid, lift);
      const liftUid = addedLift.uid;
      // Exists in this part of the test.
      expect(
        await sut.getLift(firestore, userUid, liftUid)
      ).not.toBeUndefined();
      await sut.deleteLift(firestore, userUid, liftUid);
      // Is removed by this part.
      expect(await sut.getLift(firestore, userUid, liftUid)).toBeUndefined();
    });

    test("getLifts returns the correct collection", async () => {
      const firestore = authedApp({ uid: userUid });
      const actualCollection = sut.getLifts(firestore, userUid);
      expect((await actualCollection.get()).size).toBe(0);
      await sut.addLift(firestore, userUid, lift);
      expect((await actualCollection.get()).size).toBe(1);
    });
  });
});
