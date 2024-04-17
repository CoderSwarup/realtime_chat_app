import User from "../models/user.model.js";
import filterObj from "../utils/FilterObject.js";
import catchAsync from "../utils/catchAsync.js";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import { sendEmailService } from "../utils/Services/SendMailService.js";
import OTP_HTML from "../Templates/Otp_HTML.js";
import jwt from "jsonwebtoken";
import FORGOT_PASSWORD from "../Templates/FORGOT_PASSWORD.js";

dotenv.config();

// Return Sign Token
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

// Register New User
export const RegisterController = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "password"
  );

  // check if a verified user with given email exists

  const existing_user = await User.findOne({ email: email });

  if (existing_user && existing_user.verified) {
    // user with this email already exists, Please login
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login.",
    });
  } else if (existing_user) {
    // if not verified than update prev one
    // await User.findByIdAndUpdate(existing_user._id, filteredBody, {
    //   new: true,
    // });
    // generate an otp and send to email
    req.userId = existing_user._id;
    next();
  } else {
    // if user is not created before than create a new one
    const new_user = await User.create(filteredBody);
    // generate an otp and send to email
    req.userId = new_user._id;
    next();
  }
});

//Generate Otp
export const sendOTPController = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  // console.log(new_otp);

  // TODO send mail
  const emailSubject = "Your OTP for authentication";
  const emailHtml = OTP_HTML(user.firstName, new_otp);
  const emailAttachments = []; // No attachments in this case
  const emailOptions = {
    to: user.email,
    subject: emailSubject,
    html: emailHtml,
    attachments: emailAttachments,
  };

  // Send email

  await sendEmailService(emailOptions);

  // console.log(new_otp);
  // console.log("OTP email sent successfully!");

  res.status(200).json({
    status: "success",
    message: "OTP Sent Successfully!",
  });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  // verify otp and update user accordingly
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new Error("All fields Are Required");
  }
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
      user_id: user._id,
    });

    return;
  }

  // OTP is correct

  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user._id,
  });
});

//Login User
export const LoginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // console.log(email, password);

  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Both email and password are required",
    });
    return;
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !user.password) {
    res.status(400).json({
      status: "error",
      message: "Incorrect Email Or password",
    });

    return;
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });

    return;
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Logged in successfully!",
    token,
    user_id: user._id,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user?.avatar.url || "",
    },
  });
});

// Forgot Password Controller
export const forgotPasswordController = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({
      status: "error",
      message: "Email is Required",
    });
  }
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "There is no user with email address.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `http://localhost:5173/auth/new-password?token=${resetToken}`;
    // TODO => Send Email with this Reset URL to user's email address

    // console.log(resetToken);
    const emailSubject = "Reset Password";
    const emailHtml = FORGOT_PASSWORD(user.firstName, resetURL);
    const emailAttachments = []; // No attachments in this case
    const emailOptions = {
      to: user.email,
      subject: emailSubject,
      html: emailHtml,
      attachments: emailAttachments,
    };

    // Send email

    await sendEmailService(emailOptions);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      message: "There was an error sending the email. Try again later!",
    });
  }
});

// Reset Password
export const resetPasswordController = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.passwordConfirm) {
    return res.status(400).json({
      status: "error",
      message: "Password Must Be Required",
    });
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return res.status(400).json({
      status: "error",
      message: "Password Not Match",
    });
  }
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is Invalid or Expired",
    });
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password Reseted Successfully",
    token,
  });
});
