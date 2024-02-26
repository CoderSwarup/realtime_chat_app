import express from "express";
import { VerifyUserMiddleware } from "../Middleware/auths.middleware.js";
import {
  GetUsers,
  getFriends,
  getRequests,
  updateMeController,
} from "../Controllers/user.controller.js";

const UserRouter = express.Router();

UserRouter.use(VerifyUserMiddleware);

UserRouter.patch("/update-me", updateMeController);

UserRouter.get("/get-users", GetUsers);

UserRouter.get("/get-requests", getRequests);
UserRouter.get("/get-friends", getFriends);

export default UserRouter;
