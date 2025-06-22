import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AddNewSuperblock from ".";

// Mock the actions that the hook uses
vi.mock("./actions", () => ({
  addNewSuperblock: vi.fn(),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("AddNewSuperblock Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form elements", () => {
    render(<AddNewSuperblock />);

    expect(screen.getByText("Create New Superblock")).toBeInTheDocument();
    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Superblock" }),
    ).toBeInTheDocument();
  });

  it("should update input values when user types", () => {
    render(<AddNewSuperblock />);

    const nameInput = screen.getByLabelText("name");
    const notesInput = screen.getByLabelText("Notes");

    fireEvent.change(nameInput, { target: { value: "Test Name" } });
    fireEvent.change(notesInput, { target: { value: "Test Notes" } });

    expect(nameInput).toHaveValue("Test Name");
    expect(notesInput).toHaveValue("Test Notes");
  });

  it("should clear input values when user clears them", () => {
    render(<AddNewSuperblock />);

    const nameInput = screen.getByLabelText("name");
    const notesInput = screen.getByLabelText("Notes");

    // First add some values
    fireEvent.change(nameInput, { target: { value: "Test Name" } });
    fireEvent.change(notesInput, { target: { value: "Test Notes" } });

    expect(nameInput).toHaveValue("Test Name");
    expect(notesInput).toHaveValue("Test Notes");

    // Then clear them
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(notesInput, { target: { value: "" } });

    expect(nameInput).toHaveValue("");
    expect(notesInput).toHaveValue("");
  });

  it("should have proper form structure", () => {
    render(<AddNewSuperblock />);

    const form = screen.getByRole("button").closest("form");
    expect(form).toBeInTheDocument();

    // Check that inputs have proper names for form submission
    expect(screen.getByRole("textbox", { name: "name" })).toHaveAttribute(
      "name",
      "name",
    );
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAttribute(
      "name",
      "notes",
    );
  });

  it("should render Notes field as multiline with minimum rows", () => {
    render(<AddNewSuperblock />);

    const notesInput = screen.getByLabelText("Notes");
    expect(notesInput).toBeInTheDocument();
    expect(notesInput.tagName).toBe("TEXTAREA");
  });

  it("should show loading state during form submission", async () => {
    const { addNewSuperblock } = await import("./actions");
    const mockAddNewSuperblock = vi.mocked(addNewSuperblock);

    // Mock a slow response
    let resolvePromise: (value: unknown) => void;
    const submitPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockAddNewSuperblock.mockReturnValueOnce(
      submitPromise as ReturnType<typeof addNewSuperblock>,
    );

    render(<AddNewSuperblock />);

    const nameInput = screen.getByLabelText("name");
    const form = screen.getByRole("button").closest("form")!;

    fireEvent.change(nameInput, { target: { value: "Test Superblock" } });

    fireEvent.submit(form);

    // Should show loading state
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Creating..." }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Creating..." }),
      ).toBeDisabled();
    });

    // Resolve the promise
    await act(async () => {
      resolvePromise({
        data: { id: "123" },
        error: null,
        status: 200,
        statusText: "OK",
        count: null,
      });
      await submitPromise;
    });

    // Should return to normal state
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Create Superblock" }),
      ).toBeInTheDocument();
    });
  });

  it("should display error message when submission fails", async () => {
    const { addNewSuperblock } = await import("./actions");
    const mockAddNewSuperblock = vi.mocked(addNewSuperblock);

    const errorMessage = "Failed to create superblock";
    mockAddNewSuperblock.mockResolvedValueOnce({
      data: null,
      error: {
        message: errorMessage,
        details: "Error details",
        hint: "Error hint",
        code: "ERROR_CODE",
        name: "Error",
      },
      status: 400,
      statusText: "Bad Request",
      count: null,
    } as ReturnType<typeof addNewSuperblock> extends Promise<infer T>
      ? T
      : never);

    render(<AddNewSuperblock />);

    const nameInput = screen.getByLabelText("name");
    const form = screen.getByRole("button").closest("form")!;

    fireEvent.change(nameInput, { target: { value: "Test Superblock" } });

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("should not display error alert when there is no error", () => {
    render(<AddNewSuperblock />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should call addNewSuperblock with correct parameters on form submission", async () => {
    const { addNewSuperblock } = await import("./actions");
    const mockAddNewSuperblock = vi.mocked(addNewSuperblock);

    mockAddNewSuperblock.mockResolvedValueOnce({
      data: { id: "123" },
      error: null,
      status: 200,
      statusText: "OK",
      count: null,
    } as ReturnType<typeof addNewSuperblock> extends Promise<infer T>
      ? T
      : never);

    render(<AddNewSuperblock />);

    const nameInput = screen.getByLabelText("name");
    const notesInput = screen.getByLabelText("Notes");
    const form = screen.getByRole("button").closest("form")!;

    fireEvent.change(nameInput, { target: { value: "Test Superblock" } });
    fireEvent.change(notesInput, { target: { value: "Test notes" } });

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(mockAddNewSuperblock).toHaveBeenCalledWith({
      name: "Test Superblock",
      notes: "Test notes",
    });
  });
});
