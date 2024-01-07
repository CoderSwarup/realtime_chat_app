import {
  Avatar,
  Box,
  Button,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSender, getSenderImg } from "../../config/ChatLogics";
import "./Chat.style.css";
import { AddIcon } from "@chakra-ui/icons";
import GroupChatImg from "./GroupChatImg";
import GroupChatModal from "./Modals/GroupChatModal";
import { setSelectedChat } from "../../Store/Slice/ChatSlice";
export default function MyChats() {
  const { loading, mychats, selectedChat } = useSelector(
    (state) => state.chats
  );
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      bg="#242424"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      // h="100%"
    >
      <Box
        p="5px 3px"
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontWeight="800" fontSize="2xl">
          {" "}
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#242424"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        <Stack h="80vh" overflowY="scroll" className="MyChats-Container">
          {!loading ? (
            <>
              {mychats.map((chat) => (
                <Box
                  onClick={() => {
                    dispatch(setSelectedChat(chat));
                  }}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#777474" : "#242424"}
                  color={selectedChat === chat ? "white" : "white"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                  gap="10px"
                  alignItems="center"
                >
                  {!chat.isGroupChat ? (
                    <Avatar
                      // background="#fff"
                      size="sm"
                      cursor="pointer"
                      objectFit="cover"
                      name={user.user.username}
                      // name="Dan Abrahmov"
                      src={getSenderImg(user.user, chat.users)}
                    />
                  ) : (
                    <GroupChatImg users={chat.users}></GroupChatImg>
                  )}

                  <Box>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(user.user, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
            </>
          ) : (
            <Box w="100%" h="100%" display="grid" placeItems="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
