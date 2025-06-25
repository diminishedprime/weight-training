"use client";

import React from "react";
import { Database } from "@/database.types";
import Barbell from "@/components/Barbell";
import Dumbbell from "@/components/Dumbell";
import { equipmentForExercise } from "@/util";

interface WeightThumbnailProps {
  /** The weight value to display */
  weight: number;
  /** The unit of weight (kg, lbs, etc.) */
  weightUnit: Database["public"]["Enums"]["weight_unit_enum"];
  /** The type of exercise to determine equipment visualization */
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"];
}

/**
 * Renders a visual representation of the weight for an exercise based on equipment type.
 * Shows barbell visualization for barbell exercises and dumbbell for dumbbell exercises.
 */
const WeightThumbnail: React.FC<WeightThumbnailProps> = (props) => {
  const { weight, weightUnit, exerciseType } = props;
  const equipment = equipmentForExercise(exerciseType);

  if (equipment === "barbell") {
    return (
      <span
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          width: 80,
        }}>
        <Barbell weight={weight} hidePlateNumbers />
      </span>
    );
  } else if (equipment === "dumbbell") {
    return (
      <Dumbbell
        weight={weight}
        weightUnit={weightUnit}
        width={"100%"}
        hideText={true}
      />
    );
  } else {
    return null;
  }
};

export default WeightThumbnail;
