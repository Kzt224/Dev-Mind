export const guestIdentity = async (deviceId) => {
  try {
    const random = Math.floor(Math.random() * 10000); // 4-digit random number
    const prefix = "guest";

    const guestName = `${prefix}-${deviceId}`;
    const guestEmail = `${prefix}-${deviceId}-${random}@guest.local`;

    return {
      name: guestName,
      email: guestEmail,
      password: `${prefix}-${random}-pass`
    };
  } catch (error) {
    console.log("Error in guestIdentity.js:", error);
    return null;
  }
};
