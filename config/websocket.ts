import { Server } from "ws";
import jwt from "jsonwebtoken";

export default (strapi: any) => {
  const host = process.env.WS_HOST || "localhost"; 
  const port = process.env.WS_PORT || 8082; 

  const wss = new Server({ host, port });

  wss.on("connection", (ws, req) => {
    try {
      
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        console.log("⛔ No token provided!");
        ws.close();
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;

      const decoded = jwt.verify(token, jwtSecret);
      console.log("✅ User authenticated:", decoded);

      ws.on("message", (message: string) => {
        console.log("here I am !");
        console.log(`💬 Received: ${message}`);
        ws.send(`Echo: ${message}`);
      });
    } catch (error) {
      console.log("❌ Invalid Token:", error.message);
      ws.close();
    }
  });

  console.log(`🚀 WebSocket running at ws://${host}:${port}`);
};