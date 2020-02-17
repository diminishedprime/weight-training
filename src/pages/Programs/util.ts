import {
  BarbellLiftType,
  Program,
  ProgramBuilder,
  Weight,
  WorkoutType
} from "../../types";

export interface BarbellLiftParams {
  type: "barbell-program";
  programName: BarbellLiftType;
  liftType: BarbellLiftType;
  workoutType: WorkoutType;
  oneRepMax: Weight;
}

export type ProgramsParams = BarbellLiftParams;

export const barbellLiftParams = (params: BarbellLiftParams): string => {
  return `/programs/${params.programName}?programName=${
    params.programName
  }&type=${params.type}&liftType=${params.liftType}&workoutType=${
    params.workoutType
  }&oneRepMax=${params.oneRepMax.asJSON()}`;
};

export const paramsToProgramsParams = (
  params: URLSearchParams
): ProgramsParams | undefined => {
  const type = params.get("type");
  if (type === null) {
    return undefined;
  }
  if (type === "barbell-program") {
    const programName = params.get("programName");
    if (programName === null) {
      throw new Error("?programName is required");
    }
    const liftType = params.get("liftType");
    if (liftType === null) {
      throw new Error("?liftType is required");
    }
    const workoutType = params.get("workoutType");
    if (workoutType === null) {
      throw new Error("?workoutType is required");
    }
    const oneRepMax = params.get("oneRepMax");
    if (oneRepMax === null) {
      throw new Error("?oneRepMax is required");
    }
    // TODO - add in an asserts for the type assertions.
    const result: BarbellLiftParams = {
      type,
      programName: programName as BarbellLiftType,
      liftType: liftType as BarbellLiftType,
      workoutType: workoutType as WorkoutType,
      oneRepMax: Weight.fromJSON(oneRepMax)
    };
    return result;
  }
  throw new Error(`${type} is not yet supported.`);
};

export const barbellProgram = (programsParams: BarbellLiftParams): Program => {
  return Program.builder()
    .setDisplayName(`${programsParams.liftType} ${programsParams.workoutType}`)
    .addProgramSection(
      ProgramBuilder.xByX(
        programsParams.liftType,
        programsParams.workoutType,
        programsParams.oneRepMax
      )
    )
    .build();
};
