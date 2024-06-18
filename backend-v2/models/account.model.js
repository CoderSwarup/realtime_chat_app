import mongoose from "mongoose";

import bcrypt from "bcrypt";

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  accountPassword: {
    type: String,
    required: true,
  },
});

accountSchema.pre("save", async function (next) {
  if (this.isModified("accountPassword")) {
    this.accountPassword = await bcrypt.hash(this.accountPassword, 10);
  }
  next();
});

const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;
