import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "./axios.js";
import { registerPushToken } from "../notification/notiToken.js";
import axios from "axios";

/********Project API start ***** */
export const getAllProject = async () => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.get("/api/data/project", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        await AsyncStorage.setItem("Projects", JSON.stringify(response.data));
        return response.data ?? [];
    } catch (error) {
        return [];
    }
}
export const getProjectById = async (id) => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get(`/api/data/project/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return [];
        throw error;
    }
}
export const createProject = async (data) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post("/api/data/project", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updateProject = async (data, id) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.patch(`api/data/project/${id}`, {
            name: data.name,
            summary: data.summary,
            duration: data.duration
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
/**Project API end*****/

/**Task API start****/
export const getAllTask = async () => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get("/api/data/task", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data ?? [];
    } catch (error) {
        return [];
    }
}
export const createTask = async (data) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post("/api/data/task", {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            note: data.note,
            authorId: data.userId,
            projectId: data.projectId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getTaskById = async (id) => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get(`/api/data/task/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return [];
        throw error;
    }
}
export const updateTask = async (data, id) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.patch(`api/data/task/${id}`, {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            progress: data.progress,
            note: data.note
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deleteTask = async (id) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.delete(`/api/data/task/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
/****Task API end *******/

/** Noti API start*/
export const getNotification = async () => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get("/api/data/noti", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data ?? [];
    } catch (error) {
        return [];
    }
}
export const updateReadedNoti = async (id) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.patch(`/api/data/noti/${id}`,
            {
                isRead: true
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deleteNoti = async (id) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post(`/api/data/noti/delete`,
            {
                id: id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
/**Noti API end****/

/** Team API start*/
export const getAllGroup = async () => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get("/api/data/group", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return [];
    }
}
export const getGroupWithId = async (id) => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get(`/api/data/group/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return [];
    }
}
export const getGroupMember = async (groupId) => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get(`/api/data/group/${groupId}/member`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return [];
    }
}
export const createGroup = async (name) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post(`/api/data/group`,
            {
                name: name
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const generateInvite = async (groupId) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post(`/api/data/group/generate`,
            {
                groupId: groupId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const checkInviteLink = async (inviteToken) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post(`/api/data/group/check`,
            {
                inviteToken: inviteToken
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const joinGroup = async (data) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post(
            `/api/data/group/join`,
            { data: data },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject({ message: error.message || "Something went wrong" });
    }
};

export const sendGroupJoinFeekback = async (data) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.post(`/api/data/group/acceptOrReject`,
            {
                requestId: data?.requestId,
                status: data?.status
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}
/**Team API end */

// >> Assign task API start
export const assignTaskToUser = async (data) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const taskId = data.taskId;
        const response = await api.post(`/api/data/task/${taskId}/assign`,
            {
                projectId: data?.projectId,
                taskId: taskId,
                assignUserId: data?.assignUserId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
}