import express from "express";
import { VerifyUserMiddleware } from "../Middleware/auths.middleware.js";
import { updateMeController } from "../Controllers/user.controller.js";

const UserRouter = express.Router();

UserRouter.patch("/update-me", VerifyUserMiddleware, updateMeController);

export default UserRouter;
