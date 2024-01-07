import express from "express";
import {
  GetAllUser,
  GetUserDetails,
  LoginUser,
  LogoutUserController,
  registerUser,
} from "../Controllers/user.controller.js";
import AuthMiddleWare from "../middlewares/AuthMiddleWare.js";

const userRouter = express.Router();

// userRouter.route("/login");

userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(LoginUser);

userRouter.route("/logout").get(AuthMiddleWare, LogoutUserController);

userRouter.route("/getuserdetails").get(AuthMiddleWare, GetUserDetails);

userRouter.route("/getallusers").get(AuthMiddleWare, GetAllUser);

export default userRouter;
