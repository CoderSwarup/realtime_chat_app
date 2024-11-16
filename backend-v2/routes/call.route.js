import express from "express";
import { VerifyUserMiddleware } from "../Middleware/auths.middleware.js";
import { getUserCallLogs } from "../Controllers/Call.controller.js";

const CallRouter = express.Router();

CallRouter.use(VerifyUserMiddleware);

CallRouter.get("/get-call-logs", getUserCallLogs);

export default CallRouter;
