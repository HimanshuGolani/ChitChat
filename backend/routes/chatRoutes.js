import express from "express";
import {
  getAllChats,
  accessChat,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
} from "../controllers/Chat_Controller.js";
import { protect } from "../middleware/authmiddleware.js";

const chatRouter = express.Router();

chatRouter.get("/", protect, getAllChats);
chatRouter.post("/", protect, accessChat);
chatRouter.post("/creategroup", protect, createGroup);
chatRouter.put("/groupadd", protect, addToGroup);
chatRouter.put("/rename", protect, renameGroup);
chatRouter.put("/groupremove", protect, removeFromGroup);

export default chatRouter;
