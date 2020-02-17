import { LiftDoc as V1 } from "./v1";
import { LiftDoc as V2, migrateV1 } from "./v2";
import { LiftDoc as V3, migrateV2 } from "./v3";

export type LiftDocTypes = V1 | V2 | V3;

export const migrate = (liftDoc: LiftDocTypes): V3 => {
  switch (liftDoc.version) {
    case "3":
      return liftDoc;
    case "1": {
      if ((liftDoc as V2).liftDocVersion === "1") {
        return migrate(migrateV2(liftDoc as V2));
      } else {
        // If there's not a liftDocVersion property & the version is 1, liftDoc
        // is a V1.
        return migrate(migrateV1(liftDoc));
      }
    }
    case undefined: {
      return migrate(migrateV1(liftDoc));
    }
    default: {
      throw new Error(
        `Cannot parse liftdoc to modern version. \n${JSON.stringify(liftDoc)}`
      );
    }
  }
};
