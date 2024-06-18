import express from "express";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import bodyParser from "body-parser";
import xss from "xss";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./routes/auth.route.js";
import UserRouter from "./routes/user.route.js";
import AccountRouter from "./routes/account.route.js";

dotenv.config();

const app = express();

//cors Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//Setup MiddleWares
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//helmet Midddleware
app.use(helmet());
// morgan middleWare
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

//Rate limit MiddleWare
const limiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many Requests! Please try again after an hour",
});

app.use("/api", limiter);

//Express urlEncoded MiddleWare
app.use(express.urlencoded({ extended: true }));

// Mongosanitize middleWare
app.use(ExpressMongoSanitize());

// xss Middleware Use To Prevent XSS attacks Cross-site scripting
// app.use(xss());

// All Routes
app.get("/", (req, res) => {
  res.send("Hello Server is start");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/account", AccountRouter);

export default app;
