import * as admin from "firebase-admin";
import * as t from "../../src/types";
import serviceAccount from "./service-account.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://weight-training-8a1ac.firebaseio.com"
});

const db = admin.firestore();

const addUnitsToUserDoc = async (firestore: admin.firestore.Firestore) => {
  const usersCollection = await firestore.collection("users").get();
  for (const userDoc of usersCollection.docs) {
    const data = userDoc.data() as t.UserDoc;
    Object.values(data).forEach((value) => {
      if (value === undefined) {
        return;
      }
      const val = value[t.ONE_REP_MAX];
      if (typeof val === "number") {
        value[t.ONE_REP_MAX] = JSON.parse(
          JSON.stringify(
            new t.Weight((val as unknown) as number, t.WeightUnit.POUND)
          )
        );
      }
    });
    await firestore
      .collection("users")
      .doc(userDoc.id)
      .set(data);
  }
};

const addUnitsToLifts = async (firestore: admin.firestore.Firestore) => {
  const usersCollection = await firestore.collection("users").get();
  for (const userDoc of usersCollection.docs) {
    const lifts = await firestore
      .collection("users")
      .doc(userDoc.id)
      .collection("lifts")
      .get();
    for (const liftDoc of lifts.docs) {
      const lift = liftDoc.data() as t.Lift;
      if (typeof lift.weight === "number") {
        lift.weight = new t.Weight(
          (lift.weight as unknown) as number,
          t.WeightUnit.POUND
        );
        (lift as any).weight = lift.weight.asObject();
        await firestore
          .collection("users")
          .doc(userDoc.id)
          .collection("lifts")
          .doc(liftDoc.id)
          .update(lift);
      }
    }
  }
};
addUnitsToUserDoc(db)
  .then(() => addUnitsToLifts(db))
  .then(() => console.log("finished migration"));
