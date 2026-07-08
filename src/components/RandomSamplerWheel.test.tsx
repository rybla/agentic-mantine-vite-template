import { describe, expect, it, vi } from "vitest";
import { RandomSamplerWheel } from "@/components/RandomSamplerWheel";
import { render, screen, userEvent } from "@test-utils";

describe("RandomSamplerWheel Component", () => {
  const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

  it("renders empty state correctly if no options provided", () => {
    render(<RandomSamplerWheel options={[]} />);
    expect(screen.getByText("NO OPTIONS PROGRAMMED")).toBeInTheDocument();
  });

  it("renders correctly with given options", () => {
    render(<RandomSamplerWheel options={options} />);
    expect(screen.getByTestId("wheel-container")).toBeInTheDocument();
    expect(screen.getByTestId("needle")).toBeInTheDocument();
    expect(screen.getByTestId("svg-wheel")).toBeInTheDocument();
    expect(screen.getByTestId("spin-button")).toBeInTheDocument();
    expect(screen.getByText("SPIN TO SELECT")).toBeInTheDocument();
  });

  it("renders correct number of segments and labels", () => {
    render(<RandomSamplerWheel options={options} />);
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
    for (let i = 0; i < options.length; i++) {
      expect(screen.getByTestId(`wedge-${i}`)).toBeInTheDocument();
    }
  });

  it("triggers spin animation when spin button is clicked", async () => {
    const onSpinStartMock = vi.fn();
    render(
      <RandomSamplerWheel options={options} onSpinStart={onSpinStartMock} />
    );

    const spinBtn = screen.getByTestId("spin-button");
    await userEvent.click(spinBtn);

    expect(onSpinStartMock).toHaveBeenCalled();
    expect(spinBtn).toBeDisabled();
    expect(screen.getByText(/PASSING:/)).toBeInTheDocument();
  });
});
