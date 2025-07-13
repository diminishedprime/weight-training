"use client";

import React, { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EquipmentType, ExerciseType } from "@/common-types";
import { Button, Paper } from "@mui/material";
import { TestIds } from "@/test-ids";
import AddIcon from "@mui/icons-material/Add";
import AddBarbell from "@/app/exercise/[exercise_type]/_components/AddExercise/AddBarbell";

// Import equipment-specific add components (to be implemented)
// import AddDumbbell from "./AddDumbbell";
// import AddKettlebell from "./AddKettlebell";
// import AddMachine from "./AddMachine";
// import AddBodyweight from "./AddBodyweight";
// import AddPlateStack from "./AddPlateStack";

interface AddExerciseProps {
  userId: string;
  equipmentType: EquipmentType;
  exerciseType: ExerciseType;
  pathToRevalidate: string;
  availablePlates: number[];
}

type AddExerciseControlProps = AddExerciseProps & {
  cancelComponent: React.JSX.Element;
};
export type AddBarbelProps = AddExerciseControlProps;

const AddExerciseControl: React.FC<AddExerciseControlProps> = (props) => {
  // TODO - For all of these, we want to pull in reps, and plate preferences,
  // etc. from the user preferences, and probably pass them down via useContext?
  // For this we'll probably need to update the existing standalone components
  // to work with context.
  switch (props.equipmentType) {
    case "barbell":
      return <AddBarbell {...props} />;
    case "dumbbell":
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Add Dumbbell Exercise</Typography>
          {/* <AddDumbbell {...props} /> */}
          <div>Dumbbell form goes here</div>
        </Stack>
      );
    case "kettlebell":
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Add Kettlebell Exercise</Typography>
          {/* <AddKettlebell {...props} /> */}
          <div>Kettlebell form goes here</div>
        </Stack>
      );
    case "machine":
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Add Machine Exercise</Typography>
          {/* <AddMachine {...props} /> */}
          <div>Machine form goes here</div>
        </Stack>
      );
    case "bodyweight":
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Add Bodyweight Exercise</Typography>
          {/* <AddBodyweight {...props} /> */}
          <div>Bodyweight form goes here</div>
        </Stack>
      );
    case "plate_stack":
      return (
        <Stack spacing={2}>
          <Typography variant="h6">Add Plate Stack Exercise</Typography>
          {/* <AddPlateStack {...props} /> */}
          <div>Plate Stack form goes here</div>
        </Stack>
      );
    default: {
      // Exhaustiveness check
      const _exhaustiveCheck: never = props.equipmentType;
    }
  }
};

const useAddExerciseAPI = (_props: AddExerciseProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showForm, setShowForm] = React.useState(
    () => searchParams.get("addExercise") === "true"
  );
  const setShowFormAndSync = useCallback(
    (val: boolean) => {
      setShowForm(val);
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("addExercise", "true");
      } else {
        params.delete("addExercise");
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const hideForm = useCallback(
    () => setShowFormAndSync(false),
    [setShowFormAndSync]
  );
  const cancelComponent = useMemo(
    () => (
      <Button
        color="error"
        variant="outlined"
        onClick={hideForm}
        data-testid={TestIds.AddExerciseCancelButton}>
        Cancel
      </Button>
    ),
    [hideForm]
  );
  return { showForm, setShowForm: setShowFormAndSync, cancelComponent };
};

const AddExercise: React.FC<AddExerciseProps> = (props) => {
  const api = useAddExerciseAPI(props);
  return (
    <React.Fragment>
      {!api.showForm && (
        <Button
          data-testid={TestIds.AddExerciseButton}
          variant="contained"
          onClick={() => api.setShowForm(true)}
          startIcon={<AddIcon />}>
          Add Exercise
        </Button>
      )}
      {api.showForm && (
        <Paper sx={{ p: 1, width: "100%" }}>
          <AddExerciseControl
            {...props}
            cancelComponent={api.cancelComponent}
          />
        </Paper>
      )}
    </React.Fragment>
  );
};

export default AddExercise;
