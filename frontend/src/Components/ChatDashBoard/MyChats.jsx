import { Avatar, Box, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getSender, getSenderImg } from "../../config/ChatLogics";
import "./Chat.style.css";
import GroupChatImg from "./GroupChatImg";
export default function MyChats() {
  const { mychats } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.user);

  const [selectedChat, setSelectedChat] = useState(mychats[0]);

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      bg="#242424"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontWeight="800" fontSize="2xl">
          {" "}
          My Chats
        </Text>
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
        {mychats ? (
          <Stack h="91vh" overflowY="scroll" className="MyChats-Container">
            {mychats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#222121" : "#242424"}
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
          </Stack>
        ) : (
          <h1>Loading</h1>
        )}
      </Box>
    </Box>
  );
}
