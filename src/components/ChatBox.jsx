import React from "react";
import { Box } from "@chakra-ui/layout";
import { useChatState } from "../Context/ChatProvider";
import "../Css/style.css";
import SingleChat from "./UserAvatar/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatState();

  return (
    <>
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        padding={5}
        bg="gray.100"
        width={{ base: "100%", md: "68%" }}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="md"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
};

export default ChatBox;
