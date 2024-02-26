import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FrientRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);

export default FrientRequestModel;
