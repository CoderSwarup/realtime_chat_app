import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import ProfileModal from "./Modals/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { setSelectedChat } from "../../Store/Slice/ChatSlice";
import UpdateGroupChatModal from "./Modals/UpdateGroupChatModel";
import "./Chat.style.css";
import { useRef } from "react";
const SingleChat = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const scrollableBoxRef = useRef();
  const { user } = useSelector((state) => state.user);
  const { selectedChat } = useSelector((state) => state.chats);

  useEffect(() => {
    scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
  }, [selectedChat]);

  return (
    <div className="SingleChatConatiner">
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => {
            dispatch(setSelectedChat(null));
          }}
        />
        {!selectedChat.isGroupChat ? (
          <>
            {getSender(user.user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user.user, selectedChat.users)} />
          </>
        ) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal />
          </>
        )}
      </Text>

      <Box
        ref={scrollableBoxRef}
        display="flex"
        flexDir="column"
        p={3}
        bg="#000000"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="scroll"
        className="MessageRedingBox"
      ></Box>

      <div className="MessageSenderConatiner"></div>
    </div>
  );
};

export default SingleChat;
