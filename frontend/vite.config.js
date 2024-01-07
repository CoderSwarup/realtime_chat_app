import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const BACKENDURL = "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // chats
      "/api/v1/chats": BACKENDURL,

      //User

      "/api/v1/user/register": BACKENDURL,
      "/api/v1/user/login": BACKENDURL,
      "/api/v1/user/logout": BACKENDURL,
      "/api/v1/user/getuserdetails": BACKENDURL,
      "/api/v1/user/getallusers": BACKENDURL,
    },
  },
});
