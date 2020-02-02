import * as firebase from "@firebase/testing";
import * as fs from "fs";
import moment from "moment";
import * as sut from "../db";
import * as t from "../types";

const DEADLIFT = t.LiftType.DEADLIFT;
const SQUAT = t.LiftType.SQUAT;

const projectId = "weight-training-8a1ac";

const rules = fs.readFileSync("firestore.rules", "utf8");
const now = firebase.firestore.Timestamp.now();

const authedApp = (auth?: object) => {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
};

const adminApp = () => {
  return firebase.initializeAdminApp({ projectId }).firestore();
};

describe("for the db", () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  describe("for the user operations", () => {
    const userUid = "matt2";

    test("can get daysWithLifts", async () => {
      await adminApp()
        .collection("users")
        .doc(userUid)
        .collection("liftTimes")
        .add({ t: now });
      const firestore = authedApp({ uid: userUid });
      const daysWithLifts = await sut.getDaysWithLifts(firestore, {
        uid: userUid
      });
      expect(daysWithLifts.data.map((a) => a.toJSON())).toEqual(
        [moment.utc(now.toDate())].map((a) => a.toJSON())
      );
    });

    test("one rep max is initially undefined", async () => {
      const firestore = authedApp({ uid: userUid });
      const oneRepMaxes = await Promise.all(
        Object.values(t.LiftType).map(async (liftType) => {
          return sut.getOneRepMax(firestore, userUid, liftType);
        })
      );
      oneRepMaxes.forEach((oneRepMax) => {
        expect(oneRepMax.weight.asFirestore()).toEqual(
          t.Weight.zero().asFirestore()
        );
      });
    });

    test("can set one rep max when not defined", async () => {
      const firestore = authedApp({ uid: userUid });

      for (const liftType of Object.values(t.LiftType)) {
        await sut.setOneRepMax(
          firestore,
          userUid,
          liftType,
          t.Weight.lbs(100),
          now
        );
      }

      const oneRepMaxes = await Promise.all(
        Object.values(t.LiftType).map(async (liftType) => {
          return sut.getOneRepMax(firestore, userUid, liftType);
        })
      );
      oneRepMaxes.forEach((oneRepMax) => {
        expect(oneRepMax.weight.asFirestore()).toEqual(
          t.Weight.lbs(100).asFirestore()
        );
      });
    });

    test("can override an existing one rep max", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(
        firestore,
        userUid,
        DEADLIFT,
        t.Weight.lbs(100),
        now
      );
      const oldDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
      await sut.setOneRepMax(
        firestore,
        userUid,
        DEADLIFT,
        t.Weight.lbs(110),
        now
      );
      const newDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
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
        const firestore = authedApp({ uid: userUid });
        await sut.setOneRepMax(
          firestore,
          userUid,
          DEADLIFT,
          t.Weight.lbs(100),
          now
        );
        await sut.setOneRepMax(
          firestore,
          userUid,
          DEADLIFT,
          t.Weight.lbs(90),
          now,
          {
            checkPrevious: true
          }
        );

        const actual = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
        expect(actual.weight.asFirestore()).toEqual(
          t.Weight.lbs(100).asFirestore()
        );
      });
      test("checkPrevious: false overwrites when value is larger", async () => {
        const firestore = authedApp({ uid: userUid });
        await sut.setOneRepMax(
          firestore,
          userUid,
          DEADLIFT,
          t.Weight.lbs(100),
          now
        );
        await sut.setOneRepMax(
          firestore,
          userUid,
          DEADLIFT,
          t.Weight.lbs(90),
          now,
          {
            checkPrevious: false
          }
        );

        const actual = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
        expect(actual.weight.asFirestore()).toEqual(
          t.Weight.lbs(90).asFirestore()
        );
      });
    });

    test("setting a one rep max does not clear out others", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(
        firestore,
        userUid,
        DEADLIFT,
        t.Weight.lbs(100),
        now
      );
      const oldDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);

      await sut.setOneRepMax(firestore, userUid, SQUAT, t.Weight.lbs(110), now);
      const newSquat = await sut.getOneRepMax(firestore, userUid, SQUAT);
      const newDeadlift = await sut.getOneRepMax(firestore, userUid, DEADLIFT);
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
    const lift: t.Lift = t.Lift.fromDb({
      weight: t.Weight.lbs(200),
      reps: 3,
      type: DEADLIFT,
      date: firebase.firestore.Timestamp.now(),
      warmup: false,
      version: "1"
    });

    test("adding a new lift puts it in the db.", async () => {
      const firestore = authedApp({ uid: userUid });
      const actual = await sut.addLift(firestore, userUid, lift);
      delete actual.uid;
      expect(actual.asFirestore()).toEqual(lift.asFirestore());
    });

    test("adding a new lift sets the one-rep-max if unset.", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.addLift(firestore, userUid, lift);

      const actual = await sut.getOneRepMax(firestore, userUid, lift.getType());
      expect(actual.weight.asFirestore()).toEqual(
        lift.getWeight().asFirestore()
      );
    });

    test("adding a new lift updates the one-rep-max if larger.", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(
        firestore,
        userUid,
        lift.getType(),
        lift.getWeight().subtract(t.Weight.lbs(10)),
        now
      );
      await sut.addLift(firestore, userUid, lift);

      const actual = await sut.getOneRepMax(firestore, userUid, lift.getType());
      expect(actual.weight.asFirestore()).toEqual(
        lift.getWeight().asFirestore()
      );
    });

    test("adding a new lift does not update the one-rep-max if smaller.", async () => {
      const firestore = authedApp({ uid: userUid });
      await sut.setOneRepMax(
        firestore,
        userUid,
        lift.getType(),
        lift.getWeight().add(t.Weight.lbs(10)),
        now
      );
      await sut.addLift(firestore, userUid, lift);

      const actual = await sut.getOneRepMax(firestore, userUid, lift.getType());
      expect(actual!.weight.asFirestore()).toEqual(
        lift
          .getWeight()
          .add(t.Weight.lbs(10))
          .asFirestore()
      );
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
        reps: lift.getReps() + 3
      });
      const actualAfterUpdate = await sut.getLift(firestore, userUid, liftUid);
      expect(actualAfterUpdate!.getReps()).toBe(6);
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
  });
});
