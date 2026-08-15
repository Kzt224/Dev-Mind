import { Appearance } from 'react-native';

const Palette = {
  light: {
    // Core Branding
    primary: "#3B82F6",
    secondary: "#6366F1",

    // Backgrounds & Surfaces
    bgPrimary: "#F8FAFC",
    bgGradient: "#EEF3F8",
    white: "#FFFFFF",
    gray: "#E2E8F0",

    // Typography
    textPrimary: "#1E293B",
    textSecondary: "#64748B",

    // Dashboard Specific
    cardBlue: "rgba(227, 232, 250, 0.88)",
    cardIndigo: "#EEF2FF",
    cardRose: "rgba(247, 225, 221, 0.88)",
    cardGreen: "rgba(223, 243, 236, 0.88)",
    lightIndigo: "rgba(99, 102, 241, 0.1)",

    // Status Utilities
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    waiting: "#38BDF8",

    waitingBg: "#E0F2FE",
    processingBg: "#FFF7ED",
    successBg: "#DCFCE7",
    active: "rgb(58, 220, 68)",
    bgSuccess: "#DCFCE7",
    bgDanger: "#FEE2E2",
    bgInfo: "#E0F2FE",
    bgWarning: "#f5e2bd",

    // ─── NEW: PRIORITY STATUSES (LIGHT MODE) ──────────────────────────
    priority_low_bg: "#E0F2FE",
    priority_low_text: "#0369A1",

    priority_normal_bg: "#D1FAE5",
    priority_normal_text: "#047857",

    priority_medium_bg: "#FEF3C7",
    priority_medium_text: "#B45309",

    priority_high_bg: "#FFEDD5",
    priority_high_text: "#C2410C",

    priority_urgent_bg: "#FEE2E2",
    priority_urgent_text: "#B91C1C",
    // ──────────────────────────────────────────────────────────────────

    tagBackend: "#DBEAFE",
    tagBackendText: "#2563EB",
    tagUrgent: "#FEE2E2",
    tagUrgentText: "#DC2626",

    black: "#0F172A",
    disable: "#F8FAFC",
  },

  dark: {
    // Core Branding
    primary: "#60A5FA",
    secondary: "#818CF8",

    // Backgrounds & Surfaces
    //bgPrimary: "#1A2235",
    bgPrimary: "#0F1219",
    bgGradient: "#0F1219",
    white: "#1E293B",
    gray: "#334155",

    // Typography
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",

    // Dashboard Specific
    cardBlue: "rgba(34, 45, 69, 0.82)",
    cardIndigo: "#312E81",
    cardRose: "rgba(59, 42, 45, 0.82)",
    indigo: "#1a13f5e3",
    cardGreen: "rgba(29, 47, 45, 0.82)",
    lightIndigo: "rgba(99, 102, 241, 0.2)",

    // Status Utilities
    success: "rgb(79, 156, 134)",
    warning: "#d5a01b",
    danger: "#F87171",
    waiting: "#38BDF8",

    waitingBg: "#082F49",
    processingBg: "#3B2F0B",
    successBg: "#052E16",
    active: "rgb(58, 220, 68)",
    bgSuccess: "rgba(9, 89, 42, 0.5)",
    bgDanger: "rgba(63, 10, 10, 0.5)",
    bgInfo: "rgba(8, 47, 73, 0.5)",

    // ─── NEW: PRIORITY STATUSES (DARK MODE) ───────────────────────────
    priority_low_bg: "#0C4A6E",
    priority_low_text: "#7DD3FC",

    priority_normal_bg: "#064E3B",
    priority_normal_text: "#6EE7B7",

    priority_medium_bg: "#9c3d0a",
    priority_medium_text: "#FCD34D",

    priority_high_bg: "#7C2D12",
    priority_high_text: "#FDBA74",

    priority_urgent_bg: "#4C0519",
    priority_urgent_text: "#FCA5A5",
    // ──────────────────────────────────────────────────────────────────

    tagBackend: "rgba(37, 99, 235, 0.2)", // Fixed typo 'gba' -> 'rgba'
    tagBackendText: "#60A5FA",
    tagUrgent: "rgba(220, 38, 38, 0.2)",
    tagUrgentText: "#F87171",

    black: "#F8FAFC",
    disable: "#1E293B",
  }
};

let currentMode = Appearance.getColorScheme() || 'light';

export const Colors = new Proxy({}, {
  get(target, prop) {
    return Palette[currentMode][prop] || Palette.light[prop];
  }
});

export const setGlobalTheme = (mode) => {
  currentMode = mode;
};