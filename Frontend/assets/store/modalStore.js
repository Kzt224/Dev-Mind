import { create } from "zustand";


export const useModalStore = create((set) => ({
    isVisible: false,
    modalType: "",
    editProject: {},
    editTask: {},
    groupId: '',
    inputData: {},
    step: 1,
    data: '',
    qrToken: '',
    id: '',//for edit task and project and assign user id
    setStep: (val, data) => set({ step: val, data: data }),
    openModal: (type, id) => {
        set({
        isVisible: true,
        modalType: type, 
        id: id
    })},
    closeModal: () => set({
        isVisible: false,
        inputData: {},
        step: 1,
        qrToken: '',
        data: '',
        id: '',
        modalType: '',
        editProject: {},
        editTask: {}
    }),
    setInputData: (key, value) => set(state => ({
        inputData: { ...state.inputData, [key]: value }
    })),
    setEditData: (item, type) =>
        set(state => ({
            ...state,
            editProject: type === "project" ? item : state.editProject,
            editTask: type === "task" ? item : state.editTask,
        })),
    setInviteData: (id) => set({ groupId: id }),
    setQrToken: (val, groupId) => set({ qrToken: val, groupId: groupId })
}));
