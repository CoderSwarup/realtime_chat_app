import express from "express";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import bodyParser from "body-parser";
import xss from "xss";
import cors from "cors";

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
app.use(morgan("dev"));
if (process.env.NODE_ENV == "development") {
  console.log("devMode");
}

//Rate limit MiddleWare
const limiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many Requests! Please try again after an hour",
});

app.use("/", limiter);

//Express urlEncoded MiddleWare
app.use(express.urlencoded({ extended: true }));

// Mongosanitize middleWare
app.use(ExpressMongoSanitize());

// xss Middleware Use To Prevent XSS attacks Cross-site scripting
// app.use(xss());

app.get("/", (req, res) => {
  res.send("Hello Server is start");
});
export default app;
