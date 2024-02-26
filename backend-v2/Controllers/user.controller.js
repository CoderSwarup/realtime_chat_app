import User from "../models/user.model.js";
import filterObj from "../utils/FilterObject.js";
import catchAsync from "../utils/catchAsync.js";

export const updateMeController = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );

  const userDoc = await User.findByIdAndUpdate(req.user._id, filteredBody);

  res.status(200).json({
    status: "success",
    data: userDoc,
    message: "User Updated successfully",
  });
});

// get all users
export const GetUsers = async (req, res) => {
  const allUsers = await User.find({
    verified: true,
  }).select("firstName lastName _id");

  const this_user = req.user;

  const RemainingUsers = allUsers.filter(
    (user) =>
      !this_user.friends.includes(
        user._id && user._id.toString() !== this_user._id.toString()
      )
  );

  res.status(200).json({
    status: "success",
    data: RemainingUsers,
    message: "UsersFound Successfully",
  });
};
