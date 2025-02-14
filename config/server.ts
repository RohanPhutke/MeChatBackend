export default ({ env }: { env: any }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  afterStartup: async (strapi: any) => {
    console.log("Initializing WebSocket server...");
    require("../config/websocket").default(strapi);
  },
});