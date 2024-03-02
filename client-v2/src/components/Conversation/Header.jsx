import React from "react";
import { useTheme } from "@emotion/react";

import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  CaretDown,
  CaretLeft,
  MagnifyingGlass,
  PhoneCall,
  VideoCamera,
} from "phosphor-react";
import StyledBadge from "./StyledBadge";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectConversation,
  ToggleSideBar,
  UpdateSidebarType,
} from "../../Redux/Slices/AppSlice";
import {
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../Redux/Slices/ConversationSlice";
export default function Header() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        background:
          theme.palette.mode == "light"
            ? "#FAFAFE"
            : theme.palette.background.paper,
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ height: "100%", width: "100%" }}
      >
        {/* Left avatar */}
        <Stack direction={"row"} spacing={2}>
          <IconButton
            onClick={() => {
              dispatch(SelectConversation({ room_id: null, chat_type: null }));
              dispatch(SetCurrentConversation(null));
              dispatch(FetchCurrentMessages({ messages: [] }));
            }}
          >
            <CaretLeft />
          </IconButton>

          <Stack
            onClick={() => {
              dispatch(ToggleSideBar());
              dispatch(UpdateSidebarType("CONTACT"));
            }}
            direction={"row"}
            spacing={2}
          >
            <Avatar
              src={current_conversation?.img}
              alt={current_conversation?.name}
            ></Avatar>

            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {current_conversation?.name}
              </Typography>
              <Typography variant="caption">About ....</Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Right Side Icons*/}
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <IconButton>
            <VideoCamera></VideoCamera>
          </IconButton>
          <IconButton>
            <PhoneCall />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>

          <Divider orientation="vertical" flexItem></Divider>

          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
