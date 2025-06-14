// Mock next/navigation locally so notFound is a spy in this test scope
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

import { notFound } from "next/navigation";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";
import * as utilModule from "@/util";
import { Constants } from "@/database.types";

// Mock @/auth to avoid next-auth/server issues
vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: "user1" } }),
}));
vi.mock("@/util");

const mockParams = (exercise_type: string) =>
  Promise.resolve({ exercise_type });

describe("Home (exercise_type page)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders breadcrumbs and table for valid exercise_type", async () => {
    (
      utilModule.requireId as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue("user1");
    const validType = Constants.public.Enums.exercise_type_enum[0];
    const result = await Home({ params: mockParams(validType) });
    expect(result).toBeTruthy();
  });

  it("calls notFound for invalid exercise_type", async () => {
    (
      utilModule.requireId as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue("user1");
    await Home({ params: mockParams("invalid_type") });
    expect(notFound).toHaveBeenCalled();
  });
});
