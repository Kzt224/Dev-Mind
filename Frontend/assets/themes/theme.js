import { Appearance } from 'react-native';

const Palette = {
  light: {
    primary: "#4338CA",
    secondary: "#7c73ff",
    textPrimary: "#1C1B1B",
    textSecondary: "#6B7280",
    disable: "#E5E7EB",
    warning: "#F29017",
    processing: "rgba(249, 167, 67, 1)",
    success: "#0ca00c",
    danger: "#EE2626",
    white: "#FFFFFF",
    gray: "#E5E7EB",
    bgPrimary: "#F9FAFB",
    lightIndigo: '#857FFA79',
    backup: "#8255F5",
    reject: "#FCA5A5",
    bgSuccess: "#DDFFB7C8",
    bgDanger: "#EF4444",
    bgInfo: "#FFB74D",
    black: "#1C1B1BDF",
    waiting: "#81D4FA",
    red: "#E60B0B",
    waitingBg: "#E3F2FD",
    processingBg: "#FFF3E0",
    successBg: "#E6F4EA",
  },
  dark: {
    primary: "#6366F1",        // Slightly lighter indigo for dark backgrounds
    secondary: "#A5B4FC",
    textPrimary: "#F9FAFB",    // White-ish text
    textSecondary: "#9CA3AF",  // Muted gray text
    disable: "#374151",
    warning: "#FBBF24",
    processing: "rgba(249, 167, 67, 0.8)",
    success: "#22C55E",
    danger: "#F87171",
    white: "#1F2937",          // In dark mode, "white" is often dark gray
    gray: "#4B5563",
    bgPrimary: "#111827",      // Deep dark background
    lightIndigo: '#4338CA50',
    backup: "#A78BFA",
    reject: "#991B1B",
    bgSuccess: "#064E3B",
    bgDanger: "#7F1D1D",
    bgInfo: "#7C2D12",
    black: "#F9FAFB",
    waiting: "#0284C7",
    red: "#EF4444",
    waitingBg: "#082F49",
    processingBg: "#431407",
    successBg: "#064E3B",
  }
};

// Start with the user's current system preference
let currentMode = Appearance.getColorScheme() || 'light';

// This is the Magic: We export an object that ALWAYS points to the active theme
export const Colors = new Proxy({}, {
  get(target, prop) {
    return Palette[currentMode][prop] || Palette.light[prop];
  }
});

// Function to switch themes globally
export const setGlobalTheme = (mode) => {
  currentMode = mode;
};