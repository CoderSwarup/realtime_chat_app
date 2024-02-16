import { useTheme } from "@emotion/react";

import { Box, Stack } from "@mui/material";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Messages from "./Messages";

export default function Conversation() {
  const theme = useTheme();
  return (
    <Stack height="100%" maxHeight="100vh" width="auto">
      {/* Chat Header */}
      <Header />

      {/* Conversation MSG */}
      <Box
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
