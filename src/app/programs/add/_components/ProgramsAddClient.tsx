"use client";
import {
  getProgramsAddFormDraft,
  ProgramsAddFormDraft,
} from "@/app/programs/add/_components/_page_ProgramsAdd";
import {
  addProgram,
  saveFormDraft,
} from "@/app/programs/add/_components/actions";
import { ExerciseType, GetAddProgramInfoResult } from "@/common-types";
import DisplayWeightChange from "@/components/display/DisplayWeightChange";
import EditWeight from "@/components/edit/EditWeight";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { PATHS } from "@/constants";
import { TestIds } from "@/test-ids";
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
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

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
          slotProps={{
            // TODO: easy, all of the other form inputs should do this, I think
            // I'm using deprecated inputProps for that.
            htmlInput: {
              "data-testid": TestIds.Programs_Add_ProgramNameInput,
            },
          }}
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
          <Fab
            variant="extended"
            color="primary"
            type="submit"
            data-testid={TestIds.Programs_Add_AddProgram}
          >
            <IconPlus sx={{ mr: 1 }} />
            Add
          </Fab>
        </form>
      </Stack>
      <TODO>
        Add some heuristics based on the perceived effort of the working sets
        and let the user know about that so it's easier to make an informed
        decision.
      </TODO>
      <TODO easy>
        Pull out the hook into its own file (or maybe even files) so it's easier
        to read/understand
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
    formDraft: initialServerFormDraft,
  } = props;

  const [serverFormDraft, setServerFormDraft] =
    React.useState<ProgramsAddFormDraft>(initialServerFormDraft);

  const [programName, setProgramName] = React.useState(
    initialServerFormDraft?.programName ??
      props.getAddProgramInfoResult.program_name,
  );

  const [squatTargetMax, setSquatTargetMax] = React.useState(
    initialServerFormDraft?.targetMax.squatTargetMax ??
      props.getAddProgramInfoResult.squat_target_max,
  );
  const [benchTargetMax, setBenchTargetMax] = React.useState(
    initialServerFormDraft?.targetMax.benchTargetMax ??
      props.getAddProgramInfoResult.bench_press_target_max,
  );
  const [deadliftTargetMax, setDeadliftTargetMax] = React.useState(
    initialServerFormDraft?.targetMax.deadliftTargetMax ??
      props.getAddProgramInfoResult.deadlift_target_max,
  );
  const [overheadPressTargetMax, setOverheadPressTargetMax] = React.useState(
    initialServerFormDraft?.targetMax.overheadPressTargetMax ??
      props.getAddProgramInfoResult.overhead_press_target_max,
  );

  const [deload, setDeload] = React.useState(
    initialServerFormDraft?.deload ?? true,
  );

  const squatIncrease = useMemo(() => {
    return squatTargetMax - squat_target_max;
  }, [squatTargetMax, squat_target_max]);
  const deadliftIncrease = useMemo(() => {
    return deadliftTargetMax - deadlift_target_max;
  }, [deadliftTargetMax, deadlift_target_max]);
  const overheadPressIncrease = useMemo(() => {
    return overheadPressTargetMax - overhead_press_target_max;
  }, [overheadPressTargetMax, overhead_press_target_max]);
  const benchPressIncrease = useMemo(() => {
    return benchTargetMax - bench_press_target_max;
  }, [benchTargetMax, bench_press_target_max]);

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
      squatIncrease,
      deadliftIncrease,
      overheadPressIncrease,
      benchPressIncrease,
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
    squatIncrease,
    deadliftIncrease,
    overheadPressIncrease,
    benchPressIncrease,
  ]);

  const localFormDraft: ProgramsAddFormDraft = useMemo(
    () => ({
      targetMax: {
        benchTargetMax,
        deadliftTargetMax,
        overheadPressTargetMax,
        squatTargetMax,
      },
      deload,
      programName,
    }),
    [
      benchTargetMax,
      deadliftTargetMax,
      overheadPressTargetMax,
      squatTargetMax,
      deload,
      programName,
    ],
  );
  const formDraftModified = useMemo(() => {
    if (!serverFormDraft) {
      return true;
    }

    if (localFormDraft.deload !== serverFormDraft.deload) {
      return true;
    }

    if (localFormDraft.programName !== serverFormDraft.programName) {
      return true;
    }

    const [{ targetMax: targetMaxLocal }, { targetMax: targetMaxSaved }] = [
      localFormDraft,
      serverFormDraft,
    ];
    for (const key of Object.keys(targetMaxLocal)) {
      if (
        targetMaxLocal[key as keyof typeof targetMaxLocal] !==
        targetMaxSaved[key as keyof typeof targetMaxSaved]
      ) {
        return true;
      }
    }
    return false;
  }, [localFormDraft, serverFormDraft]);

  const debouncedSaveFormDraft = useDebouncedCallback(
    async (userId: string, formDraft: ProgramsAddFormDraft) => {
      await saveFormDraft(userId, PATHS.Programs_Add, formDraft);
      const updatedFormDraft = await getProgramsAddFormDraft(userId);
      setServerFormDraft(updatedFormDraft);
    },
    1000,
    { trailing: true },
  );

  useEffect(() => {
    if (!formDraftModified) {
      return;
    }
    debouncedSaveFormDraft(userId, localFormDraft);
    return () => {
      debouncedSaveFormDraft.cancel();
    };
  }, [userId, localFormDraft, formDraftModified, debouncedSaveFormDraft]);

  return {
    serverFormDraft,
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
          <DisplayWeightChange
            warningWeightThreshold={props.ten ? 10 : props.five ? 5 : undefined}
            errorWeightThreshold={props.ten ? 15 : props.five ? 10 : undefined}
            changeValue={props.newTargetMax - props.currentTargetMax}
          />
        </Stack>
      </Stack>
    </LabeledValue>
  );
};

export default ProgramsAddClient;
