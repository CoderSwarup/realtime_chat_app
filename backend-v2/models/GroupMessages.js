import mongoose from "mongoose";

const GroupMessageSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      require: true,
    },
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    admins: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        from: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        type: {
          type: String,
          enum: ["Text", "Media", "Document", "Link"],
        },
        created_at: {
          type: Date,
          default: Date.now(),
        },
        text: {
          type: String,
        },
        file: {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const GroupMessage = new mongoose.model("GroupMessage", GroupMessageSchema);

export default GroupMessage;
