import { describe, it, expect, vi, beforeEach } from "vitest";
import ExercisesTableWrapper from "./ExercisesTableWrapper";
import * as supabaseJs from "@supabase/supabase-js";
import React from "react";

// Mock ExercisesTable to just render props for easier assertion
vi.mock("./ExercisesTable", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    <div data-testid="ex-table-mock" {...props} />
  ),
}));

describe("ExercisesTableWrapper", () => {
  const userId = "user-123";
  const lift_type = "squat";
  const fakeLifts = [
    { id: 1, performed_at: "2024-01-01T00:00:00Z" },
    { id: 2, performed_at: "2024-01-02T00:00:00Z" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches lifts and renders ExercisesTable with data", async () => {
    // Mock createClient and .rpc().select().data
    const select = vi.fn().mockResolvedValue({ data: fakeLifts });
    const rpc = vi.fn(() => ({ select }));
    vi.spyOn(supabaseJs, "createClient").mockReturnValue({ rpc } as never);

    // @ts-expect-error - Testing component as function rather than JSX
    const result = await ExercisesTableWrapper({ userId, lift_type });
    // Should render the mock ExercisesTable with correct props
    expect(result.props.exercises).toEqual(fakeLifts);
    expect(result.props.exercise_type).toBe(lift_type);
  });

  it("renders ExercisesTable with empty array if no data", async () => {
    const select = vi.fn().mockResolvedValue({ data: undefined });
    const rpc = vi.fn(() => ({ select }));
    vi.spyOn(supabaseJs, "createClient").mockReturnValue({ rpc } as never);

    // @ts-expect-error - Testing component as function rather than JSX
    const result = await ExercisesTableWrapper({ userId, lift_type });
    expect(result.props.exercises).toEqual([]);
  });
});
