const iconList = {
    done: "checkbox-marked",
    processing: "progress-clock",
    waiting: "timer-sand",
    name: "person",
    email: "email",
    userName: "alternate-email",
    phone: "local-phone"
}
const statusColor = {
    "done": {
        color: "success",
        bg: "successBg"
    },
    "processing": {
        color: "processing",
        bg: "processingBg"
    },
    "waiting": {
        color: "waiting",
        bg: "waitingBg"
    }
};
export const GetIcon = (item) => {
    if (!item || item.length < 1) {
        return "user";
    }
    const status = item?.status.toLowerCase();
    return iconList[status];
}

export const getSettinInfoIcon = (name) => {
    if (!name) return "user";
    return iconList[name];
}

export const getStatusColor = (item) => {
    if (!item || item.length < 1) {
        return "success";
    }
    const status = item?.status.toLowerCase();
    return statusColor[status].color;
}

export const getStatusBgColor = (status) => {
    if (!status) return "";
    const lowerStatus = status.toLowerCase();
    return statusColor[lowerStatus].bg;
};
