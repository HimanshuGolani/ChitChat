import express from "express";
import {
  registerUser,
  userLogin,
  getAllUsers,
} from "../controllers/User_Controller.js";
import { protect } from "../middleware/authmiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/login", userLogin);
UserRouter.post("/signup", registerUser);
// search functionality
UserRouter.get("/search-users", protect, getAllUsers);

export default UserRouter;
