import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  minimalPlates,
  correspondingEquipment,
  requireId,
  getSupabaseClient,
} from "./util";
import { DEFAULT_PLATE_SIZES } from "./constants";
import { Database } from "@/database.types";
// Import the globally mocked redirect function with a new alias
import { redirect as navigationRedirectMock } from "next/navigation";

// Mock the @supabase/supabase-js module
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    // Mock supabase client object
    from: vi.fn(),
    auth: vi.fn(),
  })),
}));

describe("util", () => {
  describe("getSupabaseClient", () => {
    it("should create and return a Supabase client", () => {
      // Set required environment variables
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

      const client = getSupabaseClient();

      // Verify that a client object is returned
      expect(client).toBeDefined();
      expect(typeof client).toBe("object");
    });
  });

  describe("minimalPlates", () => {
    it("should return an empty array for 0 target weight", () => {
      expect(minimalPlates(0, DEFAULT_PLATE_SIZES)).toEqual([]);
    });

    it("should return the correct plates for a given weight", () => {
      expect(minimalPlates(135, DEFAULT_PLATE_SIZES)).toEqual([45, 45, 45]);
      expect(minimalPlates(45, DEFAULT_PLATE_SIZES)).toEqual([45]);
      expect(minimalPlates(50, DEFAULT_PLATE_SIZES)).toEqual([45, 5]);
      expect(minimalPlates(52.5, DEFAULT_PLATE_SIZES)).toEqual([45, 5, 2.5]);
      expect(minimalPlates(60, DEFAULT_PLATE_SIZES)).toEqual([45, 10, 5]);
      expect(minimalPlates(2.5, DEFAULT_PLATE_SIZES)).toEqual([2.5]);
    });

    it("should handle cases where exact weight cannot be made with available plates", () => {
      expect(minimalPlates(1, DEFAULT_PLATE_SIZES)).toEqual([]);
      expect(minimalPlates(46, DEFAULT_PLATE_SIZES)).toEqual([45]);
    });

    it("should work with a custom set of available plates", () => {
      const customPlates = [25, 10, 5];
      expect(minimalPlates(35, customPlates)).toEqual([25, 10]);
      expect(minimalPlates(40, customPlates)).toEqual([25, 10, 5]);
      expect(minimalPlates(7, customPlates)).toEqual([5]);
    });

    it("should return an empty array if targetWeight is less than the smallest plate", () => {
      expect(minimalPlates(2, [2.5, 5, 10])).toEqual([]);
    });
  });

  describe("correspondingEquipment", () => {
    it('should return "barbell" for barbell exercises', () => {
      expect(correspondingEquipment("barbell_deadlift")).toBe("barbell");
      expect(correspondingEquipment("barbell_squat")).toBe("barbell");
      expect(correspondingEquipment("barbell_bench_press")).toBe("barbell");
      expect(correspondingEquipment("barbell_overhead_press")).toBe("barbell");
      expect(correspondingEquipment("barbell_row")).toBe("barbell");
    });

    it('should return "dumbbell" for dumbbell exercises', () => {
      expect(correspondingEquipment("dumbbell_row")).toBe("dumbbell");
    });

    it('should return "bodyweight" for bodyweight exercises', () => {
      expect(correspondingEquipment("chinup")).toBe("bodyweight");
      expect(correspondingEquipment("pullup")).toBe("bodyweight");
      expect(correspondingEquipment("pushup")).toBe("bodyweight");
      expect(correspondingEquipment("situp")).toBe("bodyweight");
    });

    it('should return "machine" for machine exercises', () => {
      const machineExercises: Database["public"]["Enums"]["exercise_type_enum"][] =
        [
          "machine_converging_chest_press",
          "machine_diverging_lat_pulldown",
          "machine_diverging_low_row",
          "machine_converging_shoulder_press",
          "machine_lateral_raise",
          "machine_abdominal",
          "machine_leg_extension",
          "machine_seated_leg_curl",
          "machine_leg_press",
          "machine_back_extension",
          "machine_pec_fly",
          "machine_biceps_curl",
          "machine_inner_thigh",
          "machine_outer_thigh",
          "machine_triceps_extension",
          "machine_rear_delt",
        ];
      machineExercises.forEach((exercise) => {
        expect(correspondingEquipment(exercise)).toBe("machine");
      });
    });

    it('should return "plate_stack" for plate_stack exercises', () => {
      expect(correspondingEquipment("plate_stack_calf_raise")).toBe(
        "plate_stack"
      );
    });
  });

  describe("requireId", () => {
    beforeEach(() => {
      vi.mocked(navigationRedirectMock).mockClear();
    });

    it("should return user ID if session and user ID exist", () => {
      const mockSession = {
        user: { id: "test-user-id" },
        expires: "",
      };
      const currentPath = "/test-path";
      const userId = requireId(mockSession, currentPath);
      expect(userId).toBe("test-user-id");
      expect(navigationRedirectMock).not.toHaveBeenCalled();
    });

    it("should call redirect if session is null", () => {
      const currentPath = "/test-path";
      const encodedPath = encodeURIComponent(currentPath);
      try {
        requireId(null, currentPath);
      } catch {
        // next/navigation's redirect throws an error in test environments
        // to halt execution, which is expected.
      }
      expect(navigationRedirectMock).toHaveBeenCalledWith(
        `/login?redirect-uri=${encodedPath}`
      );
    });

    it("should call redirect if session user or user ID is missing", () => {
      const mockSessionNoUser = { expires: "" };
      const mockSessionNoId = { user: {}, expires: "" };
      const currentPath = "/another-path";
      const encodedPath = encodeURIComponent(currentPath);

      try {
        requireId(mockSessionNoUser, currentPath);
      } catch {
        // Expected
      }
      expect(navigationRedirectMock).toHaveBeenCalledWith(
        `/login?redirect-uri=${encodedPath}`
      );

      vi.mocked(navigationRedirectMock).mockClear(); // Clear before the next assertion in the same test

      try {
        requireId(mockSessionNoId, currentPath);
      } catch {
        // Expected
      }
      expect(navigationRedirectMock).toHaveBeenCalledWith(
        `/login?redirect-uri=${encodedPath}`
      );
    });
  });
});
