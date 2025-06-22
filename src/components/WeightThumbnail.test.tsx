import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import WeightThumbnail from "./WeightThumbnail";

// Mock the child components since we're focusing on the conditional rendering logic
vi.mock("@/components/Barbell", () => ({
  default: function MockBarbell({
    weight,
    hidePlateNumbers,
  }: {
    weight: number;
    hidePlateNumbers: boolean;
  }) {
    return (
      <div data-testid="barbell">
        Barbell: {weight} (hidePlateNumbers: {String(hidePlateNumbers)})
      </div>
    );
  },
}));

vi.mock("@/components/Dumbell", () => ({
  default: function MockDumbbell({
    weight,
    weightUnit,
    width,
    hideText,
  }: {
    weight: number;
    weightUnit: string;
    width: number;
    hideText: boolean;
  }) {
    return (
      <div data-testid="dumbbell">
        Dumbbell: {weight} {weightUnit} (width: {width}, hideText:{" "}
        {String(hideText)})
      </div>
    );
  },
}));

describe("WeightThumbnail", () => {
  it("renders barbell component for barbell exercise types", () => {
    const { getByTestId } = render(
      <WeightThumbnail
        weight={135}
        weightUnit="pounds"
        exerciseType="barbell_squat"
      />
    );

    const barbellElement = getByTestId("barbell");
    expect(barbellElement).toBeInTheDocument();
    expect(barbellElement.textContent).toContain("Barbell: 135");
    expect(barbellElement.textContent).toContain("hidePlateNumbers: true");
  });

  it("renders dumbbell component for dumbbell exercise types", () => {
    const { getByTestId } = render(
      <WeightThumbnail
        weight={25}
        weightUnit="pounds"
        exerciseType="dumbbell_row"
      />
    );

    const dumbbellElement = getByTestId("dumbbell");
    expect(dumbbellElement).toBeInTheDocument();
    expect(dumbbellElement.textContent).toContain("Dumbbell: 25 pounds");
    expect(dumbbellElement.textContent).toContain("width: 100%");
    expect(dumbbellElement.textContent).toContain("hideText: true");
  });
});
