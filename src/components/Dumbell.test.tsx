import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Dumbell from "./Dumbell";

describe("Dumbell", () => {
  it("renders with required props", () => {
    const { container } = render(<Dumbell weight={25} weightUnit="pounds" />);

    // Should render the main container
    expect(container.firstChild).toBeTruthy();

    // Should display the weight value in both bulbs (left and right)
    const weightTexts = container.querySelectorAll("div");
    const weightsDisplayed = Array.from(weightTexts).filter(
      (el) => el.textContent === "25",
    );
    expect(weightsDisplayed.length).toBe(2); // Two bulbs should show the weight

    // Should have the correct default width
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveStyle({ width: "30%" });
  });
});
