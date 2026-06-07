
export interface User {
    name: string;
    id: number
}
export interface SendNotificationProps {
    user?: User | null;
    leaderId?: number;
    memberId?: number;
    inviteStatus?: string;
    requestId?: number;
    socketIo?: any;
}
export interface AssignNotificationProps {
    memberId: number;
    authorId: number;
    taskId?: number;
    projectId?: number | null;
    taskName: string;
}
export interface ModifyNotiProps extends AssignNotificationProps{
    recipientId: number;
    modifierId: number;
}