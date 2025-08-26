const jwt = require("jsonwebtoken");

const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpsOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    }).json({
        status:true,
        message,
        user
    })
};

module.exports = generateToken;
