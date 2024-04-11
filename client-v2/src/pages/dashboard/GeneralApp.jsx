import React, { Suspense, lazy, useEffect } from "react";
import Chats from "./Chats";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import Conversation from "../../components/Conversation";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { SetSideBarChatType } from "../../Redux/Slices/AppSlice";

const Cat = lazy(() => import("../../components/Cat"));
import NoChat from "../../assets/Illustration/NoChat";
const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar, room_id, chat_type } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(SetSideBarChatType("individual"));
  }, []);
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
        {room_id !== null && chat_type == "individual" ? (
          <Conversation />
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
    </Stack>
  );
};

export default GeneralApp;
