import React, { useEffect, useState } from "react";
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
import { socket } from "../../Socket";
export default function Header() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);
  const [userTyping, setUserTyping] = useState(false);
  useEffect(() => {
    const handleTypingStart = (data) => {
      if (room_id === data.room_id) setUserTyping(true);
    };

    const handleTypingStop = (data) => {
      // console.log("STOP TYPING>>>", data);
      setUserTyping(false);
    };

    // Add event listeners when component mounts
    socket?.on("SINGLE_CHAT_TYPING", handleTypingStart);
    socket?.on("SINGLE_CHAT_TYPING_STOP", handleTypingStop);

    // Clean up event listeners when component unmounts
    return () => {
      socket?.off("SINGLE_CHAT_TYPING", handleTypingStart);
      socket?.off("SINGLE_CHAT_TYPING_STOP", handleTypingStop);
    };
  }, [room_id]);

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
            alignItems={"center"}
          >
            <Avatar
              src={current_conversation?.img}
              alt={current_conversation?.name}
              sx={{
                width: {
                  xs: 30,
                  sm: 50,
                },
                height: {
                  xs: 30,
                  sm: 50,
                },
              }}
            ></Avatar>

            <Stack spacing={0.2}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: {
                    xs: 10,
                    md: 17,
                  },
                }}
              >
                {current_conversation?.name}
              </Typography>
              <Typography variant="caption">
                {userTyping && "Typing..."}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Right Side Icons*/}
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            spacing: { xs: 0.5, md: 1 },
          }}
        >
          <IconButton
            sx={{
              width: {
                xs: 30,
                md: 40,
              },
            }}
          >
            <VideoCamera></VideoCamera>
          </IconButton>
          <IconButton
            sx={{
              width: {
                xs: 30,
                md: 40,
              },
            }}
          >
            <PhoneCall />
          </IconButton>
          <IconButton
            sx={{
              width: {
                xs: 30,
                md: 40,
              },
            }}
          >
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
