import React, { useEffect, useRef } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Box, Stack } from "@mui/material";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import StarredMessags from "../StarredMessags";
import SharedMessage from "../SharedMessage";
import Contact from "../Contact";
import GroupChatInfo from "../GroupChatInfo";

export default function GroupChatConversion() {
  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );
  const { sidebar } = useSelector((state) => state.app);

  const FiltertedMedia = current_messages?.filter((msg) => {
    return msg?.subtype === "Media";
  });

  // Filter the Link MSG
  const FiltertedLink = current_messages?.filter((msg) => {
    return msg?.subtype === "Link";
  });

  const FiltertedDocs = current_messages?.filter((msg) => {
    return msg?.subtype === "Document";
  });
  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <>
      <Stack height="100%" maxHeight="100vh" width="auto">
        <Header />
        {/* <Conversation /> */}
        <Box
          ref={messageListRef}
          className="hideScrollBar"
          sx={{ height: "100%", width: "100%", overflowY: "scroll" }}
          flexGrow={1}
        >
          <Messages />
        </Box>
        <Footer />

        {/* Contact Info */}
        {sidebar.open &&
          sidebar?.chat_type === "group" &&
          (() => {
            switch (sidebar.type) {
              case "STARRED":
                return <StarredMessags type={"group"} />;
              case "SHARED":
                return (
                  <SharedMessage
                    FiltertedLink={FiltertedLink}
                    FiltertedMedia={FiltertedMedia}
                    FiltertedDocs={FiltertedDocs}
                  />
                );
              default:
                return <GroupChatInfo FiltertedMedia={FiltertedMedia} />;
            }
          })()}
      </Stack>
    </>
  );
}
