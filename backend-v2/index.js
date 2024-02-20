import app from "./app.js";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

// DEFINE THE PORT
const PORT = process.env.PORT || 3000;

// Create a HTTP SERVER
const server = http.createServer(app);

//LISTEN THE SERVER ON DEFINE PORT
server.listen(PORT, () => {
  console.log(`Server is Listen on the PORT : ${PORT}`);
});
