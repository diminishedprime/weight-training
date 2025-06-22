import { describe, it, expect, vi, beforeEach } from "vitest";
import { addNewSuperblock } from "./actions";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

// Mock dependencies
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));
vi.mock("@/util");
vi.mock("next/cache");

// Import mocked modules
import { auth } from "@/auth";
import { getSupabaseClient, requireId } from "@/util";
import { revalidatePath } from "next/cache";

describe("NewSuperblock server actions", () => {
  // Mock Supabase client chain
  const mockSelect = vi.fn().mockReturnThis();
  const mockSingle = vi.fn();
  const mockInsert = vi.fn().mockReturnThis();
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
    single: mockSingle,
  }));

  const mockSupabaseClient = {
    from: mockFrom,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSupabaseClient).mockReturnValue(
      mockSupabaseClient as unknown as SupabaseClient<Database>
    );
    vi.mocked(revalidatePath).mockImplementation(() => {});
  });

  describe("addNewSuperblock", () => {
    it("should create a new superblock successfully", async () => {
      const mockSession = { user: { id: "user-123" } };
      const mockUserId = "user-123";
      const mockSuperblockId = "superblock-456";

      vi.mocked(auth).mockResolvedValue(
        mockSession as unknown as Awaited<ReturnType<typeof auth>>
      );
      vi.mocked(requireId).mockReturnValue(mockUserId);
      mockSingle.mockResolvedValue({
        data: { id: mockSuperblockId },
        error: null,
      });

      const params = { name: "Test Superblock", notes: "Test notes" };
      const result = await addNewSuperblock(params);

      expect(auth).toHaveBeenCalledTimes(1);
      expect(requireId).toHaveBeenCalledWith(mockSession, "/superblock");
      expect(getSupabaseClient).toHaveBeenCalledTimes(1);
      expect(mockFrom).toHaveBeenCalledWith("exercise_superblock");
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        name: params.name,
        notes: params.notes,
      });
      expect(mockSelect).toHaveBeenCalledWith("id");
      expect(mockSingle).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith("/superblock");
      expect(result).toEqual({ data: { id: mockSuperblockId }, error: null });
    });

    it("should create a superblock without notes", async () => {
      const mockSession = { user: { id: "user-123" } };
      const mockUserId = "user-123";
      const mockSuperblockId = "superblock-456";

      vi.mocked(auth).mockResolvedValue(
        mockSession as unknown as Awaited<ReturnType<typeof auth>>
      );
      vi.mocked(requireId).mockReturnValue(mockUserId);
      mockSingle.mockResolvedValue({
        data: { id: mockSuperblockId },
        error: null,
      });

      const params = { name: "Test Superblock" };
      const result = await addNewSuperblock(params);

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        name: params.name,
        notes: undefined,
      });
      expect(revalidatePath).toHaveBeenCalledWith("/superblock");
      expect(result).toEqual({ data: { id: mockSuperblockId }, error: null });
    });

    it("should return error if Supabase insert fails", async () => {
      const mockSession = { user: { id: "user-123" } };
      const mockUserId = "user-123";
      const mockError = {
        message: "Insert failed",
        details: "DB error",
        hint: "",
        code: "123",
        name: "DatabaseError",
      };

      vi.mocked(auth).mockResolvedValue(
        mockSession as unknown as Awaited<ReturnType<typeof auth>>
      );
      vi.mocked(requireId).mockReturnValue(mockUserId);
      mockSingle.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const params = { name: "Test Superblock Fail" };
      const result = await addNewSuperblock(params);

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        name: params.name,
        notes: undefined,
      });
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(result).toEqual({ data: null, error: mockError });
    });
    it("should throw if requireId throws (e.g., no session)", async () => {
      const mockSession = null;
      const requireIdError = new Error("User ID is required");

      vi.mocked(auth).mockResolvedValue(
        mockSession as unknown as Awaited<ReturnType<typeof auth>>
      );
      vi.mocked(requireId).mockImplementation(() => {
        throw requireIdError;
      });

      const params = { name: "Test Superblock No Auth" };

      await expect(addNewSuperblock(params)).rejects.toThrow(requireIdError);

      expect(auth).toHaveBeenCalledTimes(1);
      expect(requireId).toHaveBeenCalledWith(mockSession, "/superblock");
      expect(getSupabaseClient).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should throw if auth throws", async () => {
      const authError = new Error("Authentication failed");
      vi.mocked(auth).mockRejectedValue(authError);

      const params = { name: "Test Superblock Auth Error" };

      await expect(addNewSuperblock(params)).rejects.toThrow(authError);

      expect(auth).toHaveBeenCalledTimes(1);
      expect(requireId).not.toHaveBeenCalled();
      expect(getSupabaseClient).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should handle empty name", async () => {
      const mockSession = { user: { id: "user-123" } };
      const mockUserId = "user-123";
      const mockSuperblockId = "superblock-456";

      vi.mocked(auth).mockResolvedValue(
        mockSession as unknown as Awaited<ReturnType<typeof auth>>
      );
      vi.mocked(requireId).mockReturnValue(mockUserId);
      mockSingle.mockResolvedValue({
        data: { id: mockSuperblockId },
        error: null,
      });

      const params = { name: "" };
      const result = await addNewSuperblock(params);

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        name: "",
        notes: undefined,
      });
      expect(result).toEqual({ data: { id: mockSuperblockId }, error: null });
    });
  });
});
