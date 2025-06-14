import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Barbell from "./Barbell";

describe("Barbell", () => {
  it("renders with default props", () => {
    const { container } = render(<Barbell weight={135} />);

    // Should render the main container
    expect(container.firstChild).toBeTruthy();

    // Should have the container ref element
    const barbellContainer = container.querySelector("div");
    expect(barbellContainer).toBeTruthy();
    expect(barbellContainer).toHaveStyle({ width: "100%" });
  });
});
