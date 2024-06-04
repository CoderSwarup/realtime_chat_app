import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    createdUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storyType: {
      type: String,
      enum: ["Text", "Video", "Image"],
      required: true,
    },
    storyData: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
      text: {
        type: String,
      },
    },
    expirationTime: {
      type: Date,
      default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // Default to 24 hours from creation
    },
    isSeen: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    reactions: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        reactionType: {
          type: String,
          enum: ["Like", "Love", "Haha", "Wow", "Sad", "Angry"],
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const StoryModel = mongoose.model("Story", StorySchema);
export default StoryModel;
