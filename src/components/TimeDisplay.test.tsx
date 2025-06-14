import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TimeDisplay from "./TimeDisplay";

// Mock date to have consistent testing
const mockDate = new Date("2023-01-01T12:00:00.000Z");

describe("TimeDisplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("renders static time display for times older than 10 minutes", () => {
    const theme = createTheme();
    // Set performed time to 15 minutes ago
    const performedAt = new Date(
      mockDate.getTime() - 15 * 60 * 1000,
    ).toISOString();

    render(
      <ThemeProvider theme={theme}>
        <TimeDisplay performedAt={performedAt} />
      </ThemeProvider>,
    );

    // Should show static time in HH:MM:SS format
    // The actual time will depend on the timezone, but it should be a valid time format
    const timeElement = screen.getByText(/^\d{2}:\d{2}:\d{2}$/);
    expect(timeElement).toBeInTheDocument();
  });
});
