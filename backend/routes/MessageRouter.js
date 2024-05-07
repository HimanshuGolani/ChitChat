import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  sendMessageController,
  getAllMessages,
} from "../controllers/MessageController.js";

const messageRouter = express.Router();

messageRouter.post("/", protect, sendMessageController);
messageRouter.get("/:chatId", protect, getAllMessages);

export default messageRouter;
