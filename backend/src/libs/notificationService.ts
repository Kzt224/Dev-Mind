import { emitNotification } from "./notiEmitter.js";

interface Item {
  header: string;
  body: string;
  authorId: number;
  projectId?: number;
  type?: any;
  taskId?: number | undefined;
  requestId?: number
}
export const createNotification = async (prisma: any, data: Item) => {
  return await prisma.notification.create({ data });
};

export const createAndEmitNotification = async (prisma: any, io: any, data: Item) => {
  const noti = await createNotification(prisma, data);
  try {
    if (io && noti && noti.authorId) {
      await emitNotification(io, noti.authorId, {
        header: noti.header,
        body: noti.body,
        type: noti.type,
      });
    }
  } catch (e) {
    console.error("createAndEmitNotification emit error:", e);
  }
  return noti;
};

export default { createNotification, createAndEmitNotification };
