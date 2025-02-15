import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

console.log("Process env : ", process.env.BUILD_MODE);

if (process.env.BUILD_MODE) {
  console.log("Skipping WebSocket initialization during build.");
  process.exit(0);
}

const PORT = process.env.SOCKET_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials:true,
  },
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("authenticate", (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("User authenticated:", decoded);

      socket.emit("authenticated", { message: "Authentication successful!" });

      socket.on("message", (data) => {
        try {
          const parsedData = JSON.parse(data);
          console.log("Parsed message received:", parsedData);

          const botResponse = {
            text: `${parsedData.text}`,
            sender: "bot",
          };

          socket.emit("message", JSON.stringify(botResponse));
        } catch (error) {
          console.error("Error parsing incoming message:", error);
        }
      });
    } catch (error) {
      console.log("Invalid Token:", error.message);
      socket.emit("unauthorized", { error: "Invalid token" });
      socket.disconnect();
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
