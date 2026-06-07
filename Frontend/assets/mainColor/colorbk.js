import { Appearance } from 'react-native';

const Palette = {
    light: {
        // Core Branding
        primary: "#3B82F6",         // Vibrant blue from "Create New Task" button
        secondary: "#6366F1",       // Modern Indigo for secondary accents

        // Backgrounds & Surfaces
        bgPrimary: "#F1F5F9",       // Soft Slate-100 backdrop
        white: "#FFFFFF",           // Card surface color
        gray: "#E2E8F0",            // Border/Divider color

        // Typography
        textPrimary: "#1E293B",     // Deep Navy/Slate for headers
        textSecondary: "#64748B",   // Muted Slate for subtitles

        // Dashboard Specific (Extracted from UI Cards)
        cardBlue: "#E0F2FE",        // "Active Projects" card
        cardIndigo: "#EEF2FF",      // "AI Insights" card
        cardRose: "#FFF1F2",        // "My Sprint" card

        // Status & Tags
        tagBackend: "#DBEAFE",
        tagBackendText: "#2563EB",
        tagUrgent: "#FEE2E2",
        tagUrgentText: "#DC2626",

        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        waiting: "#38BDF8",

        // Background Utilities
        bgSuccess: "#DCFCE7",
        bgDanger: "#FEE2E2",
        bgInfo: "#E0F2FE",

        black: "#0F172A",
        disable: "#F8FAFC",
        lightIndigo: "rgba(99, 102, 241, 0.1)",
    },

    dark: {
        // Core Branding
        primary: "#60A5FA",         // Brightened blue for dark mode
        secondary: "#818CF8",

        // Backgrounds & Surfaces
        bgPrimary: "#0B1222",       // Deep Midnight/Navy background
        white: "#1E293B",           // Dark Card surface (Slate-800)
        gray: "#334155",            // Darker border

        // Typography
        textPrimary: "#F8FAFC",     // Off-white text
        textSecondary: "#94A3B8",   // Muted gray text

        // Dashboard Specific (Dark variants)
        cardBlue: "#0C4A6E",
        cardIndigo: "#312E81",
        cardRose: "#881337",

        // Status & Tags
        tagBackend: "rgba(37, 99, 235, 0.2)",
        tagBackendText: "#60A5FA",
        tagUrgent: "rgba(220, 38, 38, 0.2)",
        tagUrgentText: "#F87171",

        success: "#34D399",
        warning: "#FBBF24",
        danger: "#F87171",
        waiting: "#38BDF8",

        // Background Utilities
        bgSuccess: "rgba(5, 46, 22, 0.5)",
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