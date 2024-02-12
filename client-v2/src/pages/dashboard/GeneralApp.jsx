import React, { Suspense, lazy } from "react";
import Chats from "./Chats";
import { Box, Stack, useTheme } from "@mui/material";
import Conversation from "../../components/Conversation";
const Cat = lazy(() => import("../../components/Cat"));

const GeneralApp = () => {
  const theme = useTheme();
  return (
    <Stack direction="row" sx={{ width: "100%" }}>
      <Chats />
      {/* Conversation  */}

      <Box
        sx={{
          height: "100%",
          width: "calc(100vw - 410px)",
          background:
            theme.palette.mode == "light"
              ? "#F0F4FE"
              : theme.palette.background.default,
        }}
      >
        <Conversation />
      </Box>
    </Stack>
  );
};

export default GeneralApp;
