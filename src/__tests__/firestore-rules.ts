import * as firebase from "@firebase/testing";
import * as testUtil from "../test-utils";
import { authedApp } from "../test-utils";

describe("For firestore", () => {
  beforeAll(async () => {
    testUtil.mockAnalytics();
    await testUtil.loadFirestoreRules();
  });

  beforeEach(async () => {
    await testUtil.clearFirestoreData();
  });

  afterAll(async () => {
    await testUtil.clearApps();
  });

  describe("for authed users own lift data", () => {
    const docId = "123";
    const uid = "matt";
    let doc: firebase.firestore.DocumentReference;
    let collection: firebase.firestore.CollectionReference;
    beforeEach(() => {
      collection = authedApp({ uid })
        .collection("users")
        .doc(uid)
        .collection("lifts");
      doc = collection.doc(docId);
    });

    test("they can get", async () => {
      await firebase.assertSucceeds(doc.get());
    });
    test("they can set", async () => {
      await firebase.assertSucceeds(doc.set({ type: "deadlift" }));
    });
    test("they can delete", async () => {
      await firebase.assertSucceeds(doc.delete());
    });
    test("they can add a new entry", async () => {
      await firebase.assertSucceeds(collection.add({ type: "deadlift" }));
    });
  });

  describe("for unauthed users", () => {
    const docId = "123";
    const uid = "matt";
    let doc: firebase.firestore.DocumentReference;
    let collection: firebase.firestore.CollectionReference;
    beforeEach(() => {
      collection = authedApp()
        .collection("users")
        .doc(uid)
        .collection("lifts");
      doc = collection.doc(docId);
    });
    test("nothing is allowed", async () => {
      await firebase.assertFails(doc.get());
      await firebase.assertFails(doc.set({ type: "deadlift" }));
      await firebase.assertFails(doc.delete());
      await firebase.assertFails(collection.add({ type: "deadlift" }));
    });
  });
  describe("for others users own data", () => {
    const docId = "123";
    const uid = "matt";
    const otherUid = "not matt";
    let doc: firebase.firestore.DocumentReference;
    let collection: firebase.firestore.CollectionReference;
    beforeEach(() => {
      collection = authedApp({ uid })
        .collection("users")
        .doc(otherUid)
        .collection("lifts");
      doc = collection.doc(docId);
    });

    test("they cannot get", async () => {
      await firebase.assertFails(doc.get());
    });
    test("they cannot set", async () => {
      await firebase.assertFails(doc.set({ type: "deadlift" }));
    });
    test("they cannot delete", async () => {
      await firebase.assertFails(doc.delete());
    });
    test("they cannot add a new entry", async () => {
      await firebase.assertFails(collection.add({ type: "deadlift" }));
    });
  });
});
