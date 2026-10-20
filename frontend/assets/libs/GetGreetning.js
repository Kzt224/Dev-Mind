export const getGreeting = () => {
    // Extract current hour (0-23) specifically in Myanmar UTC+6:30 timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Yangon",
        hour: "numeric",
        hour12: false,
    });

    const hour = parseInt(formatter.format(new Date()), 10);

    // Time-of-day classification logic:
    // 05:00 - 11:59 -> Morning
    // 12:00 - 16:59 -> Afternoon
    // 17:00 - 20:59 -> Evening
    // 21:00 - 04:59 -> Night
    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
};