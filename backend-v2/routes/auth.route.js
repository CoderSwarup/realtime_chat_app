import express from "express";
import {
  LoginController,
  RegisterController,
  forgotPasswordController,
  resetPasswordController,
  sendOTPController,
  verifyOTP,
} from "../Controllers/auth.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("/login", LoginController);

AuthRouter.post("/register", RegisterController, sendOTPController);
AuthRouter.post("/verify", verifyOTP);
AuthRouter.post("/send-otp", sendOTPController);

AuthRouter.post("/forgot-password", forgotPasswordController);
AuthRouter.post("/reset-password", resetPasswordController);

export default AuthRouter;
