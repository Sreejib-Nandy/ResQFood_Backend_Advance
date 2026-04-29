import { socketAuth } from "../middlewares/socketMiddleware.js";

let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.use(socketAuth);

  io.on("connection", (socket) => {
    if (!socket.user) {
      return socket.disconnect();
    }

    const userId = socket.user.userId;
    const role = socket.user.role;

    // personal room
    socket.join(`user:${userId}`);

    // role room
    socket.join(`role:${role}`);

    console.log(`User ${userId} connected as ${role}`);

    // NGO sends live location
    socket.on("send_location", ({ lat, lng, restaurantId }) => {
      if (!lat || !lng || !restaurantId) return;

      console.log(`Location from NGO ${userId} → Restaurant ${restaurantId}`);

      io.to(`user:${restaurantId}`).emit("ngo_location_update", {
        lat,
        lng,
        ngoId: userId,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io is not initialized");
  }
  return ioInstance;
};