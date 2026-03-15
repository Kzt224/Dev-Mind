

export const emitNotification = async(io, userId, payload) => {
  io.to(`user_${userId}`).emit("notification", payload);
};
