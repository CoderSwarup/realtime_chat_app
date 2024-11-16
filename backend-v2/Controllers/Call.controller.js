import AudioVideoCall from "../models/audioVideoCall.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";

// GET USER CALL LOG
export const getUserCallLogs = catchAsync(async (req, res) => {
  const this_user = req.user;

  if (!this_user) {
    throw new Error("Please Login To Access This");
  }

  const user = await User.findById(this_user._id);

  if (!user) {
    throw new Error("User Not Exist");
  }

  // call logs
  const call_logs = await AudioVideoCall.find({
    $or: [{ from: this_user._id }, { to: this_user._id }],
  })
    .populate("from", "firstName lastName email avatar status")
    .populate("to", "firstName lastName email avatar status")
    .sort({ endedAt: -1 })
    .exec();

  const logs = call_logs.map((log) => {
    const isCaller = log.from._id.toString() === this_user._id.toString();
    const otherUser = isCaller ? log.to : log.from;
    return {
      id: log._id,
      callType: log.callType,
      verdict: log.verdict,
      status: log.status,
      startedAt: log.startedAt,
      endedAt: log.endedAt,
      isIncoming: !isCaller, // Determine if the call is incoming
      otherUser: {
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        email: otherUser.email,
        avatar: otherUser.avatar,
        status: otherUser.status,
        _id: otherUser._id,
      },
    };
  });

  res.status(200).json({
    status: true,
    message: "Call logs Fetch Successfully!",
    call_logs: logs,
  });
});
