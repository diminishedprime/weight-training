import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as moment from "moment";

admin.initializeApp();
const db = admin.firestore();

// Since there's no simple way to do a query unique days from firebase, this
// implements a simple index that keeps track of days that have a lift recorded.
export const indexNewLiftDays = functions.firestore
  .document("users/{userId}/lifts/{liftId}")
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;

    const newLift = snap.data();
    const newYYYYMMDD = moment((newLift as any).date.toDate()).format(
      "YYYY-MM-DD"
    );
    await db
      .collection("users")
      .doc(userId)
      .collection("daysWithLifts")
      .doc(newYYYYMMDD)
      .set({ hasLift: true });
  });
