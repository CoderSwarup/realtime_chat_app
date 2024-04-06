import React, { Suspense, lazy } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";

import { useSelector } from "react-redux";

const Cat = lazy(() => import("../../components/Cat"));
import NoChat from "../../assets/Illustration/NoChat";
import GroupChatConversion from "../../components/Group_Chat_Conversion";
import Groups from "./Groups";
const GroupGeneralApp = () => {
  const theme = useTheme();
  const { sidebar, room_id, chat_type } = useSelector((state) => state.app);
  return (
    <Stack direction="row" sx={{ width: "100%", position: "relative" }}>
      <Groups />
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
        {/* Right Conversation  */}
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
          {room_id !== null && chat_type == "group_chat" ? (
            <GroupChatConversion />
          ) : (
            <Stack
              width={"100%"}
              height={"100%"}
              spacing={3}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <NoChat />{" "}
              <Typography variant="subtitle">
                Select a Chat To Start A conversation{" "}
              </Typography>
            </Stack>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default GroupGeneralApp;
