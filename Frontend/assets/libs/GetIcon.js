
export const GetIcon = (item) => {
    if (!item || item.length < 1) {
        return "user";
    }
    if (item?.status?.toLowerCase() === 'done') {
        return "checkbox-marked";
    } else if (item?.status?.toLowerCase() === "processing") {
        return "progress-clock";
    } else if (item?.status?.toLowerCase() === "waiting") {
        return "timer-sand";
    } else {
        return "";
    }
}
export const getSettinInfoIcon = (name) => {
    if (!name) return "user";
    if (name === "name") {
        return "person";
    } else if (name === "email") {
        return "email";
    } else if (name === "userName") {
        return "alternate-email"
    } else {
        return "local-phone"
    }
}
export const getStatusColor = (item) => {
    if (!item || item.length < 1) {
        return "success";
    }
    if (item.status.toLowerCase() === 'done') {
        return "success";
    } else if (item.status.toLowerCase() === "processing") {
        return "processing";
    } else if (item.status.toLowerCase() === "waiting") {
        return "waiting";
    } else {
        return "";
    }
}

export const getStatusBgColor = (status) => {
    if (!status) return "";

    if (status.toLowerCase() === "done") {
        return "successBg";
    } else if (status.toLowerCase() === "processing") {
        return "processingBg";
    } else if (status.toLowerCase() === "waiting") {
        return "waitingBg";
    } else {
        return "";
    }
};
