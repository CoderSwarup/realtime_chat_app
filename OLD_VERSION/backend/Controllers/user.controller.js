import TokenSender from "../Config/generateJWT.js";
import UserModel from "../Models/user.model.js";
import bcrypt from "bcrypt";

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await UserModel.create({
      username,
      email,
      password,
      avatar,
    });

    if (user) {
      return res.status(201).send({
        message: "User Register successfully please Login",
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
        },
      });
    } else {
      res.status(400).send({
        message: "Failed to create user.",
        success: false,
      });
    }
  } catch (error) {
    // console.log(error.message);
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};

//Login User
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and Password are required fields!");
    }
    // Checking if the user exist in the database

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
    // Validate the password of the user with the entered password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
    // res.send({
    //   token: generateToken(user),
    //   success: true,
    //   message: "Login Success fully",
    //   user: {
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //   },
    // });
    // console.log("done");
    return TokenSender(user, 200, "User Login Succefully", res);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: err.message,
      success: false,
    });
  }
};

//GetUserDetails
const GetUserDetails = async (req, res) => {
  try {
    let user = req.user._id;

    const isUserExists = await UserModel.findById(user).select("-password");
    if (!isUserExists) {
      throw new Error("User Not Found");
    }

    return res.status(200).send({
      success: true,
      user: isUserExists,
      message: "User is Found",
    });
  } catch (error) {
    res.status(400).send({
      error: err.message,
      success: false,
    });
  }
};

// GetallUser
const GetAllUser = async (req, res) => {
  try {
    // If User Serach By user name
    const keywords = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    // Find In database

    const Users = await UserModel.find(keywords).find({
      _id: { $ne: req.user._id },
    });
    res.status(200).send({
      message: "User is found",
      Users,
    });
  } catch (error) {
    res.status(400).send({
      error: err.message,
      success: false,
    });
  }
};

//logout fucntionallity
const LogoutUserController = async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .cookie("refreshToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .send({
        success: true,
        message: "logout Successfully",
      });
  } catch (err) {
    res.status(400).send({
      error: err.message,
      success: false,
    });
  }
};
export {
  registerUser,
  LoginUser,
  GetUserDetails,
  GetAllUser,
  LogoutUserController,
};
