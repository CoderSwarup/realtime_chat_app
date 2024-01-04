import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../Models/user.model.js";

dotenv.config();

const AuthMiddleWare = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    let Token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      Token = req.headers.authorization.split(" ")[1];

      //Decode Token
      const Decode = JWT.verify(Token, process.env.JWT_SECRET);

      req.user = await UserModel.findById(Decode._id).select("-password");

      next();
    } else {
      throw new Error("Not Authorized , Token Filed");
    }
  } catch (error) {
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};

export default AuthMiddleWare;
