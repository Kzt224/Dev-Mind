import React, { useContext } from "react";
import { Modal, View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useModalStore } from "../../../assets/store/modalStore.js";
import { Colors } from "@/assets/mainColor/colors";
import ProjectForm from "./ProjectForm.jsx";
import TaskForm from "./TaskForm.jsx";
import { AuthContext } from "@/app/hook/authContex";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignTaskToUser, groupLeftRequest, createGroup, createProject, createTask, generateInvite, joinGroup, updateProject, updateTask } from "@/assets/api/fetchData";
import ProjectEditForm from "./ProjectEditForm.jsx";
import InviteForm from "./InviteForm.jsx";
import TaskEditForm from "./TaskEditForm.jsx";
import { usePathname } from "expo-router";
import TeamForm from "./TeamForm.jsx";
import { dvmBtn, shadowStyles } from "@/assets/themes/style.js";
import JoinConfirmForm from "./JoinConfirmForm.jsx";
import { useAlertStore } from "@/assets/store/aleartStore.js";
import AssignForm from "./AssignForm.jsx";
import InsightDisplayForm from "./InsightDisplayForm.jsx";
import GroupLeftForm from "./GroupLeftForm.jsx";
export default function PopupInput() {
    const { isVisible, closeModal,
        modalType, inputData, editProject,
        editTask, groupId, step, setStep, qrToken, id } = useModalStore();
    const { user, cacheProject } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { setSuccess, setError } = useAlertStore();
    const projectList = cacheProject?.result;
    const pathName = usePathname();
    const mutation = useMutation({
        mutationFn: ({ data }) => {
            const isEmpty = obj => obj && Object.keys(obj).length === 0;
            const handler = MODAL_HANDLERS[modalType];
            return handler.mutate(data, !isEmpty(editProject) ? editProject : editTask);
        },
        onSuccess: (data) => {
            setSuccess(data?.message || "Success");
            const handler = MODAL_HANDLERS[modalType];
            queryClient.invalidateQueries(handler.invalidate);
            if (modalType === 'forInvite' || modalType === 'forInviteConfirm') {
                setTimeout(() => setStep(2, data), 100);
            } else {
                closeModal();
            }
        },
        onError: (error) => {
            setError(error?.message);
        },
    });
    const MODAL_HANDLERS = {
        forProject: {
            buildData: (inputData, user) => ({
                name: inputData["project Name"],
                summary: inputData["project Summary"],
                authorId: user.id,
                duration: inputData["duration"],
                category: inputData["category"],
                priority: inputData['priority']
            }),
            validate: (data) => data.name && data.summary,
            mutate: createProject,
            invalidate: ["project"],
        },
        forTask: {
            buildData: (inputData, user, pathName, id) => ({
                name: inputData["task Name"],
                startDate: inputData["start Date"],
                endDate: inputData["end Date"],
                note: inputData["note"],
                userId: user.id,
                projectId:
                    pathName === "/projectDetail" ? id : inputData["Project Id"],
            }),
            validate: (data) =>
                data.name && data.projectId && data.startDate && data.endDate,
            mutate: createTask,
            invalidate: ["tasks"],
        },
        editProject: {
            buildData: (inputData) => ({
                name: inputData["project Name"],
                summary: inputData["project Summary"],
                duration: inputData["duration"],
            }),
            validate: (data) => data.name && data.summary,
            mutate: (data, editProject) => updateProject(data, editProject.id),
            invalidate: ["project"],
        },
        editTask: {
            buildData: (inputData) => ({
                name: inputData["task Name"],
                startDate: inputData["start Date"],
                endDate: inputData["end Date"],
                progress: inputData["progress"],
                note: inputData["note"],
            }),
            validate: (data, editTask) =>
                data.name &&
                data.startDate &&
                data.endDate &&
                data.progress >= editTask.progress,
            mutate: (data, editTask) =>
                updateTask(data, id)
            ,
            invalidate: ["tasks"],
        },
        forTeam: {
            buildData: (inputData) => ({
                name: inputData["group Name"],
            }),
            validate: (data) => data.name,
            mutate: createGroup,
            invalidate: ["group"],
        },
        forInvite: {
            buildData: (id) => ({
                groupId: id
            }),
            validate: () => { return true },
            mutate: generateInvite,
            invalidate: ['group']
        },
        forInviteConfirm: {
            buildData: (qrToken, id) => ({
                qrToken: qrToken,
                groupId: id
            }),
            validate: () => { return true },
            mutate: joinGroup,
            invalidate: ['group']
        },
        forAssignTask: {
            buildData: (inputData, user = "", pathName = "", id) => ({
                projectId: inputData['Project Id'],
                taskId: inputData['task Id'],
                assignUserId: id,
            }),
            validate: (data) => data.taskId && data.projectId && data.assignUserId,
            mutate: assignTaskToUser,
            invalidate: ['group']
        },
        forGroupLeft: {
            buildData: (inputData) => ({
                userName: inputData['User Name'],
                userId: inputData["User Id"],
                groupId: inputData['group'].groupId
            }),
            validate: (data) => data.groupId && data.userId,
            mutate: groupLeftRequest,
            invalidate: ['userInfo']
        }
    };
    const handleSubmit = () => {
        const handler = MODAL_HANDLERS[modalType];
        if (!handler) {
            console.warn("Invalid modal type");
            return;
        }
        let data = '';

        if (modalType === 'forInvite') {
            data = handler.buildData(
                id
            );
        } else if (modalType === 'forInviteConfirm') {
            data = handler.buildData(
                qrToken,
                groupId
            )
        } else if (modalType === "forGroupLeft") {
            if (step !== 2) {
                setStep(2, "");
            } else {
                data = handler.buildData(inputData);
            }
        }
        else {
            data = handler.buildData(
                inputData,
                user,
                pathName,
                id
            );
        }
        let isValid = true;
        if (step == 2) {
            isValid = handler.validate(data, editTask);
        }
        if (!isValid) {
            Alert.alert("Warning", "Please fill in all fields correctly");
            return;
        }
        if (modalType === "forGroupLeft") {
            if (step == 2) {
                mutation.mutate({ data });
            }
        } else {
            mutation.mutate({ data })
        }

    };

    const ModelComponents = {
        forProject: {
            page: <ProjectForm />,
            button: "Save",
            step2: false,
        },
        forTask: {
            page: <TaskForm projectList={cacheProject} />,
            button: "Save",
            step2: false,
        },
        editProject: {
            page: <ProjectEditForm />,
            button: "Save",
            step2: false,
        },
        editTask: {
            page: <TaskEditForm />,
            button: "Save",
            step2: false,
        },
        forTeam: {
            page: <TeamForm />,
            button: "Save",
            step2: false,
        },
        forInvite: {
            page: <InviteForm />,
            button: "Generate",
            step2: true,
        },
        forInviteConfirm: {
            page: <JoinConfirmForm />,
            button: "Join",
            step2: true,
            done: "OK",
        },
        forAssignTask: {
            page: <AssignForm projectList={projectList} />,
            button: "Assign",
            step2: false
        },
        forInsight: {
            page: <InsightDisplayForm data={id} />,
            step2: false,
            done: "OK"
        },
        forGroupLeft: {
            page: <GroupLeftForm />,
            button: "Confirm",
            step2: true,
            step2Button: "Confirm",
            done: "Cancel"
        }
    }
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalBox, { backgroundColor: Colors.white }]}>
                    <View style={styles.formGroup}>
                        {ModelComponents[modalType]?.page}
                        <>
                            {(ModelComponents[modalType]?.step2 && step === 2) ? (
                                <>
                                    <View style={styles.buttonContainer}>
                                        <Pressable style={dvmBtn['btnWhite']} onPress={closeModal}>
                                            <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                                {ModelComponents[modalType]?.done || "Cancle"}
                                            </Text>
                                        </Pressable>
                                        {ModelComponents[modalType]?.step2Button && (
                                            <Pressable style={dvmBtn['btnPrimary']} onPress={handleSubmit}>
                                                <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                                    {ModelComponents[modalType]?.step2Button || "Confirm"}
                                                </Text>
                                            </Pressable>
                                        )}

                                    </View>
                                </>
                            ) : (
                                <View style={styles.buttonContainer}>
                                    {ModelComponents[modalType]?.button && (
                                        <Pressable style={dvmBtn['btnPrimary']} onPress={handleSubmit}>
                                            <Text style={{ fontWeight: "bold", color: "#fff" }}>
                                                {ModelComponents[modalType]?.button}
                                            </Text>
                                        </Pressable>
                                    )}
                                    <Pressable onPress={() => closeModal()} style={dvmBtn['btnWhite']}>
                                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>
                                            {ModelComponents[modalType]?.done ?? "Cancle"}
                                        </Text>
                                    </Pressable>
                                </View>
                            )}
                        </>
                    </View>
                </View>
            </View>
        </Modal >
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)"
    },
    modalBox: {
        width: "90%",
        padding: 20,
        borderRadius: 15,
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 10
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        marginTop: 20
    },
});
