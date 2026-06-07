import { Appearance } from 'react-native';

const Palette = {
  light: {
    // Core Branding
    primary: "#3B82F6",         // Vibrant blue from "Create New Task" button
    secondary: "#6366F1",       // Modern Indigo for secondary accents

    // Backgrounds & Surfaces
    bgPrimary: "#F8FAFC",       // Soft Slate-100 backdrop
    bgGradient: "#EEF3F8",

    white: "#FFFFFF",           // Card surface color
    gray: "#E2E8F0",            // Border/Divider color

    // Typography
    textPrimary: "#1E293B",     // Deep Navy/Slate for headers
    textSecondary: "#64748B",   // Muted Slate for subtitles

    // Dashboard Specific (Extracted from UI Cards)
    cardBlue: "rgba(227, 232, 250, 0.88)",        // "Active Projects" card
    cardIndigo: "#EEF2FF",      // "AI Insights" card
    cardRose: "rgba(247, 225, 221, 0.88)",        // "My Sprint" card
    cardGreen: "rgba(223, 243, 236, 0.88)",
    // Status & Tags
    tagBackend: "#DBEAFE",
    tagBackendText: "#2563EB",
    tagUrgent: "#FEE2E2",
    tagUrgentText: "#DC2626",

    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    waiting: "#38BDF8",

    waitingBg: "#E0F2FE",
    processingBg: "#FFF7ED",
    successBg: "#DCFCE7",
    // Background Utilities
    bgSuccess: "#DCFCE7",
    bgDanger: "#FEE2E2",
    bgInfo: "#E0F2FE",
    bgWarning: "#f5e2bd",
    black: "#0F172A",
    disable: "#F8FAFC",
    lightIndigo: "rgba(99, 102, 241, 0.1)",
  },

  dark: {
    // Core Branding
    primary: "#60A5FA",         // Brightened blue for dark mode
    secondary: "#818CF8",

    // Backgrounds & Surfaces
    bgPrimary: "#1A2235",
    bgGradient: "#0F1219",
    white: "#1E293B",           // Dark Card surface (Slate-800)
    gray: "#334155",            // Darker border

    // Typography
    textPrimary: "#F8FAFC",     // Off-white text
    textSecondary: "#94A3B8",   // Muted gray text

    // Dashboard Specific (Dark variants)
    cardBlue: "rgba(34, 45, 69, 0.82)",

    cardIndigo: "#312E81",
    cardRose: "rgba(59, 42, 45, 0.82)",
    indigo: "#1a13f5e3",
    cardGreen: "rgba(29, 47, 45, 0.82)",

    // Status & Tags
    tagBackend: "gba(37, 99, 235, 0.2)",
    tagBackendText: "#60A5FA",
    tagUrgent: "rgba(220, 38, 38, 0.2)",
    tagUrgentText: "#F87171",

    success: "rgb(79, 156, 134)",
    warning: "#d5a01b",
    danger: "#F87171",
    waiting: "#38BDF8",

    waitingBg: "#082F49",
    processingBg: "#3B2F0B",
    successBg: "#052E16",

    // Background Utilities
    bgSuccess: "rgba(9, 89, 42, 0.5)",
    bgDanger: "rgba(63, 10, 10, 0.5)",
    bgInfo: "rgba(8, 47, 73, 0.5)",

    black: "#F8FAFC",
    disable: "#1E293B",
    lightIndigo: "rgba(99, 102, 241, 0.2)",
  }
};

// Start with system theme
let currentMode = Appearance.getColorScheme() || 'light';

// Dynamic theme access
export const Colors = new Proxy({}, {
  get(target, prop) {
    return Palette[currentMode][prop] || Palette.light[prop];
  }
});

// Change theme manually
export const setGlobalTheme = (mode) => {
  currentMode = mode;
};