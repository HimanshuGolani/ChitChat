import jwt from "jsonwebtoken";
import User from "../modules/UserMOdel.js";

export const protect = async (req, res, next) => {
  // console.log(req);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECREAT);
      req.user = await User.findById(decoded.id).select("-password");
      // console.log(req.user);
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Token auth failed",
      });
    }
  }

  // Move this block outside of the if statement
  if (!token) {
    res.status(401).json({
      success: false,
      message: "No Token found",
    });
  }
};
