import { FirestoreTimestamp } from "../../../types";

export interface ProgramDoc {
  title: string;
  liftUids: string[];
  time: FirestoreTimestamp;
  version: "1";
}
