import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import DBConnect from "./Config/DBConnect.js";

dotenv.config();

// DEFINE THE PORT
const PORT = process.env.PORT || 3000;

// Create a HTTP SERVER
const server = http.createServer(app);

// DB CONNECTION
DBConnect();

//LISTEN THE SERVER ON DEFINE PORT
server.listen(PORT, () => {
  console.log(`Server is Listen on the PORT : ${PORT}`);
});
