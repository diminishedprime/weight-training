import * as sut from "../RecordLift";
import * as t from "../types";
import * as firebase from "@firebase/testing";
import * as fs from "fs";

const projectId = "weight-training-8a1ac";

const rules = fs.readFileSync("firestore.rules", "utf8");

const authedApp = (auth?: object) => {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
};

describe("for the RecordLift component", () => {
  const uid = "matt";

  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
  });

  test("adding a new lift puts it in the db.", async () => {
    const lift: t.Lift = {
      weight: 200,
      reps: 3,
      type: t.LiftType.DEADLIFT,
      date: new Date()
    };
    const actual = await sut.addLift(authedApp({ uid }), uid, lift);
    const newLift = (await actual.get()).data();
    // Change date to be a Date object instead of a firestore timestamp.
    newLift!.date = newLift!.date.toDate();
    expect(newLift).toEqual(lift);
  });
});
