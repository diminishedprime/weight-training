import * as firebase from "@firebase/testing";
import * as fs from "fs";
const projectId = "weight-training-8a1ac";

const rules = fs.readFileSync("firestore.rules", "utf8");

export * from "./TestWrapper";

export const authedApp = (auth?: object) => {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
};

export const adminApp = () => {
  return firebase.initializeAdminApp({ projectId }).firestore();
};

export const loadFirestoreRules = async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
};

export const clearFirestoreData = async () => {
  await firebase.clearFirestoreData({ projectId });
};

export const clearApps = async () => {
  await Promise.all(firebase.apps().map((app) => app.delete()));
};
