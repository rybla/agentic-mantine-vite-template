import { describe, expect, it, vi } from "vitest";
import { LoadingBar } from "@/components/LoadingBar";
import { render, screen } from "@test-utils";

describe("LoadingBar Component", () => {
  it("renders with default label and value", () => {
    render(<LoadingBar value={45} />);
    expect(screen.getByText("LOADING SYSTEM DATA...")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("renders with a custom label", () => {
    const customLabel = "DOWNLOADING KERNEL MODS...";
    render(<LoadingBar value={80} label={customLabel} />);
    expect(screen.getByText(customLabel)).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("renders the striped progress bar fill", () => {
    render(<LoadingBar value={60} variant="striped" />);
    const fill = screen.getByTestId("striped-fill");
    expect(fill).toBeInTheDocument();
    expect(fill).toHaveStyle({ width: "60%" });
  });

  it("renders the segmented progress bar blocks", () => {
    // 12 segments total. 50% means 6 active segments.
    render(<LoadingBar value={50} variant="segmented" />);
    for (let i = 0; i < 6; i++) {
      const activeSegment = screen.getByTestId(`segment-${i}`);
      expect(activeSegment).toBeInTheDocument();
      // Ensure it contains the active class
      expect(activeSegment.className).toContain("segmentActive");
    }
    for (let i = 6; i < 12; i++) {
      const inactiveSegment = screen.getByTestId(`segment-${i}`);
      expect(inactiveSegment).toBeInTheDocument();
      expect(inactiveSegment.className).not.toContain("segmentActive");
    }
  });

  it("triggers onComplete when reaching 100%", () => {
    const onCompleteMock = vi.fn();
    render(<LoadingBar value={100} onComplete={onCompleteMock} />);
    expect(onCompleteMock).toHaveBeenCalled();
  });
});
