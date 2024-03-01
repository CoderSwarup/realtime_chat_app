import { useTheme } from "@emotion/react";

import { Box, Stack } from "@mui/material";

import React, { useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Messages from "./Messages";
import { useSelector } from "react-redux";

export default function Conversation() {
  const theme = useTheme();

  // Scrolling Effect
  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);
  return (
    <Stack height="100%" maxHeight="100vh" width="auto">
      {/* Chat Header */}
      <Header />

      {/* Conversation MSG */}
      <Box
        ref={messageListRef}
        className="hideScrollBar"
        sx={{ height: "100%", width: "100%", overflowY: "scroll" }}
        flexGrow={1}
      >
        <Messages />
      </Box>

      {/* Footer */}
      <Footer />
    </Stack>
  );
}
