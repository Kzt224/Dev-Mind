import { emitNotification } from "./notiEmitter.js";

export const createNotification = async (prisma, data) => {
  return await prisma.notification.create({ data });
};

export const createAndEmitNotification = async (prisma, io, data) => {
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
