import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Box, Stack } from "@mui/material";
import Messages from "./Messages";

export default function GroupChatConversion() {
  return (
    <>
      <Stack height="100%" maxHeight="100vh" width="auto">
        <Header />
        {/* <Conversation /> */}
        <Box
          className="hideScrollBar"
          sx={{ height: "100%", width: "100%", overflowY: "scroll" }}
          flexGrow={1}
        >
          <Messages />
        </Box>

        <Footer />
      </Stack>
    </>
  );
}
