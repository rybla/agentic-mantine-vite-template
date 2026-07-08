/* eslint-disable @eslint-react/no-array-index-key -- Stable index keys are necessary for generating custom static block segments */
import { useEffect, useState } from "react";
import { Box, Group, Text } from "@mantine/core";
import classes from "@/components/LoadingBar.module.css";

export interface LoadingBarProps {
  /** Controlled progress value (0 to 100) */
  value?: number;
  /** Label text to display above the loading bar */
  label?: string;
  /** Visual variant of the loading bar */
  variant?: "striped" | "segmented";
  /** Custom fill color for the striped variant (e.g. '#39ff14', '#00ffff') */
  color?: string;
  /** Speed of auto-simulation in milliseconds per step (defaults to 100) */
  speed?: number;
  /** Callback triggered when progress reaches 100% */
  onComplete?: () => void;
  /** Whether to automatically simulate loading progress (if value is undefined) */
  autoSimulate?: boolean;
}

export function LoadingBar({
  value,
  label = "LOADING SYSTEM DATA...",
  variant = "striped",
  color = "#39ff14", // High-contrast neon green
  speed = 100,
  onComplete,
  autoSimulate = false,
}: LoadingBarProps) {
  const [internalValue, setInternalValue] = useState<number>(0);

  const isControlled = value !== undefined;
  const progress = isControlled ? value : internalValue;

  useEffect(() => {
    if (isControlled) {
      if (progress >= 100 && onComplete) {
        onComplete();
      }
      return;
    }

    if (!autoSimulate) {
      return;
    }

    // Set internal value asynchronously to avoid synchronous setState inside effect warning!
    const initTimer = setTimeout(() => {
      setInternalValue(0);
    }, 0);

    const interval = setInterval(() => {
      setInternalValue((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            onComplete();
          }
          return 100;
        }
        // Gritty jumpy step increments rather than smooth +1
        const step = Math.floor(Math.random() * 8) + 4;
        const next = prev + step;
        return next >= 100 ? 100 : next;
      });
    }, speed);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [isControlled, autoSimulate, speed, onComplete, progress]);

  // Determine if it should jitter (for a gritty look at high completion rates or during load)
  const isJittering = progress > 0 && progress < 100;

  // For segmented variant, let's render 12 blocks
  const totalSegments = 12;
  const activeSegmentsCount = Math.floor((progress / 100) * totalSegments);

  // High contrast background gradient for stripes:
  const backgroundStyle = {
    backgroundColor: "#000000",
    backgroundImage: `repeating-linear-gradient(45deg, ${color}, ${color} 10px, #000000 10px, #000000 20px)`,
    width: `${progress}%`,
  };

  const handleReset = () => {
    if (!isControlled) {
      setInternalValue(0);
    }
  };

  const containerClasses = `${classes["container"]} ${isJittering ? classes["jittering"] : ""}`;

  return (
    <Box className={containerClasses} data-testid="loading-bar">
      <Box className={classes["labelContainer"]}>
        <Text className={classes["statusText"]} size="sm" span>
          {label}
        </Text>
        <Text className={classes["percentBadge"]} size="xs" span>
          {Math.floor(progress)}%
        </Text>
      </Box>

      <Box className={classes["track"]}>
        {variant === "segmented" ? (
          <Box className={classes["segments"]}>
            {Array.from({ length: totalSegments }).map((_, i) => {
              const segmentClass = `${classes["segment"]} ${i < activeSegmentsCount ? classes["segmentActive"] : ""}`;
              return (
                <Box
                  key={i}
                  className={segmentClass}
                  data-testid={`segment-${i}`}
                />
              );
            })}
          </Box>
        ) : (
          <Box
            className={classes["fill"]}
            style={backgroundStyle}
            data-testid="striped-fill"
          />
        )}
      </Box>

      {!isControlled && !autoSimulate && (
        <Group justify="flex-end" gap="xs">
          <button
            className={classes["button"]}
            onClick={() => {
              setInternalValue((prev) =>
                prev >= 100 ? 100 : Math.min(100, prev + 15)
              );
            }}
            type="button"
          >
            Advance +15%
          </button>
          <button
            className={classes["button"]}
            onClick={handleReset}
            type="button"
          >
            Reset
          </button>
        </Group>
      )}

      {!isControlled && autoSimulate && progress === 100 && (
        <Group justify="flex-end">
          <button
            className={classes["button"]}
            onClick={handleReset}
            type="button"
          >
            Restart Simulation
          </button>
        </Group>
      )}
    </Box>
  );
}
