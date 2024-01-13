import { Box, Text } from "@chakra-ui/layout";
import { useDispatch, useSelector } from "react-redux";
import SingleChat from "./SingleChat";
import { io } from "socket.io-client";
import { addNotification } from "../../Store/Slice/Notificationslice";
import { useEffect, useMemo } from "react";
import { setMessages } from "../../Store/Slice/MessageSlice";
import { useToast } from "@chakra-ui/react";
import { getSender } from "../../config/ChatLogics";
import { useSocket } from "../../Context/SocketContext";

const Chatbox = () => {
  const dispatch = useDispatch();
  let socket = useSocket();
  const toast = useToast();

  const { loading, user } = useSelector((s) => s.user);
  const { selectedChat } = useSelector((s) => s.chats);

  useEffect(() => {
    socket.emit("new-user-add", user);
  }, []);

  useEffect(() => {
    // Message received event
    const messageReceivedHandler = (newMessageReceived) => {
      // If the chat is already selected, only update messages
      dispatch(setMessages(newMessageReceived));
    };

    // Send notification event
    const sendNotificationHandler = (notifications) => {
      if (
        selectedChat === null ||
        selectedChat?._id !== notifications.message.chat._id
      ) {
        dispatch(addNotification(notifications.message));
        let MessageSenderName;
        const isGroupChat = notifications.message.chat.isGroupChat;
        if (isGroupChat) {
          MessageSenderName = notifications.message.chat.chatName + " (GROUP)";
        } else {
          MessageSenderName = getSender(
            user.user,
            notifications.message.chat.users
          );
        }
        toast({
          title: `New Message`,
          description: `From ${MessageSenderName}`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top left",
        });

        // Handle notifications as needed when the chat is not selected
      }
    };

    // Add event listeners
    socket.on("message received", messageReceivedHandler);
    socket.on("send notification", sendNotificationHandler);

    // // Clear the event listeners when the component unmounts
    // return () => {
    //   socket.off("message received", messageReceivedHandler);
    // };
  }, [socket, selectedChat, user.id, dispatch]);

  return (
    <Box
      className="ChatBoxCantainer"
      // d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      h="91vh"
      alignItems="center"
      flexDir="column"
      p={3}
      bg="#242424"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {selectedChat ? (
        <SingleChat socket={socket} />
      ) : (
        <Box w="100%" h="100%" display="grid" placeItems="center">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Chatbox;
