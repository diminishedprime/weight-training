import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Since there's no simple way to do a query unique days from firebase, this
// implements a simple index that only keeps track of lift times.
export const indexNewLiftDays = functions.firestore
  .document("users/{userId}/lifts/{liftId}")
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;

    const newLift = snap.data() as any;
    const liftTime = newLift.date;
    const t = liftTime;
    await db
      .collection("users")
      .doc(userId)
      .collection("liftTimes")
      .add({ t });
  });
