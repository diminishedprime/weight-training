import * as firebase from "@firebase/testing";
import moment from "moment";
import * as sut from "../db";
import {
  adminApp,
  authedApp,
  clearFirestoreData,
  loadFirestoreRules
} from "../test-utils";
import * as t from "../types";
import { withBrand } from "../types/db/marker";

const DEADLIFT = t.LiftType.Deadlift;
const SQUAT = t.LiftType.Squat;

const now = firebase.firestore.Timestamp.now();

describe("for the db", () => {
  beforeAll(async () => {
    await loadFirestoreRules();
  });

  beforeEach(async () => {
    await clearFirestoreData();
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  describe("for the user operations", () => {
    const userUid = "matt2";
    const user = { uid: userUid };

    describe("for the program operations", () => {
      test("can add a new program", async () => {
        const firestore = authedApp(user);
        const program: t.ProgramDoc = {
          title: "My program",
          time: firebase.firestore.Timestamp.fromMillis(50),
          version: "1",
          liftUids: ["123"]
        };
        const actual = await sut.addProgram(firestore, user, program);
        expect(actual).toEqual(program);
      });

      test("recent lifts are ordered by date", async () => {
        const firestore = authedApp(user);
        const program1: t.ProgramDoc = {
          title: "My program",
          time: firebase.firestore.Timestamp.fromMillis(50),
          version: "1",
          liftUids: ["123"]
        };
        const program2: t.ProgramDoc = {
          title: "My program",
          time: firebase.firestore.Timestamp.fromMillis(20),
          version: "1",
          liftUids: ["122"]
        };
        await sut.addProgram(firestore, user, program1);
        await sut.addProgram(firestore, user, program2);
        const actual = await sut.getRecentPrograms(firestore, user);
        expect(actual).toEqual([program1, program2]);
      });
    });

    test("can get daysWithLifts", async () => {
      await adminApp()
        .collection("users")
        .doc(userUid)
        .collection("liftTimes")
        .add({ t: now });
      const firestore = authedApp(user);
      const daysWithLifts = await sut.getDaysWithLifts(firestore, {
        uid: userUid
      });
      expect(daysWithLifts.data.map((a) => a.toJSON())).toEqual(
        [moment.utc(now.toDate())].map((a) => a.toJSON())
      );
    });

    test("one rep max is initially undefined", async () => {
      const firestore = authedApp(user);
      const oneRepMaxes = await Promise.all(
        Object.values(t.LiftType).map(async (liftType) => {
          return sut.getOneRepMax(firestore, user, liftType);
        })
      );
      oneRepMaxes.forEach((oneRepMax) => {
        expect(oneRepMax.weight.asFirestore()).toEqual(
          t.Weight.zero().asFirestore()
        );
      });
    });

    test("can set one rep max when not defined", async () => {
      const firestore = authedApp(user);

      for (const liftType of Object.values(t.LiftType)) {
        await sut.setOneRepMax(
          firestore,
          user,
          liftType,
          t.Weight.lbs(100),
          now
        );
      }

      const oneRepMaxes = await Promise.all(
        Object.values(t.LiftType).map(async (liftType) => {
          return sut.getOneRepMax(firestore, user, liftType);
        })
      );
      oneRepMaxes.forEach((oneRepMax) => {
        expect(oneRepMax.weight.asFirestore()).toEqual(
          t.Weight.lbs(100).asFirestore()
        );
      });
    });

    test("can override an existing one rep max", async () => {
      const firestore = authedApp(user);
      await sut.setOneRepMax(firestore, user, DEADLIFT, t.Weight.lbs(100), now);
      const oldDeadlift = await sut.getOneRepMax(firestore, user, DEADLIFT);
      await sut.setOneRepMax(firestore, user, DEADLIFT, t.Weight.lbs(110), now);
      const newDeadlift = await sut.getOneRepMax(firestore, user, DEADLIFT);
      expect(oldDeadlift.weight.asFirestore()).toEqual(
        t.Weight.lbs(100).asFirestore()
      );
      expect(oldDeadlift.weight.asFirestore()).not.toEqual(
        newDeadlift.weight.asFirestore()
      );
      expect(newDeadlift.weight.asFirestore()).toEqual(
        t.Weight.lbs(110).asFirestore()
      );
    });

    describe("when using the options flag", () => {
      test("checkPrevious: true overwrites when value is larger", async () => {
        const firestore = authedApp(user);
        await sut.setOneRepMax(
          firestore,
          user,
          DEADLIFT,
          t.Weight.lbs(100),
          now
        );
        await sut.setOneRepMax(
          firestore,
          user,
          DEADLIFT,
          t.Weight.lbs(90),
          now,
          {
            checkPrevious: true
          }
        );

        const actual = await sut.getOneRepMax(firestore, user, DEADLIFT);
        expect(actual.weight.asFirestore()).toEqual(
          t.Weight.lbs(100).asFirestore()
        );
      });
      test("checkPrevious: false overwrites when value is larger", async () => {
        const firestore = authedApp(user);
        await sut.setOneRepMax(
          firestore,
          user,
          DEADLIFT,
          t.Weight.lbs(100),
          now
        );
        await sut.setOneRepMax(
          firestore,
          user,
          DEADLIFT,
          t.Weight.lbs(90),
          now,
          {
            checkPrevious: false
          }
        );

        const actual = await sut.getOneRepMax(firestore, user, DEADLIFT);
        expect(actual.weight.asFirestore()).toEqual(
          t.Weight.lbs(90).asFirestore()
        );
      });
    });

    test("setting a one rep max does not clear out others", async () => {
      const firestore = authedApp(user);
      await sut.setOneRepMax(firestore, user, DEADLIFT, t.Weight.lbs(100), now);
      const oldDeadlift = await sut.getOneRepMax(firestore, user, DEADLIFT);

      await sut.setOneRepMax(firestore, user, SQUAT, t.Weight.lbs(110), now);
      const newSquat = await sut.getOneRepMax(firestore, user, SQUAT);
      const newDeadlift = await sut.getOneRepMax(firestore, user, DEADLIFT);
      expect(oldDeadlift.weight.asFirestore()).toEqual(
        t.Weight.lbs(100).asFirestore()
      );
      expect(oldDeadlift.weight.asFirestore()).toEqual(
        newDeadlift.weight.asFirestore()
      );

      expect(newSquat.weight.asFirestore()).toEqual(
        t.Weight.lbs(110).asFirestore()
      );
    });
  });

  describe("for the lift operations", () => {
    const userUid = "matt";
    const user = { uid: userUid };
    const lift: t.Lift = t.Lift.fromDb(
      withBrand({
        weight: t.Weight.lbs(200).asFirestore(),
        reps: 3,
        type: DEADLIFT,
        date: firebase.firestore.Timestamp.now(),
        warmup: false,
        version: "3"
      })
    );

    test("adding a new lift puts it in the db.", async () => {
      const firestore = authedApp(user);
      const actual = await sut.addLift(firestore, user, lift);
      delete actual.uid;
      expect(actual.asFirestore()).toEqual(lift.asFirestore());
    });

    test("adding a new lift sets the one-rep-max if unset.", async () => {
      const firestore = authedApp(user);
      await sut.addLift(firestore, user, lift);

      const actual = await sut.getOneRepMax(firestore, user, lift.getType());
      expect(actual.weight.asFirestore()).toEqual(
        lift.getWeight().asFirestore()
      );
    });

    test("adding a new lift updates the one-rep-max if larger.", async () => {
      const firestore = authedApp(user);
      await sut.setOneRepMax(
        firestore,
        user,
        lift.getType(),
        lift.getWeight().subtract(t.Weight.lbs(10)),
        now
      );
      await sut.addLift(firestore, user, lift);

      const actual = await sut.getOneRepMax(firestore, user, lift.getType());
      expect(actual.weight.asFirestore()).toEqual(
        lift.getWeight().asFirestore()
      );
    });

    test("adding a new lift does not update the one-rep-max if smaller.", async () => {
      const firestore = authedApp(user);
      await sut.setOneRepMax(
        firestore,
        user,
        lift.getType(),
        lift.getWeight().add(t.Weight.lbs(10)),
        now
      );
      await sut.addLift(firestore, user, lift);

      const actual = await sut.getOneRepMax(firestore, user, lift.getType());
      expect(actual!.weight.asFirestore()).toEqual(
        lift
          .getWeight()
          .add(t.Weight.lbs(10))
          .asFirestore()
      );
    });

    test("an added lift can be retrieved from the db.", async () => {
      const firestore = authedApp(user);
      const addedLift = await sut.addLift(firestore, user, lift);
      const liftUid = addedLift.uid;
      const actual = await sut.getLift(firestore, user, liftUid);
      expect(actual).not.toBeUndefined();
    });

    test("an added lift can be updated.", async () => {
      const firestore = authedApp(user);
      const addedLift = await sut.addLift(firestore, user, lift);
      const liftUid = addedLift.uid;
      const firstValue = await sut.getLift(firestore, user, liftUid);
      expect(firstValue).not.toBeUndefined();
      await sut.updateLift(firestore, user, liftUid, {
        reps: lift.getReps() + 3
      });
      const actualAfterUpdate = await sut.getLift(firestore, user, liftUid);
      expect(actualAfterUpdate!.getReps()).toBe(6);
    });

    test("a non-added lift cannot be retrieved from the db.", async () => {
      const firestore = authedApp(user);
      const actual = await sut.getLift(firestore, user, "made up lift id");
      expect(actual).toBeUndefined();
    });

    test("deleting an added lift removes it from the db.", async () => {
      const firestore = authedApp(user);
      const addedLift = await sut.addLift(firestore, user, lift);
      const liftUid = addedLift.uid;
      // Exists in this part of the test.
      expect(await sut.getLift(firestore, user, liftUid)).not.toBeUndefined();
      await sut.deleteLift(firestore, user, liftUid);
      // Is removed by this part.
      expect(await sut.getLift(firestore, user, liftUid)).toBeUndefined();
    });
  });
});
