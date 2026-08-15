import { Colors } from "../mainColor/colors";

export const getPriorityStyles = (item) => {
    if (!item) {
        return { bg: Colors.white, text: Colors.textPrimary }; // Safe Fallback
    }

    const key = item.toLowerCase();

    return {
        bg: Colors[`priority_${key}_bg`] || Colors.white,
        text: Colors[`priority_${key}_text`] || Colors.textPrimary,
    };
};