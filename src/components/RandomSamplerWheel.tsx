/* eslint-disable @eslint-react/no-array-index-key -- Stable index keys are necessary for mapping dynamically sized pie slices in SVG */
import { useEffect, useRef, useState } from "react";
import { Box, Stack, Text } from "@mantine/core";
import classes from "@/components/RandomSamplerWheel.module.css";

export interface RandomSamplerWheelProps {
  /** Array of string options to populate the wheel */
  options: string[];
  /** Callback when spin starts */
  onSpinStart?: () => void;
  /** Callback when spin finishes with the selected option */
  onSelection?: (selected: string) => void;
  /** Custom high-contrast colors to use for wheel wedges */
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#FF007F", // Neon Pink
  "#39FF14", // Neon Green
  "#00FFFF", // Neon Cyan
  "#FFFF00", // Neon Yellow
  "#FF5F1F", // Neon Orange
  "#BD00FF", // Neon Purple
];

export function RandomSamplerWheel({
  options = [],
  onSpinStart,
  onSelection,
  colors = DEFAULT_COLORS,
}: RandomSamplerWheelProps) {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [needleVibrating, setNeedleVibrating] = useState<boolean>(false);

  const spinRef = useRef<{
    angle: number;
    velocity: number;
    animationFrameId: number | null;
    lastTickIndex: number;
  }>({
    angle: 0,
    velocity: 0,
    animationFrameId: null,
    lastTickIndex: -1,
  });

  const totalOptions = options.length;
  const sliceAngle = totalOptions > 0 ? 360 / totalOptions : 360;

  // Cleanup animation on unmount
  useEffect(() => {
    const currentSpin = spinRef.current;
    return () => {
      if (currentSpin.animationFrameId) {
        cancelAnimationFrame(currentSpin.animationFrameId);
      }
    };
  }, []);

  if (totalOptions === 0) {
    return (
      <Box className={classes["container"]} data-testid="wheel-container">
        <Text fw="bold" ta="center">
          NO OPTIONS PROGRAMMED
        </Text>
      </Box>
    );
  }

  // Calculate coordinates for SVG slice drawing
  const getCoordinatesForAngle = (
    angleInDegrees: number,
    radius: number = 140,
    cx: number = 150,
    cy: number = 150
  ) => {
    // 0 degrees is straight UP (-90 degrees in math coordinate space)
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const handleSpin = () => {
    if (isSpinning || totalOptions <= 1) {
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    if (onSpinStart) {
      onSpinStart();
    }

    // Gritty physics setup: Initial kick speed + deceleration
    const initialVelocity = 25 + Math.random() * 15; // Jumps between 25 and 40 deg/frame
    spinRef.current.velocity = initialVelocity;
    spinRef.current.lastTickIndex = -1;

    const animate = () => {
      const state = spinRef.current;
      state.angle += state.velocity;
      state.velocity *= 0.978;

      const currentRotationNormalized = state.angle % 360;
      const localAngle = (360 - currentRotationNormalized) % 360;
      const tickIndex = Math.floor(localAngle / sliceAngle);

      if (tickIndex !== state.lastTickIndex) {
        state.lastTickIndex = tickIndex;
        setCurrentIndex(tickIndex);
        setNeedleVibrating(true);
        setTimeout(() => setNeedleVibrating(false), 30);
      }

      setRotation(state.angle);

      if (state.velocity < 0.15) {
        setIsSpinning(false);
        state.velocity = 0;
        if (state.animationFrameId) {
          cancelAnimationFrame(state.animationFrameId);
          state.animationFrameId = null;
        }

        const finalIndex = Math.floor(
          ((360 - (state.angle % 360)) % 360) / sliceAngle
        );
        const finalSelected = options[finalIndex];
        if (finalSelected !== undefined) {
          setWinner(finalSelected);
          if (onSelection) {
            onSelection(finalSelected);
          }
        }
      } else {
        state.animationFrameId = requestAnimationFrame(animate);
      }
    };

    spinRef.current.animationFrameId = requestAnimationFrame(animate);
  };

  // Quantize the rotation for a gritty, lower framerate/stop-motion visual style!
  const quantizedRotation = Math.round(rotation / 2) * 2;

  const needleClasses = `${classes["needle"]} ${needleVibrating ? classes["needleVibrating"] : ""}`;
  const resultBoxClasses = `${classes["resultBox"]} ${winner ? classes["resultWinner"] : ""}`;

  return (
    <Box className={classes["container"]} data-testid="wheel-container">
      <Box className={classes["wheelWrapper"]}>
        {/* Gritty needle indicator at top center */}
        <svg className={needleClasses} viewBox="0 0 20 30" data-testid="needle">
          <path
            d="M 10 30 L 20 0 L 0 0 Z"
            fill="#FF007F"
            stroke="#000000"
            strokeWidth="1.5"
          />
        </svg>

        {/* Dynamic SVG Wheel */}
        <svg
          className={classes["svgWheel"]}
          viewBox="0 0 300 300"
          data-testid="svg-wheel"
        >
          <g
            style={{
              transform: `rotate(${quantizedRotation}deg)`,
              transformOrigin: "150px 150px",
            }}
          >
            {options.map((option, i) => {
              const angleA = i * sliceAngle;
              const angleB = (i + 1) * sliceAngle;
              const pA = getCoordinatesForAngle(angleA);
              const pB = getCoordinatesForAngle(angleB);
              const largeArcFlag = sliceAngle > 180 ? 1 : 0;
              const pathData = `M 150 150 L ${pA.x} ${pA.y} A 140 140 0 ${largeArcFlag} 1 ${pB.x} ${pB.y} Z`;

              // High-contrast cycling colors
              const color = colors[i % colors.length] || "#FFFFFF";

              // Place text in center of slice, rotated radially
              const midAngle = angleA + sliceAngle / 2;
              const textPos = getCoordinatesForAngle(midAngle, 75);
              const textRotation = midAngle;

              // Truncate option label if too long to prevent spillover
              const truncatedLabel =
                option.length > 10 ? `${option.substring(0, 8)}..` : option;

              return (
                <g key={i}>
                  <path
                    d={pathData}
                    fill={color}
                    stroke="#000000"
                    strokeWidth="1.5"
                    data-testid={`wedge-${i}`}
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="#000000"
                    fontWeight="900"
                    fontSize={totalOptions > 8 ? "9" : "11"}
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
                    style={{ textTransform: "uppercase" }}
                  >
                    {truncatedLabel}
                  </text>
                </g>
              );
            })}
            {/* Center wheel pin/cap */}
            <circle
              cx="150"
              cy="150"
              r="15"
              fill="#000000"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          </g>
        </svg>
      </Box>

      <Stack align="center" gap="xs" w="100%">
        <button
          className={classes["spinBtn"]}
          onClick={handleSpin}
          disabled={isSpinning || totalOptions <= 1}
          type="button"
          data-testid="spin-button"
        >
          {isSpinning ? "SPINNING!" : "SPIN!"}
        </button>

        {/* Real-time indicator of ticker / final winner */}
        <Box className={resultBoxClasses} data-testid="result-box">
          {isSpinning ? (
            <Text span fw="bold">
              PASSING: {options[currentIndex]}
            </Text>
          ) : winner ? (
            <Text span fw="black" style={{ letterSpacing: "1px" }}>
              WINNER: {winner}
            </Text>
          ) : (
            <Text span size="sm">
              SPIN TO SELECT
            </Text>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
