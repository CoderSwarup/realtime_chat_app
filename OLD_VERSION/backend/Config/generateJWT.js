import dotenv from "dotenv";
dotenv.config();

const TokenSender = async (user, status, msg, res) => {
  const token = await user.getJWTToken();

  const accessTokenOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Access token expiration: 1 day
    httpOnly: true,
  };

  // Set access token and refresh token as separate cookies
  res.status(status).cookie("token", token, accessTokenOptions).send({
    success: true,
    message: msg,
    user,
  });
};

export default TokenSender;
