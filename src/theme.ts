import { createTheme, type CSSVariablesResolver } from "@mantine/core";

const otherColors = {
  neonPink: "#FF007F",
  neonGreen: "#39FF14",
  neonCyan: "#00FFFF",
  neonYellow: "#FFFF00",
  neonOrange: "#FF5F1F",
  neonPurple: "#BD00FF",
};

export const theme = createTheme({
  other: otherColors,
});

export const resolver: CSSVariablesResolver = () => ({
  variables: {
    "--mantine-color-pink-filled": otherColors.neonPink,
    "--mantine-color-green-filled": otherColors.neonGreen,
    "--mantine-color-cyan-filled": otherColors.neonCyan,
    "--mantine-color-yellow-filled": otherColors.neonYellow,
    "--mantine-color-orange-filled": otherColors.neonOrange,
    "--mantine-color-purple-filled": otherColors.neonPurple,
  },
  light: {},
  dark: {},
});
