import { Appearance } from 'react-native';

const Palette = {
    light: {
        primary: "#4F46E5",        // smoother premium indigo
        secondary: "#818CF8",      // softer accent
        textPrimary: "#111827",    // softer black
        textSecondary: "#6B7280",

        disable: "#E5E7EB",
        warning: "#F59E0B",
        processing: "rgba(249, 167, 67, 0.9)",

        success: "#16A34A",        // deeper green
        danger: "#DC2626",         // less harsh red

        white: "#FFFFFF",
        gray: "#E5E7EB",

        bgPrimary: "#F8FAFC",      // cleaner premium background
        lightIndigo: "#6366F140",  // subtle indigo overlay

        backup: "#7C3AED",         // richer purple
        reject: "#FCA5A5",

        bgSuccess: "#DCFCE7",
        bgDanger: "#FEE2E2",
        bgInfo: "#FEF3C7",

        black: "#111827",
        waiting: "#38BDF8",        // softer blue
        red: "#DC2626",

        waitingBg: "#E0F2FE",
        processingBg: "#FFF7ED",
        successBg: "#DCFCE7",
    },

    dark: {
        primary: "#818CF8",        // brighter for dark mode
        secondary: "#C7D2FE",

        textPrimary: "#F9FAFB",
        textSecondary: "#9CA3AF",

        disable: "#374151",
        warning: "#FBBF24",
        processing: "rgba(249, 167, 67, 0.85)",

        success: "#22C55E",
        danger: "#F87171",

        white: "#111827",          // surface color in dark
        gray: "#4B5563",

        bgPrimary: "#0B1220",      // deeper premium dark
        lightIndigo: "#6366F120",

        backup: "#A78BFA",
        reject: "#7F1D1D",

        bgSuccess: "#052E16",
        bgDanger: "#3F0A0A",
        bgInfo: "#3B2F0B",

        black: "#F9FAFB",
        waiting: "#38BDF8",
        red: "#EF4444",

        waitingBg: "#082F49",
        processingBg: "#3B2F0B",
        successBg: "#052E16",
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