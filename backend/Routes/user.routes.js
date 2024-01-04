import express from "express";
import {
  GetAllUser,
  LoginUser,
  registerUser,
} from "../Controllers/user.controller.js";
import AuthMiddleWare from "../middlewares/AuthMiddleWare.js";

const userRouter = express.Router();

// userRouter.route("/login");

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(LoginUser);
userRouter.route("/getallusers").get(AuthMiddleWare, GetAllUser);

export default userRouter;
