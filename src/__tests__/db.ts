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

    test("getLifts returns the correct collection", async () => {
      const firestore = authedApp({ uid: userUid });
      const actualCollection = sut.getLifts(firestore, userUid);
      expect((await actualCollection.get()).size).toBe(0);
      await sut.addLift(firestore, userUid, lift);
      expect((await actualCollection.get()).size).toBe(1);
    });

    test("onSnapshotGroupedBy can group by date", async () => {
      const lift1: t.Lift = {
        weight: 200,
        reps: 3,
        type: DEADLIFT,
        date: new Date("2019-11-17T03:24:00")
      };
      const lift2: t.Lift = {
        weight: 200,
        reps: 3,
        type: DEADLIFT,
        date: new Date("2019-11-17T03:26:17")
      };
      const lift3: t.Lift = {
        weight: 200,
        reps: 3,
        type: DEADLIFT,
        date: new Date("2019-11-18T03:26:17")
      };
      const firestore = authedApp({ uid: userUid });
      await sut.addLift(firestore, userUid, lift1);
      await sut.addLift(firestore, userUid, lift2);
      await sut.addLift(firestore, userUid, lift3);
      const lifts = sut.getLifts(firestore, userUid);
      const grouping: t.Grouping<t.DisplayLift> = await new Promise(resolve => {
        sut.onSnapshotGroupedBy(
          lifts,
          doc =>
            doc
              .data()
              .date.toDate()
              .toISOString()
              .slice(0, 10),
          doc => {
            const data = doc.data();
            const asDate = data.date.toDate();
            data["date"] = asDate;
            data["uid"] = doc.id;
            return data as t.DisplayLift;
          },
          grouping => {
            resolve(grouping);
          }
        );
      });
      expect(grouping[lift1.date.toISOString().slice(0, 10)]).toHaveLength(2);
      expect(grouping[lift3.date.toISOString().slice(0, 10)]).toHaveLength(1);
    });
  });
});
