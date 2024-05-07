import Chat from "../modules/ChatModel.js";
import Message from "../modules/Messagemodel.js";
import User from "../modules/UserMOdel.js";

export const sendMessageController = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed from request.");
    // console.log(content, chatId);

    return res.status(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });
    // console.log(message);
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");
    // console.log(message);
    res.json(message);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
