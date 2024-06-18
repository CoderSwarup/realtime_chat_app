import express from "express";
import { VerifyUserMiddleware } from "../Middleware/auths.middleware.js";
import {
  Balance,
  ConfirmPayment,
  CreatPaymentIntent,
  CreateAccount,
  GetActiveAccounts,
  TransactionHistory,
  TransferMoney,
  UpdateAccountPassword,
  getAccountDetails,
  isPasswordCorrect,
  sendStripePublishableKey,
} from "../Controllers/account.controller.js";
const AccountRouter = express.Router();

AccountRouter.use(VerifyUserMiddleware);

AccountRouter.post("/get-account-details", getAccountDetails);
AccountRouter.post("/others-account-details", GetActiveAccounts);
AccountRouter.post("/create-account", CreateAccount);
AccountRouter.post("/check-password", isPasswordCorrect);
AccountRouter.put("/update-password", UpdateAccountPassword);

AccountRouter.post("/transfer", TransferMoney);
AccountRouter.get("/transaction-history", TransactionHistory);
AccountRouter.get("/balance", Balance);

// Stripe Payments
AccountRouter.get("/get-stripe-publishablekey", sendStripePublishableKey);
AccountRouter.post("/create-payment-intent", CreatPaymentIntent);
AccountRouter.post("/confirm-payment", ConfirmPayment);
export default AccountRouter;
