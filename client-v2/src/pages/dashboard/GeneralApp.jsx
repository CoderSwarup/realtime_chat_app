import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Stack, useTheme } from "@mui/material";
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar } = useSelector((state) => state.app);
  return (
    <Stack direction="row" sx={{ width: "100%", position: "relative" }}>
      <Chats />
      {/* Conversation  */}

      <Box
        sx={{
          height: "100%",
          width: "calc(100vw - 410px)", // if we need sidebar -720px
          background:
            theme.palette.mode == "light"
              ? "#F0F4FE"
              : theme.palette.background.default,
        }}
      >
        <Conversation />
      </Box>

      {/* Contact Info */}
      {sidebar.open && <Contact />}
    </Stack>
  );
};

export default GeneralApp;
