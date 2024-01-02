import express from "express";
import { LoginUser, registerUser } from "../Controllers/user.controller.js";

const userRouter = express.Router();

// userRouter.route("/login");

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(LoginUser);

export default userRouter;
