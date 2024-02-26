import express from "express";
import { VerifyUserMiddleware } from "../Middleware/auths.middleware.js";
import {
  GetUsers,
  updateMeController,
} from "../Controllers/user.controller.js";

const UserRouter = express.Router();

UserRouter.patch("/update-me", VerifyUserMiddleware, updateMeController);

UserRouter.get("/get-users", VerifyUserMiddleware, GetUsers);
export default UserRouter;
