import React, { useEffect } from "react";
import SideDrawer from "../Components/ChatDashBoard/SideDrawer";
import MyChats from "../Components/ChatDashBoard/MyChats";
import ChatBox from "../Components/ChatDashBoard/ChatBox";
import { Box, useMediaQuery } from "@chakra-ui/react";
import "./Styles/ChatPageStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FetchMyChats } from "../Store/Actions/ChatActions";
export default function ChatPage() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { selectedChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchMyChats());
  }, []);
  return (
    <div className="Chat-container">
      <SideDrawer />
      <Box
        background="#242424"
        minH="91vh"
        display="flex"
        alignItems="start"
        justifyContent="space-between"
        p="8px"
      >
        {isMobile ? (
          <>{selectedChat === null ? <MyChats /> : <ChatBox />}</>
        ) : (
          <>
            <MyChats /> <ChatBox />
          </>
        )}
      </Box>
    </div>
  );
}
