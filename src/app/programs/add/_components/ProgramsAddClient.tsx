"use client";
import { ProgramsAddFormDraft } from "@/app/programs/add/_components/_page_ProgramsAdd";
import { addProgram } from "@/app/programs/add/_components/actions";
import { ExerciseType, GetAddProgramInfoResult } from "@/common-types";
import EditWeight from "@/components/edit/EditWeight";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { exerciseTypeUIStringBrief, weightUnitUIString } from "@/uiStrings";
import IconPlus from "@mui/icons-material/Add";
import {
  Button,
  Fab,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TypographyProps,
} from "@mui/material";
import React, { useMemo } from "react";

interface ProgramsAddClientProps {
  userId: string;
  formDraft: ProgramsAddFormDraft;
  getAddProgramInfoResult: GetAddProgramInfoResult;
}

const ProgramsAddClient: React.FC<ProgramsAddClientProps> = (props) => {
  const api = useProgramsAddClientAPI(props);
  return (
    <Stack spacing={1} flex={1}>
      <Typography variant="h5" component="h1">
        Add Program
      </Typography>
      <LabeledValue
        label="Program Name"
        labelVariant="h6"
        labelColor="text.primary"
      >
        <TextField
          size="small"
          value={api.programName}
          onChange={(e) => api.setProgramName((_) => e.target.value)}
        />
      </LabeledValue>

      <LabeledValue
        label="Include Deload Cycle?"
        labelVariant="h6"
        labelColor="text.primary"
        help={
          <React.Fragment>
            A deload cycle is a lighter cycle follows a set of 5 3 1 cycles. It
            is recommended to include a deload every 2 programs or whenever
            you're feeling fatigued.
            <br />
            <br />
            Just include it every program if you don't have a strong opinion.
          </React.Fragment>
        }
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          value={api.deload}
          onChange={(_, nu) => api.setDeload((_) => nu)}
          aria-label="text alignment"
          color={api.deload ? "success" : "error"}
        >
          <ToggleButton value={true}>Yes</ToggleButton>
          <ToggleButton value={false}>No</ToggleButton>
        </ToggleButtonGroup>
      </LabeledValue>
      <LabeledValue
        label="Movement Target Maxes"
        labelVariant="h6"
        labelColor="text.primary"
        alignItems="baseline"
        width="100%"
        help={
          <React.Fragment>
            The target maxes for each movement. If your last cycle went well,
            and you had good movement speed on all of your cycles, click{" "}
            <span style={{ fontWeight: "bold" }}>STANDARD</span> which will
            increase squat & deadlift by 10 lbs and bench & overhead press by 5
            lbs.
            <br />
            <br />
            If your last cycle was very challenging, you can keep the same
            weight, or do a nominal bump of 1 lb. To reset to your current
            target maxes, click{" "}
            <span style={{ fontWeight: "bold" }}>CURRENT</span>.
          </React.Fragment>
        }
      >
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="outlined"
            color="error"
            onClick={api.targetMax.resetToCurrent}
            disabled={api.targetMax.resetToCurrentDisabled}
          >
            Current
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={api.targetMax.setStandardBump}
            disabled={api.targetMax.standardBumpDisabled}
          >
            Standard
          </Button>
        </Stack>
        <TargetMax
          ten
          exerciseType={"barbell_back_squat"}
          currentTargetMax={props.getAddProgramInfoResult.squat_target_max}
          newTargetMax={api.targetMax.squatTargetMax}
          setNewTargetMax={api.targetMax.setSquatTargetMax}
        />
        <TargetMax
          five
          exerciseType={"barbell_bench_press"}
          currentTargetMax={
            props.getAddProgramInfoResult.bench_press_target_max
          }
          newTargetMax={api.targetMax.benchTargetMax}
          setNewTargetMax={api.targetMax.setBenchTargetMax}
        />
        <TargetMax
          ten
          exerciseType={"barbell_deadlift"}
          currentTargetMax={props.getAddProgramInfoResult.deadlift_target_max}
          newTargetMax={api.targetMax.deadliftTargetMax}
          setNewTargetMax={api.targetMax.setDeadliftTargetMax}
        />
        <TargetMax
          five
          exerciseType={"barbell_overhead_press"}
          currentTargetMax={
            props.getAddProgramInfoResult.overhead_press_target_max
          }
          newTargetMax={api.targetMax.overheadPressTargetMax}
          setNewTargetMax={api.targetMax.setOverheadPressTargetMax}
        />
      </LabeledValue>
      <Stack sx={{ justifyContent: "end", alignItems: "end" }}>
        <form action={api.boundAddProgramAction}>
          <Fab variant="extended" color="primary" type="submit">
            <IconPlus sx={{ mr: 1 }} />
            Add
          </Fab>
        </form>
      </Stack>
      <TODO>
        Create the necessary RPCs so this thing can actually try to create a new
        program, and then go to it.
      </TODO>
      <TODO>
        Actually persist the form to the DB every ~1 second with a tail end
        debounce.
      </TODO>
      <TODO>Props: {JSON.stringify(props, null, 2)}</TODO>
      <TODO>Form Draft: {JSON.stringify(props.formDraft, null, 2)}</TODO>
      <TODO>
        Eventually, we should also do some hueristics based on the perceived
        effort of the working sets and let the user know about that so it's
        easier to make an informed decision.
      </TODO>
    </Stack>
  );
};

const useProgramsAddClientAPI = (props: ProgramsAddClientProps) => {
  const {
    userId,
    getAddProgramInfoResult: {
      squat_target_max,
      bench_press_target_max,
      deadlift_target_max,
      overhead_press_target_max,
    },
  } = props;

  const [programName, setProgramName] = React.useState(
    props.formDraft?.programName ?? props.getAddProgramInfoResult.program_name,
  );

  const [squatTargetMax, setSquatTargetMax] = React.useState(
    props.formDraft?.targetMax.squatTargetMax ??
      props.getAddProgramInfoResult.squat_target_max,
  );
  const [benchTargetMax, setBenchTargetMax] = React.useState(
    props.formDraft?.targetMax.benchTargetMax ??
      props.getAddProgramInfoResult.bench_press_target_max,
  );
  const [deadliftTargetMax, setDeadliftTargetMax] = React.useState(
    props.formDraft?.targetMax.deadliftTargetMax ??
      props.getAddProgramInfoResult.deadlift_target_max,
  );
  const [overheadPressTargetMax, setOverheadPressTargetMax] = React.useState(
    props.formDraft?.targetMax.overheadPressTargetMax ??
      props.getAddProgramInfoResult.overhead_press_target_max,
  );

  const [deload, setDeload] = React.useState(props.formDraft?.deload ?? true);

  const setStandardBump = React.useCallback(() => {
    setOverheadPressTargetMax((_) => overhead_press_target_max + 5);
    setSquatTargetMax((_) => squat_target_max + 10);
    setBenchTargetMax((_) => bench_press_target_max + 5);
    setDeadliftTargetMax((_) => deadlift_target_max + 10);
  }, [
    overhead_press_target_max,
    squat_target_max,
    bench_press_target_max,
    deadlift_target_max,
  ]);

  const standardBumpDisabled = useMemo(() => {
    return !(
      squatTargetMax !== squat_target_max + 10 ||
      benchTargetMax !== bench_press_target_max + 5 ||
      deadliftTargetMax !== deadlift_target_max + 10 ||
      overheadPressTargetMax !== overhead_press_target_max + 5
    );
  }, [
    squatTargetMax,
    squat_target_max,
    benchTargetMax,
    bench_press_target_max,
    deadliftTargetMax,
    deadlift_target_max,
    overheadPressTargetMax,
    overhead_press_target_max,
  ]);

  const resetToCurrent = React.useCallback(() => {
    setOverheadPressTargetMax(overhead_press_target_max);
    setSquatTargetMax(squat_target_max);
    setBenchTargetMax(bench_press_target_max);
    setDeadliftTargetMax(deadlift_target_max);
  }, [
    overhead_press_target_max,
    squat_target_max,
    bench_press_target_max,
    deadlift_target_max,
  ]);

  const resetToCurrentDisabled = useMemo(() => {
    return (
      squatTargetMax === squat_target_max &&
      benchTargetMax === bench_press_target_max &&
      deadliftTargetMax === deadlift_target_max &&
      overheadPressTargetMax === overhead_press_target_max
    );
  }, [
    squatTargetMax,
    squat_target_max,
    benchTargetMax,
    bench_press_target_max,
    deadliftTargetMax,
    deadlift_target_max,
    overheadPressTargetMax,
    overhead_press_target_max,
  ]);

  const boundAddProgramAction = useMemo(() => {
    return addProgram.bind(
      null,
      userId,
      squatTargetMax,
      deadliftTargetMax,
      overheadPressTargetMax,
      benchTargetMax,
      "pounds",
      deload,
      programName,
    );
  }, [
    userId,
    squatTargetMax,
    deadliftTargetMax,
    overheadPressTargetMax,
    benchTargetMax,
    deload,
    programName,
  ]);

  return {
    boundAddProgramAction,
    programName,
    setProgramName,
    targetMax: {
      resetToCurrent,
      resetToCurrentDisabled,
      setStandardBump,
      standardBumpDisabled,
      squatTargetMax,
      setSquatTargetMax,
      benchTargetMax,
      setBenchTargetMax,
      deadliftTargetMax,
      setDeadliftTargetMax,
      overheadPressTargetMax,
      setOverheadPressTargetMax,
    },
    deload,
    setDeload,
  };
};

interface TargetMaxProps {
  exerciseType: ExerciseType;
  currentTargetMax: number;
  newTargetMax: number;
  five?: boolean;
  ten?: boolean;
  setNewTargetMax: React.Dispatch<React.SetStateAction<number>>;
}
const TargetMax: React.FC<TargetMaxProps> = (props) => {
  const difference = props.newTargetMax - props.currentTargetMax;
  const differenceSign = difference > 0 ? "+" : "";
  const warningThreshold = props.ten ? 10 : 5;
  const errorThreshold = props.ten ? 15 : 10;
  const differenceColor: TypographyProps["color"] =
    difference === 0
      ? "warning"
      : difference > errorThreshold
        ? "error"
        : difference > warningThreshold
          ? "warning"
          : "success";
  return (
    <LabeledValue
      label={`${exerciseTypeUIStringBrief(props.exerciseType)}: ${props.currentTargetMax} ${weightUnitUIString("pounds")}`}
      labelVariant="body2"
      labelColor="text.primary"
      gutterBottom
      width="100%"
    >
      <Stack direction="row" alignItems="center">
        <EditWeight
          clearValue={props.currentTargetMax}
          sub1
          add1
          add5={props.five}
          add10={props.ten}
          weightValue={props.newTargetMax}
          setWeightValue={props.setNewTargetMax}
        />
        <Stack flex={1} direction="row" justifyContent="center">
          <Typography color={differenceColor}>
            {differenceSign}
            {Math.abs(difference)} {weightUnitUIString("pounds")}
          </Typography>
        </Stack>
      </Stack>
    </LabeledValue>
  );
};

export default ProgramsAddClient;
