import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isSuccessful: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);

const TransactionModel = mongoose.model("Transaction", transactionSchema);
export default TransactionModel;
