import { useTheme } from "@emotion/react";

import { Box, Stack } from "@mui/material";

import React, { useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import Contact from "../../components/Contact";
import SharedMessage from "../../components/SharedMessage";
import StarredMessags from "../../components/StarredMessags";

export default function Conversation() {
  const theme = useTheme();

  // Scrolling Effect
  const messageListRef = useRef(null);
  const { sidebar } = useSelector((state) => state.app);
  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  // Filter the media File
  const FiltertedMedia = current_messages?.filter((msg) => {
    return msg?.subtype === "Media";
  });

  // Filter the Link MSG
  const FiltertedLink = current_messages?.filter((msg) => {
    return msg?.subtype === "Link";
  });
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

      {/* Contact Info */}
      {sidebar.open &&
        (() => {
          switch (sidebar.type) {
            case "STARRED":
              return <StarredMessags />;
            case "SHARED":
              return (
                <SharedMessage
                  FiltertedLink={FiltertedLink}
                  FiltertedMedia={FiltertedMedia}
                />
              );
            default:
              return <Contact FiltertedMedia={FiltertedMedia} />;
          }
        })()}
    </Stack>
  );
}
