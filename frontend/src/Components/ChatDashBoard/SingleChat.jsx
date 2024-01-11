import { Box, Text } from "@chakra-ui/layout";
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import ProfileModal from "./Modals/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { setSelectedChat } from "../../Store/Slice/ChatSlice";
import UpdateGroupChatModal from "./Modals/UpdateGroupChatModel";
import "./Chat.style.css";
import { useRef } from "react";

import { AttachmentIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  FetchMyChatMessages,
  SendNewMessage,
} from "../../Store/Actions/MessageActions";
import ScrollableChat from "./ScrollableChat";

// Socket Connection
import { io } from "socket.io-client";
import { setMessages } from "../../Store/Slice/MessageSlice";
import { addNotification } from "../../Store/Slice/Notificationslice";
const ENDPOINT = "http://localhost:8080";

let mySocket, selectedChatCompare;

const SingleChat = ({ socket }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const scrollableBoxRef = useRef();
  const { user } = useSelector((state) => state.user);
  const { selectedChat } = useSelector((state) => state.chats);
  const [isDisable, setIsDisable] = useState(false);
  // Messages
  const { loading } = useSelector((state) => state.message);
  const [newMessage, setNewMessage] = useState("");

  // Typindg Effect
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Establish the socket connection when the component mounts
    // socket = io(ENDPOINT);
    // socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // Clean up the socket connection when the component unmounts
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const callFunction = () => {
    setNewMessage("");
    // FetchMessages();
  };

  // SendMessages
  const sendMessage = async (event) => {
    if (isDisable === true) {
      return;
    }
    socket.emit("stop typing", selectedChat._id);
    setIsDisable(true);
    await SendNewMessage(newMessage, selectedChat._id, toast, callFunction);
    setIsDisable(false);
  };

  // On Enter Press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  //FetchThe Messages
  const FetchMessages = async () => {
    if (!selectedChat) return;
    await dispatch(FetchMyChatMessages({ selectedChatId: selectedChat._id }));
    socket.emit("join chat", selectedChat._id);
  };

  // Fetching Messages UseEffect
  useEffect(() => {
    FetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Typing Handler
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Scrolling Down
  // useEffect(() => {
  //   scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
  // }, [selectedChat]);

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

      {loading ? (
        <Box w="100%" h="100%" display="grid" placeItems="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      ) : (
        <div className="MessageRedingBox">
          <ScrollableChat istyping={istyping}></ScrollableChat>
        </div>
      )}

      {/* Message Sender Functionality */}
      <div className="MessageSenderContainer">
        <FormControl
          className="FormControllerInputSender"
          id="first-name"
          isRequired
          mt={3}
        >
          <InputGroup>
            {/* Left side: Image sender button */}
            <InputLeftElement>
              {/* Chakra UI Attachment icon */}
              <IconButton
                className="inputGroupAttachmentIcon"
                background="#707070"
                size="sm"
                icon={<AttachmentIcon />}
              />
            </InputLeftElement>

            {/* Message input */}
            <Input
              className="InputField"
              paddingLeft="44px"
              variant="filled"
              bg="#313131"
              placeholder="Enter a message.."
              _hover={{ bg: "#313131" }}
              outline="none"
              value={newMessage}
              onChange={typingHandler}
              onKeyPress={handleKeyPress}
            />

            {/* Right side: Send arrow */}
            {newMessage && (
              <InputRightElement>
                {/* Chakra UI ArrowForward icon */}
                <IconButton
                  background="#707070"
                  icon={<ArrowForwardIcon />}
                  onClick={sendMessage}
                  size="sm"
                />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default SingleChat;
