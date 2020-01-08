import moment from "moment";
import * as admin from "firebase-admin";
import * as t from "../../src/types";
import serviceAccount from "./service-account.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://weight-training-8a1ac.firebaseio.com"
});

const db = admin.firestore();

const populateDaysWithLifts = async (firestore: admin.firestore.Firestore) => {
  const usersCollection = await firestore.collection("users").get();
  for (const userDoc of usersCollection.docs) {
    const userId = userDoc.id;
    console.log(`Migrating data for user: ${userId}`);
    const lifts = await firestore
      .collection("users")
      .doc(userDoc.id)
      .collection("lifts")
      .get();
    for (const liftDoc of lifts.docs) {
      const lift = liftDoc.data() as t.Lift;
      const yyyyMMDD = moment(lift.date.toDate())
        // This is really hacky and only works for people lifting in my timezone...
        .local()
        .format("YYYY-MM-DD");
      await firestore
        .collection("users")
        .doc(userId)
        .collection("daysWithLifts")
        .doc(yyyyMMDD)
        .set({ hasLift: true });
    }
  }
};

populateDaysWithLifts(db).then(() => console.log("finished migration"));
