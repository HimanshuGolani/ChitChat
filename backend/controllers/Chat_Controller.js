import Chat from "../modules/ChatModel.js";
import User from "../modules/UserMOdel.js";

export const getAllChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  // check if the id is fetched or not
  if (!userId) {
    console.log("User Params not sent with request");
    return res.status(400).send("User Params not sent with request");
  }

  try {
    // Find chat(s) related to the user
    const chats = await Chat.find({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] }, // Find chats where both users are present
    })
      .populate("users", "-password")
      .populate("latestMessage.sender");

    if (chats.length > 0) {
      res.send(chats);
    } else {
      // If no chat is found, create a new chat
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const newChat = await Chat.create(chatData);
      const fullChat = await Chat.findById(newChat._id).populate(
        "users",
        "-password"
      );
      console.log(fullChat);
      res.status(200).send(fullChat);
    }
  } catch (error) {
    console.error("Error in getAllChats:", error);
    res.status(500).send("Internal server error");
  }
};
export const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the feilds" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat.");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Error in creating group chat:", error);
    res.status(500).send("Internal server error");
  }
};
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  } else {
    res.json(updatedChat);
  }
};
export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    return res.status(404).josn({ success: false, message: "Chat not found" });
  } else {
    return res.status(200).json(updatedGroup);
  }
};
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    return res.status(404).josn({ success: false, message: "Chat not found" });
  } else {
    return res.status(200).json(updatedGroup);
  }
};
