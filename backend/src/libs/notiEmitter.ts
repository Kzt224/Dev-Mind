

export const emitNotification = async(io: any, userId: number, payload: any) => {
  io.to(`user_${userId}`).emit("notification", payload);
};
