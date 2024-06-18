import AccountModel from "../models/account.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import dotenv from "dotenv";
import mongoose from "mongoose";
import TransactionModel from "../models/transaction.model.js";

dotenv.config();

export const CreateAccount = catchAsync(async (req, res, next) => {
  const { accountPassword } = req.body;
  const this_user = req.user;
  if (!this_user || !accountPassword) {
    throw new Error("All fields Are Required");
  }

  // check is User Exist or Not
  const user = await User.findById(this_user._id);

  if (!user) {
    throw new Error("User Not Exist");
  }

  //check the User Accout is Already exist Or Not
  const isUserAccountExist = await AccountModel.findOne({
    user: this_user._id,
  });
  if (isUserAccountExist) {
    return res.status(400).json({
      status: false,
      message: "Account is Alredy Exist",
    });
  }

  // create a New Account
  const newAccount = await AccountModel({
    user: this_user._id,
    accountPassword,
    walletBalance: Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000,
  }).save();

  res.status(200).json({
    status: true,
    message: "Account Created Successfully!",
    accountDetails: newAccount,
  });
});

export const getAccountDetails = catchAsync(async (req, res, next) => {
  const this_user = req.user;
  console.log("this_user");
  if (!this_user) {
    throw new Error("All Fields Are Required");
  }

  const isAccount = await AccountModel.findOne({
    user: this_user._id,
  })
    .populate("user", "firstName lastName email")
    .select("-accountPassword");

  if (!isAccount) {
    return res.status(300).send({
      status: false,
      message: "Account is Not Created",
      accountDetails: null,
    });
  }

  return res.status(200).send({
    status: true,
    message: "Account Details",
    accountDetails: isAccount,
  });
});

export const GetActiveAccounts = catchAsync(async (req, res, next) => {
  const { userIds } = req.body;

  if (userIds.length < 1 || !userIds || !Array.isArray(userIds)) {
    throw new Error("Please Provide All Fields");
  }

  const accounts = await AccountModel.find({
    user: { $in: userIds },
  })
    .populate("user", "firstName lastName email")
    .select("-accountPassword -walletBalance");

  return res.status(200).send({
    status: true,
    message: "Accounts Retrived",
    accounts,
  });
});

export const isPasswordCorrect = catchAsync(async (req, res, next) => {
  const this_user = req.user;
  const { password } = req.body;
  if (!password) {
    throw new Error("Password Is Required");
  }
  const UserAccount = await AccountModel.findOne({
    user: this_user._id,
  });

  if (!UserAccount) {
    throw new Error("Sorry Account Not Exist");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    UserAccount.accountPassword
  );

  if (!isPasswordCorrect) {
    return res.status(400).send({
      success: false,
      error: "Password Invalid",
      isTrue: false,
    });
  }

  return res.status(200).send({
    success: true,
    message: "Password Valid",
    isTrue: true,
  });
});

export const UpdateAccountPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, newConfirmPassword } = req.body;

  if (!oldPassword || !newPassword | !newConfirmPassword) {
    throw new Error("All Fields Are Required");
  }
  if (newPassword.trim() !== newConfirmPassword.trim()) {
    throw new Error("Password Not Matched");
  }
  const this_user = req.user;

  const UserAccount = await AccountModel.findOne({
    user: this_user._id,
  });

  if (!UserAccount) {
    throw new Error("Sorry Account Now Exist");
  }

  const isPasswordCorrect = await bcrypt.compare(
    oldPassword,
    UserAccount.accountPassword
  );

  if (!isPasswordCorrect) {
    throw new Error("Old Password Is Incorrect");
  }

  UserAccount.accountPassword = newPassword;

  await UserAccount.save();

  return res.status(200).send({
    status: true,
    message: "Password Updated Successfully",
  });
});

export const TransferMoney = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { from, amount, to } = req.body;
  const this_user = req.user;

  try {
    if (
      !from ||
      !amount ||
      amount <= 0 ||
      !to ||
      !this_user ||
      from.length < 24 ||
      to.length < 24
    ) {
      throw new Error("Invalid transfer details. Please Check it.");
    }

    const account = await AccountModel.findOne({ _id: from })
      .populate("user", "_id")
      .session(session);

    if (!account) {
      throw new Error("Account not found.");
    }

    if (from === to || account._id.toString() === to) {
      throw new Error("Cannot transfer to yourself!");
    }

    const toAccount = await AccountModel.findOne({ _id: to })
      .populate("user", "_id")
      .session(session);

    if (!toAccount) {
      throw new Error("Invalid account.");
    }

    if (account.walletBalance < amount) {
      await TransactionModel({
        sender: account.user._id,
        receiver: toAccount.user._id,
        amount,
        isSuccessful: false,
      }).save();

      throw new Error("Insufficient balance.");
    }
    await AccountModel.updateOne(
      { _id: account._id },
      { $inc: { walletBalance: -amount } }
    ).session(session);

    await AccountModel.updateOne(
      { _id: toAccount._id },
      { $inc: { walletBalance: amount } }
    ).session(session);

    await session.commitTransaction();

    const transaction = await new TransactionModel({
      sender: account.user._id,
      receiver: toAccount.user._id,
      amount,
      isSuccessful: true,
    }).save();

    return res.status(200).send({
      success: true,
      message: "Transfer successful.",
      transaction,
    });
  } catch (error) {
    await session?.abortTransaction();
    res.status(400).json({
      error: error.message,
      status: false,
    });
  } finally {
    session.endSession();
  }
};

export const TransactionHistory = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Ensure user ID is a valid Mongoose ObjectId
  const userId = new mongoose.Types.ObjectId(user._id);

  const transactions = await TransactionModel.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senderDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiverDetails",
      },
    },
    {
      $unwind: {
        path: "$senderDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$receiverDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
        },
        senderName: {
          $concat: ["$senderDetails.firstName", " ", "$senderDetails.lastName"],
        },
        receiverName: {
          $concat: [
            "$receiverDetails.firstName",
            " ",
            "$receiverDetails.lastName",
          ],
        },
        amount: {
          $cond: [
            { $eq: ["$sender", userId] },
            { $multiply: ["$amount", -1] },
            "$amount",
          ],
        },
      },
    },
    {
      $project: {
        id: "$_id",
        date: 1,
        sender: "$senderName",
        receiver: "$receiverName",
        amount: 1,
        status: {
          $cond: ["$isSuccessful", "Success", "Failed"],
        },
      },
    },
    {
      $sort: { timestamp: -1 },
    },
  ]);

  // Aggregation pipeline to get chart data
  const chartData = await TransactionModel.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
        },
        totalAmount: {
          $sum: {
            $cond: [
              { $eq: ["$sender", userId] },
              { $multiply: ["$amount", -1] },
              "$amount",
            ],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        date: "$_id",
        amount: "$totalAmount",
        _id: 0,
      },
    },
  ]);

  return res.status(200).send({
    status: true,
    message: "Transaction details fetched successfully",
    transactions,
    chartData,
  });
});

export const Balance = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const account = await AccountModel.findOne({
    user: userId,
  });
  if (!account) {
    throw new Error("Account Not Found");
  }
  return res.status(200).send({
    status: true,
    message: "Balance fetched successfully",
    balance: account.walletBalance,
  });
});

//STRIPE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const sendStripePublishableKey = catchAsync(async (req, res, next) => {
  res.status(200).send({
    status: true,
    message: "Stripe publishable key fetched successfully",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

export const CreatPaymentIntent = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const this_user = req.user;

  if (!amount || !this_user || amount <= 0) {
    throw new Error("All Fields Are Required");
  }

  const payment = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: "usd",
    metadata: {
      company: "Talk_Live",
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // console.log(payment);
  return res.status(200).send({
    status: true,
    message: "Deposit successful",
    clientSecret: payment.client_secret,
    paymentIntentId: payment.id, // Ensure this line is added
  });
});

export const ConfirmPayment = catchAsync(async (req, res) => {
  const { paymentIntentId } = req.body;
  const this_user = req.user;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    // Update the user's wallet balance
    const userAccount = await AccountModel.findOne({ user: this_user._id });
    userAccount.walletBalance += paymentIntent.amount / 100; // Convert back to dollars
    await userAccount.save();

    res.status(200).send({
      status: true,
      balance: userAccount.walletBalance,
      message: "Payment succeeded Money added To Your Account",
    });
  } else {
    res.status(400).send({ error: "Payment not successful" });
  }
});
