import mongoose from "mongoose";
const audioVideoCallSchema = new mongoose.Schema({
  callType: {
    type: String,
    enum: ["Audio", "Video"],
  },
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  verdict: {
    type: String,
    enum: ["Accepted", "Denied", "Missed", "Busy"],
  },
  status: {
    type: String,
    enum: ["Ongoing", "Ended"],
  },
  startedAt: {
    type: Date,
    default: Date.now(),
  },
  endedAt: {
    type: Date,
  },
});

const AudioVideoCall = new mongoose.model(
  "AudioVideoCall",
  audioVideoCallSchema
);
export default AudioVideoCall;
