export * from "./WeightField";
export * from "./TimeStampField";
export * from "./UserDoc";
export * from "./LiftDoc";
export * from "./ProgramDoc";
export * from "./LiftType";

const brand = Symbol();
// Marker interface for FirestoreFields. Makes it slightly less likely I'll fuck
// stuff up.
export interface FirestoreField {
  [brand]: never;
}

export const withBrand = <T>(t: T): T & FirestoreField => {
  return t as T & FirestoreField;
};

export interface HasFirestoreField<T extends FirestoreField> {
  // Require implementors to have this field that stores the firestore data.
  firestoreField: T;

  asFirestore(): T;
  asJSON(): string;
  getVersion(): string;
}
