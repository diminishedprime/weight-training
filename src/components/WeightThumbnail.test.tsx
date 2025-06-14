import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import WeightThumbnail from "./WeightThumbnail";

// Mock the child components since we're focusing on the conditional rendering logic
vi.mock("@/components/Barbell", () => ({
  default: function MockBarbell({ weight, hidePlateNumbers }: any) {
    return (
      <div data-testid="barbell">
        Barbell: {weight} (hidePlateNumbers: {String(hidePlateNumbers)})
      </div>
    );
  },
}));

vi.mock("@/components/Dumbell", () => ({
  default: function MockDumbbell({ weight, weightUnit, width, hideText }: any) {
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
      />,
    );

    const barbellElement = getByTestId("barbell");
    expect(barbellElement).toBeInTheDocument();
    expect(barbellElement.textContent).toContain("Barbell: 135");
    expect(barbellElement.textContent).toContain("hidePlateNumbers: true");
  });
});
