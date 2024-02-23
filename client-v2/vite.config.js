import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
const BASE_URL = "http://localhost:3000/api/v1";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {},
  },
});
